
export function drawFlowingLines(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  // Horizontal center line
  const centerY = canvasHeight * 0.75;
  
  // Create more natural, organically flowing lines
  const segments = 10;
  const width = canvasWidth;
  const lineSpacing = canvasHeight * 0.1;
  
  for (let j = 0; j < 3; j++) {
    const yOffset = j * lineSpacing - lineSpacing;
    ctx.beginPath();
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const intensity = 
        Math.sin(i * 0.3 + time * 0.001 + j * 0.7) * 
        Math.sin(i * 0.2 - time * 0.0008 + j * 0.4);
      const amplitude = 10 * (Math.sin(time * 0.0005 + j) * 0.5 + 0.5);
      const y = centerY + yOffset + intensity * amplitude;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Stylized stroke with gradient and varying alpha
    const alpha = 0.1 + j * 0.1;
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}
