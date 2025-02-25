
import React, { useEffect, useRef } from "react";

interface AffirmationVisualizerProps {
  isActive: boolean;
  currentAffirmation: string;
}

export function AffirmationVisualizer({ isActive, currentAffirmation }: AffirmationVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Animation variables
    let particles: Particle[] = [];
    let animationFrameId: number;
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = getRandomColor();
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    function getRandomColor() {
      const colors = [
        '#9b87f5', // Primary Purple
        '#7E69AB', // Secondary Purple
        '#D6BCFA', // Light Purple
        '#E5DEFF', // Soft Purple
        '#F2FCE2', // Soft Green
        '#FEF7CD', // Soft Yellow
        '#FEC6A1', // Soft Orange
        '#FFDEE2', // Soft Pink
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create gradient background like music player
    function createGradientBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(155, 135, 245, 0.8)'); // Primary Purple
      gradient.addColorStop(1, 'rgba(126, 105, 171, 0.8)'); // Secondary Purple
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle noise texture
      for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
          if (Math.random() > 0.996) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
            ctx.fillRect(i, j, 4, 4);
          }
        }
      }
    }
    
    // Initialize particles
    function init() {
      particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      createGradientBackground();
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Draw the main affirmation text
      const lines = currentAffirmation.split('.').filter(line => line.trim() !== '');
      
      if (lines.length > 0) {
        const mainLine = lines[0].trim();
        
        // Draw the main affirmation in large text
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        
        // Word wrap the text
        const words = mainLine.split(' ');
        let currentLine = '';
        let y = canvas.height / 2 - 20;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width - 40 && i > 0) {
            ctx.fillText(currentLine, canvas.width / 2, y);
            currentLine = words[i] + ' ';
            y += 30;
          } else {
            currentLine = testLine;
          }
        }
        
        ctx.fillText(currentLine, canvas.width / 2, y);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // Start animation
    init();
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, currentAffirmation]);
  
  return (
    <div className="mb-4 rounded-lg overflow-hidden">
      <div className="bg-gradient-to-b from-primary/90 to-primary-foreground/20 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center mr-3">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Daily Affirmation</h3>
            <p className="text-white/70 text-sm">Empowerment Session</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white">★</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-white">⋯</span>
          </button>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 bg-primary"
      />
    </div>
  );
}
