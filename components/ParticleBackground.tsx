'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const CURSOR_RADIUS = 200;
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;
const MAX_DIST = 200;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let bgGradient: CanvasGradient | null = null;
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Cache bg gradient — recreated only on resize, not every frame
      bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.75
      );
      bgGradient.addColorStop(0, 'rgba(245, 232, 200, 0.55)');
      bgGradient.addColorStop(0.55, 'rgba(245, 232, 200, 0.18)');
      bgGradient.addColorStop(1, 'rgba(250, 251, 252, 0)');
    };

    const createParticles = () => {
      const count = Math.min(52, Math.floor((canvas.width * canvas.height) / 23000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 2.4 + 0.8,
        opacity: Math.random() * 0.55 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
      }));
    };

    const drawParticle = (p: Particle, time: number, cursorBoost: number) => {
      const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
      const alpha = Math.min(1, p.opacity * pulse + cursorBoost * 0.6);
      const sizeBoost = 1 + cursorBoost * 0.8;

      // Halo
      const haloRadius = p.size * 7 * sizeBoost;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloRadius);
      gradient.addColorStop(0, `rgba(197, 165, 90, ${alpha * 0.55})`);
      gradient.addColorStop(0.35, `rgba(168, 134, 47, ${alpha * 0.22})`);
      gradient.addColorStop(1, 'rgba(168, 134, 47, 0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * sizeBoost, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 134, 47, ${Math.min(1, alpha + 0.25)})`;
      ctx.fill();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (bgGradient) {
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // ===== Update positions first (single pass) =====
      // Precompute cursor influence per particle
      const cursorBoosts = new Float32Array(particles.length);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CURSOR_RADIUS_SQ) {
            // Linear-ish falloff 1→0 as we move away from cursor
            const t = 1 - Math.sqrt(distSq) / CURSOR_RADIUS;
            cursorBoosts[i] = t * t; // ease for stronger center, soft edges
          }
        }
      }

      // ===== Draw connections =====
      // Particle <-> particle mesh (squared-distance to avoid sqrt in hot loop)
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        const boostI = cursorBoosts[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < MAX_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const distAlpha = (1 - dist / MAX_DIST) * 0.42;
            const pulse = 0.7 + Math.sin(time * 0.0008 + i * 0.1) * 0.3;
            // Lines under the cursor light up too
            const lineBoost = Math.max(boostI, cursorBoosts[j]);
            const alpha = distAlpha * pulse + lineBoost * 0.35;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(168, 134, 47, ${alpha})`;
            ctx.lineWidth = 0.75 + lineBoost * 0.5;
            ctx.stroke();
          }
        }
      }

      // Cursor → particle rays (only when cursor is active and particle is in range)
      if (mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          const boost = cursorBoosts[i];
          if (boost <= 0) continue;
          const p = particles[i];
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(168, 134, 47, ${boost * 0.55})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // ===== Draw particles last so cores sit on top of lines =====
      for (let i = 0; i < particles.length; i++) {
        drawParticle(particles[i], time, cursorBoosts[i]);
      }

      animationId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => {
      resize();
      createParticles();
    };

    resize();
    createParticles();
    animationId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particles-canvas" />;
}
