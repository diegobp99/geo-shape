# GeoShape

**Guess the country from its SVG silhouette.** A daily geography game built with vanilla HTML, CSS, and JavaScript.

[![Live Site](https://img.shields.io/badge/geo-shape.pages.dev-00ffff?style=flat-square&logo=cloudflare-pages&logoColor=black)](https://geo-shape.pages.dev)

---

## Features

- **Daily Challenge** — One mystery country per day, shared across all players.
- **Practice Mode** — Endless rounds with adaptive difficulty that increases with your streak.
- **Real SVG Shapes** — Authentic country outlines sourced from Mapsicon.
- **3D Relief Mode** — Toggle a dramatic multi-layered drop-shadow effect that makes the country silhouette float like a physical trophy.
- **Bilingual** — Full English and Spanish support, automatically detected from browser settings.
- **Proximity Guesses** — Each guess shows distance, direction, and proximity percentage.
- **Streak Tracking** — Consecutive wins build streaks; difficulty scales as you prove your skill.
- **Share Results** — Share your score grid via the system share sheet or clipboard.
- **Responsive** — Two-column layout on desktop, stacked on mobile.

## How to Play

1. A country silhouette appears in the map panel.
2. Type a country name into the search field — autocomplete helps narrow it down.
3. Click **Guess** to submit. The grid fills in with distance, direction, and proximity.
4. You have **6 guesses** to identify the country.
5. Stuck? Hit **Give Up** to reveal the answer (counts as a loss).

## Secret Features

Hidden keyboard easter eggs for the curious:

| Trigger | Effect |
|---|---|
| Type `party` or press `Shift`+`P` | Rainbow color cycling + SVG spins for 5 seconds |
| Type `ufo` or `alien` | A flying saucer glides across the screen; the country glows green and vibrates |
| Konami Code (`↑↑↓↓←→`) | Earthquake — the game container shakes with a glitch effect for 2 seconds |
| Type `detective` or press `Ctrl`+`D` | Toggles blueprint mode: deep technical blue background, cyan wireframe country |

## Project Architecture

```
├── index.html             Entry point — SVG structure, modals, SEO meta tags
├── styles.css             Geo-Premium Dark theme, responsive layout, easter egg animations
├── app.js                 Game logic — Haversine distance, autocomplete, i18n, stats, easter eggs
├── data.js                Auto-generated — 235 countries with real SVG path data
├── generate-data.mjs      Fetches SVG shapes from Mapsicon and rebuilds data.js
├── package.json           Dev scripts
└── AGENTS.md              Development notes and gotchas
```

### Key Design Decisions

- **No framework, no build step.** Pure vanilla JS — serve `index.html` and it works.
- **SVG rendering** uses `viewBox` and `transform` from the data set, with `preserveAspectRatio="xMidYMid meet"` for smart centering.
- **Distance formula** is Haversine, mapped to a 0-100 proximity scale (max reference: 20,000 km).
- **Stats** persist in `localStorage` under `geoshape_stats` (daily) and `geoshape_practice_stats` (practice).
- **i18n** uses a dictionary object in `app.js` with `data-i18n` HTML attributes; `Intl.DisplayNames` handles country name translation.

## Development

```bash
# Serve locally with hot-reload
npm run dev

# Regenerate country data (requires Node 18+)
node generate-data.mjs
```

Opens on `http://localhost:8080`.

## Deployment

The game is deployed on **Cloudflare Pages**. Push to the main branch or use `wrangler pages publish .` — no build command needed since it is static HTML/CSS/JS.

Domain: `https://geo-shape.pages.dev/`

## Tech Stack

- **Models:** Big Pickle, OpenCode Zen, MiniMax M2.5 Free
- **Platform:** OpenCode
- **Cost:** $0.00 (100% Free Tier / AI credits)
- **AI Assistance:** 100% of the code, UI design, and SEO optimization were generated through AI-human collaboration.

## Credits

**Diego Bouza** — Developer and geography enthusiast.

> I am a huge fan of traveling and geography. This passion inspired me to build GeoShape as a way to combine my interests with the power of modern technology.

Country shape data sourced from [Mapsicon](https://github.com/djaiss/mapsicon). Inspired by [Worldle](https://worldle.teuteuf.fr/).

---

<p align="center">
  <a href="https://github.com/diegobp99">GitHub</a>
  ·
  <a href="https://www.linkedin.com/in/diego-bouza-pena/">LinkedIn</a>
  ·
  <a href="https://www.instagram.com/diego_bouza/">Instagram</a>
</p>
