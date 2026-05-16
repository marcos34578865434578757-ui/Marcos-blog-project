"use client";

import { useEffect, useRef } from "react";

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  active: number;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  sway: number;
  phase: number;
};

export function InteractiveGlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasElement = canvas;

    const context = canvasElement.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx = context;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer: PointerState = {
      x: window.innerWidth * 0.58,
      y: window.innerHeight * 0.28,
      targetX: window.innerWidth * 0.58,
      targetY: window.innerHeight * 0.28,
      active: 0,
    };
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const start = performance.now();
    const particles: Particle[] = [];

    function createParticles() {
      particles.length = 0;
      const count = Math.max(18, Math.min(34, Math.floor((width * height) / 48000)));
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.4 + Math.random() * 3.4,
          alpha: 0.05 + Math.random() * 0.07,
          speed: 0.08 + Math.random() * 0.18,
          sway: 6 + Math.random() * 18,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
      width = window.innerWidth;
      height = window.innerHeight;
      canvasElement.width = Math.floor(width * ratio);
      canvasElement.height = Math.floor(height * ratio);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    }

    function drawRibbon(time: number, yOffset: number, color: string, alpha: number, amplitude: number) {
      const gradient = ctx.createLinearGradient(0, yOffset - 180, width, yOffset + 180);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.28, color);
      gradient.addColorStop(0.72, color);
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.lineWidth = Math.max(120, width * 0.12);
      ctx.lineCap = "round";
      ctx.strokeStyle = gradient;
      ctx.filter = "blur(34px)";
      ctx.beginPath();

      for (let x = -80; x <= width + 80; x += 28) {
        const waveA = Math.sin(x * 0.006 + time * 0.00055) * amplitude;
        const waveB = Math.sin(x * 0.013 - time * 0.00036) * (amplitude * 0.38);
        const pull = Math.sin((x / Math.max(width, 1)) * Math.PI) * pointer.active * 36;
        const y = yOffset + waveA + waveB - pull;
        if (x === -80) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.restore();
    }

    function render(now: number) {
      const time = reducedMotion ? start : now;
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      pointer.active += ((pointer.active > 0 ? 1 : 0) - pointer.active) * 0.035;

      ctx.clearRect(0, 0, width, height);

      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "#effaf3");
      base.addColorStop(0.42, "#f7fcf8");
      base.addColorStop(1, "#e6f5ec");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const pointerGlow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.max(width, height) * 0.56);
      pointerGlow.addColorStop(0, "rgba(73, 176, 126, 0.38)");
      pointerGlow.addColorStop(0.28, "rgba(142, 221, 178, 0.24)");
      pointerGlow.addColorStop(0.68, "rgba(213, 244, 226, 0.10)");
      pointerGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = pointerGlow;
      ctx.fillRect(0, 0, width, height);

      drawRibbon(time, height * 0.18 + pointer.y * 0.04, "rgba(104, 206, 154, 0.42)", 0.9, 34);
      drawRibbon(time + 1200, height * 0.45 - pointer.y * 0.025, "rgba(186, 235, 205, 0.52)", 0.75, 48);
      drawRibbon(time + 2600, height * 0.76, "rgba(54, 148, 103, 0.20)", 0.58, 42);
      drawParticles(time);

      const wash = ctx.createLinearGradient(0, 0, 0, height);
      wash.addColorStop(0, "rgba(255,255,255,0.18)");
      wash.addColorStop(0.52, "rgba(255,255,255,0.34)");
      wash.addColorStop(1, "rgba(245,251,246,0.72)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(render);
      }
    }

    function drawParticles(time: number) {
      const interactionRadius = 120;
      for (const particle of particles) {
        const driftY = reducedMotion ? 0 : ((time * particle.speed) / 42) % (height + 40);
        const currentY = (particle.y + driftY) % (height + 40) - 20;
        const currentX =
          particle.x +
          (reducedMotion ? 0 : Math.sin(time * 0.00022 + particle.phase) * particle.sway);
        const dx = currentX - pointer.x;
        const dy = currentY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence =
          pointer.active > 0 && distance < interactionRadius
            ? (1 - distance / interactionRadius) * pointer.active
            : 0;
        const spreadX = influence ? (dx / Math.max(distance, 1)) * (6 + influence * 14) : 0;
        const spreadY = influence ? (dy / Math.max(distance, 1)) * (6 + influence * 14) : 0;
        const drawX = currentX + spreadX;
        const drawY = currentY + spreadY;
        const radius = particle.radius + influence * 0.9;
        const alpha = particle.alpha + influence * 0.06;

        ctx.beginPath();
        ctx.fillStyle = `rgba(147, 219, 181, ${alpha.toFixed(3)})`;
        ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function onPointerMove(event: PointerEvent) {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = 1;
    }

    function onPointerLeave() {
      pointer.active = 0;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    render(start);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
