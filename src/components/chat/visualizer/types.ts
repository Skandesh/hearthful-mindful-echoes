
export interface Particle {
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
  
  update: (time: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface VisualizerConfig {
  particleCount: number;
  colorPalette: string[];
}
