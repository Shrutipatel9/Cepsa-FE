import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ onOpenInquiry }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Scroll position listener for scroll-triggered navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const aboutSubLinks = [
    { label: 'COMPANY PROFILE', path: '/about' },
    { label: 'EXPORT', path: '/export' },
    { label: 'GALLERY', path: '/gallery' },
    { label: 'E-CATALOGUE', path: '/e-catalogue' },
  ];

  const isAboutActive = aboutSubLinks.some(sub => location.pathname === sub.path);

  // Dynamic header wrapper classes based on page & scroll state
  let headerClasses = "z-50 w-full transition-all duration-500 ease-out ";

  if (isHomePage) {
    if (scrolled) {
      headerClasses += "fixed top-0 left-0 right-0 transform translate-y-0 opacity-100 pointer-events-auto bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md";
    } else {
      headerClasses += "fixed top-0 left-0 right-0 transform -translate-y-full opacity-0 pointer-events-none";
    }
  } else {
    headerClasses += "sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs";
  }

  return (
    <header className={headerClasses}>
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-20">

          {/* Left: Official CEPSA Logo Image */}
          <Link to="/" className="flex items-center shrink-0">
            <Logo className="h-9 sm:h-11" />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-wider text-slate-800 uppercase">

            {/* 1. HOME */}
            <Link
              to="/"
              className={`transition-colors duration-200 py-1 border-b-2 ${location.pathname === '/' ? 'border-[#B17F59] text-[#B17F59]' : 'border-transparent hover:text-[#B17F59]'
                }`}
            >
              HOME
            </Link>

            {/* 2. ABOUT US (WITH DROPDOWN MENU - CEPSA CERAMIC THEME) */}
            <div
              className="relative group py-6 cursor-pointer flex items-center"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <div
                className={`flex items-center gap-1 transition-colors duration-200 border-b-2 ${isAboutActive ? 'border-[#B17F59] text-[#B17F59]' : 'border-transparent hover:text-[#B17F59]'
                  }`}
              >
                <span>ABOUT US</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </div>

              {/* Sleek Theme Dropdown Card */}
              <div
                className={`absolute top-full left-0 w-56 bg-white text-slate-900 rounded-md shadow-2xl border border-[#E5D7CD] py-3 px-2 z-50 transition-all duration-300 transform origin-top ${aboutDropdownOpen
                  ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                  : 'opacity-0 scale-95 pointer-events-none -translate-y-2'
                  }`}
              >
                <div className="space-y-1">
                  {aboutSubLinks.map((sub) => {
                    const active = location.pathname === sub.path;
                    return (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setAboutDropdownOpen(false)}
                        className={`block px-4 py-2.5 text-[11px] font-bold tracking-widest transition-all rounded-md ${active
                          ? 'bg-[#B17F59] text-white'
                          : 'text-slate-700 hover:text-[#B17F59] hover:bg-[#F0E8E1]'
                          }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. PRODUCTS */}
            <Link
              to="/products"
              className={`transition-colors duration-200 py-1 border-b-2 ${location.pathname.startsWith('/products')
                ? 'border-[#B17F59] text-[#B17F59]'
                : 'border-transparent hover:text-[#B17F59]'
                }`}
            >
              PRODUCTS
            </Link>

            {/* 4. CONTACT */}
            <Link
              to="/contact"
              className={`transition-colors duration-200 py-1 border-b-2 ${location.pathname === '/contact' ? 'border-[#B17F59] text-[#B17F59]' : 'border-transparent hover:text-[#B17F59]'
                }`}
            >
              CONTACT
            </Link>

          </nav>

          {/* Right Action Section: GET A QUOTE Button */}
          <div className="hidden sm:flex items-center gap-6 shrink-0">
            <button
              onClick={() => onOpenInquiry('')}
              className="px-6 py-3 bg-[#B17F59] hover:bg-[#986743] text-white font-bold text-xs uppercase tracking-wider rounded-none transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              GET A QUOTE
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('')}
              className="px-3.5 py-2 bg-[#B17F59] text-white font-bold text-xs uppercase tracking-wider"
            >
              GET A QUOTE
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 hover:text-[#B17F59]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-fadeIn shadow-lg">
          <nav className="flex flex-col gap-3 font-bold text-xs uppercase tracking-wider text-slate-800">

            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B17F59] py-1">
              HOME
            </Link>

            {/* Mobile About Accordion */}
            <div>
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className="w-full flex items-center justify-between py-1 text-left hover:text-[#B17F59]"
              >
                <span>ABOUT US</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileAboutOpen && (
                <div className="pl-4 pt-2 pb-1 space-y-2 border-l-2 border-[#B17F59] ml-1 mt-1">
                  {aboutSubLinks.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[11px] text-slate-600 hover:text-[#B17F59] py-1"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B17F59] py-1">
              PRODUCTS
            </Link>

            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#B17F59] py-1">
              CONTACT
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}
