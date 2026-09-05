"use client";

import { useEffect, useRef } from "react";

// Subtle dot grid background with gentle animation (port of script.js).
export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: { x: number; y: number; baseAlpha: number }[] = [];
    const SPACING = 40;
    const mouse = { x: -1000, y: -1000 };
    let animFrame = 0;

    function buildDots() {
      dots = [];
      for (let x = SPACING; x < width; x += SPACING) {
        for (let y = SPACING; y < height; y += SPACING) {
          dots.push({ x, y, baseAlpha: 0.08 + Math.random() * 0.04 });
        }
      }
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      buildDots();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 200);
        const alpha = dot.baseAlpha + influence * 0.25;
        const radius = 0.6 + influence * 1.2;

        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx!.fill();
      }
      animFrame = requestAnimationFrame(draw);
    }

    const onResize = () => {
      cancelAnimationFrame(animFrame);
      resize();
      draw();
    };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none opacity-35"
      aria-hidden="true"
    />
  );
}
