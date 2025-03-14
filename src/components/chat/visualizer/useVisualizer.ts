
import { useEffect, useRef, useState, useMemo } from 'react';
import { Particle } from './Particle';
import { createSoothingBackground } from './Background';
import { drawFlowingLines } from './FlowingLines';
import { drawBreathingCircle } from './BreathingCircle';
import { drawAffirmationText } from './AffirmationText';

// Throttle function to limit how often a function runs
const throttle = (callback: Function, limit: number) => {
  let waiting = false;
  return function() {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

export const useVisualizer = (isActive: boolean, currentAffirmation: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Create particles only when dimensions change or when becoming active
  // This avoids recreating particles on every render
  const initializeParticles = () => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      particlesRef.current = [];
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push(new Particle(dimensions.width, dimensions.height));
      }
    }
  };
  
  // Handle resize in a more efficient way
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Only update if dimensions actually changed
      if (width !== dimensions.width || height !== dimensions.height) {
        canvas.width = width;
        canvas.height = height;
        setDimensions({ width, height });
      }
    };
    
    // Throttled resize handler to improve performance
    const throttledResize = throttle(handleResize, 200);
    
    // Initial sizing
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', throttledResize);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
    };
  }, []);
  
  // Initialize particles when dimensions change
  useEffect(() => {
    initializeParticles();
  }, [dimensions.width, dimensions.height, isActive]);
  
  // The animation loop using requestAnimationFrame for better performance
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }
      
      // Clear canvas first for efficiency
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      createSoothingBackground(ctx, canvas.width, canvas.height, time);
      
      // Draw breathing circle
      drawBreathingCircle(ctx, canvas.width, canvas.height, time);
      
      // Draw flowing lines
      drawFlowingLines(ctx, canvas.width, canvas.height, time);
      
      // Update and draw particles
      // Only update every other particle on each frame for better performance with many particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        if (i % 2 === time % 2) { // Only update half the particles each frame
          particles[i].update(time);
        }
        particles[i].draw(ctx);
      }
      
      // Draw the affirmation text on top
      drawAffirmationText(ctx, canvas.width, canvas.height, currentAffirmation);
      
      // Schedule next frame
      requestRef.current = requestAnimationFrame(animate);
      previousTimeRef.current = time;
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up animation on unmount or when isActive changes
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, currentAffirmation]);
  
  return canvasRef;
};
