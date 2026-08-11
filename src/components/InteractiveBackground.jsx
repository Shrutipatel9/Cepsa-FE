import React, { useEffect, useRef, useState } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const ripplesRef = useRef([]);
  const animFrameRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse Movement Handler (Clean & Subtle Spotlight)
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Check hover state for interactive elements
      const target = e.target;
      const interactive = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
      setIsHovered(!!interactive);
    };

    // Mouse Click Handler (Single Delicate Micro Pulse)
    const handleClick = (e) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 36,
        alpha: 0.45,
        lineWidth: 1.5,
        color: '177, 127, 89' // Terracotta #B17F59
      });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    // Render Loop (Smooth Canvas Animation)
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Gentle Ambient Spotlight Glow around Cursor
      if (mouseRef.current.active && mouseRef.current.x > 0) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          180
        );
        gradient.addColorStop(0, 'rgba(177, 127, 89, 0.07)');
        gradient.addColorStop(0.5, 'rgba(216, 162, 121, 0.02)');
        gradient.addColorStop(1, 'rgba(248, 245, 240, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render & Fast Fade Click Micro-Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.radius += (ripple.maxRadius - ripple.radius) * 0.15;
        ripple.alpha *= 0.86;

        if (ripple.alpha <= 0.01) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ripple.color}, ${ripple.alpha})`;
        ctx.lineWidth = ripple.lineWidth;
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-30 w-full h-full select-none"
      />

      {/* ULTRA-CLEAN MODERN MINIMALIST CURSOR FOLLOWER */}
      {cursorPos.x > 0 && (
        <div
          className={`fixed pointer-events-none z-40 rounded-full transform-gpu transition-all duration-150 ease-out flex items-center justify-center ${
            isHovered
              ? 'w-7 h-7 border border-[#B17F59] bg-[#B17F59]/15 shadow-xs scale-105'
              : isMouseDown
              ? 'w-5 h-5 border border-[#B17F59] bg-[#B17F59]/25 scale-90'
              : 'w-6 h-6 border border-[#B17F59]/40 bg-[#B17F59]/5'
          }`}
          style={{
            transform: `translate3d(${cursorPos.x - (isHovered ? 14 : isMouseDown ? 10 : 12)}px, ${cursorPos.y - (isHovered ? 14 : isMouseDown ? 10 : 12)}px, 0)`
          }}
        >
          <div
            className={`rounded-full bg-[#B17F59] transition-all duration-150 ${
              isHovered ? 'w-1.5 h-1.5 opacity-90' : 'w-1 h-1 opacity-70'
            }`}
          />
        </div>
      )}
    </>
  );
}
