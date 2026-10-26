import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, ArrowUp, Globe, ShieldCheck, MessageCircle } from 'lucide-react';
import api from '../services/api';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/public/categories');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Error fetching categories for footer:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="relative bg-[#1C1613] text-slate-300 border-t border-[#3A281C] text-xs pt-16 pb-12 overflow-hidden selection:bg-[#B17F59] selection:text-white">

      {/* AMBIENT BACKGROUND GLOW ORBS */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#B17F59]/10 rounded-md blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[550px] h-[550px] bg-[#D8A279]/8 rounded-md blur-3xl pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 relative z-10 space-y-12">

        {/* TOP BRANDING BAR */}
        <div className="pb-10 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <img
                loading="lazy"
                decoding="async"
                src="/cepsa-logo.png"
                alt="CEPSA Logo"
                className="h-10 sm:h-12 w-auto object-contain filter brightness-0 invert drop-shadow-md"
              />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
              For years, CEPSA has been committed to delivering premium ceramic sanitaryware that reflects innovation, craftsmanship, and uncompromising quality for modern living.
            </p>
          </div>
        </div>

        {/* MAIN NAVIGATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Col 1: Contact Details & Address (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-amber-100 uppercase tracking-widest text-xs border-l-2 border-[#B17F59] pl-2.5">
              GLOBAL HEADQUARTERS
            </h4>

            <div className="space-y-3 text-slate-300 font-medium pt-1">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D8A279] shrink-0 mt-0.5" />
                <span className="leading-relaxed">CEPSA Sanitaryware, Old Ghuntu Road, Morbi - 363642, Gujarat, India</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D8A279] shrink-0" />
                <a href="tel:+917574055155" className="hover:text-[#D8A279] transition-colors font-mono">
                  (+91) 75740 55155
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D8A279] shrink-0" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=cepsasanitaryware@gmail.com&su=Inquiry%20for%20CEPSA%20Sanitaryware%20Products&body=Hello%20CEPSA%20Team,%0A%0AI%20am%20interested%20in%20your%20cepsa%20sanitaryware%20products%20and%20would%20like%20to%20request%20catalogue%20specs,%20pricing,%20and%20availability%20details.%0A%0AThank%20you!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D8A279] transition-colors font-mono"
                >
                  cepsasanitaryware@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Dynamic Category Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-amber-100 uppercase tracking-widest text-xs border-l-2 border-[#B17F59] pl-2.5">
              COLLECTIONS
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-400">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?category=${cat.id}`}
                      onClick={scrollToTop}
                      className="hover:text-[#D8A279] transition-colors flex items-center gap-1"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/products" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">One Piece Monolithic Closets</Link></li>
                  <li><Link to="/products" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Wall Hung Floating Toilets</Link></li>
                  <li><Link to="/products" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Satin-Matte Table Top Basins</Link></li>
                  <li><Link to="/products" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Freestanding Pedestal Columns</Link></li>
                  <li><Link to="/products" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Vitrified GVT Floor Slabs</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 3: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif font-bold text-amber-100 uppercase tracking-widest text-xs border-l-2 border-[#B17F59] pl-2.5">
              COMPANY
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-400">
              <li><Link to="/about" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">About CEPSA</Link></li>
              <li><Link to="/products" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">All Products</Link></li>
              <li><Link to="/gallery" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Gallery</Link></li>
              <li><Link to="/export" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Global Export</Link></li>
              <li><Link to="/e-catalogue" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">E-Catalogue</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Contact Hub</Link></li>
            </ul>
          </div>

          {/* Col 4: Animated Social Connections & Quick Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-amber-100 uppercase tracking-widest text-xs border-l-2 border-[#B17F59] pl-2.5">
              CONNECT WITH US
            </h4>
            <p className="text-slate-400 leading-relaxed font-medium">
              Follow CEPSA for luxury interior inspiration updates
            </p>

            {/* ANIMATED 3D LEVITATING SOCIAL MEDIA BUTTONS */}
            <div className="flex items-center gap-3 pt-2">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/cepsabathware?igsh=ODVyYTlsaXYzZXph"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-3.5 bg-[#2B1D14] text-white rounded-2xl border border-white/10 hover:border-pink-300 transition-all duration-300 transform hover:scale-115 hover:-translate-y-2 hover:rotate-6 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:shadow-[0_12px_28px_rgba(236,72,153,0.5)] animate-float-slow cursor-pointer hover-shine"
                title="Instagram Channel"
              >
                <Instagram className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/cepsaceramics"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-3.5 bg-[#2B1D14] text-white rounded-2xl border border-white/10 hover:border-blue-300 transition-all duration-300 transform hover:scale-115 hover:-translate-y-2 hover:-rotate-6 hover:bg-blue-600 hover:shadow-[0_12px_28px_rgba(37,99,235,0.5)] animate-float-slow cursor-pointer hover-shine"
                style={{ animationDelay: '0.4s' }}
                title="Facebook Channel"
              >
                <Facebook className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/keval-jivani-b443b2184"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-3.5 bg-[#2B1D14] text-white rounded-2xl border border-white/10 hover:border-sky-300 transition-all duration-300 transform hover:scale-115 hover:-translate-y-2 hover:rotate-6 hover:bg-sky-600 hover:shadow-[0_12px_28px_rgba(2,132,199,0.5)] animate-float-slow cursor-pointer hover-shine"
                style={{ animationDelay: '0.8s' }}
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </a>

            </div>

            {/* Direct Animated WhatsApp Button */}
            <div className="pt-3">
              <a
                href="https://wa.me/917574055155?text=Hello%20CEPSA%20Bathware,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs transition-all duration-300 border border-emerald-400/40 shadow-lg hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 hover-shine cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>WhatsApp Direct Inquiry</span>
              </a>
            </div>

          </div>

        </div>

        {/* BOTTOM COPYRIGHT FOOTER */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">

          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} CEPSA Sanitarywares Ltd. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/about" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Privacy Policy</Link>
            <Link to="/about" onClick={scrollToTop} className="hover:text-[#D8A279] transition-colors">Terms of Service</Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#2B1D14] text-[#D8A279] border border-white/10 hover:bg-[#B17F59] hover:text-white transition-all transform hover:scale-110 shadow-md flex items-center gap-1.5"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Top</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
