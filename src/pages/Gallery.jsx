import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

// Import Video Assets
import video1 from '../assets/Gallery/Video1.mp4';
import video2 from '../assets/Gallery/Video2.mp4';
import video3 from '../assets/Gallery/Video3.mp4';

// Import 6 Image Assets
import image1 from '../assets/Gallery/Image1.jpg';
import image2 from '../assets/Gallery/Image2.jpg';
import image3 from '../assets/Gallery/Image3.jpg';
import image4 from '../assets/Gallery/Image4.jpg';
import image5 from '../assets/Gallery/Image5.jpg';
import image6 from '../assets/Gallery/Image6.jpg';

function GalleryItem({ item }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = 2.5;
    }
  };

  const handleMouseLeave = () => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 2.5;
      setIsPlaying(false);
    }
  };

  const handleMouseEnter = () => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (item.type !== 'video' || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      videoRef.current.currentTime = 2.5;
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const isVideo = item.type === 'video';

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group w-full cursor-pointer"
    >
      {/* CARD CONTAINER */}
      <div className={`relative w-full ${isVideo ? 'aspect-[9/16]' : 'aspect-4/3 sm:aspect-16/11'} rounded-3xl overflow-hidden shadow-xl border border-[#E5D7CD] bg-slate-950 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_0_20px_rgba(177,127,89,0.2),0_12px_28px_-6px_rgba(43,29,20,0.18)] group-hover:border-[#D8A279]`}>

        {/* LIGHT SHEEN SWEEP */}
        <div className="absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

        {/* MEDIA LAYER: VIDEO REEL vs PHOTO */}
        {isVideo ? (
          <div className="relative w-full h-full overflow-hidden bg-slate-950">
            <video
              ref={videoRef}
              src={`${item.src}#t=2.5`}
              preload="auto"
              onLoadedMetadata={handleLoadedMetadata}
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Play/Pause Center Indicator Button */}
            <button
              onClick={togglePlay}
              className={`absolute inset-0 z-20 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
            >
              <div className="p-4 rounded-full bg-[#B17F59] text-white shadow-2xl transform group-hover:scale-110 transition-transform duration-300 border border-white/20">
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </div>
            </button>

            {/* Mute/Unmute Toggle Button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/75 text-white backdrop-blur-md border border-white/20 hover:bg-[#B17F59] transition-colors shadow-md"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={item.src}
              alt="CEPSA Gallery Showcase"
              className="w-full h-full object-cover scale-[1.02]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  // 3 Actual Videos & 6 Actual Images from assets/Gallery
  const column1 = [
    { id: 1, type: 'video', src: video1 },
    { id: 2, type: 'photo', src: image1 },
    { id: 3, type: 'photo', src: image2 },
  ];

  const column2 = [
    { id: 4, type: 'photo', src: image3 },
    { id: 5, type: 'video', src: video2 },
    { id: 6, type: 'photo', src: image4 },
  ];

  const column3 = [
    { id: 7, type: 'photo', src: image5 },
    { id: 8, type: 'video', src: video3 },
    { id: 9, type: 'photo', src: image6 },
  ];

  return (
    <div className="bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white pb-24">

      {/* 1. HERO HEADER BANNER (ELEGANT CLAY OVERLAY) */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden border-b border-[#E5D7CD] mb-14">

        {/* Background Architectural Craftsmanship Image */}
        <img
          src={image1}
          alt="CEPSA Gallery"
          className="w-full h-full object-cover opacity-65 filter brightness-95"
        />

        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1613]/60 via-[#2B1D14]/40 to-[#1C1613]/60"></div>

        {/* Center Title with Horizontal Accent Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ScrollReveal variant="fade-up" delay={100}>
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-white">
              <div className="w-12 sm:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-transparent to-[#D8A279]"></div>

              <div className="text-center space-y-1">
                <span className="text-[11px] font-mono font-bold text-[#D8A279] uppercase tracking-widest block">
                  CEPSA
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md text-amber-50">
                  Gallery
                </h1>
              </div>

              <div className="w-12 sm:w-24 lg:w-32 h-0.5 bg-gradient-to-l from-transparent to-[#D8A279]"></div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* 2. MASONRY REELS & PHOTO SHOWCASE GRID */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6">

        {/* Section Header */}
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950">
              Inspired Spaces
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Explore timeless designs and premium sanitaryware crafted for modern living.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

          {/* Column 1 */}
          <div className="space-y-6 sm:space-y-8">
            {column1.map((item, idx) => (
              <ScrollReveal key={item.id} variant="fade-up" delay={100 * (idx + 1)}>
                <GalleryItem item={item} />
              </ScrollReveal>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-6 sm:space-y-8">
            {column2.map((item, idx) => (
              <ScrollReveal key={item.id} variant="fade-up" delay={100 * (idx + 1)}>
                <GalleryItem item={item} />
              </ScrollReveal>
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-6 sm:space-y-8">
            {column3.map((item, idx) => (
              <ScrollReveal key={item.id} variant="fade-up" delay={100 * (idx + 1)}>
                <GalleryItem item={item} />
              </ScrollReveal>
            ))}
          </div>

        </div>

      </section>

    </div>
  );
}
