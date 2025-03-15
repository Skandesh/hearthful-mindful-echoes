
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Particle } from './Particle';
import { createSoothingBackground } from './Background';
import { drawFlowingLines } from './FlowingLines';
import { drawBreathingCircle } from './BreathingCircle';
import { drawAffirmationText } from './AffirmationText';

// Debounce function for resize events
const debounce = (callback: Function, delay: number) => {
  let timeoutId: number | undefined;
  return function(...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
      timeoutId = undefined;
    }, delay);
  };
};

export const useVisualizer = (isActive: boolean, currentAffirmation: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const devicePixelRatio = useRef(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  
  // Memoize particle count based on screen size for better performance
  const particleCount = useMemo(() => {
    if (dimensions.width < 400) return 20;      // Mobile
    if (dimensions.width < 800) return 30;      // Tablet
    return 40;                                   // Desktop
  }, [dimensions.width]);
  
  // Create particles with a memoized initialization function
  const initializeParticles = useCallback(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      particlesRef.current = [];
      
      // Create fewer particles on smaller screens
      const count = particleCount;
      
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle(dimensions.width, dimensions.height));
      }
    }
  }, [dimensions.width, dimensions.height, particleCount]);
  
  // Handle resize in a more efficient way with debounce
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Only update if dimensions actually changed
      if (width !== dimensions.width || height !== dimensions.height) {
        // Set correct size considering device pixel ratio for sharper rendering
        const dpr = devicePixelRatio.current;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Update dimensions state which will trigger particle initialization
        setDimensions({ width, height });
      }
    };
    
    // Debounced resize handler to improve performance
    const debouncedResize = debounce(handleResize, 250);
    
    // Initial sizing
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);
  
  // Initialize particles when dimensions change
  useEffect(() => {
    if (isActive) {
      initializeParticles();
    }
  }, [dimensions.width, dimensions.height, isActive, initializeParticles]);
  
  // The animation loop using requestAnimationFrame for better performance
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    if (!ctx) return;
    
    // Apply device pixel ratio scale once at the start for sharp rendering
    const dpr = devicePixelRatio.current;
    if (dpr !== 1) {
      ctx.scale(dpr, dpr);
    }
    
    let frameSkip = 0;
    const isLowPowerDevice = dimensions.width < 500 || dimensions.height < 400;
    const frameSkipThreshold = isLowPowerDevice ? 1 : 3; // Skip frames on low-power devices
    
    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }
      
      // Frame skipping for low-power devices
      frameSkip = (frameSkip + 1) % frameSkipThreshold;
      const shouldRenderThisFrame = frameSkip === 0 || !isLowPowerDevice;
      
      if (shouldRenderThisFrame) {
        // Clear canvas first for efficiency
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        
        // Draw background
        createSoothingBackground(ctx, dimensions.width, dimensions.height, time);
        
        // Draw breathing circle
        drawBreathingCircle(ctx, dimensions.width, dimensions.height, time);
        
        // Draw flowing lines - skip on very small screens
        if (dimensions.width > 200) {
          drawFlowingLines(ctx, dimensions.width, dimensions.height, time);
        }
        
        // Update and draw particles
        // Limit particle updates for better performance
        const particles = particlesRef.current;
        const updateRatio = isLowPowerDevice ? 3 : 2; // Update fewer particles on low-power devices
        
        for (let i = 0; i < particles.length; i++) {
          if (i % updateRatio === time % updateRatio) { // Only update a subset of particles each frame
            particles[i].update(time);
          }
          particles[i].draw(ctx);
        }
        
        // Draw the affirmation text on top
        drawAffirmationText(ctx, dimensions.width, dimensions.height, currentAffirmation);
      }
      
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
        requestRef.current = undefined;
      }
    };
  }, [isActive, currentAffirmation, dimensions.width, dimensions.height]);
  
  return canvasRef;
};
