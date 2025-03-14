
export function createSoothingBackground(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  // Create a soft, soothing gradient background that slowly shifts
  const gradient = ctx.createRadialGradient(
    canvasWidth * (0.5 + 0.1 * Math.sin(time * 0.0003)), 
    canvasHeight * (0.5 + 0.1 * Math.cos(time * 0.0004)),
    0,
    canvasWidth * 0.5, 
    canvasHeight * 0.5,
    canvasWidth * 0.8
  );
  
  // Shift gradient colors very slightly over time
  const hue1 = (230 + 10 * Math.sin(time * 0.0002)) % 360; // Blue-ish range
  const hue2 = (260 + 10 * Math.cos(time * 0.0003)) % 360; // Purple-ish range
  
  gradient.addColorStop(0, `hsla(${hue1}, 70%, 70%, 0.7)`);
  gradient.addColorStop(1, `hsla(${hue2}, 80%, 40%, 0.7)`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Add subtle glow in the center
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
