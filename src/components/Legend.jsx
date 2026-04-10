export default function Legend() {
  const items = [
    { color: "#00ff88", label: "Position (Human)" },
    { color: "#0088ff", label: "Position (Bot)" },
    { color: "#ff4444", label: "Kill" },
    { color: "#ff8800", label: "Death / Killed" },
    { color: "#ffff00", label: "Loot" },
    { color: "#ff00ff", label: "Storm Death" },
  ]

  return (
    <div className="legend">
      <h3>Legend</h3>
      {items.map(item => (
        <div key={item.label} className="legend-item">
          <span className="legend-dot" style={{ background: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
      <div className="legend-shapes">
        <h4>Shape</h4>
        <div className="legend-item">
          <span className="legend-circle" />
          <span>Human</span>
        </div>
        <div className="legend-item">
          <span className="legend-square" />
          <span>Bot</span>
        </div>
      </div>
    </div>
  )
}