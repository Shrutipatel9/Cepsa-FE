import React from 'react';

// Generic Animated Shimmer Line
export function SkeletonLine({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#E7DDD3]/80 rounded-lg ${className}`} />
  );
}

// Product Card Skeleton (Matching ProductCard & Catalog Grid)
export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5D7CD] rounded-3xl overflow-hidden shadow-sm space-y-3 p-3 animate-pulse">
      {/* Container Image Space - Strict 4x4 Square Shape */}
      <div className="w-full aspect-square bg-[#F0E8E1] rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="px-2 space-y-2">
        {/* Category & Code Badges */}
        <div className="flex items-center justify-between">
          <div className="w-16 h-3 bg-[#E7DDD3] rounded-md" />
          <div className="w-20 h-3 bg-[#E7DDD3] rounded-md" />
        </div>

        {/* Product Title */}
        <div className="w-3/4 h-5 bg-[#D8C7B8] rounded-md" />

        {/* Specifications Container (Exact same min-h-[85px] height) */}
        <div className="min-h-[85px] p-2.5 bg-[#F8F5F0] rounded-xl space-y-2">
          <div className="w-full h-3 bg-[#E7DDD3] rounded-sm" />
          <div className="w-4/5 h-3 bg-[#E7DDD3] rounded-sm" />
          <div className="w-2/3 h-3 bg-[#E7DDD3] rounded-sm" />
        </div>

        {/* Action Button Placeholder */}
        <div className="w-full h-10 bg-[#B17F59]/30 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// Product Grid Skeleton (4 per row on XL screens)
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5D7CD] rounded-3xl overflow-hidden p-3 shadow-xs space-y-3 animate-pulse">
      <div className="w-full aspect-square bg-[#F0E8E1] rounded-2xl" />
      <div className="px-2 space-y-1.5">
        <div className="w-1/2 h-5 bg-[#D8C7B8] rounded-md" />
        <div className="w-1/3 h-3 bg-[#E7DDD3] rounded-sm" />
      </div>
    </div>
  );
}

// Category Grid Skeleton
export function CategoryGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Metric Stat Card Skeleton (For Admin Dashboard & Admin Products)
export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5D7CD] p-6 rounded-md space-y-3 shadow-xs animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-28 h-3 bg-[#E7DDD3] rounded-md" />
        <div className="w-9 h-9 bg-[#F0E8E1] rounded-md" />
      </div>
      <div className="w-16 h-8 bg-[#D8C7B8] rounded-md" />
      <div className="w-36 h-3 bg-[#E7DDD3] rounded-sm" />
    </div>
  );
}

// Admin Table Rows Skeleton
export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="space-y-3 p-4 animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
          <div className="w-12 h-4 bg-[#F0E8E1] rounded-md" />
          <div className="w-32 h-4 bg-[#E7DDD3] rounded-md" />
          <div className="w-40 h-4 bg-[#F0E8E1] rounded-md" />
          <div className="w-24 h-4 bg-[#E7DDD3] rounded-md" />
          <div className="w-20 h-4 bg-[#F0E8E1] rounded-md" />
          <div className="w-16 h-6 bg-[#B17F59]/20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Product Detail Hero Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="w-full h-96 sm:h-[450px] bg-[#F0E8E1] rounded-3xl" />
      <div className="space-y-4 pt-4">
        <div className="w-24 h-4 bg-[#E7DDD3] rounded-md" />
        <div className="w-3/4 h-8 bg-[#D8C7B8] rounded-md" />
        <div className="w-full h-32 bg-[#F8F5F0] rounded-2xl p-4 space-y-2">
          <div className="w-full h-3 bg-[#E7DDD3] rounded-sm" />
          <div className="w-4/5 h-3 bg-[#E7DDD3] rounded-sm" />
          <div className="w-2/3 h-3 bg-[#E7DDD3] rounded-sm" />
        </div>
        <div className="w-full h-12 bg-[#B17F59]/40 rounded-2xl" />
      </div>
    </div>
  );
}

export default function Skeleton({ type = 'product-grid', count = 8, rows = 5 }) {
  if (type === 'product-grid') return <ProductGridSkeleton count={count} />;
  if (type === 'product-card') return <ProductCardSkeleton />;
  if (type === 'category-grid') return <CategoryGridSkeleton count={count} />;
  if (type === 'stat-card') return <StatCardSkeleton />;
  if (type === 'table') return <TableSkeleton rows={rows} />;
  if (type === 'product-detail') return <ProductDetailSkeleton />;
  return <ProductGridSkeleton count={count} />;
}
