import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Award, Crown, ArrowUpRight, ChevronDown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import HeroScene from '../components/HeroScene';

// Import 4 Choose Us Assets
import chooseUsImg1 from '../assets/choose_us/choose_us_photo_1.png';
import chooseUsImg2 from '../assets/choose_us/choose_us_photo_2.png';
import chooseUsImg3 from '../assets/choose_us/choose_us_photo_3.png';
import chooseUsImg4 from '../assets/choose_us/choose_us_photo_4.png';

// Import About Us Story Image
import aboutUsImg from '../assets/about_us_image.png';


export default function Home({ onOpenInquiry }) {
  // Interactive "Why Choose Us" Feature Selector State
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  // 4 Company Highlight Feature Points (Compact 3D Flip Cards)
  const companyHighlights = [
    {
      title: "Engineered to Last",
      description: "Advanced ceramic technology crafted for exceptional durability.",
      icon: <Award className="w-5 h-5 text-[#B17F59]" />
    },
    {
      title: "Crafted in Morbi",
      description: "Proudly manufactured in India's ceramic capital.",
      icon: <Sparkles className="w-5 h-5 text-[#B17F59]" />
    },
    {
      title: "Trusted Worldwide",
      description: "Exporting premium sanitaryware to 35+ countries.",
      icon: <ShieldCheck className="w-5 h-5 text-[#B17F59]" />
    },
    {
      title: "Designed for Modern Living",
      description: "Elegant collections that blend style with functionality.",
      icon: <Crown className="w-5 h-5 text-[#B17F59]" />
    }
  ];

  // Split "Why Choose Us" Interactive Feature List & Image Showcase
  const featureList = [
    {
      id: 0,
      title: "Unmatched Quality",
      subtitle: "CEPSA",
      description: "Every CEPSA product is crafted using premium ceramic materials and advanced manufacturing technology to ensure exceptional durability, flawless finishes, and long-lasting performance.",
      image: chooseUsImg1
    },
    {
      id: 1,
      title: "Innovative Designs",
      subtitle: "ITALIAN SPECIFICATION",
      description: "Our collections blend contemporary aesthetics with practical functionality, creating elegant bathroom spaces that complement every lifestyle and architectural vision.",
      image: chooseUsImg2
    },
    {
      id: 2,
      title: "Exceptional Durability",
      subtitle: "1250°C KILN FIRED",
      description: "Manufactured under strict quality standards and high-temperature vitrification, our products offer superior strength, stain resistance, and reliable performance for years to come.",
      image: chooseUsImg3
    },
    {
      id: 3,
      title: "Premium Collection",
      subtitle: "SANITARYWARE & SLABS",
      description: "From modern basins and one-piece closets to wall-hung solutions and designer accessories, CEPSA offers a comprehensive range crafted to elevate every bathroom experience.",
      image: chooseUsImg4
    }
  ];

  const activeFeature = featureList[activeFeatureIndex];

  return (
    <div className="bg-[#F8F5F0] text-slate-900 relative">

      {/* AMBIENT BACKGROUND MOTION ORBS */}
      <div className="absolute top-10 left-[-10%] w-[500px] h-[500px] bg-[#B17F59]/8 rounded-md blur-3xl pointer-events-none animate-ambient-glow-1"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[#D8A279]/8 rounded-md blur-3xl pointer-events-none animate-ambient-glow-2"></div>

      {/* 1. HERO — FULL SCREEN HEIGHT 3D RETRO GRID + CENTERED 3,800 PARTICLE LOGO */}
      <section className="relative w-full h-screen min-h-[650px] overflow-hidden bg-[#F8F5F0] select-none">
        <div className="relative z-10 w-full h-full">
          <HeroScene className="w-full h-full block" />
        </div>

        {/* BOTTOM SCROLL INDICATOR PROMPT */}
        <div
          onClick={() => {
            const el = document.getElementById('why-choose-us');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#B17F59] uppercase opacity-90 group-hover:opacity-100 transition-opacity">
            Scroll to Explore
          </span>
          <div className="w-8 h-8 rounded-full border border-[#B17F59]/30 bg-white/80 backdrop-blur-md flex items-center justify-center text-[#B17F59] animate-bounce shadow-md group-hover:border-[#B17F59]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* LOWER SECTIONS WRAPPER */}
      <div className="space-y-12 pt-6 pb-6">

        {/* 2. COMPANY HIGHLIGHTS BAR (COMPACT 3D FLIP CARDS) */}
        <section className="bg-[#F8F5F0] py-5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {companyHighlights.map((item, idx) => (
                <ScrollReveal key={idx} variant="fade-up" delay={100 * (idx + 1)}>

                  {/* Compact 3D Flip Card */}
                  <div className="group h-28 w-full perspective-1000 cursor-pointer">
                    <div className="relative w-full h-full duration-600 transform-style-3d transition-transform group-hover:rotate-y-180">

                      {/* FRONT FACE */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-white/95 border border-[#E5D7CD] rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 shadow-xs hover:border-[#B17F59] transition-colors">
                        <div className="w-9 h-9 rounded-md bg-[#F0E8E1] flex items-center justify-center animate-float-slow shadow-inner">
                          {item.icon}
                        </div>

                        <h4 className="font-serif font-bold text-slate-900 text-lg leading-snug">
                          {item.title}
                        </h4>
                      </div>

                      {/* BACK FACE */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#B17F59] text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 shadow-lg border border-[#986743]">
                        <h4 className="font-serif font-bold text-amber-100 text-lg">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-amber-50 font-lg leading-tight line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                    </div>
                  </div>

                </ScrollReveal>
              ))}
            </div>

          </div>
        </section>

        {/* 3. INTERACTIVE "WHY CHOOSE US" SHOWCASE */}
        <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

            {/* Left Column: Interactive Feature List */}
            <div className="lg:col-span-5 space-y-5 z-10 pr-0 lg:pr-2">
              <ScrollReveal variant="fade-right" delay={100}>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
                  Why choose Us
                </h2>
              </ScrollReveal>

              {/* Vertical Feature Selection List */}
              <ScrollReveal variant="fade-right" delay={200}>
                <div className="space-y-1 divide-y divide-[#E5D7CD]">
                  {featureList.map((feat, idx) => {
                    const isSelected = idx === activeFeatureIndex;
                    return (
                      <button
                        key={feat.id}
                        onClick={() => setActiveFeatureIndex(idx)}
                        onMouseEnter={() => setActiveFeatureIndex(idx)}
                        className={`relative w-full py-4 text-left flex items-center justify-between transition-all duration-300 group cursor-pointer ${isSelected ? 'pl-4 text-[#B17F59]' : 'text-slate-800 hover:text-[#B17F59] hover:pl-2'
                          }`}
                      >
                        {/* Active Sliding Left Indicator Bar */}
                        <div
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#B17F59] rounded-r-full transition-all duration-300 ${isSelected ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                            }`}
                        />

                        <div className="flex items-center gap-3">
                          <div className="w-6 flex items-center justify-center">
                            {isSelected ? (
                              <ArrowRight className="w-5 h-5 text-[#B17F59] animate-pulse" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#B17F59] transition-colors" />
                            )}
                          </div>

                          <span className={`font-serif text-xl sm:text-2xl font-bold transition-all duration-300 ${isSelected ? 'text-[#B17F59] translate-x-1' : 'text-slate-900 group-hover:text-[#B17F59]'
                            }`}>
                            {feat.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Lifestyle Showcase Image + Light Theme CEPSA Card */}
            <div className="lg:col-span-7 relative">
              <ScrollReveal variant="fade-left" delay={200}>
                <div className="relative pt-2 pb-6 lg:pb-8">

                  {/* Showcase Image Container (Fixed Size Container) */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E5D7CD] w-full h-[400px] sm:h-[460px] ml-0 lg:ml-6 group bg-slate-100 flex items-center justify-center">
                    <img
                      key={activeFeature.id}
                      src={activeFeature.image}
                      alt={activeFeature.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105 filter brightness-95 animate-fadeIn"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Overlapping Light Theme CEPSA Card (Sleek Compact Size for Better Image Visibility) */}
                  <div className="relative lg:absolute lg:-bottom-3 lg:-left-2 xl:-left-4 w-full lg:w-[280px] bg-white/95 backdrop-blur-md text-slate-900 p-4 sm:p-5 rounded-2xl shadow-2xl border border-[#E5D7CD] z-30 mt-4 lg:mt-0 animate-fadeIn hover-shine group/card">

                    {/* Official CEPSA Logo Header */}
                    <div className="pb-2 mb-2.5 flex items-center justify-between border-b border-slate-100">
                      <img
                        src="/cepsa-logo.png"
                        alt="CEPSA"
                        className="h-6 sm:h-7 object-contain"
                      />
                    </div>

                    {/* Active Feature Description */}
                    <p className="text-slate-600 text-[11px] font-medium leading-relaxed mb-3.5 line-clamp-3">
                      {activeFeature.description}
                    </p>

                    {/* Read More -> /about Button */}
                    <div>
                      <Link
                        to="/about"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white transition-all duration-300 group/btn uppercase tracking-wider bg-[#B17F59] hover:bg-[#986743] px-3.5 py-1.5 rounded-md shadow-xs hover-shine"
                      >
                        Read More <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>

                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* 4. UNVEILING THE STORY AND VISION OF CEPSA (UNCLIPPED FULLY VISIBLE CIRCULAR BADGE) */}
        <section className="pt-6 pb-16 lg:pb-20 relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Header Title */}
            <ScrollReveal variant="fade-up" delay={100}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-4xl">
                Unveiling the <span className="italic font-serif text-[#B17F59]">Story</span> of CEPSA
              </h2>
            </ScrollReveal>

            {/* Split Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Column: 3D Bathroom Showcase Image + Circular Terracotta Badge HALF OUT (100% UNCLIPPED & VISIBLE) */}
              <div className="lg:col-span-6 relative pb-10 sm:pb-14 pr-4 sm:pr-8">
                <ScrollReveal variant="fade-right" delay={200}>

                  {/* Image Frame Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5D7CD] group hover-shine bg-slate-100 aspect-4/3 sm:aspect-16/11">
                    <img
                      src={aboutUsImg}
                      alt="CEPSA Story and Vision"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent"></div>
                  </div>

                  {/* Floating Circular Terracotta Badge Button (About Us ↗) Positioned at Bottom-Right Corner */}
                  <Link
                    to="/about"
                    className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#B17F59] hover:bg-[#986743] text-white flex flex-col items-center justify-center font-serif font-bold text-xs tracking-wide shadow-2xl transition-all duration-500 transform hover:scale-110 animate-float-slow group/badge border-4 border-[#F8F5F0] z-40"
                    title="Learn More About CEPSA"
                  >
                    <div className="flex items-center gap-1 group-hover/badge:translate-x-0.5 group-hover/badge:-translate-y-0.5 transition-transform duration-300">
                      <span>About Us</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </Link>

                </ScrollReveal>
              </div>

              {/* Right Column: Story Text Content */}
              <div className="lg:col-span-6 space-y-6 mb-20">

                <ScrollReveal variant="fade-left" delay={200}>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
                      The Story Behind CEPSA
                    </span>
                    <div className="w-20 sm:w-28 h-0.5 bg-[#E5D7CD]"></div>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fade-left" delay={400}>
                  <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed space-y-4">
                    CEPSA was founded with a simple vision—to create premium sanitaryware that seamlessly blends timeless design with modern innovation. Over the years, our commitment to quality, precision craftsmanship, and advanced manufacturing has shaped a brand trusted by homeowners, architects, designers, and global partners alike. Every product we create embodies our passion for excellence, delivering elegant, durable, and thoughtfully engineered solutions that elevate bathroom spaces across India and international markets.
                  </p>
                </ScrollReveal>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}
