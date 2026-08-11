import React, { useState, useEffect, useRef } from 'react';

// Import Hero Media Frame Assets
import frame1Image from '../assets/frame1.png';
import frame2Image from '../assets/frame2.png';
import frame3Image from '../assets/frame3.png';
import frame4Image from '../assets/frame4.png';

export default function HeroFrameSlider3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const frames = [
    { id: 1, src: frame1Image },
    { id: 2, src: frame2Image },
    { id: 3, src: frame3Image },
    { id: 4, src: frame4Image },
  ];

  // Continuous auto-play rotation
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frames.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isHovered, frames.length]);

  // Mouse Move Tilt Effect for 3D Perspective
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[340px] sm:h-[400px] lg:h-[450px] flex items-center justify-center select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* 3D PERSPECTIVE CONTAINER */}
      <div
        className="relative w-full h-full flex items-center justify-center transform-gpu transition-transform duration-300 ease-out"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${mousePos.y * -14}deg) rotateY(${mousePos.x * 18}deg)`,
        }}
      >
        {frames.map((frame, index) => {
          // Calculate relative circular offset (-1, 0, 1, 2)
          let offset = index - currentIndex;
          if (offset < -1) offset += frames.length;
          if (offset > 1) offset -= frames.length;

          const isActive = offset === 0;
          const isPrev = offset === -1 || (currentIndex === 0 && index === frames.length - 1);
          const isNext = offset === 1 || (currentIndex === frames.length - 1 && index === 0);

          // Dynamic 3D Matrix Transforms
          let transformCss = 'translate3d(0, 0, -280px) scale(0.65) rotateY(180deg)';
          let opacityCss = '0';
          let zIndex = 0;
          let filterCss = 'blur(4px) brightness(0.6)';

          if (isActive) {
            transformCss = 'translate3d(0, 0, 80px) scale(1) rotateY(0deg)';
            opacityCss = '1';
            zIndex = 30;
            filterCss = 'none';
          } else if (isPrev) {
            transformCss = 'translate3d(-42%, 0, -60px) scale(0.84) rotateY(32deg)';
            opacityCss = '0.78';
            zIndex = 20;
            filterCss = 'brightness(0.85)';
          } else if (isNext) {
            transformCss = 'translate3d(42%, 0, -60px) scale(0.84) rotateY(-32deg)';
            opacityCss = '0.78';
            zIndex = 20;
            filterCss = 'brightness(0.85)';
          }

          return (
            <div
              key={frame.id}
              onClick={() => setCurrentIndex(index)}
              className="absolute w-[82%] sm:w-[75%] lg:w-[78%] h-[88%] rounded-3xl overflow-hidden cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu border border-white/20"
              style={{
                transform: transformCss,
                opacity: opacityCss,
                zIndex,
                filter: filterCss,
                boxShadow: isActive
                  ? '0 25px 50px -12px rgba(177, 127, 89, 0.35), 0 0 30px rgba(177, 127, 89, 0.2)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={frame.src}
                alt=""
                className="w-full h-full object-cover rounded-3xl pointer-events-none"
              />

              {/* AMBIENT LIGHT SHIMMER OVERLAY */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/15 pointer-events-none transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
