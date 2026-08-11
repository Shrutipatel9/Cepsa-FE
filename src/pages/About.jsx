import React, { useState } from 'react';
import { Target, Eye, Diamond, Plus, Minus, ShieldCheck, Sparkles, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const accordionItems = [
    {
      title: "Exceptional Quality and Craftsmanship",
      content: "Every CEPSA product is manufactured using premium ceramic materials and advanced 1250°C kiln vitrification technology, ensuring superior strength, low water absorption, stain resistance, and long-lasting performance."
    },
    {
      title: "Design Meets Functionality",
      content: "Our collections are thoughtfully designed to combine sophisticated aesthetics with everyday practicality, delivering bathroom solutions that complement both modern and classic interiors."
    },
    {
      title: "Trusted Reliability",
      content: "From carefully selected raw materials to rigorous quality inspections, every CEPSA product is crafted to deliver exceptional durability, consistent performance, and lasting value. Our commitment to uncompromising quality and growing global export presence has made CEPSA a trusted choice for homeowners, architects, designers, dealers, and international partners."
    }
  ];

  return (
    <div className="bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white relative overflow-hidden pb-20">

      {/* AMBIENT BACKGROUND MOTION ORBS FOR SMOOTH ATMOSPHERIC GLOW */}
      <div className="absolute top-20 left-[-10%] w-[600px] h-[600px] bg-[#B17F59]/8 rounded-full blur-3xl pointer-events-none animate-ambient-glow-1"></div>
      <div className="absolute top-[45%] right-[-10%] w-[650px] h-[650px] bg-[#D8A279]/8 rounded-full blur-3xl pointer-events-none animate-ambient-glow-2"></div>

      {/* 1. HERO HEADER BANNER (ELEGANT CLAY OVERLAY) */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden mb-16 lg:mb-20">

        {/* Background Craftsmanship Image */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80"
          alt="About CEPSA"
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
                  CEPSA
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md text-amber-50">
                  About Us
                </h1>
              </div>

              <div className="w-12 sm:w-24 lg:w-32 h-0.5 bg-gradient-to-l from-transparent to-[#D8A279]"></div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* 2. CRAFTSMANSHIP & STORY SHOWCASE */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 mb-16 lg:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: 1 Compact Luxury Bathroom Showcase Image Container */}
          <div className="lg:col-span-5 relative w-full">
            <ScrollReveal variant="fade-right" delay={150}>
              <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-[#E5D7CD] aspect-4/3 max-h-[340px] max-w-md mx-auto group hover-shine bg-white">
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
                  alt="CEPSA Luxury Bathroom Fixtures"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Story Headline, Body Text & Stat Counters */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            <ScrollReveal variant="fade-up" delay={200}>
              <h2 className="font-serif font-extrabold leading-relaxed">
                <span className='block text-2xl sm:text-3xl lg:text-4xl'>Welcome to CEPSA Sanitaryware,</span>
                <span className='block text-lg sm:text-xl lg:text-2xl'>Crafting Spaces with Timeless Elegance</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300}>
              <p className="text-slate-600 font-medium text-sm sm:text-md leading-relaxed">
                At CEPSA Sanitaryware, we believe every bathroom should reflect the perfect balance of elegance, innovation, and functionality. We design and manufacture premium sanitaryware that combines contemporary aesthetics with exceptional durability, delivering solutions that enhance both residential and commercial spaces. Every product is crafted with precision to meet the highest standards of quality, performance, and style.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={300}>
              <p className="text-slate-600 font-medium text-sm sm:text-md leading-relaxed">
                Backed by advanced manufacturing technology and a commitment to continuous innovation, CEPSA is dedicated to creating products that stand the test of time. Our focus on superior craftsmanship, rigorous quality control, and customer satisfaction has earned the trust of architects, designers, builders, dealers, and homeowners who seek reliable, stylish, and premium bathroom solutions.
              </p>
            </ScrollReveal>

            {/* Stat Counters Below Text */}
            <ScrollReveal variant="fade-up" delay={350}>
              <div className="pt-5 border-t border-[#E5D7CD] grid grid-cols-3 gap-3 sm:gap-4 text-left">

                {/* 1. HIGHLIGHTED 7+ YEARS EXPERIENCE BOX */}
                <div className="space-y-1 border-l-2 border-[#B17F59] pl-3 bg-[#F0E8E1] p-3 rounded-2xl shadow-xs transition-transform duration-300 hover:-translate-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#B17F59]">
                    12 +
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 uppercase tracking-wider leading-tight">
                    Years of Excellence
                  </div>
                </div>

                {/* 2. 100% EXCELLENCE & QUALITY */}
                <div className="space-y-1 border-l-2 border-[#B17F59] pl-3 bg-[#F0E8E1] p-3 rounded-2xl shadow-xs transition-transform duration-300 hover:-translate-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#B17F59]">
                    100 %
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 uppercase tracking-wider leading-tight">
                    Quality Assured
                  </div>
                </div>

                {/* 3. 100+ PREMIUM COLLECTIONS */}
                <div className="space-y-1 border-l-2 border-[#B17F59] pl-3 bg-[#F0E8E1] p-3 rounded-2xl shadow-xs transition-transform duration-300 hover:-translate-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#B17F59]">
                    100 +
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 uppercase tracking-wider leading-tight">
                    Premium Collections
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* 3. "WHY CHOOSE US" INTERACTIVE ACCORDION & FEATURE SHOWCASE */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 mb-16 lg:mb-20">
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column: Heading, Accordion & Highlighted Experience Badge */}
            <div className="lg:col-span-7 space-y-6">

              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                  Why Choose Us
                </h2>
              </div>

              {/* Accordion Points */}
              <div className="space-y-3.5 pt-2">
                {accordionItems.map((item, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <div
                      key={idx}
                      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpen
                        ? 'border-[#B17F59] bg-white shadow-md'
                        : 'border-[#E5D7CD] bg-white/70 hover:border-[#B17F59]/60 hover:bg-white'
                        }`}
                    >
                      <button
                        onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                        className="w-full p-5 text-left flex items-center justify-between font-serif font-bold text-base sm:text-lg transition-colors cursor-pointer"
                      >
                        <span className={isOpen ? 'text-[#B17F59]' : 'text-slate-900'}>
                          {item.title}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                          ? 'bg-[#B17F59] text-white rotate-180'
                          : 'bg-[#F0E8E1] text-[#B17F59] border border-[#E5D7CD]'
                          }`}>
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-[#E5D7CD]/60 pt-3.5 animate-fadeIn">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Prominent Highlighted 10+ Years Badge */}
              <div className="pt-3">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#B17F59] to-[#986743] text-white px-6 py-3.5 rounded-2xl font-serif font-bold text-sm sm:text-base shadow-xl border border-[#D8A279]/40 transform hover:scale-105 transition-all duration-300 hover-shine">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-3xl mb-1">
                    12+
                  </div>
                  <div className="flex flex-col">
                    <span className="text-amber-100 text-xs font-sans font-bold uppercase tracking-wider">Proven Track Record</span>
                    <span className="text-white font-serif font-bold">Years of Manufacturing Excellence</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Architectural Image (Compact Size) */}
            <div className="lg:col-span-5">
              <ScrollReveal variant="fade-left" delay={200}>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5D7CD] aspect-4/3 max-h-[340px] max-w-md mx-auto group hover-shine bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80"
                    alt="CEPSA Architectural Craftsmanship"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* 4. "KEY VALUES OF CEPSA" SECTION */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 mb-16 lg:mb-20">

        {/* Section Header */}
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E5D7CD]">
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-950 mt-1">
                Key Values
              </h2>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10">

          {/* Card 1: MISSION */}
          <ScrollReveal variant="fade-up" delay={150}>
            <div className="bg-white border border-[#E5D7CD] rounded-3xl p-8 space-y-5 shadow-xs hover:border-[#B17F59] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover-shine h-full flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F0E8E1] text-[#B17F59] flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-xl group-hover:text-[#B17F59] transition-colors">
                  MISSION
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  To redefine modern bathroom experiences through innovative, sustainable, and premium sanitaryware that combines exceptional craftsmanship, lasting durability, and elegant design.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5D7CD]/60 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                01 // MISSION
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: VISION (PRIMARY TERRACOTTA HIGHLIGHT CARD) */}
          <ScrollReveal variant="fade-up" delay={300}>
            <div className="bg-[#B17F59] text-white border border-[#986743] rounded-3xl p-8 space-y-5 shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover-shine relative overflow-hidden h-full flex flex-col justify-between group">

              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow"></div>

              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#B17F59] flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-white text-xl">
                  VISION
                </h3>
                <p className="text-sm text-amber-50 font-medium leading-relaxed">
                  To become one of the world's most trusted premium sanitaryware brands by delivering luxury bathroom solutions, driving continuous innovation, setting new benchmarks in quality and sustainable ceramic engineering, and exceeding customer expectations across global markets.
                </p>
              </div>

              <div className="pt-3 border-t border-white/20 text-[10px] font-mono font-bold text-amber-100 tracking-widest uppercase relative z-10">
                02 // CORE VISION
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: VALUES */}
          <ScrollReveal variant="fade-up" delay={450}>
            <div className="bg-white border border-[#E5D7CD] rounded-3xl p-8 space-y-5 shadow-xs hover:border-[#B17F59] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl hover-shine h-full flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F0E8E1] text-[#B17F59] flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Diamond className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-xl group-hover:text-[#B17F59] transition-colors">
                  VALUES
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  At CEPSA, our values define everything we do. We are committed to excellence in every detail, placing our customers at the heart of every decision while upholding the highest standards of integrity and transparency. Through continuous innovation, advanced manufacturing, and sustainable practices, we deliver exceptional quality while building long-term relationships founded on trust, reliability, and mutual success.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5D7CD]/60 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                03 // VALUES
              </div>
            </div>
          </ScrollReveal>

        </div>

      </section>

    </div>
  );
}
