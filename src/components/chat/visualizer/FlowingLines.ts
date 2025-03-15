
// Cache for animation values
let lastLineCalcTime = 0;
let cachedSineValues: number[] = [];

export function drawFlowingLines(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  // Calculate sine values less frequently
  if (time - lastLineCalcTime > 100 || cachedSineValues.length === 0) {
    const timeFactorA = time * 0.001;
    const timeFactorB = time * 0.0008;
    const timeFactorC = time * 0.0005;
    
    // Precompute sine values for this frame
    cachedSineValues = [
      Math.sin(timeFactorA),
      Math.sin(timeFactorB),
      Math.sin(timeFactorC),
      Math.cos(timeFactorA),
      Math.cos(timeFactorB)
    ];
    
    lastLineCalcTime = time;
  }
  
  // Use cached values
  const [sinA, sinB, sinC, cosA, cosB] = cachedSineValues;
  
  // Optimize by reducing calculations and segments based on canvas width
  // Fewer segments for narrower canvases
  const segments = Math.max(4, Math.min(10, Math.floor(canvasWidth / 100)));
  
  // Horizontal center line
  const centerY = canvasHeight * 0.75;
  
  // Create more natural, organically flowing lines
  const width = canvasWidth;
  const lineSpacing = canvasHeight * 0.1;
  
  // Draw fewer lines on smaller screens
  const lineCount = canvasWidth < 400 ? 2 : 3;
  
  // Use a single stroke operation for all lines for better performance
  ctx.beginPath();
  
  for (let j = 0; j < lineCount; j++) {
    const yOffset = j * lineSpacing - lineSpacing;
    const amplitude = 10 * (sinC * 0.5 + 0.5);
    
    // Start a new path for each line
    ctx.moveTo(0, centerY + yOffset);
    
    for (let i = 1; i <= segments; i++) {
      const x = (i / segments) * width;
      const progress = i / segments;
      
      // Use cached sine values for more efficient calculations
      const intensity = 
        Math.sin(progress * 3 + sinA + j * 0.7) * 
        Math.sin(progress * 2 - sinB + j * 0.4);
      
      const y = centerY + yOffset + intensity * amplitude;
      ctx.lineTo(x, y);
    }
  }
  
  // Apply a single style and stroke operation for all lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
