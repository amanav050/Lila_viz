import { useEffect, useRef } from "react"

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
  const imgRef = useRef(null)

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
        const size = e.event === "Position" || e.event === "BotPosition" ? 2 : 5

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

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      className="map-canvas"
    />
  )
}