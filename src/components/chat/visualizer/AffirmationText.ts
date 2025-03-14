
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
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // Word wrap the text
    const words = mainLine.split(' ');
    let currentLine = '';
    let y = canvasHeight * 0.4;
    
    // Use a nicer font
    ctx.font = '500 24px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvasWidth - 60 && i > 0) {
        ctx.fillText(currentLine, canvasWidth / 2, y);
        currentLine = words[i] + ' ';
        y += 35;
      } else {
        currentLine = testLine;
      }
    }
    
    ctx.fillText(currentLine, canvasWidth / 2, y);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
}
