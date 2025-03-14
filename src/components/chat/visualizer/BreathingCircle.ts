
export function drawBreathingCircle(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  const x = canvasWidth * 0.5;
  const y = canvasHeight * 0.4;
  
  // Calculate breathing rhythm - slower, more meditative
  const breathSize = 
    40 + 
    20 * Math.sin(time * 0.0004) * 
    Math.pow(Math.sin(time * 0.0004), 2); // Pause at full breath
  
  // Main circle with soft gradient
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, breathSize);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.beginPath();
  ctx.arc(x, y, breathSize, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Outer glow ring
  ctx.beginPath();
  ctx.arc(x, y, breathSize + 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.stroke();
}
