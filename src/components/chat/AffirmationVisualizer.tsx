
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
      maxSize: number;
      growth: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
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
    
    function getRandomSoothingColor() {
      const colors = [
        'rgba(155, 135, 245, 0.6)', // Soft Purple
        'rgba(126, 105, 171, 0.5)', // Muted Purple
        'rgba(214, 188, 250, 0.4)', // Light Purple
        'rgba(229, 222, 255, 0.5)', // Softer Purple
        'rgba(242, 252, 226, 0.4)', // Soft Green
        'rgba(254, 247, 205, 0.5)', // Soft Yellow
        'rgba(156, 198, 233, 0.5)', // Soft Blue
        'rgba(214, 234, 248, 0.4)', // Lighter Blue
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create soothing gradient background
    function createSoothingBackground(time: number) {
      // Create a soft, soothing gradient background that slowly shifts
      const gradient = ctx.createRadialGradient(
        canvas.width * (0.5 + 0.1 * Math.sin(time * 0.0003)), 
        canvas.height * (0.5 + 0.1 * Math.cos(time * 0.0004)),
        0,
        canvas.width * 0.5, 
        canvas.height * 0.5,
        canvas.width * 0.8
      );
      
      // Shift gradient colors very slightly over time
      const hue1 = (230 + 10 * Math.sin(time * 0.0002)) % 360; // Blue-ish range
      const hue2 = (260 + 10 * Math.cos(time * 0.0003)) % 360; // Purple-ish range
      
      gradient.addColorStop(0, `hsla(${hue1}, 70%, 70%, 0.7)`);
      gradient.addColorStop(1, `hsla(${hue2}, 80%, 40%, 0.7)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle glow in the center
      const centerGlow = ctx.createRadialGradient(
        canvas.width * 0.5, 
        canvas.height * 0.4,
        0,
        canvas.width * 0.5, 
        canvas.height * 0.4,
        canvas.width * 0.4
      );
      centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      centerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw gentle flowing lines
    function drawFlowingLines(time: number) {
      ctx.beginPath();
      
      // Horizontal center line
      const centerY = canvas.height * 0.75;
      
      // Create more natural, organically flowing lines
      const segments = 10;
      const width = canvas.width;
      const lineSpacing = canvas.height * 0.1;
      
      for (let j = 0; j < 3; j++) {
        const yOffset = j * lineSpacing - lineSpacing;
        ctx.beginPath();
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * width;
          const intensity = 
            Math.sin(i * 0.3 + time * 0.001 + j * 0.7) * 
            Math.sin(i * 0.2 - time * 0.0008 + j * 0.4);
          const amplitude = 10 * (Math.sin(time * 0.0005 + j) * 0.5 + 0.5);
          const y = centerY + yOffset + intensity * amplitude;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Stylized stroke with gradient and varying alpha
        const alpha = 0.1 + j * 0.1;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    
    // Draw a gentle breathing circle
    function drawBreathingCircle(time: number) {
      const x = canvas.width * 0.5;
      const y = canvas.height * 0.4;
      
      // Calculate breathing rhythm - slower, more meditative
      const breathSize = 
        40 + 
        20 * Math.sin(time * 0.0004) * 
        Math.pow(Math.sin(time * 0.0004), 2); // Pause at full breath
      
      // Main circle with soft gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, breathSize);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, breathSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Outer glow ring
      ctx.beginPath();
      ctx.arc(x, y, breathSize + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Initialize particles
    function init() {
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
      }
    }
    
    // Animation loop
    function animate() {
      const currentTime = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      createSoothingBackground(currentTime);
      
      // Draw breathing circle
      drawBreathingCircle(currentTime);
      
      // Draw flowing lines
      drawFlowingLines(currentTime);
      
      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(currentTime);
        particles[i].draw();
      }
      
      // Draw the main affirmation text
      if (currentAffirmation) {
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
