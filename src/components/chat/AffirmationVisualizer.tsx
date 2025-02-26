
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
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = getRandomColor();
        this.alpha = Math.random() * 0.5 + 0.5; // Varied opacity
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
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
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
    
    // Create premium music player-like background
    function createGradientBackground() {
      // Create a deep, rich gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(84, 58, 183, 0.9)'); // Deep purple top
      gradient.addColorStop(1, 'rgba(0, 172, 193, 0.7)'); // Teal-ish bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle noise texture for depth
      for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
          if (Math.random() > 0.996) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
            ctx.fillRect(i, j, 4, 4);
          }
        }
      }
    }
    
    // Draw audio-like waveform that moves with time
    function drawWaveform(time: number) {
      ctx.beginPath();
      
      // Horizontal center line
      const centerY = canvas.height * 0.75;
      ctx.moveTo(0, centerY);
      
      // Number of segments to draw
      const segments = 40;
      const width = canvas.width;
      
      // Create a smoother, more professional looking waveform
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const intensity = Math.sin(i * 0.2 + time * 0.002) * Math.sin(i * 0.1 - time * 0.001);
        const amplitude = 20 * Math.sin(time * 0.001) + 10; // Varying amplitude
        const y = centerY + intensity * amplitude;
        
        ctx.lineTo(x, y);
      }
      
      // Stylized stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Draw a pulsing progress bar
    function drawProgressBar(time: number) {
      const barHeight = 4;
      const barY = canvas.height * 0.9;
      const maxWidth = canvas.width * 0.8;
      const startX = (canvas.width - maxWidth) / 2;
      
      // Background track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(startX, barY, maxWidth, barHeight);
      
      // Calculate progress based on time
      const progress = (Math.sin(time * 0.001) + 1) / 2; // 0 to 1 oscillating
      const progressWidth = maxWidth * progress;
      
      // Progress fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(startX, barY, progressWidth, barHeight);
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
      const currentTime = Date.now();
      
      // Draw background
      createGradientBackground();
      
      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Draw waveform and progress elements
      drawWaveform(currentTime);
      drawProgressBar(currentTime);
      
      // Draw the main affirmation text
      const lines = currentAffirmation.split('.').filter(line => line.trim() !== '');
      
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
        let y = canvas.height * 0.4;
        
        // Use a nicer font
        ctx.font = '500 24px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.textAlign = 'center';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > canvas.width - 60 && i > 0) {
            ctx.fillText(currentLine, canvas.width / 2, y);
            currentLine = words[i] + ' ';
            y += 35;
          } else {
            currentLine = testLine;
          }
        }
        
        ctx.fillText(currentLine, canvas.width / 2, y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
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
    <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-primary/10 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-3 backdrop-blur-md shadow-inner">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Affirmation to Repeat</h3>
            <p className="text-white/70 text-xs">Say or type this exactly as shown</p>
          </div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 bg-gradient-to-b from-[#543ab7] to-[#00acc1]"
      />
      <div className="p-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
          <span>Please repeat this affirmation exactly, then submit</span>
        </div>
      </div>
    </div>
  );
}
