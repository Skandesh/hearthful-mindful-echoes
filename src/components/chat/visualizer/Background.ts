
import { useMemo } from 'react';

// Cache calculation of gradients for better performance
const calculateGradientColors = (time: number) => {
  // Shift gradient colors very slightly over time (reduced frequency)
  const hue1 = (230 + 10 * Math.sin(time * 0.0001)) % 360; // Reduced from 0.0002
  const hue2 = (260 + 10 * Math.cos(time * 0.00015)) % 360; // Reduced from 0.0003
  
  return {
    start: `hsla(${hue1}, 70%, 70%, 0.7)`,
    end: `hsla(${hue2}, 80%, 40%, 0.7)`
  };
};

export function createSoothingBackground(
  ctx: CanvasRenderingContext2D, 
  canvasWidth: number, 
  canvasHeight: number, 
  time: number
) {
  // Calculate positions less frequently for better performance
  const gradientX = canvasWidth * (0.5 + 0.1 * Math.sin(time * 0.0001)); // Reduced from 0.0003
  const gradientY = canvasHeight * (0.5 + 0.1 * Math.cos(time * 0.0002)); // Reduced from 0.0004

  // Create a soft, soothing gradient background that slowly shifts
  const gradient = ctx.createRadialGradient(
    gradientX, 
    gradientY,
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
  
  // Add subtle glow in the center - only create if canvas is big enough
  if (canvasWidth > 100 && canvasHeight > 100) {
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
