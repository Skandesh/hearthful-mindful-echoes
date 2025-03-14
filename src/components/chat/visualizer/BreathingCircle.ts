
// Cache values for breathing animation
let lastBreathSize = 0;
let lastTimestamp = 0;

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
  
  // Main circle with soft gradient
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, breathSize);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.beginPath();
  ctx.arc(x, y, breathSize, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Outer glow ring - only draw if breathSize is big enough
  if (breathSize > 5) {
    ctx.beginPath();
    ctx.arc(x, y, breathSize + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
