/**
 * Stylized vector coordinate dataset of the world continents and major islands.
 * Coordinates are represented in [longitude, latitude] format.
 * This allows high-fidelity offline rendering of a 3D globe.
 */

export interface Polygon {
  name: string;
  points: [number, number][];
}

export const WORLD_CONTINENTS: Polygon[] = [
  {
    name: "South America",
    points: [
      [-77, 7], [-80, -5], [-81, -15], [-72, -35], [-74, -45],
      [-72, -55], [-68, -55], [-65, -45], [-58, -34], [-48, -27],
      [-40, -22], [-35, -6], [-35, -5], [-44, -2], [-51, 4],
      [-61, 10], [-72, 10], [-74, 11], [-77, 7]
    ]
  },
  {
    name: "North America",
    points: [
      [-80, 9], [-83, 9], [-83, 15], [-95, 18], [-97, 26],
      [-90, 30], [-83, 23], [-80, 25], [-75, 35], [-65, 44],
      [-80, 50], [-80, 60], [-100, 68], [-120, 68], [-150, 70],
      [-160, 71], [-168, 65], [-160, 58], [-145, 60], [-135, 57],
      [-125, 48], [-124, 40], [-115, 30], [-110, 23], [-105, 20],
      [-96, 16], [-88, 13], [-80, 9]
    ]
  },
  {
    name: "Africa",
    points: [
      [-17, 14], [-17, 32], [-6, 35], [12, 37], [20, 32],
      [31, 31], [32, 30], [34, 27], [43, 12], [51, 11],
      [40, -4], [36, -20], [32, -30], [18, -34], [10, -12],
      [9, 0], [5, 4], [-10, 5], [-17, 14]
    ]
  },
  {
    name: "Eurasia",
    points: [
      [-9, 38], [-9, 43], [-1, 43], [1, 50], [5, 52],
      [8, 55], [15, 56], [20, 65], [30, 70], [40, 68],
      [60, 70], [80, 76], [100, 77], [120, 73], [140, 73],
      [160, 70], [180, 68], [170, 60], [160, 55], [140, 50],
      [130, 40], [120, 35], [120, 25], [108, 20], [105, 10],
      [100, 1], [96, 16], [90, 22], [80, 6], [73, 15],
      [68, 24], [58, 25], [48, 12], [35, 15], [35, 30],
      [26, 40], [12, 43], [-5, 36], [-9, 38]
    ]
  },
  {
    name: "Australia",
    points: [
      [113, -26], [115, -34], [121, -34], [138, -35], [146, -39],
      [151, -34], [151, -23], [142, -10], [136, -12], [129, -15],
      [113, -26]
    ]
  },
  {
    name: "Greenland",
    points: [
      [-60, 60], [-45, 60], [-30, 65], [-20, 75], [-20, 83],
      [-40, 83], [-60, 75], [-60, 60]
    ]
  },
  {
    name: "Madagascar",
    points: [
      [49, -12], [50, -25], [43, -25], [43, -16], [47, -12], [49, -12]
    ]
  },
  {
    name: "Great Britain",
    points: [
      [-5, 50], [-5, 56], [-2, 58], [2, 52], [-2, 50], [-5, 50]
    ]
  },
  {
    name: "Japan",
    points: [
      [130, 31], [136, 35], [140, 38], [142, 44], [145, 43], [140, 36], [130, 31]
    ]
  },
  {
    name: "Iceland",
    points: [
      [-24, 63], [-14, 64], [-14, 66], [-24, 66], [-24, 63]
    ]
  },
  {
    name: "New Zealand",
    points: [
      [166, -46], [178, -37], [174, -36], [166, -40], [166, -46]
    ]
  }
];

/**
 * Draws a premium, stylized world map on a canvas for use as a 3D Earth texture.
 * Implements a sleek dark space/cyber-sustainability look.
 */
export function drawWorldMapToCanvas(
  canvas: HTMLCanvasElement,
  themeColor: string = "#56A35C", // Premium Balú Green
  gridColor: string = "rgba(167, 217, 72, 0.15)", // Subtle Lime Grid
  glowColor: string = "rgba(86, 163, 92, 0.4)" // Greenish glow
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Clear background - very dark space blue
  ctx.fillStyle = "#030c14";
  ctx.fillRect(0, 0, w, h);

  // Helper to map longitude/latitude to Canvas X/Y (Equirectangular Projection)
  const mapCoords = (lng: number, lat: number): [number, number] => {
    const x = ((lng + 180) / 360) * w;
    const y = ((90 - lat) / 180) * h;
    return [x, y];
  };

  // 2. Draw subtle grid lines (meridians and parallels)
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  // Parallels (horizontal lines)
  for (let lat = -60; lat <= 60; lat += 20) {
    const [, y] = mapCoords(0, lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Meridians (vertical lines)
  for (let lng = -180; lng <= 180; lng += 30) {
    const [x] = mapCoords(lng, 0);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // 3. Draw continents
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 15;

  WORLD_CONTINENTS.forEach((continent) => {
    if (continent.points.length === 0) return;

    ctx.beginPath();
    const [startX, startY] = mapCoords(
      continent.points[0][0],
      continent.points[0][1]
    );
    ctx.moveTo(startX, startY);

    for (let i = 1; i < continent.points.length; i++) {
      const [px, py] = mapCoords(
        continent.points[i][0],
        continent.points[i][1]
      );
      ctx.lineTo(px, py);
    }

    ctx.closePath();

    // Fill continent with a sleek semi-transparent green/cyan gradient or solid
    const gradient = ctx.createRadialGradient(
      w / 2, h / 2, 10,
      w / 2, h / 2, w / 2
    );
    gradient.addColorStop(0, "rgba(86, 163, 92, 0.4)");
    gradient.addColorStop(1, "rgba(22, 54, 38, 0.65)");

    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw glowing neon border
    ctx.shadowBlur = 8;
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });

  // Reset shadow for further draws
  ctx.shadowBlur = 0;
}
