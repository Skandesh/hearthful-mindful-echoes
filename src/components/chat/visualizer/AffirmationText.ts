
// Cache for word-wrapped text to avoid recalculating on every frame
let cachedLines: string[] = [];
let cachedText: string = '';
let cachedWidth: number = 0;

export function drawAffirmationText(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  affirmationText: string
) {
  if (!affirmationText) return;
  
  const lines = affirmationText.split('.').filter(line => line.trim() !== '');
  
  if (lines.length > 0) {
    const mainLine = lines[0].trim();
    
    // Word wrap the text
    // Only recalculate if text or canvas width has changed
    if (mainLine !== cachedText || canvasWidth !== cachedWidth) {
      const words = mainLine.split(' ');
      let currentLine = '';
      cachedLines = [];
      
      // Use a nicer font
      ctx.font = '500 24px "Inter", sans-serif';
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvasWidth - 60 && i > 0) {
          cachedLines.push(currentLine);
          currentLine = words[i] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      
      cachedLines.push(currentLine);
      cachedText = mainLine;
      cachedWidth = canvasWidth;
    }
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.textAlign = 'center';
    
    // Draw each line from the cache
    let y = canvasHeight * 0.4;
    for (let i = 0; i < cachedLines.length; i++) {
      ctx.fillText(cachedLines[i], canvasWidth / 2, y);
      y += 35;
    }
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}
