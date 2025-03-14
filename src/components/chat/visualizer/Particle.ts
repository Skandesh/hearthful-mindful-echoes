
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
  }
  
  update(time: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Gentle pulsing size based on time
    this.size = this.size + Math.sin(time * 0.001 + this.x * 0.01) * this.growth;
    if (this.size > this.maxSize) this.size = this.maxSize;
    if (this.size < 1) this.size = 1;
    
    // Screen wrap
    if (this.x > this.canvasWidth) this.x = 0;
    else if (this.x < 0) this.x = this.canvasWidth;
    
    if (this.y > this.canvasHeight) this.y = 0;
    else if (this.y < 0) this.y = this.canvasHeight;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
