export default function Timeline({ total, timeRange, onTimeRangeChange }) {
  const startIdx = Math.floor((timeRange[0] / 100) * total)
  const endIdx = Math.floor((timeRange[1] / 100) * total)

  return (
    <div className="timeline">
      <div className="timeline-header">
        <span>Timeline</span>
        <span className="timeline-info">
          Showing events {startIdx.toLocaleString()} — {endIdx.toLocaleString()} of {total.toLocaleString()}
        </span>
      </div>
      <div className="timeline-controls">
        <div className="slider-group">
          <label>Start</label>
          <input
            type="range"
            min={0}
            max={100}
            value={timeRange[0]}
            onChange={e => {
              const val = Number(e.target.value)
              if (val < timeRange[1]) onTimeRangeChange([val, timeRange[1]])
            }}
          />
        </div>
        <div className="slider-group">
          <label>End</label>
          <input
            type="range"
            min={0}
            max={100}
            value={timeRange[1]}
            onChange={e => {
              const val = Number(e.target.value)
              if (val > timeRange[0]) onTimeRangeChange([timeRange[0], val])
            }}
          />
        </div>
        <button
          className="reset-btn"
          onClick={() => onTimeRangeChange([0, 100])}
        >
          Reset
        </button>
      </div>
      <div className="timeline-bar">
        <div
          className="timeline-selection"
          style={{
            left: `${timeRange[0]}%`,
            width: `${timeRange[1] - timeRange[0]}%`
          }}
        />
      </div>
    </div>
  )
}