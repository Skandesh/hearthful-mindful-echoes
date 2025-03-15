
import { Particle as ParticleType } from './types';
import { getRandomSoothingColor } from './colors';

export class Particle implements ParticleType {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  maxSize: number;
  growth: number;
  canvasWidth: number;
  canvasHeight: number;
  lastUpdate: number;
  updateInterval: number;
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 3 + 1;
    this.maxSize = this.size + Math.random() * 3;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = getRandomSoothingColor();
    this.alpha = Math.random() * 0.4 + 0.2; // Softer opacity
    this.growth = Math.random() * 0.03; // For pulsing effect
    this.lastUpdate = 0;
    // Stagger updates with higher intervals for better performance
    this.updateInterval = Math.floor(Math.random() * 5) + 2; // Increased interval
  }
  
  update(time: number) {
    // Only update at specific intervals based on the particle's individual update frequency
    if (time - this.lastUpdate < this.updateInterval * 16) { // 16ms is ~60fps
      return;
    }
    
    this.lastUpdate = time;
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Use a more efficient size calculation with fewer operations
    this.size = this.size + Math.sin(time * 0.0005) * this.growth; // Reduced frequency
    
    // Simple clamping
    if (this.size > this.maxSize) this.size = this.maxSize;
    if (this.size < 1) this.size = 1;
    
    // Fast boundary checking with modulo for wraparound
    this.x = (this.x + this.canvasWidth) % this.canvasWidth;
    this.y = (this.y + this.canvasHeight) % this.canvasHeight;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    // Skip drawing very small particles for performance
    if (this.size < 0.8) return;
    
    // Avoid globalAlpha changes when possible for better performance
    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset to previous alpha to avoid unnecessary state changes
    ctx.globalAlpha = prevAlpha;
  }
}
