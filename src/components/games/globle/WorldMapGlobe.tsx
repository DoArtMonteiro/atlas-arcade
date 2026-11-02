"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoBounds } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, LineString, Point } from "geojson";
import type { GeoJSONSource, LayerSpecification, Map as MapLibreMap } from "maplibre-gl";
import { COUNTRY_BY_NUMERIC } from "@/data/countries";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";
const GEO_FETCH_TIMEOUT_MS = 10_000;
const FLY_MS = 1_000;
const COUNTRY_SOURCE_ID = "geodle-country-highlights";
const COUNTRY_FILL_LAYER_ID = "geodle-country-fills";
const COUNTRY_LINE_LAYER_ID = "geodle-country-lines";
const EQUATOR_SOURCE_ID = "geodle-equator";
const EQUATOR_LAYER_ID = "geodle-equator-line";
const MARKER_SOURCE_ID = "geodle-guess-markers";
const MARKER_LAYER_ID = "geodle-guess-marker-circles";
const DEFAULT_COUNTRY_COLOR = "#00d4ff";

interface Props {
  colorMap: Record<number, string>;
  markers?: { lng: number; lat: number; color: string }[];
  mysteryNumeric?: number;
  zoomTarget?: number;
  flyTo?: { lng: number; lat: number };
}

type CountryProperties = {
  numericId: number;
  fillColor: string;
  isGuessed: boolean;
};

type CountryFeature = Feature<Geometry, CountryProperties>;
type CountryCollection = FeatureCollection<Geometry, CountryProperties>;
type MarkerCollection = FeatureCollection<Point, { color: string }>;
type EquatorFeature = Feature<LineString>;
type TopologyWorld = {
  objects?: {
    countries?: {
      geometries?: unknown[];
    };
  };
};

let countryCache: CountryCollection | null = null;
let countryRequest: Promise<CountryCollection> | null = null;
const EQUATOR: EquatorFeature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: Array.from({ length: 181 }, (_, index) => [-180 + index * 2, 0]),
  },
};

async function loadCountries(): Promise<CountryCollection> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEO_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(GEO_URL, { signal: controller.signal });
    if (!response.ok) throw new Error("World boundaries could not be loaded.");

    const world = (await response.json()) as TopologyWorld;
    const countriesObject = world.objects?.countries;
    if (!Array.isArray(countriesObject?.geometries) || countriesObject.geometries.length === 0) {
      throw new Error("World boundary data is incomplete.");
    }

    const converted = feature(world as never, countriesObject as never) as unknown as FeatureCollection<Geometry>;
    const features: CountryFeature[] = converted.features.flatMap((country) => {
      const numericId = Number(country.id);
      if (!country.geometry || !Number.isSafeInteger(numericId)) return [];

      return [{
        type: "Feature",
        id: country.id,
        geometry: country.geometry,
        properties: {
          numericId,
          fillColor: DEFAULT_COUNTRY_COLOR,
          isGuessed: false,
        },
      }];
    });

    if (features.length === 0) throw new Error("World boundary data has no countries.");
    return { type: "FeatureCollection", features };
  } finally {
    clearTimeout(timeout);
  }
}

function fetchCountries(): Promise<CountryCollection> {
  if (countryCache) return Promise.resolve(countryCache);
  if (!countryRequest) {
    countryRequest = loadCountries()
      .then((countries) => {
        countryCache = countries;
        return countries;
      })
      .catch((error: unknown) => {
        countryRequest = null;
        throw error;
      });
  }
  return countryRequest;
}

function colorCountries(
  countries: CountryCollection,
  colorMap: Record<number, string>,
  mysteryNumeric?: number,
): CountryCollection {
  return {
    ...countries,
    features: countries.features.map((country) => {
      const numericId = country.properties.numericId;
      const isMystery = mysteryNumeric !== undefined && numericId === mysteryNumeric;
      const isGuessed = isMystery || colorMap[numericId] !== undefined;

      return {
        ...country,
        properties: {
          numericId,
          fillColor: isMystery ? "#00ff41" : (colorMap[numericId] ?? DEFAULT_COUNTRY_COLOR),
          isGuessed,
        },
      };
    }),
  };
}

function makeMarkerCollection(markers: Props["markers"]): MarkerCollection {
  return {
    type: "FeatureCollection",
    features: (markers ?? []).map((marker) => ({
      type: "Feature",
      properties: { color: marker.color },
      geometry: { type: "Point", coordinates: [marker.lng, marker.lat] },
    })),
  };
}

function countryZoom(country?: CountryFeature): number {
  if (!country?.geometry) return 3.2;

  const [[west, south], [east, north]] = geoBounds(country);
  const rawLongitudeSpan = Math.abs(east - west);
  const longitudeSpan = Math.min(rawLongitudeSpan, 360 - rawLongitudeSpan);
  const latitude = (south + north) / 2;
  const span = Math.max(
    north - south,
    longitudeSpan * Math.cos((latitude * Math.PI) / 180),
  );

  return Math.min(6.5, Math.max(1.8, Math.log2(180 / Math.max(span, 0.5)) - 0.1));
}

function syncCountryLayers(map: MapLibreMap, data: CountryCollection) {
  const existing = map.getSource(COUNTRY_SOURCE_ID) as GeoJSONSource | undefined;
  if (existing) {
    existing.setData(data);
    return;
  }

  map.addSource(COUNTRY_SOURCE_ID, { type: "geojson", data });
  const labels = map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id;
  const fillLayer: LayerSpecification = {
    id: COUNTRY_FILL_LAYER_ID,
    type: "fill",
    source: COUNTRY_SOURCE_ID,
    paint: {
      "fill-color": ["get", "fillColor"],
      "fill-opacity": ["case", ["boolean", ["get", "isGuessed"], false], 0.76, 0],
    },
  };
  const lineLayer: LayerSpecification = {
    id: COUNTRY_LINE_LAYER_ID,
    type: "line",
    source: COUNTRY_SOURCE_ID,
    paint: {
      "line-color": ["case", ["boolean", ["get", "isGuessed"], false], ["get", "fillColor"], "#46617a"],
      "line-opacity": 0.72,
      "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.45, 5, 1.1],
    },
  };

  map.addLayer(fillLayer, labels);
  map.addLayer(lineLayer, labels);
}

function syncMarkerLayer(map: MapLibreMap, data: MarkerCollection) {
  const existing = map.getSource(MARKER_SOURCE_ID) as GeoJSONSource | undefined;
  if (existing) {
    existing.setData(data);
    return;
  }

  map.addSource(MARKER_SOURCE_ID, { type: "geojson", data });
  const markerLayer: LayerSpecification = {
    id: MARKER_LAYER_ID,
    type: "circle",
    source: MARKER_SOURCE_ID,
    paint: {
      "circle-color": ["get", "color"],
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 3, 4, 5, 7, 7],
      "circle-stroke-color": "#f8f8f8",
      "circle-stroke-width": 1,
    },
  };
  map.addLayer(markerLayer);
}

function syncEquatorLayer(map: MapLibreMap) {
  if (map.getSource(EQUATOR_SOURCE_ID)) return;

  map.addSource(EQUATOR_SOURCE_ID, { type: "geojson", data: EQUATOR });
  const equatorLayer: LayerSpecification = {
    id: EQUATOR_LAYER_ID,
    type: "line",
    source: EQUATOR_SOURCE_ID,
    paint: {
      "line-color": "#ffe600",
      "line-width": 1.5,
      "line-opacity": 0.9,
    },
  };
  const labels = map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id;
  map.addLayer(equatorLayer, labels);
}

export function WorldMapGlobe({ colorMap, markers, mysteryNumeric, zoomTarget, flyTo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const mapReadyRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [countries, setCountries] = useState<CountryCollection | null>(null);
  const [countryError, setCountryError] = useState(false);
  const [countryAttempt, setCountryAttempt] = useState(0);

  const coloredCountries = useMemo(
    () => countries ? colorCountries(countries, colorMap, mysteryNumeric) : null,
    [countries, colorMap, mysteryNumeric],
  );
  const markerData = useMemo(() => makeMarkerCollection(markers), [markers]);

  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    mapReadyRef.current = false;

    void import("maplibre-gl").then((maplibre) => {
      if (cancelled || !containerRef.current) return;

      map = new maplibre.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: [0, 18],
        zoom: 0.7,
        minZoom: 0,
        maxZoom: 8,
        attributionControl: {
          compact: false,
          customAttribution: "© OpenFreeMap · © OpenMapTiles · © OpenStreetMap contributors",
        },
      });
      mapRef.current = map;
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        if (cancelled || !map) return;
        map.setProjection({ type: "globe" });
        mapReadyRef.current = true;
        setMapReady(true);
        setMapError(false);
      });
      map.on("error", () => {
        if (!cancelled && !mapReadyRef.current) setMapError(true);
      });

      if (typeof ResizeObserver !== "undefined" && containerRef.current) {
        resizeObserver = new ResizeObserver(() => map?.resize());
        resizeObserver.observe(containerRef.current);
      }
    }).catch(() => {
      if (!cancelled) setMapError(true);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapReadyRef.current = false;
      if (mapRef.current === map) mapRef.current = null;
      map?.remove();
    };
  }, [mapAttempt]);

  useEffect(() => {
    let active = true;
    fetchCountries().then((loaded) => {
      if (active) setCountries(loaded);
    }).catch(() => {
      if (active) setCountryError(true);
    });
    return () => { active = false; };
  }, [countryAttempt]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !coloredCountries) return;
    syncCountryLayers(map, coloredCountries);
  }, [mapReady, coloredCountries]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    syncEquatorLayer(map);
  }, [mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    syncMarkerLayer(map, markerData);
  }, [mapReady, markerData]);

  useEffect(() => {
    const map = mapRef.current;
    const country = zoomTarget === undefined ? undefined : COUNTRY_BY_NUMERIC[zoomTarget];
    if (!map || !mapReady || !country) return;

    const boundary = countries?.features.find((item) => item.properties.numericId === zoomTarget);
    map.flyTo({
      center: [country.lng, country.lat],
      zoom: countryZoom(boundary),
      duration: FLY_MS,
      essential: true,
    });
  }, [countries, mapReady, zoomTarget]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !flyTo) return;

    map.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: Math.max(map.getZoom(), 4),
      duration: FLY_MS,
      essential: true,
    });
  }, [flyTo, mapReady]);

  return (
    <div
      ref={containerRef}
      className="live-globe-map relative h-full w-full overflow-hidden"
      style={{ minHeight: 260, background: "#080810" }}
      role="region"
      aria-label="Interactive world map"
      aria-busy={!mapReady && !mapError}
    >
      {!mapReady && !mapError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#080810]/85">
          <p role="status" aria-live="polite" className="font-pixel text-[8px] text-arcade-neon-cyan">
            Loading live map…
          </p>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/85 px-4 text-center">
          <p role="alert" className="font-pixel text-[9px] text-arcade-neon-red">
            Live map unavailable
          </p>
          <p className="font-mono text-xs text-gray-300">Check your connection and try again.</p>
          <button
            type="button"
            onClick={() => { setMapError(false); setMapAttempt((attempt) => attempt + 1); }}
            className="min-h-11 border border-arcade-neon-cyan px-4 py-2 font-pixel text-[8px] text-arcade-neon-cyan hover:bg-arcade-neon-cyan hover:text-black"
          >
            Retry map
          </button>
        </div>
      )}

      {countryError && mapReady && (
        <div className="absolute left-3 top-3 z-10 max-w-xs border border-arcade-neon-red bg-black/85 p-3">
          <p role="status" aria-live="polite" className="font-mono text-sm text-white">
            Country highlights could not load.
          </p>
          <button
            type="button"
            onClick={() => { setCountryError(false); setCountryAttempt((attempt) => attempt + 1); }}
            className="mt-2 min-h-11 border border-arcade-neon-cyan px-3 py-2 font-pixel text-[7px] text-arcade-neon-cyan hover:bg-arcade-neon-cyan hover:text-black"
          >
            Retry country data
          </button>
        </div>
      )}
    </div>
  );
}

export default WorldMapGlobe;
