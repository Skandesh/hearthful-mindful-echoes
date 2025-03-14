
export function drawFlowingLines(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  // Optimize by reducing calculations and segments based on canvas width
  // Fewer segments for narrower canvases
  const segments = canvasWidth < 600 ? 6 : 10;
  
  // Horizontal center line
  const centerY = canvasHeight * 0.75;
  
  // Create more natural, organically flowing lines
  const width = canvasWidth;
  const lineSpacing = canvasHeight * 0.1;
  
  // Precompute sine values for better performance
  const timeFactorA = time * 0.001;
  const timeFactorB = time * 0.0008;
  const timeFactorC = time * 0.0005;
  
  // Draw fewer lines on smaller screens
  const lineCount = canvasWidth < 400 ? 2 : 3;
  
  for (let j = 0; j < lineCount; j++) {
    const yOffset = j * lineSpacing - lineSpacing;
    ctx.beginPath();
    
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const progress = i / segments;
      
      // Simplified calculations
      const intensity = 
        Math.sin(progress * 3 + timeFactorA + j * 0.7) * 
        Math.sin(progress * 2 - timeFactorB + j * 0.4);
      const amplitude = 10 * (Math.sin(timeFactorC + j) * 0.5 + 0.5);
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
