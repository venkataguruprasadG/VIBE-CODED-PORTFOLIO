import { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  isDark: boolean;
}

interface MeshNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  accent: boolean;
}

export function BackgroundCanvas({ isDark }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const nodes: MeshNode[] = [];

    const buildNodes = () => {
      nodes.length = 0;
      const area = width * height;
      const targetCount = Math.min(72, Math.max(28, Math.floor(area / 24000)));
      for (let i = 0; i < targetCount; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.12 + Math.random() * 0.22;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: i % 6 === 0 ? 2.1 : 1.35,
          accent: i % 7 === 0,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const dark = isDarkRef.current;
      // Navy in light mode, Glacier ice in dark mode
      const baseRgb = dark ? '237, 246, 252' : '9, 25, 51';
      // Glacier blue accent connections
      const accentRgb = dark ? '102, 179, 245' : '59, 142, 224';
      const maxDist = 148;
      const mouseDist = 175;

      if (!prefersReducedMotion) {
        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < -16) n.x = width + 16;
          if (n.x > width + 16) n.x = -16;
          if (n.y < -16) n.y = height + 16;
          if (n.y > height + 16) n.y = -16;
        }
      }

      // Draw hairline connections between nearby nodes
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDist) * (dark ? 0.13 : 0.11);
            ctx.strokeStyle =
              a.accent || b.accent
                ? `rgba(${accentRgb}, ${alpha * 1.25})`
                : `rgba(${baseRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw cursor proximity connections
      if (mouse.active) {
        ctx.lineWidth = 0.9;
        for (let i = 0; i < nodes.length; i += 1) {
          const n = nodes[i];
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseDist * mouseDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / mouseDist) * 0.19;
            ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes (with subtle lemon accent dots on key architectural nodes)
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        if (n.accent) {
          ctx.fillStyle = dark ? 'rgba(242, 236, 56, 0.34)' : 'rgba(59, 142, 224, 0.28)';
        } else {
          ctx.fillStyle = `rgba(${baseRgb}, ${dark ? 0.16 : 0.14})`;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none no-print" aria-hidden="true">
      {/* Soft slow-drifting Glacier Blue & Lemon ambient radial glows */}
      <div
        className="animate-ambient-one absolute -top-[18%] -left-[12%] h-[58vw] w-[58vw] max-h-[760px] max-w-[760px] rounded-full opacity-55 dark:opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 142, 224, 0.20) 0%, rgba(59, 142, 224, 0.05) 45%, transparent 72%)',
        }}
      />
      <div
        className="animate-ambient-two absolute -bottom-[20%] -right-[10%] h-[52vw] w-[52vw] max-h-[680px] max-w-[680px] rounded-full opacity-45 dark:opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(239, 234, 43, 0.16) 0%, rgba(59, 142, 224, 0.04) 48%, transparent 72%)',
        }}
      />

      {/* Retina architectural mesh canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle paper grain overlay */}
      <div className="paper-grain absolute inset-0 h-full w-full" />
    </div>
  );
}
