import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  alpha: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  life: number;
}

const LINK_DISTANCE = 130;
const CURSOR_RADIUS = 170;
const MAX_DPR = 2;

/**
 * Full-viewport constellation canvas that reacts to the pointer:
 * particles drift, link up when close, get nudged away from the cursor,
 * connect to it with secondary-colour threads, and scatter on click.
 * Colours follow the active theme (--color-primary / --color-secondary).
 * With prefers-reduced-motion it draws a single static frame.
 */
export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: 0, y: 0, active: false };
    let primary = '#8b5cf6';
    let secondary = '#84cc16';
    let frame = 0;
    let rafId = 0;

    const readThemeColors = () => {
      const styles = getComputedStyle(document.documentElement);
      primary = styles.getPropertyValue('--color-primary').trim() || primary;
      secondary = styles.getPropertyValue('--color-secondary').trim() || secondary;
    };

    const createParticles = () => {
      const count = Math.min(Math.round((width * height) / 15000), width < 768 ? 45 : 110);
      particles = Array.from({ length: count }, () => {
        const vx = (Math.random() - 0.5) * 0.35;
        const vy = (Math.random() - 0.5) * 0.35;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: Math.random() * 1.4 + 0.8,
          alpha: Math.random() * 0.5 + 0.25
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
      if (reducedMotion) draw();
    };

    const step = () => {
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CURSOR_RADIUS && dist > 0.1) {
            const force = (1 - dist / CURSOR_RADIUS) * 0.6;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Ease back towards the particle's own slow drift
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 6;
        r.life -= 0.022;
        if (r.life <= 0) ripples.splice(i, 1);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft spotlight under the cursor
      if (pointer.active) {
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 320);
        glow.addColorStop(0, primary);
        glow.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.09;
        ctx.fillStyle = glow;
        ctx.fillRect(pointer.x - 320, pointer.y - 320, 640, 640);
      }

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = primary;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          if (Math.abs(dx) > LINK_DISTANCE || Math.abs(dy) > LINK_DISTANCE) continue;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            ctx.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        ctx.strokeStyle = secondary;
        for (const p of particles) {
          const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (dist < CURSOR_RADIUS * 1.25) {
            ctx.globalAlpha = (1 - dist / (CURSOR_RADIUS * 1.25)) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = primary;
      for (const p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = secondary;
      ctx.lineWidth = 1.5;
      for (const r of ripples) {
        ctx.globalAlpha = r.life * 0.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const loop = () => {
      // Theme can change at runtime from the admin panel; re-read occasionally
      if (frame++ % 120 === 0) readThemeColors();
      step();
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = e.pointerType === 'mouse';
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, radius: 0, life: 1 });
      for (const p of particles) {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 0.1) {
          const impulse = (1 - dist / 260) * 7;
          p.vx += (dx / dist) * impulse;
          p.vy += (dy / dist) * impulse;
        }
      }
    };

    const handleVisibility = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(loop);
    };

    readThemeColors();
    resize();
    window.addEventListener('resize', resize);

    if (!reducedMotion) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      document.documentElement.addEventListener('pointerleave', handlePointerLeave);
      document.addEventListener('visibilitychange', handleVisibility);
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Ambient gradient meshes */}
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-[var(--color-secondary)]/[0.06] rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-[var(--color-primary)]/[0.08] rounded-full blur-3xl" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
    </div>
  );
}
