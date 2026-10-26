import React from 'react';

export default function Logo({ className = "h-9", showTagline = false }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      <img
        decoding="async"
        src="/cepsa-logo.png"
        alt="CEPSA Logo"
        className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
      />
    </div>
  );
}
