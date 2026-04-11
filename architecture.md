# Architecture — LILA BLACK Player Journey Visualizer

**Live URL:** https://lila-viz-iota.vercel.app  
**Repo:** https://github.com/amanav050/Lila_viz

---
## What I Built With & Why

- **React + Vite** — Fast setup, clean component model, instant hot reload
- **HTML5 Canvas** — Renders 60k+ dots without DOM overhead — SVG/D3 would choke
- **Python (pandas + pyarrow)** — Best-in-class parquet parsing, battle-tested for data engineering
- **Vercel** — Zero-config, auto-deploys from GitHub push, free tier sufficient

---
## How I Built It

### Phase 0 — Project Setup
Initialized React + Vite, set up Git, structured folders:
- `src/` → React components
- `public/data/` → processed JSON files
- `public/maps/` → minimap images
- `process_data.py` → data pipeline script at root level

### Phase 1 — Data Pipeline
Wrote `process_data.py` to convert 1,243 raw parquet files into browser-readable JSON.
This was the most critical phase — bad data in means broken visualization out.

Key problems solved:
- Event column stored as bytes → decoded to UTF-8 strings
- Bot detection via numeric user_id pattern (e.g. `1379`) vs UUID (e.g. `b15bb032...`)
- Coordinate bounds computed per map from actual data min/max
- 1,243 files across 5 date folders → 3 clean map JSONs + bounds.json

### Phase 2 — React Frontend
Built 4 focused components:
- `MapCanvas.jsx` → Canvas rendering, coordinate mapping, heatmaps, hover tooltips
- `FilterPanel.jsx` → date, match, heatmap mode, bot/human toggles
- `Timeline.jsx` → scrubber to slice through match progression by event index
- `Legend.jsx` → color and shape reference key

`App.jsx` owns all state, fetches JSON on map switch, and passes filtered
events down to components. Filtering happens entirely client-side.

### Phase 3 — Polish
- Hover tooltips showing event type, player type, match ID and date on every non-position event
- Heatmap overlays for kill zones, death zones, and high-traffic areas using a 40x40 grid
- UI designed specifically for Level Designers — simple controls, no data science jargon
- Dark military theme to match LILA BLACK's aesthetic and make the tool feel native to the game

### Phase 4 — Deployment
- Pushed to GitHub → Vercel auto-deployed on push
- No environment variables needed
- All data is static and served directly from the `public/` folder

---

## Data Flow
1,243 .nakama-0 parquet files (Feb 10–14, 2026)
↓
process_data.py  (runs once before deploy)
→ reads all files across 5 date folders
→ decodes bytes-encoded event column to UTF-8
→ tags is_bot: True if user_id is numeric
→ computes x/z coordinate bounds per map
→ outputs 3 map JSONs + bounds.json
↓
public/data/
AmbroseValley.json  →  61,013 events
GrandRift.json      →   6,853 events
Lockdown.json       →  21,238 events
bounds.json         →  min/max coordinates per map
↓
React app (browser)
→ fetches correct map JSON on tab switch
→ filters by date / match / bot toggle / timeline slice
→ renders minimap image on HTML5 Canvas
→ plots event dots using coordinate mapping formula
→ hover tooltip on non-position events

---

## Coordinate Mapping

Game engine uses X and Z as the ground plane — Y is height, ignored for 2D rendering.
This is standard for Unreal/Unity engines and confirmed by the symmetry of data ranges.
pixel_x = (world_x - x_min) / (x_max - x_min) * canvas_width
pixel_y = (world_z - z_min) / (z_max - z_min) * canvas_height

- Bounds derived from actual data min/max per map — not hardcoded
- Automatically adapts if the playable area expands between builds
- Y coordinate dropped entirely — irrelevant for 2D minimap rendering

---

## Bot Detection

- Bots have numeric user_ids — e.g. `1379`, `1443`
- Humans have UUID-format user_ids — e.g. `b15bb032-6782-441a-9bd8-b42d446220cd`
- Detection logic: `is_bot = str(user_id).isdigit()`
- Clean signal — zero edge cases found across all 1,243 files
- Visually distinguished in the tool: humans = circles, bots = squares

---

## Assumptions

- **X/Z = ground plane, Y = height** — confirmed by data range symmetry, dropped Y entirely
- **Numeric user_id = bot** — consistent across all 1,243 files, zero exceptions found
- **Static pre-processing is sufficient** — data is 5 days fixed, no live updates needed
- **Coordinate bounds from data range** — no explicit bounds in README, derived from min/max
- **February 14 is a partial day** — included with date filter so designers can exclude it

---

## Tradeoffs

- **Static JSON vs Backend API** — data is static, no server needed, faster load, nothing to break
- **HTML5 Canvas vs Leaflet/D3** — Canvas handles 60k+ dots, DOM-based approaches lag above 10k
- **One JSON per map vs single combined file** — avoids loading 89k rows when viewing one map
- **Client-side filtering vs server-side** — sufficient at this scale, eliminates backend complexity
- **Pre-compute bounds vs hardcode** — more resilient to map updates in future builds

---

## Why No Backend?

The data is static — 5 days of fixed gameplay, not a live stream. Pre-processing at build time means faster load, zero server costs, and nothing to break at demo time. If LILA scales to live match data, a WebSocket backend would be the natural next step.