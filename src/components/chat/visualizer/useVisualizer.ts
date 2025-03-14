
import { useEffect, useRef } from 'react';
import { Particle } from './Particle';
import { createSoothingBackground } from './Background';
import { drawFlowingLines } from './FlowingLines';
import { drawBreathingCircle } from './BreathingCircle';
import { drawAffirmationText } from './AffirmationText';

export const useVisualizer = (isActive: boolean, currentAffirmation: string) => {
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
    
    // Initialize particles
    function init() {
      particles = [];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    }
    
    // Animation loop
    function animate() {
      const currentTime = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      createSoothingBackground(ctx, canvas.width, canvas.height, currentTime);
      
      // Draw breathing circle
      drawBreathingCircle(ctx, canvas.width, canvas.height, currentTime);
      
      // Draw flowing lines
      drawFlowingLines(ctx, canvas.width, canvas.height, currentTime);
      
      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(currentTime);
        particles[i].draw(ctx);
      }
      
      // Draw the main affirmation text
      drawAffirmationText(ctx, canvas.width, canvas.height, currentAffirmation);
      
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
  
  return canvasRef;
};
