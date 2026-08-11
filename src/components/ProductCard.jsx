import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ProductCard({ product, onInquire }) {
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';

  // Build specification list from array returned from database
  const specList = Array.isArray(product.specifications) && product.specifications.length > 0
    ? product.specifications
    : (product.description ? [product.description] : []);

  return (
    <div className="group relative bg-white border border-[#E5D7CD] hover:border-[#B17F59] rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-md hover:shadow-2xl flex flex-col justify-between hover-shine transform-gpu h-full">
      
      {/* 1. PRODUCT MEDIA IMAGE (STRICT 4x4 SQUARE SHAPE ASPECT RATIO - 100% FLUSH FILL) */}
      <div className="relative w-full aspect-square shrink-0 overflow-hidden bg-[#1C1613] border-b border-[#E5D7CD]">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-95"
        />

        {/* Glass Sheen Sweep */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
      </div>

      {/* 2. PRODUCT DETAILS */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
        
        <div className="space-y-3">
          
          {/* Title / Name First */}
          <div>
            <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-[#8E5832] group-hover:text-[#B17F59] transition-colors tracking-tight">
              {product.title || product.product_code}
            </h3>
          </div>

          {/* Specifications List Below Title (Fixed Minimum Height) */}
          <div className="space-y-1.5 pt-2 border-t border-[#E5D7CD]/60 min-h-[85px]">
            {specList.length > 0 ? (
              specList.slice(0, 4).map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#B17F59] shrink-0" />
                  <span className="line-clamp-1">{spec}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 font-medium italic pt-1">
                Standard sanitaryware specification
              </div>
            )}
          </div>

        </div>

        {/* 3. INQUIRE BUTTON BELOW SPECS */}
        <div className="pt-2 mt-auto">
          <button
            onClick={() => onInquire(product.product_code || product.title)}
            className="w-full py-3 bg-[#B17F59] hover:bg-[#986743] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md hover-shine flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" /> Inquire
          </button>
        </div>

      </div>

    </div>
  );
}
