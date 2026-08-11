import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import PhoneCountryInput from './PhoneCountryInput';
import LocationInput from './LocationInput';
import { lookupCountryCode } from '../utils/countryCodes';

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

export default function InquiryModal({ isOpen, onClose, productCode = '', productName = '' }) {
  const targetProductName = productName || productCode || '';

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    city: '',
    product_name: targetProductName,
    message: '',
  });
  const [countryCode, setCountryCode] = useState(getDefaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product_name: targetProductName,
    }));
  }, [productName, productCode]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Full Name Validation
    if (!formData.customer_name.trim()) {
      const errText = 'Please enter your full name.';
      setError(errText);
      showError(errText);
      return;
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      const errText = 'Please enter a valid email address (e.g. name@domain.com).';
      setError(errText);
      showError(errText);
      return;
    }

    // 3. Country Code Validation
    const countryInfo = lookupCountryCode(countryCode);
    if (!countryInfo.valid) {
      const errText = 'Please enter a valid country calling code (e.g. +91, +1, +44).';
      setError(errText);
      showError(errText);
      return;
    }

    // 4. Phone Number Validation
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      const errText = 'Please enter a valid 10-digit phone number.';
      setError(errText);
      showError(errText);
      return;
    }

    setLoading(true);

    try {
      const codePrefix = countryCode.trim().startsWith('+') ? countryCode.trim() : `+${countryCode.trim()}`;
      const fullPhone = `${codePrefix} ${phoneNumber.trim()}`;
      const payload = {
        inquiry_type: 'product',
        customer_name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: fullPhone,
        city: formData.city.trim(),
        product_name: formData.product_name.trim(),
        message: formData.message.trim(),
      };
      await api.post('/public/inquiries', payload);
      setSubmitted(true);
      showSuccess('Product inquiry submitted successfully!');
    } catch (err) {
      const errText = err.response?.data?.detail || 'Failed to submit inquiry. Please try again.';
      setError(errText);
      showError(errText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-800 transition-colors rounded-md hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-2xl font-serif font-bold text-slate-900">Inquiry Submitted!</h3>
            <p className="text-slate-600 text-sm max-w-xs mx-auto font-medium">
              Thank you for contacting Cepsa. Our tile design consultant will reach out to you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-md hover:bg-black transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">
              {formData.product_name ? `Inquire for: ${formData.product_name}` : 'Product Inquires'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Fill out your details to receive catalogue specs, pricing, and sample tiles.
            </p>

            {error && (
              <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-md font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <PhoneCountryInput
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                />
              </div>

              <div>
                <LocationInput
                  label="City / Region"
                  value={formData.city}
                  onChange={(city) => setFormData({ ...formData, city })}
                  placeholder="e.g. Mumbai / London"
                />
              </div>



              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Details / Message</label>
                <textarea
                  rows="3"
                  placeholder="Mention requirement sq ft, space type, or custom inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#E5D7CD] rounded-2xl text-slate-900 focus:outline-none focus:border-[#B17F59] text-xs font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B17F59] hover:bg-[#986743] disabled:opacity-50 text-white font-bold rounded-md text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" /> Submitting Inquiry...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" /> Send Product Inquiry
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
