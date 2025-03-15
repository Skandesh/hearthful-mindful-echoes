
// Cache for gradient colors to prevent recalculation on every frame
let lastColorCalcTime = 0;
let cachedColors = {
  start: 'hsla(230, 70%, 70%, 0.7)',
  end: 'hsla(260, 80%, 40%, 0.7)'
};

// Only recalculate colors every 1000ms for better performance
const calculateGradientColors = (time: number) => {
  if (time - lastColorCalcTime < 1000) {
    return cachedColors;
  }
  
  // Shift gradient colors very slightly over time (reduced frequency)
  const hue1 = (230 + 10 * Math.sin(time * 0.0001)) % 360; // Reduced from 0.0002
  const hue2 = (260 + 10 * Math.cos(time * 0.00015)) % 360; // Reduced from 0.0003
  
  cachedColors = {
    start: `hsla(${hue1}, 70%, 70%, 0.7)`,
    end: `hsla(${hue2}, 80%, 40%, 0.7)`
  };
  
  lastColorCalcTime = time;
  return cachedColors;
};

// Cache for gradient positions
let lastPosCalcTime = 0;
let cachedPositions = {
  x: 0,
  y: 0
};

export function createSoothingBackground(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  // Calculate positions less frequently for better performance
  if (time - lastPosCalcTime > 500) {
    cachedPositions = {
      x: canvasWidth * (0.5 + 0.1 * Math.sin(time * 0.0001)),
      y: canvasHeight * (0.5 + 0.1 * Math.cos(time * 0.0002))
    };
    lastPosCalcTime = time;
  }
  
  // Create a soft, soothing gradient background that slowly shifts
  const gradient = ctx.createRadialGradient(
    cachedPositions.x, 
    cachedPositions.y,
    0,
    canvasWidth * 0.5, 
    canvasHeight * 0.5,
    canvasWidth * 0.8
  );
  
  // Get colors (optimized to change less frequently)
  const colors = calculateGradientColors(time);
  
  gradient.addColorStop(0, colors.start);
  gradient.addColorStop(1, colors.end);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Add subtle glow only on larger canvases and skip on small screens
  if (canvasWidth > 400 && canvasHeight > 200) {
    const centerGlow = ctx.createRadialGradient(
      canvasWidth * 0.5, 
      canvasHeight * 0.4,
      0,
      canvasWidth * 0.5, 
      canvasHeight * 0.4,
      canvasWidth * 0.4
    );
    centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    centerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}
