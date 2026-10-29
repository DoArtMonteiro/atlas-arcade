# Product

## Register

product

## Intended users

The product is designed for two overlapping use cases:
- **Casual geo-trivia players:** a short Daily Challenge, with optional streak and leaderboard features.
- **Competitive score-chasers:** repeatable Arcade rounds, coin use across the mini-games, and access to the separate Atlas Jackpot run for signed-in players with five tokens.

Both groups share one app shell: a game-select grid, a Daily/Arcade mode-select modal per game, in-game HUDs, and a coin economy that gates Arcade attempts.

## Product Purpose

A retro arcade cabinet of geography mini-games (GeoRadar, Capital Strike, Flag Frenzy, Peaks & Valleys, Tectonic Snap, Frontier Face-Off, One Strike, Urban Legends, Skyline Silhouette, Border Blitz, Stat Attack, plus the Atlas Jackpot boss stage). Success looks like: a player opens the arcade, immediately reads which game does what and what mode they're in, and gets clean instant feedback on every guess, with no dead air, no ambiguity about score or state.

## Brand personality

Punchy, retro, precise: a real arcade cabinet, not a mobile hyper-casual skin.
- **Retro / nostalgic**: 80s-90s arcade cabinet, CRT scanlines, pixel font (Press Start 2P + VT323), neon glow on dark.
- **Punchy / high-energy**: fast feedback, instant score reveals, bold neon accents, confident retro-UI chrome (`[ BUTTON ]` bracket styling, blinking CTAs).
- **Precise / educational**: distance-based scoring and country/city data form the quiz engine; the retro presentation sits around that content.
- Accessible by design intent: the motion target is to avoid strobing. The repository does not include a photosensitivity safety assessment.

## Anti-references

Explicitly not: generic mobile hyper-casual (bright rounded gradients, cartoon mascots, aggressive ad-style interstitials, Candy-Crush/King-style chrome). Atlas Arcade is a cabinet game, not a gacha app. No forced-cheerful mascots, no gradient-soup buttons, no ad-shaped UI pretending to be content.

## Design principles

1. **Instant feedback, always.** Every guess, reveal, and mode transition must read as immediate, with no visible network/render lag on the comparison moment (see the Peaks & Valleys image-preload fix as the standard to match elsewhere).
2. **One accent colour per game, used consistently.** Each of the 12 games owns a single neon identity colour (already codified in `src/lib/gameTheme.ts`) carried through its card, mode-select modal, and in-game HUD. Yellow is reserved exclusively for Atlas Jackpot.
3. **Retro chrome, not retro friction.** Pixel fonts and bracket-button styling (`[ PLAY ]`) are the voice; they must never come at the cost of tap targets, readability, or load speed.
4. **Explicit state, explicit close.** Modals close only via their `X`/`[ CLOSE ]` control, never backdrop click; state changes (mode chosen, coin spent, answer locked) must be deliberate, not accidental.
5. **High-energy visuals with constrained motion.** Flicker, glitch, and blink effects are intended to avoid strobing (see `body::before` flicker and `neonPulse`). This is a design target, not a photosensitivity safety assessment.

## Accessibility and inclusion

- **Light-theme accent contrast**: the 12 game accent tokens are checked at 4.5:1 or higher against the two light-theme backgrounds in `DESIGN.md`. This is not a full application WCAG AA audit.
- **Motion design target**: avoid strobing and rapid, high-contrast flashing. The repository does not contain a photosensitivity safety assessment.
- **Screen reader support**: meaningful `aria-label`s on icon-only controls (already the pattern for close/X buttons), live-region announcements for score/state changes where practical, and no information conveyed by colour/animation alone without a text or icon fallback.
