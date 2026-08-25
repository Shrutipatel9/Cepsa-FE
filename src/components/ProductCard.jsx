import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, ChevronDown, X, Info } from 'lucide-react';

export default function ProductCard({ product, onInquire, maxSpecsCount }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';

  // Build specification list from array returned from database
  const specList = Array.isArray(product.specifications) && product.specifications.length > 0
    ? product.specifications
    : (product.description ? [product.description] : []);

  const visibleSpecs = specList.slice(0, 3);
  const remainingSpecs = specList.slice(3);
  const hasMore = remainingSpecs.length > 0;

  // Compute maximum specs count for card height alignment in current category group
  const targetCount = maxSpecsCount !== undefined
    ? maxSpecsCount
    : Math.min(3, visibleSpecs.length);

  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

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
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-white relative">

        <div className="space-y-3">

          {/* Title / Name First (sm:text-xl) */}
          <div>
            <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#8E5832] group-hover:text-[#B17F59] transition-colors tracking-tight">
              {product.title || product.product_code}
            </h3>
          </div>

          {/* Specifications List Below Title (Dynamic height per category/group) */}
          <div
            className={`space-y-1.5 border-t border-[#E5D7CD]/60 relative transition-all duration-300 ${targetCount > 0 ? 'pt-2' : ''
              }`}
            style={{
              minHeight:
                targetCount === 0
                  ? '0px'
                  : targetCount === 1
                    ? '28px'
                    : targetCount === 2
                      ? '56px'
                      : '84px',
            }}
          >
            {visibleSpecs.length > 0 ? (
              <>
                {visibleSpecs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#B17F59] shrink-0" />
                    <span className="line-clamp-1">{spec}</span>
                  </div>
                ))}

                {/* VIEW MORE SMALL BUTTON */}
                {hasMore && (
                  <div className="pt-1">
                    <button
                      ref={buttonRef}
                      type="button"
                      onClick={() => setShowTooltip(!showTooltip)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B17F59] hover:text-[#986743] bg-[#F0E8E1] hover:bg-[#E5D7CD] px-2.5 py-0.5 rounded-md transition-all cursor-pointer shadow-2xs"
                      title="Click to view remaining specifications"
                    >
                      <span>View More</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showTooltip ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-slate-400 font-medium italic pt-1">
                Standard sanitaryware specification
              </div>
            )}

            {/* FLOATING TOOLTIP / POPOVER ON CLICK */}
            {showTooltip && (
              <div
                ref={tooltipRef}
                className="absolute z-40 bottom-full left-0 mb-2 w-full max-w-[280px] sm:max-w-xs bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-fadeIn"
              >
                {/* Tooltip Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-[#D8A279]">
                    <Info className="w-3.5 h-3.5" />
                    <span>Additional Details</span>
                  </div>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tooltip Spec List */}
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar text-[11px] leading-relaxed">
                  {remainingSpecs.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D8A279] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Tooltip Arrow Tip */}
                <div className="absolute top-full left-6 -mt-1 border-8 border-transparent border-t-slate-900"></div>
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
