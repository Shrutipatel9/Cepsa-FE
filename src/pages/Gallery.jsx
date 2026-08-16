import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Image as ImageIcon, Film, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { getPublicGallery } from '../services/api';

// Import Assets
import galleryHeaderImg from '../assets/header_images/gallery.png';

function GalleryItem({ item }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = 1.0;
    }
  };

  const handleMouseLeave = () => {
    if (item.item_type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 1.0;
      setIsPlaying(false);
    }
  };

  const handleMouseEnter = () => {
    if (item.item_type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (item.item_type !== 'video' || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      videoRef.current.currentTime = 1.0;
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
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

  const isVideo = item.item_type === 'video';
  const mediaUrl = item.file_url;

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
              src={`${mediaUrl}#t=1.0`}
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
              src={mediaUrl}
              alt={item.title || "CEPSA Gallery Showcase"}
              className="w-full h-full object-cover scale-[1.02] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {item.title && (
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-20 pointer-events-none">
            <p className="text-xs font-semibold drop-shadow-md truncate">{item.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await getPublicGallery();
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load gallery items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Distribute items into 3 columns dynamically
  const col1 = [];
  const col2 = [];
  const col3 = [];
  items.forEach((item, index) => {
    if (index % 3 === 0) col1.push(item);
    else if (index % 3 === 1) col2.push(item);
    else col3.push(item);
  });

  return (
    <div className="bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white pb-24">

      {/* 1. HERO HEADER BANNER */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden border-b border-[#E5D7CD] mb-14">
        {/* Background Gallery Header Image */}
        <img
          src={galleryHeaderImg}
          alt="CEPSA Gallery"
          className="w-full h-full object-cover opacity-65 filter brightness-95 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1613]/60 via-[#2B1D14]/40 to-[#1C1613]/60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B17F59]/20 rounded-full blur-3xl pointer-events-none"></div>

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

      {/* 2. MEDIA SHOWCASE GRID */}
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

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#B17F59] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Loading Gallery...</p>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <ScrollReveal variant="fade-up" delay={200}>
            <div className="max-w-md mx-auto py-16 px-6 text-center bg-white/80 backdrop-blur-md rounded-3xl border border-[#E5D7CD] shadow-lg space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0E8E1] text-[#B17F59] flex items-center justify-center shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-slate-900">No Gallery Media Yet</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Photos and videos uploaded by Admin will appear here. Check back soon for our latest showcases!
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* 3-COLUMN MASONRY GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Column 1 */}
            <div className="space-y-6 sm:space-y-8">
              {col1.map((item, idx) => (
                <ScrollReveal key={item.id} variant="fade-up" delay={100 * (idx + 1)}>
                  <GalleryItem item={item} />
                </ScrollReveal>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-6 sm:space-y-8">
              {col2.map((item, idx) => (
                <ScrollReveal key={item.id} variant="fade-up" delay={100 * (idx + 1)}>
                  <GalleryItem item={item} />
                </ScrollReveal>
              ))}
            </div>

            {/* Column 3 */}
            <div className="space-y-6 sm:space-y-8">
              {col3.map((item, idx) => (
                <ScrollReveal key={item.id} variant="fade-up" delay={100 * (idx + 1)}>
                  <GalleryItem item={item} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );
}

