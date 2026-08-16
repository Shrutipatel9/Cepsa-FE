import React from 'react';
import { Globe, PackageCheck, Anchor, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

// Import Assets
import exportHeaderImg from '../assets/header_images/export.png';
import exportImg from '../assets/export.png';

export default function Export() {
  const regions = [
    { name: "African Continent", countries: "Delivering durable and stylish sanitaryware solutions across South Africa, Kenya, Nigeria, Egypt, Morocco, Ghana, and neighboring countries." },
    { name: "Asia-Pacific", countries: "Serving Australia, New Zealand, Singapore, Malaysia, Vietnam, and surrounding Asia-Pacific markets with world-class ceramic sanitaryware." },
    { name: "Middle East & GCC", countries: "Serving major markets across the UAE, Saudi Arabia, Qatar, Oman, Kuwait, and Bahrain with premium sanitaryware solutions tailored to regional preferences" }
  ];

  return (
    <div className="bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white pb-16">

      {/* 1. HERO PORT EXPORT BANNER (THEME CLAY OVERLAY) */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden mb-16">

        {/* Cargo Port Shipping Background Image */}
        <img
          src={exportHeaderImg}
          alt="CEPSA Global Export"
          className="w-full h-full object-cover opacity-65 filter brightness-95"
        />

        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1613]/60 via-[#2B1D14]/40 to-[#1C1613]/60"></div>

        {/* Center Title with Horizontal Accent Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ScrollReveal variant="fade-up" delay={100}>
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-white">
              <div className="w-12 sm:w-28 lg:w-36 h-0.5 bg-[#D8A279]"></div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md">
                Export
              </h1>
              <div className="w-12 sm:w-28 lg:w-36 h-0.5 bg-[#D8A279]"></div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* 2. MAIN EXPORT MARKETS SECTION */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 pt-4">

        {/* Section Top Mono Tag & Title */}
        <div className="space-y-2 mb-10">
          <ScrollReveal variant="fade-up" delay={150}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Global Reach with <span className="italic font-serif text-[#B17F59] block sm:inline">Premium Sanitarywares</span>
            </h2>
          </ScrollReveal>
        </div>

        {/* Split 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Container Shipping Cargo Port Image (Compact Size) */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="fade-right" delay={200}>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E5D7CD] group hover-shine bg-[#F0E8E1] aspect-4/3 max-h-[340px] max-w-md mx-auto">
                <img
                  src={exportImg}
                  alt="CEPSA Global Export Shipping"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Export Markets Text Content */}
          <div className="lg:col-span-7 space-y-6">

            <ScrollReveal variant="fade-left" delay={200}>
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-slate-900 tracking-widest text-sm uppercase">
                  EXPORT MARKETS
                </span>
                <div className="w-20 sm:w-28 h-0.5 bg-[#E5D7CD]"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-left" delay={300}>
              <p className="text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
                Delivering CEPSA Excellence Across Global Markets
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-left" delay={400}>
              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                At CEPSA Sanitaryware, we take pride in delivering premium sanitaryware solutions to customers across international markets. Combining innovative design, precision engineering, and uncompromising quality, our products are crafted to meet the evolving demands of residential, commercial, and hospitality projects worldwide.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-left" delay={500}>
              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                Backed by our state-of-the-art manufacturing facility in Morbi, Gujarat, stringent quality standards, and a robust logistics network, CEPSA seamlessly exports to 10+ countries, ensuring reliable delivery, consistent quality, and exceptional service. Our commitment to excellence has made us a trusted partner for distributors, retailers, architects, and developers across global markets.
              </p>
            </ScrollReveal>

          </div>

        </div>

      </section>

      {/* 3. GLOBAL EXPORT STATS STRIP */}
      <section className="bg-white py-12 my-8 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-[#E5D7CD]/60">

            <ScrollReveal variant="fade-up" delay={100}>
              <div className="space-y-1 p-2">
                <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#B17F59]">10+</span>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Countries Served</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={200}>
              <div className="space-y-1 p-2">
                <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#B17F59]">100+</span>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Containers Exported Annually</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300}>
              <div className="space-y-1 p-2">
                <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#B17F59]">100%</span>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Export Quality Assurance</p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={400}>
              <div className="space-y-1 p-2">
                <span className="font-serif font-extrabold text-3xl sm:text-4xl text-[#B17F59]">Mundra</span>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Nearest SeaPort</p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 4. REGIONS & COUNTRIES SERVED */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 space-y-8">
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#B17F59] uppercase tracking-widest">
              GLOBAL FOOTPRINT
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">Regions We Serve</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((reg, idx) => (
            <ScrollReveal key={idx} variant="fade-up" delay={100 * (idx + 1)}>
              <div className="bg-white border border-[#E5D7CD] p-6 rounded-2xl space-y-3 shadow-xs hover:border-[#B17F59] transition-all duration-300 transform hover:-translate-y-1 hover-shine">
                <div className="flex items-center gap-2.5 text-[#B17F59] font-bold">
                  <Globe className="w-5 h-5 text-[#B17F59]" />
                  <h4 className="font-serif text-lg text-slate-900">{reg.name}</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {reg.countries}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

    </div>
  );
}
