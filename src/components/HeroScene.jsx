import { useEffect, useRef } from 'react';

/**
 * HeroScene — Canvas 2D Particle Logo + Retro 3D Grid Background in CEPSA Brand Palette.
 *
 * 1. Retro 3D Grid Floor:
 *    - Perspective grid lines receding to vanishing horizon point in warm CEPSA Terracotta & Gold
 *    - Continuous forward movement animation with glowing brand grid lines
 *    - Radial horizon ambient glow
 *
 * 2. Centered Big Particle Logo (3,800 Particles):
 *    - FORMING   → 3,800 glowing brand particles assemble in center with spring physics
 *    - HOLD      → Centered logo holds with subtle shimmering particle glow
 *    - FREEING   → Logo disassembles and explodes outward into free space
 *    - FLOATING  → Particles float freely across the 3D grid field with mouse physics
 */

const PARTICLE_COUNT = 3800;
const LOGO_SRC = '/cepsa-logo.png';

// CEPSA Brand Theme Color Palette (Terracotta, Warm Gold, Ivory, Bronze)
const BRAND_PALETTE = ['#B17F59', '#D8A279', '#C9956C', '#FBBF24', '#E8C99A', '#986743', '#FFFFFF'];

// Phase durations (ms)
const PHASE = {
  FORMING:  2200,
  HOLD:     2600,
  FREEING:  2200,
  FLOATING: 2800,
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function HeroScene({ style, className }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });
  const shockwavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Canvas Resize Listener ─────────────────────────────────────────
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Mouse & Click Physics Listeners ───────────────────────────────
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      shockwavesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 6,
        maxRadius: Math.max(canvas.width, canvas.height) * 0.55,
        alpha: 0.88,
      });

      if (particlesRef.current) {
        particlesRef.current.forEach((p) => {
          const dx = p.x - clickX;
          const dy = p.y - clickY;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) dist = 1;
          const force = (1 / dist) * 16 * (120 + Math.random() * 90);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleCanvasClick);

    // ── Particle Array & Sampling References ──────────────────────────
    let logoTargets = [];
    let particles = [];
    const particlesRef = { current: [] };

    const img = new Image();
    img.src = LOGO_SRC;
    img.onload = () => {
      logoTargets = sampleLogo(img, canvas);
      particles = buildParticles(logoTargets, canvas);
      particlesRef.current = particles;
      startLoop();
    };
    img.onerror = () => {
      logoTargets = sampleText(canvas);
      particles = buildParticles(logoTargets, canvas);
      particlesRef.current = particles;
      startLoop();
    };

    // ── Main Render & Animation Loop ──────────────────────────────────
    let phase = 'FORMING';
    let phaseStart = performance.now();
    let gridOffset = 0;

    function startLoop() {
      phaseStart = performance.now();
      phase = 'FORMING';
      loop(performance.now());
    }

    function loop(now) {
      rafRef.current = requestAnimationFrame(loop);

      const W = canvas.width;
      const H = canvas.height;
      const mouse = mouseRef.current;

      // Update 3D Grid Animation Offset
      gridOffset = (now * 0.04) % 40;

      // Phase Transitions
      let elapsed = now - phaseStart;
      if (elapsed >= PHASE[phase]) {
        phaseStart = now;
        elapsed = 0;
        if (phase === 'FORMING') {
          phase = 'HOLD';
        } else if (phase === 'HOLD') {
          phase = 'FREEING';
          const cx = W / 2;
          const cy = H * 0.45;
          particles.forEach((p) => {
            const angle = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 0.8;
            const speed = 3.0 + Math.random() * 5.5;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
          });
        } else if (phase === 'FREEING') {
          phase = 'FLOATING';
        } else if (phase === 'FLOATING') {
          phase = 'FORMING';
          particles.forEach((p) => {
            p.sx = p.x;
            p.sy = p.y;
          });
        }
      }

      const t = Math.min(elapsed / PHASE[phase], 1);

      // ── 1. RENDER BACKGROUND & RETRO 3D GRID FLOOR (CEPSA BRAND COLOR)
      ctx.fillStyle = '#080C10';
      ctx.fillRect(0, 0, W, H);

      const horizonY = H * 0.48;

      // Horizon Terracotta & Gold Ambient Glow
      const horizonGrad = ctx.createRadialGradient(W / 2, horizonY, 0, W / 2, horizonY, W * 0.65);
      horizonGrad.addColorStop(0, 'rgba(216, 162, 121, 0.28)');
      horizonGrad.addColorStop(0.35, 'rgba(177, 127, 89, 0.14)');
      horizonGrad.addColorStop(1, 'rgba(8, 12, 16, 0)');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, W, H);

      // Render 3D Perspective Grid Floor
      ctx.save();
      ctx.beginPath();

      // Perspective Vertical Lines
      const numVLines = 32;
      for (let i = -numVLines / 2; i <= numVLines / 2; i++) {
        const startX = W / 2 + i * (W * 0.01);
        const endX = W / 2 + i * (W * 0.08);
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, H);
      }

      // Animated Horizontal Perspective Lines
      const numHLines = 18;
      for (let i = 0; i < numHLines; i++) {
        const progress = ((i * 25 + gridOffset) % 250) / 250;
        const lineY = horizonY + Math.pow(progress, 2.2) * (H - horizonY);
        ctx.moveTo(0, lineY);
        ctx.lineTo(W, lineY);
      }

      ctx.strokeStyle = 'rgba(216, 162, 121, 0.35)'; // CEPSA Terracotta Grid Lines
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.restore();

      // ── 2. RENDER ACTIVE EXPANDING SHOCKWAVES ─────────────────────
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08;
        sw.alpha *= 0.92;

        if (sw.alpha <= 0.01) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(216, 162, 121, ${sw.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // ── 3. UPDATE & DRAW CENTERED LOGO PARTICLES (CEPSA PALETTE) ───
      particles.forEach((p) => {
        let alpha = 0.9;
        let size = p.size;

        if (phase === 'FORMING') {
          const et = easeInOutCubic(t);
          p.x = p.sx + (p.tx - p.sx) * et;
          p.y = p.sy + (p.ty - p.sy) * et;
          alpha = 0.35 + et * 0.65;
          size = p.size * (0.8 + et * 0.4);
        } else if (phase === 'HOLD') {
          p.x = p.tx;
          p.y = p.ty;
          alpha = 0.92 + Math.sin(p.phase + now * 0.003) * 0.08;
          size = p.size * (1.0 + Math.sin(p.phase + now * 0.004) * 0.08);
        } else if (phase === 'FREEING' || phase === 'FLOATING') {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;

          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;

          if (p.x < 10 || p.x > W - 10) p.vx *= -0.8;
          if (p.y < 10 || p.y > H - 10) p.vy *= -0.8;
          p.x = Math.max(10, Math.min(W - 10, p.x));
          p.y = Math.max(10, Math.min(H - 10, p.y));

          alpha = 0.45 + Math.sin(p.phase + now * 0.002) * 0.25;
          size = p.size * 0.85;
        }

        // Interactive Mouse Repulsion Force
        if (mouse.x > 0) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius) {
            const force = (1 - mdist / mouse.radius) * 5;
            const angle = Math.atan2(mdy, mdx);
            p.x += Math.cos(angle) * force;
            p.y += Math.sin(angle) * force;
          }
        }

        // Render Glowing Particle Point
        ctx.globalAlpha = Math.max(0.15, Math.min(1, alpha));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, size), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('click', handleCanvasClick);
      }
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      className={className}
    />
  );
}

// ── Sampling Helpers ──────────────────────────────────────────────────────────

function sampleLogo(img, targetCanvas) {
  const W = targetCanvas.width;
  const H = targetCanvas.height;

  // Centered Logo Scale (Up to 960px width)
  const logoW = Math.min(W * 0.85, 960);
  const logoH = logoW * (img.naturalHeight / img.naturalWidth);
  const logoX = (W - logoW) / 2;
  const logoY = (H - logoH) * 0.45;

  const offscreen = document.createElement('canvas');
  offscreen.width = Math.round(logoW);
  offscreen.height = Math.round(logoH);
  const octx = offscreen.getContext('2d');
  octx.drawImage(img, 0, 0, offscreen.width, offscreen.height);

  const data = octx.getImageData(0, 0, offscreen.width, offscreen.height).data;

  const hits = [];
  const step = 2;
  for (let py = 0; py < offscreen.height; py += step) {
    for (let px = 0; px < offscreen.width; px += step) {
      const idx = (py * offscreen.width + px) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
      if (a < 80) continue;

      const isGold = r > 150 && g > 100 && b < 80 && r > g * 1.3;
      const isDark = r < 100 && g < 100 && b < 100 && a > 120;

      if (isGold || isDark) {
        hits.push({
          x: logoX + px,
          y: logoY + py,
          isGold,
        });
      }
    }
  }

  return downsample(hits, PARTICLE_COUNT);
}

function sampleText(targetCanvas) {
  const W = targetCanvas.width;
  const H = targetCanvas.height;
  const offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  const octx = offscreen.getContext('2d');
  octx.fillStyle = '#000';
  octx.font = `900 ${Math.round(H * 0.32)}px "Outfit", "Inter", sans-serif`;
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillText('CEPSA', W / 2, H * 0.45);
  const data = octx.getImageData(0, 0, W, H).data;
  const hits = [];
  const step = 3;
  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const idx = (py * W + px) * 4;
      if (data[idx + 3] > 80) hits.push({ x: px, y: py, isGold: false });
    }
  }
  return downsample(hits, PARTICLE_COUNT);
}

function downsample(hits, count) {
  if (hits.length <= count) return hits;
  const step = hits.length / count;
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(hits[Math.floor(i * step)]);
  }
  return out;
}

function buildParticles(targets, canvas) {
  const W = canvas.width;
  const H = canvas.height;

  return targets.map((t) => ({
    tx: t.x,
    ty: t.y,
    x: Math.random() * W,
    y: Math.random() * H,
    isGold: t.isGold,
    color: t.isGold ? '#FBBF24' : BRAND_PALETTE[Math.floor(Math.random() * BRAND_PALETTE.length)],
    sx: Math.random() * W,
    sy: Math.random() * H,
    vx: (Math.random() - 0.5) * 2.0,
    vy: (Math.random() - 0.5) * 2.0,
    size: 1.1 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
  }));
}
