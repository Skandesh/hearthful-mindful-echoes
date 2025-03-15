
// Cache values for breathing animation
let lastBreathSize = 0;
let lastTimestamp = 0;
let cachedGradient: CanvasGradient | null = null;
let lastCanvasWidth = 0;
let lastCanvasHeight = 0;

export function drawBreathingCircle(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  const x = canvasWidth * 0.5;
  const y = canvasHeight * 0.4;
  
  // Only recalculate breathing rhythm every 50ms for better performance
  if (time - lastTimestamp > 50) {
    // Calculate breathing rhythm - slower, more meditative
    lastBreathSize = 
      40 + 
      20 * Math.sin(time * 0.0004) * 
      Math.pow(Math.sin(time * 0.0004), 2); // Pause at full breath
    
    lastTimestamp = time;
  }
  
  const breathSize = lastBreathSize;
  
  // Skip drawing if breath is too small or canvas is tiny
  if (breathSize < 3 || canvasWidth < 50 || canvasHeight < 50) return;
  
  // Only recreate gradient if canvas size changes or first time
  if (!cachedGradient || lastCanvasWidth !== canvasWidth || lastCanvasHeight !== canvasHeight) {
    cachedGradient = ctx.createRadialGradient(x, y, 0, x, y, breathSize);
    cachedGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    cachedGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
    cachedGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    lastCanvasWidth = canvasWidth;
    lastCanvasHeight = canvasHeight;
  }
  
  // Main circle with soft gradient
  ctx.beginPath();
  ctx.arc(x, y, breathSize, 0, Math.PI * 2);
  ctx.fillStyle = cachedGradient;
  ctx.fill();
  
  // Only draw outer glow ring on larger screens and when breathSize is big enough
  if (breathSize > 20 && canvasWidth > 300) {
    ctx.beginPath();
    ctx.arc(x, y, breathSize + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
