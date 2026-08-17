"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function QuantumWaveBG({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const isDark = resolvedTheme !== "light";

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let time = 0;

    // --- Math Variables for Tweaking ---
    const PARTICLE_COUNT = 80; // Reduced for performance
    const MAX_CONNECTION_DISTANCE = 120; // Entanglement line range
    const WAVE_AMPLITUDE = 150; // Vertical wave height
    const WAVE_FREQUENCY = 0.003; // Tightness of the wave along X
    const WAVE_SPEED = 0.005; // Animation speed of the undulation (Slowed down)
    const BASE_RADIUS = 1.5; // Base particle size
    
    // Theme-based colors
    const COLORS = isDark 
      ? ["#00f3ff", "#8a2be2", "#0055ff"] // Quantum palette
      : ["#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7"]; // Soft grayish zinc palette
    const BG_COLOR = isDark ? "#050508" : "#ffffff";
    const LINE_RGB = isDark ? "0, 243, 255" : "0, 0, 0";

    // Handle Resize using ResizeObserver for parent container
    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(parent);

    class Particle {
      x: number;
      y: number;
      baseY: number;
      speed: number;
      angle: number;
      color: string;
      radius: number;
      offset: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        // Spread base Y around the center of the screen
        this.baseY = h / 2 + (Math.random() - 0.5) * 300;
        this.y = this.baseY;
        // Slower horizontal drift speed
        this.speed = Math.random() * 0.3 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.radius = Math.random() * BASE_RADIUS + 0.5;
        this.offset = Math.random() * 100; // Random phase offset for sine wave
      }

      update(t: number, w: number, h: number) {
        // Drift slowly to the right
        this.x += this.speed;
        if (this.x > w + 50) {
          this.x = -50;
        }

        // Complex undulating wave motion using Sine
        const waveY = Math.sin(this.x * WAVE_FREQUENCY + t + this.offset) * WAVE_AMPLITUDE;
        
        // Add circular floating jitter
        this.angle += 0.02;
        const floatY = Math.sin(this.angle) * 15;
        
        this.y = this.baseY + waveY + floatY;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MAX_CONNECTION_DISTANCE) {
            const opacity = 1 - distance / MAX_CONNECTION_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Theme-based ephemeral connection lines
            ctx.strokeStyle = `rgba(${LINE_RGB}, ${opacity * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    let isVisible = false;
    let isAnimating = false;

    const animate = () => {
      if (!isVisible) {
        isAnimating = false;
        return;
      }
      isAnimating = true;

      time += WAVE_SPEED;
      
      // Dynamic theme background
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Update & Draw
      particles.forEach(p => {
        p.update(time, width, height);
        p.draw(ctx);
      });

      // Draw Entanglement
      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    };

    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isAnimating) {
          animate();
        }
      });
    });
    visibilityObserver.observe(parent);

    // Initialize
    resize();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={className || "fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none"}
    />
  );
}
