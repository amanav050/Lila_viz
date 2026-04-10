import { useState, useEffect } from "react"
import MapCanvas from "./components/MapCanvas"
import FilterPanel from "./components/FilterPanel"
import Timeline from "./components/Timeline"
import Legend from "./components/Legend"
import "./App.css"

export default function App() {
  const [allEvents, setAllEvents] = useState([])
  const [bounds, setBounds] = useState({})
  const [selectedMap, setSelectedMap] = useState("AmbroseValley")
  const [selectedDate, setSelectedDate] = useState("all")
  const [selectedMatch, setSelectedMatch] = useState("all")
  const [timeRange, setTimeRange] = useState([0, 100])
  const [heatmapMode, setHeatmapMode] = useState("none")
  const [showBots, setShowBots] = useState(true)
  const [showHumans, setShowHumans] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [eventsRes, boundsRes] = await Promise.all([
        fetch(`/data/${selectedMap}.json`),
        fetch(`/data/bounds.json`)
      ])
      const events = await eventsRes.json()
      const boundsData = await boundsRes.json()
      setAllEvents(events)
      setBounds(boundsData)
      setSelectedDate("all")
      setSelectedMatch("all")
      setTimeRange([0, 100])
      setLoading(false)
    }
    loadData()
  }, [selectedMap])

  const dates = ["all", ...new Set(allEvents.map(e => e.date))].sort()

  const matches = ["all", ...new Set(
    allEvents
      .filter(e => selectedDate === "all" || e.date === selectedDate)
      .map(e => e.match_id)
  )]

  // Step 1: filter by date, match, bot/human
  const filteredEvents = allEvents.filter(e => {
    if (selectedDate !== "all" && e.date !== selectedDate) return false
    if (selectedMatch !== "all" && e.match_id !== selectedMatch) return false
    if (!showBots && e.is_bot) return false
    if (!showHumans && !e.is_bot) return false
    return true
  })

  // Step 2: sort by timestamp string
  const sortedEvents = [...filteredEvents].sort((a, b) =>
    a.ts.localeCompare(b.ts)
  )

  // Step 3: apply timeline slice
  const total = sortedEvents.length
  const startIdx = Math.floor((timeRange[0] / 100) * total)
  const endIdx = Math.floor((timeRange[1] / 100) * total)
  const timeFilteredEvents = sortedEvents.slice(startIdx, endIdx)

  return (
    <div className="app">
      <header className="header">
        <h1>LILA BLACK — Player Journey Visualizer</h1>
        <div className="map-tabs">
          {["AmbroseValley", "GrandRift", "Lockdown"].map(m => (
            <button
              key={m}
              className={selectedMap === m ? "active" : ""}
              onClick={() => setSelectedMap(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <div className="main">
        <aside className="sidebar">
          <FilterPanel
            dates={dates}
            matches={matches}
            selectedDate={selectedDate}
            selectedMatch={selectedMatch}
            onDateChange={setSelectedDate}
            onMatchChange={setSelectedMatch}
            heatmapMode={heatmapMode}
            onHeatmapChange={setHeatmapMode}
            showBots={showBots}
            showHumans={showHumans}
            onToggleBots={() => setShowBots(v => !v)}
            onToggleHumans={() => setShowHumans(v => !v)}
            eventCount={timeFilteredEvents.length}
          />
          <Legend />
        </aside>

        <div className="canvas-area">
          {loading ? (
            <div className="loading">Loading {selectedMap}...</div>
          ) : (
            <MapCanvas
              events={timeFilteredEvents}
              mapId={selectedMap}
              bounds={bounds[selectedMap]}
              heatmapMode={heatmapMode}
            />
          )}
          <Timeline
            total={total}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      </div>
    </div>
  )
}