# GeoShape — Agent Notes

## Overview

Vanilla HTML/CSS/JS browser game (no build step). A Wordle-style geography guessing game with real SVG country shapes from Mapsicon.

## Dev Commands

```bash
pnpm dev        # serve via http-server on :8080
npm run dev     # same via npx
node generate-data.mjs   # refetch SVG shapes from Mapsicon → regenerates data.js
```

**Requirements:** Node 18+ (uses native `fetch`).

## Key Files

| File | Role |
|---|---|
| `generate-data.mjs` | Fetches real SVG paths from Mapsicon GitHub, writes `data.js`. Run when country data needs updating. |
| `data.js` | Auto-generated. 234 countries with `iso`, `svg`, `svgTransform`, `svgViewBox`, `lat`, `lng`, `difficulty`. |
| `app.js` | All game logic: Haversine distance, bearing, autocomplete, confetti, stats (localStorage), i18n, share. |
| `index.html` | SVG structure, two-column layout, stats modal, footer, toast. |
| `styles.css` | Geo-Premium Dark theme, responsive two-column layout, pill-shaped cards, glassmorphism modals. |

## Architecture Notes

- **`data.js` structure** — Each entry: `{ name, iso, svg, svgTransform, svgViewBox, lat, lng, difficulty }`. `iso` is the ISO 3166-1 alpha-2 code (lowercase). `svgTransform` is the Mapsicon `translate/scale` transform (potrace or Sketch format).
- **SVG rendering** — `startGame()` sets `svgElement.viewBox` and `svgGroup.transform` dynamically. `preserveAspectRatio="xMidYMid meet"` auto-centers shapes of different sizes.
- **Proximity formula** — `Math.max(0, 100 - (distance / 20000) * 100)`. Max distance reference is Earth's half-circumference (~20,000 km).
- **Difficulty tiers** — 1 (easy), 2 (medium), 3 (hard). Game pool expands as streak grows: Tier 1 → Tier 2 (streak ≥ 2) → all tiers (streak ≥ 5).
- **Stats** — localStorage key `geoshape_stats` stores `{ gamesPlayed, gamesWon, currentStreak, maxStreak }`.
- **i18n** — Translation dictionary in `app.js` (`i18n` object). Keys are set via `data-i18n` attributes in HTML. Language auto-detected from `navigator.language`, persisted in localStorage key `geoshape_lang`. Language toggle (EN/ES) in header.
- **Country name translation** — Uses `Intl.DisplayNames([lang], { type: 'region' })` API with the `iso` field from data.js. Cached in `translatedNames`. Falls back to English name for unrecognized ISO codes.
- **Share** — Share button in stats modal. Uses `navigator.share()` on mobile (WhatsApp, Twitter, etc.). Falls back to `navigator.clipboard.writeText()` + toast notification on desktop.
- **Give Up** — `giveup-btn` next to Guess button. Ends game, reveals answer, counts as loss in stats, auto-shows stats modal.
- **SVG path format** — Mapsicon SVGs with multiple `<path>` elements (e.g. Indonesia has 90 paths) are combined with `' '` separator. Skeleton SVGs (Austria) use `d="M..."` with `id=` in non-standard order — handled by non-greedy regex in the generator.

## Common Tasks

- **Add a new country:** Edit `COUNTRY_META` array in `generate-data.mjs` (format: `[name, isoCode, lat, lng, difficulty]`), then run `node generate-data.mjs`.
- **Fix proximity %:** Edit `proximityPercent()` in `app.js` — currently uses `MAX_DIST = 20000`.
- **Regenerate data.js:** Run `node generate-data.mjs` — fetches ~242 SVGs (150ms delay each, ~1 min total). Skips ~7 entries that Mapsicon lacks.
- **Add/edit translations:** Edit the `i18n` object in `app.js`. Both `en` and `es` must have matching keys. All keys used in HTML via `data-i18n` must exist in the dictionary.
- **Testing:** No test suite. Manual verification: load `http://localhost:8080`, guess countries, check stats modal, toggle language, test give up, test share.

## Gotchas

- Do not edit `data.js` manually — it is auto-generated and will be overwritten by `generate-data.mjs`.
- The `proximityPercent` formula uses 20,000 km as max (not 200). A 2,000 km wrong guess shows ~90%.
- Confetti uses a `<canvas>` overlay — no external lib. Particles are `Rectangle` instances drawn per-frame.
- The `.hidden` CSS class uses `display: none !important`, which overrides `.show { display: flex }` on the modal. Use `style.display = 'flex'` inline before adding the `.show` class.
- Do NOT use `data-i18n` on elements that contain child HTML elements (like the `<h1>` title with nested spans, or the `<p>` footer with a link). These are handled specially in `setLanguage()`.
- The `.svg-container` uses `overflow: visible` (not hidden) to prevent country shape clipping. The `.svg-glow-ring` and pseudo-elements use `z-index: 0` while the SVG has `z-index: 1`.
- `guess-row` animation uses `slideInAndFade` (not `flipIn`) — a smooth upward fade.
