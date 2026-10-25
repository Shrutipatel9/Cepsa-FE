import React, { useState } from 'react';
import { Download, MessageSquare, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import eCatalogueImage from '../assets/e-catalogue-image.png';

// Import Header Assets
import eCatalogueHeaderImg from '../assets/header_images/e-catelogue.png';

export default function ECatalogue({ onOpenInquiry }) {
  const [isBookHovered, setIsBookHovered] = useState(false);

  // Google Drive PDF URL for the catalogue, configured via VITE_E_CATALOGUE_URL
  const drivePdfLink = import.meta.env.VITE_E_CATALOGUE_URL || '';

  return (
    <div className="bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white pb-20">

      {/* 1. HERO HEADER BANNER (ELEGANT CLAY OVERLAY) */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden mb-10">

        {/* Background Craftsmanship Image */}
        <img
          src={eCatalogueHeaderImg}
          alt="CEPSA E-Catalogue"
          className="w-full h-full object-cover opacity-65 filter brightness-95 transform scale-105"
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
                  CEPSA DIGITAL HUB
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md text-amber-50">
                  E-Catalogue
                </h1>
              </div>

              <div className="w-12 sm:w-24 lg:w-32 h-0.5 bg-gradient-to-l from-transparent to-[#D8A279]"></div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* 2. SIDE-BY-SIDE 3D BOOK & DOWNLOAD SECTION (NO WHITE CONTAINER BOX, COMPACT SIDE-BY-SIDE) */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 pt-4">
        <ScrollReveal variant="fade-up" delay={150}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

            {/* Left Column: 3D Hardcover Book Showcase Card */}
            <div className="lg:col-span-5 flex justify-center py-4">
              <div
                onMouseEnter={() => setIsBookHovered(true)}
                onMouseLeave={() => setIsBookHovered(false)}
                className="perspective-1000 group cursor-pointer"
              >
                {/* 3D Hardcover Book Container (Clean Un-bordered Presentation) */}
                <div
                  className="relative w-64 sm:w-80 max-w-full rounded-2xl bg-white shadow-2xl transition-all duration-700 ease-out transform-style-3d overflow-hidden"
                  style={{
                    transform: isBookHovered
                      ? 'rotateY(-4deg) rotateX(2deg) scale(1.04) translateY(-6px)'
                      : 'rotateY(-14deg) rotateX(4deg) scale(1)',
                    boxShadow: isBookHovered
                      ? '0 30px 60px -12px rgba(177, 127, 89, 0.45), -15px 15px 30px rgba(0, 0, 0, 0.3)'
                      : '0 20px 40px -10px rgba(43, 29, 20, 0.35), -20px 20px 35px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Book Spine (Narrow 3D Edge Line Effect) */}
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-r from-black via-slate-900 to-transparent opacity-80 z-20 rounded-l-2xl"></div>

                  {/* 3D Paper Page Stack (Right Edge Fold Effect) */}
                  <div className="absolute top-2 bottom-2 right-[-8px] w-3 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-r-md z-10 border-r border-slate-400"></div>

                  {/* Official CEPSA E-Catalogue Book Cover Image (100% Full Un-cropped Image) */}
                  <img
                    src={eCatalogueImage}
                    alt="CEPSA E-Catalogue Master Collection"
                    className="w-full h-auto object-contain rounded-xl shadow-xs block"
                  />

                  {/* Glass Gloss Sheen Sweep */}
                  <div className="absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>

                </div>
              </div>
            </div>

            {/* Right Column: Title, Narrative & Direct Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#B17F59] uppercase tracking-widest block">
                  MASTER COLLECTION
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-950 leading-tight">
                  Official CEPSA E-Catalogue
                </h2>
              </div>

              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                Discover CEPSA's complete collection of premium sanitaryware, thoughtfully designed to combine timeless aesthetics with exceptional functionality. Browse our latest range of one-piece closets, wall-hung toilets, table-top basins, pedestal basins, urinals, accessories, and vitrified slabs—all presented in a professionally curated digital catalogue.
              </p>

              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                Download the catalogue to explore detailed product specifications, dimensions, finishes, and collection highlights, or contact our team for personalized assistance and dealership inquiries
              </p>

              {/* Highlights Feature List */}
              <div className="space-y-2.5 pt-1 text-left max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#B17F59] shrink-0" />
                  <span>Complete Premium Sanitaryware Collection</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#B17F59] shrink-0" />
                  <span>Detailed Product Specifications & Dimensionss</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#B17F59] shrink-0" />
                  <span>Export-Ready Packaging & Technical Information</span>
                </div>
              </div>

              {/* Action Buttons Side-by-Side */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">

                {/* Direct Drive Download Button */}
                <a
                  href={drivePdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#B17F59] hover:bg-[#986743] text-white font-serif font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all hover-shine border border-[#D8A279]/40 transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" /> Download E-Catalogue
                </a>

                {/* Inquiry Request Button */}
                <button
                  onClick={() => {
                    if (onOpenInquiry) onOpenInquiry('Catalogue Request');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border border-[#E5D7CD] hover:border-[#B17F59] text-slate-900 font-serif font-bold text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all hover:bg-[#F0E8E1] transform hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-5 h-5 text-[#B17F59]" /> Contact Sales Team
                </button>

              </div>

            </div>

          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
