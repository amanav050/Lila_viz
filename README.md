# LILA BLACK — Player Journey Visualizer

A browser-based visualization tool for LILA Games' Level Design team to explore 
player behavior across maps in LILA BLACK, an extraction shooter.

**Live Tool:** https://lila-viz-iota.vercel.app

---

## What It Does

- Plots 89,104 player events across 3 maps (AmbroseValley, GrandRift, Lockdown)
- Distinguishes human players (circles) from bots (squares) visually
- Color-codes kills, deaths, loot pickups, and storm deaths
- Heatmap overlays for kill zones, death zones, and high-traffic areas
- Filter by map, date, and individual match
- Timeline slider to scrub through match progression
- Hover tooltips showing event type, player type, match ID, and date

---

## Tech Stack

- **Frontend:** React + Vite
- **Visualization:** HTML5 Canvas
- **Data Pipeline:** Python (pandas + pyarrow)
- **Hosting:** Vercel

---

## Setup

### Prerequisites
- Node.js v18+
- Python 3.8+

### Install dependencies
```bash
npm install
pip install pandas pyarrow
```

### Process the data
Place the raw parquet files in `src/data/player_data/` then run:
```bash
python process_data.py
```
This outputs JSON files to `public/data/`.

### Run locally
```bash
npm run dev
```
Open http://localhost:5173

### Deploy
```bash
git push
```
Vercel auto-deploys on push to main.

---

## Project Structure
lila-viz/
├── public/
│   ├── data/           # Processed JSON event files
│   └── maps/           # Minimap images
├── src/
│   ├── components/
│   │   ├── MapCanvas.jsx     # Canvas rendering + heatmaps + tooltips
│   │   ├── FilterPanel.jsx   # Date/match/heatmap filters
│   │   ├── Timeline.jsx      # Match scrubber
│   │   └── Legend.jsx        # Color/shape key
│   └── App.jsx               # State management + data loading
├── process_data.py     # Parquet → JSON pipeline
├── ARCHITECTURE.md
└── INSIGHTS.md

---

## Environment Variables

None required. All data is pre-processed and served statically.

## Walkthrough

### 1. Selecting a Map
Click **AmbroseValley**, **GrandRift**, or **Lockdown** in the top right tabs.
Each map loads its own set of events and minimap image.

### 2. Filtering Events
Use the sidebar filters to narrow down what you see:
- **Date** — filter by a specific day (Feb 10–14) or view all 5 days
- **Match** — select a specific match ID to watch one game at a time
- **Heatmap** — switch between Kill Zones, Death Zones, Traffic, or Off
- **Show Players** — toggle humans, bots, or both independently

### 3. Reading the Map
- **Circles** = human players
- **Squares** = bots
- **Green dots** = position events (movement trails)
- **Red dots** = kills
- **Orange dots** = deaths
- **Yellow dots** = loot pickups
- **Pink dots** = storm deaths

### 4. Hover Tooltips
Hover over any non-position event dot to see:
- Event type
- Human or bot
- Match ID
- Date

### 5. Timeline
Use the **Start** and **End** sliders at the bottom to scrub through match
progression. Drag Start forward to see how a match unfolds over time.
Click **Reset** to show all events again.

### 6. Heatmap Overlays
Select a heatmap mode from the dropdown:
- **Kill Zones** — where most kills happen
- **Death Zones** — where players die most
- **Traffic** — which areas see the most movement

Hotter colours = higher density.