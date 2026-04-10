export default function FilterPanel({
  dates, matches, selectedDate, selectedMatch,
  onDateChange, onMatchChange, heatmapMode, onHeatmapChange,
  showBots, showHumans, onToggleBots, onToggleHumans, eventCount
}) {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Date</label>
        <select value={selectedDate} onChange={e => onDateChange(e.target.value)}>
          {dates.map(d => (
            <option key={d} value={d}>{d === "all" ? "All Dates" : d.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Match</label>
        <select value={selectedMatch} onChange={e => onMatchChange(e.target.value)}>
          {matches.map(m => (
            <option key={m} value={m}>
              {m === "all" ? "All Matches" : m.slice(0, 8) + "..."}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Heatmap</label>
        <select value={heatmapMode} onChange={e => onHeatmapChange(e.target.value)}>
          <option value="none">Off</option>
          <option value="kills">Kill Zones</option>
          <option value="deaths">Death Zones</option>
          <option value="traffic">Player Traffic</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Show Players</label>
        <div className="toggles">
          <button
            className={showHumans ? "toggle active" : "toggle"}
            onClick={onToggleHumans}
          >
            👤 Humans
          </button>
          <button
            className={showBots ? "toggle active" : "toggle"}
            onClick={onToggleBots}
          >
            🤖 Bots
          </button>
        </div>
      </div>

      <div className="event-count">
        <span>{eventCount.toLocaleString()} events</span>
      </div>
    </div>
  )
}