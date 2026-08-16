import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, Sparkles, Loader2, Instagram, Facebook, MessageCircle, Linkedin } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import PhoneCountryInput from '../components/PhoneCountryInput';
import LocationInput from '../components/LocationInput';
import { lookupCountryCode } from '../utils/countryCodes';

// Import Header Assets
import contactUsHeaderImg from '../assets/header_images/coontact_us.png';

// Detect browser default country code based on timezone
const getDefaultCountryCode = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('India')) return '+91';
    if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles') || tz.includes('Toronto')) return '+1';
    if (tz.includes('London')) return '+44';
    if (tz.includes('Dubai')) return '+971';
  } catch (e) {
    // fallback
  }
  return '+91';
};

export default function Contact() {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    city: '',
    message: '',
  });

  const [countryCode, setCountryCode] = useState(getDefaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Full Name Validation
    if (!formData.customer_name.trim()) {
      showError('Please enter your full name.');
      return;
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      showError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // 3. Country Code Validation
    const countryInfo = lookupCountryCode(countryCode);
    if (!countryInfo.valid) {
      showError('Please enter a valid country calling code (e.g. +91, +1, +44).');
      return;
    }

    // 4. Phone Number Validation
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      showError('Please enter a valid 10-digit phone number.');
      return;
    }

    // 5. Message Validation
    if (!formData.message.trim()) {
      showError('Please enter your message requirements.');
      return;
    }

    setLoading(true);
    try {
      const codePrefix = countryCode.trim().startsWith('+') ? countryCode.trim() : `+${countryCode.trim()}`;
      const fullPhone = `${codePrefix} ${phoneNumber.trim()}`;
      const payload = {
        inquiry_type: 'customer',
        customer_name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: fullPhone,
        city: formData.city.trim(),
        message: formData.message.trim(),
      };

      await api.post('/public/inquiries', payload);
      setSubmitted(true);
      showSuccess('Message send successfully!');
    } catch (err) {
      showError('Failed to send message. Please try again or email info@cepsaceramics.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F5F0] text-slate-900 min-h-screen">

      {/* 1. HERO HEADER BANNER (ELEGANT CLAY OVERLAY) */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden border-b border-[#E5D7CD] mb-10">

        {/* Background Craftsmanship Image */}
        <img
          src={contactUsHeaderImg}
          alt="CEPSA Contact Us"
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
                  CONNECT WITH CEPSA
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md text-amber-50">
                  Contact Us
                </h1>
              </div>

              <div className="w-12 sm:w-24 lg:w-32 h-0.5 bg-gradient-to-l from-transparent to-[#D8A279]"></div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      {/* 2. MAIN CONTENT CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Direct Contact Info & Office Address */}
          <div className="lg:col-span-5 space-y-8">

            <ScrollReveal variant="fade-right">
              <div className="bg-white border border-[#E5D7CD] p-8 rounded-3xl shadow-xl space-y-6">
                <div className="border-b border-[#E5D7CD]/60 pb-4">
                  <span className="text-[11px] font-mono font-bold text-[#B17F59] uppercase tracking-widest block mb-1">
                    HEADQUARTERS & SHOWROOM
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold text-slate-950">
                    Get In Touch
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-[#F0E8E1] rounded-2xl text-[#B17F59] shrink-0 shadow-xs">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-slate-950 text-sm">Manufacturing & Trade Hub</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        CEPSA Sanitaryware, Old Ghuntu Road, Morbi - 363642, Gujarat, India
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-[#F0E8E1] rounded-2xl text-[#B17F59] shrink-0 shadow-xs">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-slate-950 text-sm">Direct Phone & WhatsApp</h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Mobile: <a href="tel:+919099998828" className="text-slate-900 font-bold hover:text-[#B17F59] transition-colors underline decoration-[#B17F59]/30 underline-offset-2">+91 90999 98828</a>
                      </p>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 pt-0.5">
                        WhatsApp: <a href="https://wa.me/919099998828?text=Hello%20CEPSA%20Bathware,%20I%20have%20an%20inquiry." target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> Chat on WhatsApp</a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-[#F0E8E1] rounded-2xl text-[#B17F59] shrink-0 shadow-xs">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-slate-950 text-sm">Email Correspondence</h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Official: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=cepsasanitaryware@gmail.com&su=Inquiry%20for%20CEPSA%20Sanitaryware%20Products&body=Hello%20CEPSA%20Team,%0A%0AI%20am%20interested%20in%20your%20ceramic%20sanitaryware%20products%20and%20would%20like%20to%20request%20catalogue%20specs,%20pricing,%20and%20availability%20details.%0A%0AThank%20you!" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:text-[#B17F59] transition-colors underline decoration-[#B17F59]/30 underline-offset-2">cepsasanitaryware@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* OFFICIAL SOCIAL PROFILES BUTTONS */}
                <div className="pt-4 border-t border-[#E5D7CD]/60 space-y-3">
                  <span className="text-[11px] font-mono font-bold text-[#B17F59] uppercase tracking-widest block">
                    OFFICIAL SOCIAL CHANNELS
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com/cepsabathware?igsh=ODVyYTlsaXYzZXph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#F0E8E1] text-[#B17F59] rounded-2xl hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white transition-all transform hover:scale-110 shadow-xs"
                      title="Instagram Channel"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.facebook.com/cepsaceramics"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#F0E8E1] text-[#B17F59] rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-xs"
                      title="Facebook Channel"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://wa.me/919099998828?text=Hello%20CEPSA%20Bathware,%20I%20have%20an%20inquiry."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#F0E8E1] text-[#B17F59] rounded-2xl hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110 shadow-xs"
                      title="WhatsApp Direct"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/keval-jivani-b443b2184"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#F0E8E1] text-[#B17F59] rounded-2xl hover:bg-sky-600 hover:text-white transition-all transform hover:scale-110 shadow-xs"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5D7CD]/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-[#B17F59] font-bold">
                    <Clock className="w-4 h-4" /> Mon - Sat: 9:00 AM - 7:00 PM
                  </span>
                  <span>IST (UTC+5:30)</span>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="fade-left" delay={200}>
              <div className="bg-white border border-[#E5D7CD] p-6 sm:p-10 rounded-3xl shadow-xl space-y-6">

                <div>
                  <span className="text-[11px] font-mono font-bold text-[#B17F59] uppercase tracking-widest block mb-1">
                    DIRECT DISPATCH
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                    Send Direct Message
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Fill out the form below. Our customer support team will reply within 2 business hours.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-fadeIn">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                    <h3 className="font-serif text-2xl font-bold text-slate-950">Message Send Successfully!</h3>
                    <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
                      Thank you for contacting CEPSA. Our team will review your inquiry and get back to you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setPhoneNumber('');
                        setFormData({ customer_name: '', email: '', city: '', message: '' });
                      }}
                      className="px-6 py-2.5 bg-[#B17F59] text-white text-xs font-bold uppercase rounded-2xl shadow-md hover:bg-[#986743] transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. rahul@example.com"
                          className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Phone / Mobile *
                      </label>
                      <PhoneCountryInput
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                      />
                    </div>

                    <div>
                      <LocationInput
                        label="City / Country"
                        value={formData.city}
                        onChange={(city) => setFormData({ ...formData, city })}
                        placeholder="e.g. Mumbai, India"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Your Message / Requirements *
                      </label>
                      <textarea
                        required
                        rows="5"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your project, product requirements, or showroom visit details..."
                        className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#B17F59] hover:bg-[#986743] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover-shine flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Direct Message
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </ScrollReveal>
          </div>

        </div>

      </section>

    </div>
  );
}
