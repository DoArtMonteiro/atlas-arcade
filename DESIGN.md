---
name: Atlas Arcade
description: "A retro CRT arcade cabinet of geography mini-games: pixel chrome, twelve neon identities, one signal colour."
colors:
  signal-cyan: "#00d4ff"
  pulse-green: "#00ff41"
  solar-yellow: "#ffe600"
  ember-orange: "#ff8c00"
  electric-blue: "#0088ff"
  reactor-mint: "#00ffa6"
  ultraviolet-purple: "#b800ff"
  alert-red: "#ff3333"
  hot-magenta: "#ff00ff"
  ghost-white: "#f8f8f8"
  volt-lime: "#ccff00"
  arcade-pink: "#ff00aa"
  void-bg: "#080810"
  panel-surface: "#0f0f1a"
  circuit-border: "#1a1a2e"
  ghost-ink: "#16161f"
typography:
  display:
    fontFamily: "'Press Start 2P', 'VT323', monospace"
    fontSize: "clamp(0.7rem, 2vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.15em"
  label:
    fontFamily: "'Press Start 2P', 'VT323', monospace"
    fontSize: "7px-11px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
  body:
    fontFamily: "'VT323', monospace"
    fontSize: "0.875rem-1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  none: "0px"
components:
  button-primary:
    backgroundColor: "{colors.void-bg}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.void-bg}"
  card-game:
    backgroundColor: "{colors.panel-surface}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "20px"
  modal-panel:
    backgroundColor: "{colors.void-bg}"
    textColor: "{colors.signal-cyan}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "24px"
---

# Design System: Atlas Arcade

## 1. Overview

**Creative North Star: "The Neon Atlas"**

Atlas Arcade combines geography with a cabinet arcade: a dark CRT bezel lit by a single glowing map. The system runs on one wordmark colour (Signal Cyan) plus eleven equal-weight neon identities, one per mini-game. Every surface is dark by default (`#080810`), square corners are the default, and every button is a bracketed command (`[ PLAY ]`, `[ INSERT COIN ]`). Most emphasis uses accent `box-shadow` or `text-shadow`; the GeoRadar country-picker dropdown retains a black drop shadow. A small number of coin and game indicators use rounded shapes.

The system explicitly rejects generic mobile hyper-casual: no bright rounded gradients, no cartoon mascots, no ad-shaped interstitials pretending to be content. Atlas Arcade is a cabinet you walk up to, not a gacha app that chases you. The motion design target is to avoid strobing. The repository does not include a photosensitivity safety assessment.

**Key Characteristics:**
- One brand-primary (Signal Cyan) for chrome/wordmark; eleven co-equal per-game neon accents, never mixed within one screen.
- Square corners are the default for cards, buttons, modals, and inputs. A small number of coin and game indicators use rounded shapes.
- The elevation system prefers accent glow. The GeoRadar country-picker dropdown is a documented drop-shadow exception.
- Pixel display font for chrome/labels, monospace VT323 for readable body copy and as the accented-character fallback.
- A light "LCD/vintage-Casio-watch" theme exists as an alternate with the same structure. The 12 game accent tokens have values checked against the two light-theme backgrounds listed below. Glow is removed, and the design uses solid colour blocks rather than small coloured text where that reads better.

## 2. Colours

The palette is dark and saturated at rest. Colour carries much of the visual identity, with each of the twelve games assigned a distinct accent.

### Primary
- **Signal Cyan** (`#00d4ff`): the ATLAS wordmark, the header brand accent, and GeoRadar's game identity. The one colour that reads as "this app," not "this game."

### Secondary: the eleven game identities
Each mini-game owns exactly one of these, used consistently across its card, its mode-select modal border/glow, and its in-game HUD accents. No game borrows another's colour; Solar Yellow is reserved for Atlas Jackpot alone.
- **Pulse Green** (`#00ff41`): Peaks & Valleys. Also the system's general "success/confirm/streak-positive" tone (premium token counter, correct-answer flashes).
- **Ember Orange** (`#ff8c00`): Capital Strike.
- **Electric Blue** (`#0088ff`): Flag Frenzy.
- **Reactor Mint** (`#00ffa6`): Tectonic Snap.
- **Ultraviolet Purple** (`#b800ff`): Frontier Face-Off.
- **Alert Red** (`#ff3333`): One Strike. Also the system's "danger/wrong answer/streak flame" tone.
- **Hot Magenta** (`#ff00ff`): Urban Legends.
- **Ghost White** (`#f8f8f8`): Skyline Silhouette, the one "neon" that's actually a desaturated glow, used deliberately since the game itself is about reading a dark silhouette.
- **Volt Lime** (`#ccff00`): Border Blitz.
- **Arcade Pink** (`#ff00aa`): Stat Attack.
- **Solar Yellow** (`#ffe600`): Atlas Jackpot exclusively, the boss-stage colour, also doubling as the coin/premium-currency tone in the header. Never assigned to a mini-game.

### Neutral
- **Void** (`#080810`): the default page/app background, near-black, not true black.
- **Panel Surface** (`#0f0f1a`): cards, modals, HUD panels, one step lighter than Void.
- **Circuit Border** (`#1a1a2e`): default dividers and inactive borders, before an accent colour takes over on hover/active/selected.
- **White** (`#ffffff`): primary body text on the dark theme.
- **Ghost Ink** (`#16161f`): primary body text and the light-theme's own "white" neon slot. On `.light`, this replaces both plain body text and every neon-white surface (since a literal near-white glow is illegible on a light background).

### Light Mode
Not a dimmed copy of the dark palette. Every one of the 12 accents is independently darkened from its dark-mode hue until it clears **4.5:1 against both `--color-arcade-bg` (#f4f3ec) and `--color-arcade-surface` (#e7e6db)**, the stricter of the two backgrounds driving each colour's minimum darkness. Verified by direct relative-luminance computation (WCAG's contrast formula), not by eye. The previous light theme had 7 of 12 accents failing 4.5:1 against the surface colour (as low as 3.15:1), which is what this redesign fixes.

| Dark-mode name | Dark hex | Light-mode hex | vs bg | vs surface |
|---|---|---|---|---|
| Signal Cyan | `#00d4ff` | `#006e85` | 5.29 | 4.69 |
| Pulse Green | `#00ff41` | `#00751e` | 5.30 | 4.70 |
| Solar Yellow | `#ffe600` | `#706500` | 5.32 | 4.71 |
| Ember Orange | `#ff8c00` | `#995400` | 5.21 | 4.62 |
| Electric Blue | `#0088ff` | `#0065bd` | 5.25 | 4.65 |
| Reactor Mint | `#00ffa6` | `#00754c` | 5.17 | 4.59 |
| Ultraviolet Purple | `#b800ff` | `#a200e0` | 5.23 | 4.63 |
| Alert Red | `#ff3333` | `#cc0000` | 5.29 | 4.69 |
| Hot Magenta | `#ff00ff` | `#b300b2` | 5.30 | 4.70 |
| Ghost White | `#f8f8f8` | `#16161f` (= Ghost Ink) | 16.15 | 14.32 |
| Volt Lime | `#ccff00` | `#566b00` | 5.40 | 4.78 |
| Arcade Pink | `#ff00aa` | `#c20081` | 5.23 | 4.64 |

Every light-mode value also clears 5.7:1+ against white, which is what makes the Ink-on-Block Rule below possible without a second, separate token set.

### Named Rules
**The One Signal Rule.** Signal Cyan is the only colour allowed to mean "this is Atlas Arcade" as opposed to "this is [game]." It appears in the wordmark, the header brand mark, and GeoRadar (which is treated as the flagship/first game), never as a generic default accent elsewhere.

**The No-Borrowing Rule.** A game's accent colour appears on its card, its mode-select modal, and its own HUD, and nowhere else. Solar Yellow is hard-reserved for Atlas Jackpot; no other surface may use it as a primary accent.

**The Ink-on-Block Rule (light mode only).** Small coloured text is where light mode's old contrast failures lived. Wherever an accent needs to carry real visual weight, such as a game card's icon or a primary CTA, light mode renders it as a **solid accent-colour block with white text/icon on top**, never as coloured text on the bare background. This works uniformly across all 12 colours with zero per-colour exceptions because every light-mode value above was chosen to also clear white-text contrast, not just background-text contrast.

## 3. Typography

**Display/Label Font:** "Press Start 2P", with "VT323" then `monospace` as fallback
**Body Font:** "VT323", with `monospace` fallback

**Character:** A true bitmap arcade font (Press Start 2P) carries all chrome, titles, and labels at deliberately tiny sizes (7px–11px is normal here, not a bug) with wide tracking. VT323, a taller, more legible pixel-monospace, carries actual reading copy (descriptions, body text, countdown timers) and quietly substitutes for Press Start 2P's missing accented uppercase glyphs (Í, Ã, Ç) in PT/ES copy, so multilingual text never shows tofu.

### Hierarchy
- **Display** (400, `clamp(0.7rem, 2vw, 1.5rem)`, 1.4 line-height, 0.15em tracking): page-level headings like "SELECT GAME" or a modal's game title. Press Start 2P.
- **Label** (400, 7px–11px, 0.1em tracking, uppercase by convention): buttons, badges, HUD counters, step indicators. The bulk of all UI text lives here. Press Start 2P.
- **Body** (400, 14px–16px, 1.6 line-height): descriptions, instruction copy, countdowns. VT323, which is legible at reading size where the pixel display font would strain the eye.

### Named Rules
**The Tiny-Label Rule.** Press Start 2P is never used above ~24px; it's a chrome/label font, not a display font at hero scale. Anything meant to be *read* comfortably (descriptions, instructions, modal body copy) is VT323, not Press Start 2P.

## 4. Elevation

The design system uses borders and accent glows to express emphasis. One implementation exception remains: the GeoRadar country-picker dropdown uses a black drop shadow (`src/components/games/globle/GuessInput.tsx`).

### Shadow Vocabulary
- **Neon glow** (`box-shadow: 0 0 8px <accent>, 0 0 20px <accent>55`), one variant per accent colour (`shadow-neon-cyan`, `shadow-neon-green`, … `shadow-neon-white`): applied to a card/modal/button on hover, focus, or active/selected state, always matching that surface's own accent, never a foreign colour.
- **Text glow** (`text-shadow: 0 0 8px <accent>, 0 0 20px <accent>55`), the `neon-text-*` utilities: the same glow language applied to headings and labels instead of containers.

### Named Rules
**The Glow-Not-Lift Rule.** Emphasis is expressed by brightening (glow) and by border colour, never by scale-up shadow or a simulated z-axis lift. A "raised" element in this system is brighter, not closer.

**The No-Glow-In-Light Rule.** Neon glow only works on dark surfaces; against `#f4f3ec`, it appears as a muddy blur. Light mode removes the glow and uses a flat ink border for depth.

Tailwind v4 writes each `@theme` shadow value as a static fallback into its compiled utility. Overriding `--shadow-neon-*` under `.light` therefore does not change `.shadow-neon-green`. The stylesheet disables the utility classes directly and separately overrides inline `box-shadow` styles, which class selectors cannot reach. The repository records approximately 20 such inline glows across win and loss overlays and badges.

**The Tap-Flash Rule.** `:hover` feedback is unavailable on touch screens. Interactive cards and CTA buttons pair their hover treatment with an `:active` treatment: a visible press-down (`active:scale-95`) and an accent fill. The active state provides visible feedback when a touch user taps.

## 5. Components

Buttons, cards, and modals share one grammar: a labeled rectangle, sharp corners, a 1px border in the surface's accent colour, and a glow that only appears on hover/active/selected, never at rest.

### Buttons
- **Shape:** square corners, 0px radius, always.
- **Primary:** `border: 1px solid <accent>`, transparent/`void-bg` background, accent-coloured text, wrapped in literal brackets in copy (`[ PLAY ]`, `[ INSERT COIN ]`, `[ CLOSE ]`). On hover: background fills solid with the accent colour and text flips to near-black/void, plus the matching neon glow.
- **Hover / Focus:** `hover:bg-<accent> hover:text-black hover:shadow-neon-<accent>`, `transition-* duration-200` on every interactive element for consistent timing.
- **Active / Press (see The Tap-Flash Rule):** `active:scale-95` plus an accent-tinted `active:bg-*` fill. This is the primary feedback channel on mobile, not a hover afterthought. All interactive controls carry `touch-action: manipulation` to kill the 300ms mobile tap delay.
- **Ghost / Cancel:** no border, muted gray text (`text-gray-600`), brightens to white on hover, `active:bg-white/10` on press. Use it only for "back out" actions (Cancel, dismiss), never for a primary action.

### Cards (Game Select Grid)
- **Corner Style:** 0px radius, plus four small literal corner-bracket glyphs (absolutely positioned L-shaped border fragments) at each corner, a deliberate "targeting reticle" detail unique to game cards.
- **Background:** Panel Surface (`#0f0f1a`) in dark mode; Panel Surface's light equivalent (`#e7e6db`) in light mode, with no other change to the card shell.
- **Shadow Strategy:** flat at rest; on hover, border and glow both switch to the card's own accent (dark mode only; see Elevation's No-Glow-In-Light Rule).
- **Border:** 1px in the game's accent colour, visible at rest in both themes.
- **Internal Padding:** ~20px (`p-5`), consistent gap-4 rhythm between icon/title/description/CTA.
- **Icon chip (light mode only, see the Ink-on-Block Rule):** the icon sits inside a small solid accent-colour square with a white icon, instead of a bare coloured glyph. Light mode uses `light:bg-arcade-neon-<color> light:p-1.5` on the wrapper, `light:text-white` on the icon. Dark mode is untouched (transparent wrapper, coloured glyph, unchanged from before this rule existed).
- **CTA (light mode only):** the `[ PLAY ]` bar is a *permanent* solid accent block with white text in light mode, not just on hover. It uses `light:bg-arcade-neon-<color> light:text-white` alongside the existing `group-hover:bg-current` dark-mode hover-fill behavior.

### Modals
- **Corner Style:** 0px radius, 1px border and glow in the relevant accent (Signal Cyan for generic modals like Profile/Leaderboard; the selected game's own accent for the mode-select modal; Alert Red for the out-of-coins modal).
- **Background:** Void (`#080810`) or Panel Surface, full-bleed `bg-black/75`–`/85` scrim behind.
- **Close behaviour (hard rule):** modals close **only** via an explicit `X` or `[ CLOSE ]` control. Backdrop click and backdrop drag never close a modal. This is deliberate, not an oversight. See PRODUCT.md's "explicit state, explicit close" principle.
- **Internal Padding:** 24px (`p-6`), `space-y-4` rhythm between sections.

### Inputs / Fields
- **Style:** bordered rectangle, `border-arcade-border` at rest, accent border on focus, dark surface fill. Font-size held at ≥16px on mobile specifically to defeat iOS Safari's input-triggered auto-zoom.
- **Focus:** border colour shifts to the surface's accent; no separate focus ring or glow beyond that border shift.

### Navigation (Header)
- **Style:** A single horizontal bar with a wordmark on the left and a horizontally scrollable icon/counter rail on the right. On mobile, the full set of controls (language, streak, coins, premium tokens, leaderboard, theme, sound and auth) does not fit at once.
- **States:** icon-only controls at `w-10 h-10` (44px+ effective tap target via padding), `active:scale-90` press feedback, colour shifts to the relevant accent on hover (cyan default, red for destructive sign-out).

### Signature component: coin / token counter
A rectangular counter contains a small radial-gradient coin glyph and a label-weight number. Colour identifies each currency: Solar Yellow for arcade coins, Pulse Green for premium tokens, and Alert Red for the daily streak flame. Admin accounts display an infinity symbol and a DEV badge in Pulse Green instead of a coin count.

## 6. Do's and Don'ts

### Do:
- **Do** give every mini-game exactly one accent colour, reused identically across its card, its mode-select modal, and its HUD (`src/lib/gameTheme.ts` is the single source of truth; extend it, do not fork it).
- **Do** keep every corner square by default: 0px radius is the system default, not a missing feature.
- **Do** express emphasis with a coloured glow (`shadow-neon-*` / `neon-text-*`) matched to the surface's own accent. The current GeoRadar dropdown shadow is an implementation exception.
- **Do** require an explicit close control (`X` / `[ CLOSE ]`) on every modal; never wire a backdrop click or drag to dismiss.
- **Do** keep Press Start 2P at label/chrome scale only; move to VT323 the moment copy is meant to be actually read.
- **Do** keep looping ambient effects (flicker, blink, glitch) subtle and slow, and avoid strobing. The current implementation has not had a photosensitivity safety assessment.
- **Do** verify any new light-mode accent value at 4.5:1 against both `--color-arcade-bg` and `--color-arcade-surface` before adding it. Compute it, do not eyeball it (see the Light Mode table under Colours).
- **Do** use the Ink-on-Block pattern (solid accent square/bar + white text) wherever an accent needs real visual weight in light mode, rather than reaching for coloured text at a small size.

### Don't:
- **Don't** build generic mobile hyper-casual UI: no bright rounded gradients, no cartoon mascots, no ad-shaped interstitials. That is this system's explicit anti-reference.
- **Don't** reuse Solar Yellow for anything other than Atlas Jackpot and the coin/premium currency readouts.
- **Don't** add `border-radius` to a card, button, modal, or input. If a shape needs to look "soft," that's the wrong instinct for this system.
- **Don't** add additional neutral or dark drop-shadows. If something needs emphasis, use a matching neon glow; see the documented GeoRadar dropdown exception above.
- **Don't** wire any backdrop-click-to-close behavior on a modal, even as a "convenience."
- **Don't** design a flashing/strobing effect, even subtle-seeming ones stacked together. Audit new motion against the existing `flicker` (8s loop, ~1-3% opacity dip) and `blink` (1s step-end) rates as the ceiling, not the floor.
- **Don't** add any glow (`box-shadow` or `text-shadow`) that renders in light mode, token-based or inline. See the No-Glow-In-Light Rule for why overriding `--shadow-neon-*` alone doesn't actually work.
- **Don't** hardcode a celebratory/decorative glow as an inline `style={{ boxShadow: "...#00ff41..." }}` with a literal dark-mode hex. It bypasses the theme system entirely and previously shipped full-brightness dark-mode glows straight onto the light background. Use the `shadow-neon-*` utility class (which the light-mode kill switch already reaches) instead.
