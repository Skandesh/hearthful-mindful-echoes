
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
    
    // Initialize particles
    function init() {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(229, 222, 255, 0.3)'); // Soft Purple with transparency
      gradient.addColorStop(1, 'rgba(214, 188, 250, 0.3)'); // Light Purple with transparency
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Draw wave pattern
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let i = 0; i < canvas.width; i++) {
        const y = Math.sin(i * 0.01 + Date.now() * 0.001) * 20 + canvas.height / 2;
        ctx.lineTo(i, y);
      }
      
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.4)'; // Primary Purple with transparency
      ctx.lineWidth = 2;
      ctx.stroke();
      
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
    <div className="mb-4 rounded-lg overflow-hidden border border-[#9b87f5]/20">
      <canvas 
        ref={canvasRef} 
        className="w-full h-32 bg-[#E5DEFF]/30"
      />
    </div>
  );
}
