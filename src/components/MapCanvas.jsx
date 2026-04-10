import { useEffect, useRef, useState, useCallback } from "react"

const EVENT_COLORS = {
  Position: "#00ff88",
  BotPosition: "#0088ff",
  Kill: "#ff4444",
  BotKill: "#ff4444",
  Killed: "#ff8800",
  BotKilled: "#ff8800",
  Loot: "#ffff00",
  KilledByStorm: "#ff00ff",
}

const MAP_IMAGES = {
  AmbroseValley: "/maps/AmbroseValley_Minimap.png",
  GrandRift: "/maps/GrandRift_Minimap.png",
  Lockdown: "/maps/Lockdown_Minimap.jpg",
}

function worldToPixel(x, z, bounds, width, height) {
  const px = ((x - bounds.x_min) / (bounds.x_max - bounds.x_min)) * width
  const py = ((z - bounds.z_min) / (bounds.z_max - bounds.z_min)) * height
  return { px, py }
}

function drawHeatmap(ctx, events, bounds, width, height, mode) {
  const GRID = 40
  const cellW = width / GRID
  const cellH = height / GRID
  const grid = Array.from({ length: GRID }, () => new Array(GRID).fill(0))

  const relevant = events.filter(e => {
    if (mode === "kills") return e.event === "Kill" || e.event === "BotKill"
    if (mode === "deaths") return e.event === "Killed" || e.event === "BotKilled" || e.event === "KilledByStorm"
    if (mode === "traffic") return e.event === "Position" || e.event === "BotPosition"
    return false
  })

  relevant.forEach(e => {
    const { px, py } = worldToPixel(e.x, e.z, bounds, width, height)
    const col = Math.floor(px / cellW)
    const row = Math.floor(py / cellH)
    if (col >= 0 && col < GRID && row >= 0 && row < GRID) {
      grid[row][col]++
    }
  })

  const maxVal = Math.max(...grid.flat(), 1)

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const val = grid[r][c]
      if (val === 0) continue
      const intensity = val / maxVal
      ctx.globalAlpha = intensity * 0.7
      const r2 = Math.floor(255 * intensity)
      const g2 = Math.floor(100 * (1 - intensity))
      ctx.fillStyle = `rgb(${r2}, ${g2}, 0)`
      ctx.fillRect(c * cellW, r * cellH, cellW, cellH)
    }
  }
  ctx.globalAlpha = 1
}

export default function MapCanvas({ events, mapId, bounds, heatmapMode }) {
  const canvasRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const eventsRef = useRef(events)
  const boundsRef = useRef(bounds)

  useEffect(() => {
    eventsRef.current = events
    boundsRef.current = bounds
  }, [events, bounds])

  useEffect(() => {
    if (!bounds) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const img = new Image()
    img.src = MAP_IMAGES[mapId]
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)

      if (heatmapMode !== "none") {
        drawHeatmap(ctx, events, bounds, width, height, heatmapMode)
      }

      events.forEach(e => {
        const { px, py } = worldToPixel(e.x, e.z, bounds, width, height)
        const color = EVENT_COLORS[e.event] || "#ffffff"
        const size = e.event === "Position" || e.event === "BotPosition" ? 2 : 6

        ctx.globalAlpha = e.event === "Position" || e.event === "BotPosition" ? 0.4 : 0.9
        ctx.fillStyle = color

        if (e.is_bot) {
          ctx.fillRect(px - size / 2, py - size / 2, size, size)
        } else {
          ctx.beginPath()
          ctx.arc(px, py, size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      ctx.globalAlpha = 1
    }
  }, [events, mapId, bounds, heatmapMode])

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas || !boundsRef.current) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    const THRESHOLD = 8
    let closest = null
    let closestDist = THRESHOLD

    eventsRef.current.forEach(ev => {
      if (ev.event === "Position" || ev.event === "BotPosition") return
      const { px, py } = worldToPixel(ev.x, ev.z, boundsRef.current, canvas.width, canvas.height)
      const dist = Math.sqrt((px - mouseX) ** 2 + (py - mouseY) ** 2)
      if (dist < closestDist) {
        closestDist = dist
        closest = { ev, screenX: e.clientX, screenY: e.clientY }
      }
    })

    if (closest) {
      setTooltip({
        x: closest.screenX + 12,
        y: closest.screenY - 10,
        event: closest.ev.event,
        player: closest.ev.is_bot ? "Bot" : "Human",
        match: closest.ev.match_id.slice(0, 8) + "...",
        date: closest.ev.date?.replace("_", " ") || "",
      })
    } else {
      setTooltip(null)
    }
  }, [])

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="map-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            background: "#1a1a2e",
            border: "1px solid #00ff88",
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#e0e0e0",
            pointerEvents: "none",
            zIndex: 1000,
            lineHeight: "1.6",
          }}
        >
          <div style={{ color: EVENT_COLORS[tooltip.event] || "#fff", fontWeight: "bold" }}>
            {tooltip.event}
          </div>
          <div>Player: {tooltip.player}</div>
          <div>Match: {tooltip.match}</div>
          <div>Date: {tooltip.date}</div>
        </div>
      )}
    </div>
  )
}