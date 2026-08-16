import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, FolderOpen, ChevronRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Skeleton, { CategoryGridSkeleton, ProductGridSkeleton } from '../components/Skeleton';

// Import Header Assets
import productsHeaderImg from '../assets/header_images/products.png';

export default function Catalog({ onOpenInquiry }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // URL Parameters
  const selectedCatId = searchParams.get('category') || '';
  const categorySearch = searchParams.get('cat_search') || '';
  const productSearch = searchParams.get('prod_search') || '';

  // 1. Fetch Categories from Database on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await api.get('/public/categories');
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error('Error fetching categories from database', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Products when a category is selected (Level 2 View)
  useEffect(() => {
    if (!selectedCatId) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await api.get('/public/products', {
          params: { category_id: selectedCatId }
        });
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching category products', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCatId]);

  // Helper to update URL params
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Direct reset function to return to all categories
  const resetToAllCategories = () => {
    setSearchParams({});
  };

  // Find currently selected active category object
  const activeCategory = useMemo(() => {
    if (!selectedCatId) return null;
    return categories.find((c) => String(c.id) === String(selectedCatId));
  }, [categories, selectedCatId]);

  // LEVEL 1: Process Category Live Search
  const filteredCategories = useMemo(() => {
    let cats = [...categories];
    if (categorySearch) {
      const q = categorySearch.toLowerCase();
      cats = cats.filter((c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    return cats;
  }, [categories, categorySearch]);

  // LEVEL 2: Process Product Live Search inside Category
  const filteredProducts = useMemo(() => {
    let prods = [...products];
    if (productSearch) {
      const q = productSearch.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.product_code?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.application_tags?.toLowerCase().includes(q)
      );
    }
    return prods;
  }, [products, productSearch]);

  return (
    <div className="bg-[#F8F5F0] text-slate-900 selection:bg-[#B17F59] selection:text-white pb-24">

      {/* HERO HEADER BANNER (THEME CLAY OVERLAY - SHOWING ACTIVE CATEGORY NAME WHEN OPEN) */}
      <section className="relative w-full h-48 sm:h-56 bg-[#2B1D14] overflow-hidden border-b border-[#E5D7CD] mb-10">

        {/* Background Craftsmanship Image */}
        <img
          src={productsHeaderImg}
          alt="CEPSA Products"
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
                  CEPSA COLLECTION
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide drop-shadow-md text-amber-50">
                  {activeCategory ? activeCategory.name : 'Products'}
                </h1>
              </div>

              <div className="w-12 sm:w-24 lg:w-32 h-0.5 bg-gradient-to-l from-transparent to-[#D8A279]"></div>
            </div>
          </ScrollReveal>
        </div>

      </section>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 space-y-8">

        {/* ========================================================= */}
        {/* LEVEL 1: CATEGORY CARDS GRID VIEW */}
        {/* ========================================================= */}
        {!selectedCatId && (
          <div className="space-y-8">

            {/* LEVEL 1 TOOLBAR: PROMINENT HIGH-HEIGHT HIGHLIGHTED SEARCH BAR */}
            <ScrollReveal variant="fade-up" delay={150}>
              <div className="max-w-2xl mx-auto pt-2">
                <div className="relative flex items-center w-full bg-white border-2 border-[#B17F59] rounded-3xl shadow-[0_10px_30px_rgba(177,127,89,0.22)] focus-within:shadow-[0_15px_35px_rgba(177,127,89,0.38)] focus-within:border-[#986743] transition-all duration-300 p-2 hover-shine">

                  {/* Left Search Icon */}
                  <div className="pl-4 pr-2 text-[#B17F59]">
                    <Search className="w-6 h-6" />
                  </div>

                  {/* Input Element */}
                  <input
                    type="text"
                    placeholder="Search any category name (e.g. Wall Hung, One Piece, Basin)..."
                    value={categorySearch}
                    onChange={(e) => updateParam('cat_search', e.target.value)}
                    className="w-full py-3.5 sm:py-4 bg-transparent text-slate-900 text-sm sm:text-base font-bold placeholder-slate-400 focus:outline-none pr-10"
                  />

                  {/* Clear Button */}
                  {categorySearch && (
                    <button
                      type="button"
                      onClick={() => updateParam('cat_search', '')}
                      className="absolute right-24 text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  )}

                  {/* Right Action Badge Button */}
                  <div className="shrink-0 pl-2">
                    <span className="px-5 py-3 bg-[#B17F59] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md hidden sm:inline-block">
                      SEARCH
                    </span>
                  </div>

                </div>
              </div>
            </ScrollReveal>

            {/* LEVEL 1: CATEGORY CARDS GRID (EQUAL HEIGHT CARDS) */}
            {loadingCategories ? (
              <CategoryGridSkeleton count={8} />
            ) : filteredCategories.length === 0 ? (
              <div className="bg-white border border-[#E5D7CD] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-md">
                <FolderOpen className="w-12 h-12 text-[#B17F59] mx-auto opacity-50" />
                <h3 className="font-serif text-xl font-bold text-slate-950">No Category Found</h3>
                <p className="text-xs text-slate-600 font-medium">
                  No category matched your search query "{categorySearch}".
                </p>
                <button
                  type="button"
                  onClick={() => updateParam('cat_search', '')}
                  className="px-6 py-2.5 bg-[#B17F59] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md hover:bg-[#986743] transition-colors"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch pt-2">
                {filteredCategories.map((cat, idx) => (
                  <ScrollReveal key={cat.id} variant="fade-up" delay={100 * ((idx % 4) + 1)}>
                    <div
                      onClick={() => updateParam('category', cat.id)}
                      className="group relative bg-white border border-[#E5D7CD] hover:border-[#B17F59] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-full transform-gpu"
                    >
                      {/* Glass Aura Glow Effect */}
                      <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-[#B17F59] via-[#D8A279] to-[#B17F59] opacity-0 group-hover:opacity-60 blur-lg transition-all duration-500 pointer-events-none"></div>

                      {/* Category Cover Image Container (4x4 Square Shape - 100% Flush Fill) */}
                      <div className="relative w-full aspect-square shrink-0 overflow-hidden bg-[#1C1613] border-b border-[#E5D7CD]">
                        <img
                          src={cat.image_url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'}
                          alt={cat.name}
                          className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-95"
                        />

                        {/* Diagonal Glass Sheen Sweep */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                      </div>

                      {/* Category Content Details (Equal Height with Browse Collection at End) */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white relative z-10">
                        <div className="space-y-1.5">
                          <h3 className="font-serif font-extrabold text-lg text-slate-950 group-hover:text-[#B17F59] transition-colors leading-tight">
                            {cat.name}
                          </h3>

                          {/* Interactive Description Container with Hover Tooltip */}
                          <div
                            className="relative group/tooltip"
                            title={cat.description || 'Premium engineered ceramic sanitaryware collection.'}
                          >
                            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed cursor-help">
                              {cat.description || 'Premium engineered ceramic sanitaryware collection.'}
                            </p>

                            {/* Floating Glass Tooltip Popover on Hover */}
                            {cat.description && (
                              <div className="absolute bottom-full left-0 mb-2.5 hidden group-hover/tooltip:block z-50 w-64 sm:w-72 p-3.5 bg-slate-950/95 text-white text-xs font-medium rounded-2xl shadow-2xl border border-[#D8A279]/40 backdrop-blur-md transition-opacity duration-300 pointer-events-none">
                                <div className="text-[10px] font-mono font-bold text-[#D8A279] uppercase tracking-wider mb-1 flex items-center justify-between">
                                  <span>{cat.name}</span>
                                  <span>DETAILS</span>
                                </div>
                                <p className="leading-relaxed text-slate-200">
                                  {cat.description}
                                </p>
                                {/* Arrow Tip */}
                                <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-slate-950/95"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Browse Collection Pinned at End */}
                        <div className="pt-3 border-t border-[#E5D7CD] flex items-center justify-between text-xs font-bold text-[#B17F59] mt-auto">
                          <span>Browse Collection</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* LEVEL 2: PRODUCTS INSIDE SELECTED CATEGORY VIEW */}
        {/* ========================================================= */}
        {selectedCatId && (
          <div className="space-y-8 animate-fadeIn">

            {/* LEVEL 2 BREADCRUMB & WORKING BACK TO CATEGORIES BUTTON */}
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7CD] pb-4">

                <div className="relative z-30">
                  <button
                    type="button"
                    onClick={resetToAllCategories}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5D7CD] hover:border-[#B17F59] rounded-md text-xs font-bold text-[#B17F59] hover:text-[#986743] shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to All Categories
                  </button>
                </div>

                {/* Direct Action Badge */}
                <span className="px-4 py-2 bg-[#B17F59] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md shrink-0 self-start sm:self-auto">
                  {filteredProducts.length} Products Available
                </span>

              </div>
            </ScrollReveal>

            {/* LEVEL 2 TOOLBAR: PROMINENT HIGH-HEIGHT HIGHLIGHTED SEARCH BAR FOR PRODUCTS */}
            <ScrollReveal variant="fade-up" delay={150}>
              <div className="max-w-2xl mx-auto pt-2">
                <div className="relative flex items-center w-full bg-white border-2 border-[#B17F59] rounded-3xl shadow-[0_10px_30px_rgba(177,127,89,0.22)] focus-within:shadow-[0_15px_35px_rgba(177,127,89,0.38)] focus-within:border-[#986743] transition-all duration-300 p-2 hover-shine">

                  {/* Left Search Icon */}
                  <div className="pl-4 pr-2 text-[#B17F59]">
                    <Search className="w-6 h-6" />
                  </div>

                  {/* Input Element */}
                  <input
                    type="text"
                    placeholder={`Search products in ${activeCategory?.name || 'this category'} (e.g. LETOP - 1014)...`}
                    value={productSearch}
                    onChange={(e) => updateParam('prod_search', e.target.value)}
                    className="w-full py-3.5 sm:py-4 bg-transparent text-slate-900 text-sm sm:text-base font-bold placeholder-slate-400 focus:outline-none pr-10"
                  />

                  {/* Clear Button */}
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => updateParam('prod_search', '')}
                      className="absolute right-24 text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1"
                    >
                      ✕
                    </button>
                  )}

                  {/* Right Action Badge Button */}
                  <div className="shrink-0 pl-2">
                    <span className="px-5 py-3 bg-[#B17F59] text-white font-serif font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md hidden sm:inline-block">
                      SEARCH
                    </span>
                  </div>

                </div>
              </div>
            </ScrollReveal>

            {/* LEVEL 2 PRODUCTS GRID */}
            {loadingProducts ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E5D7CD] rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-md">
                <FolderOpen className="w-12 h-12 text-[#B17F59] mx-auto opacity-50" />
                <h3 className="font-serif text-xl font-bold text-slate-950">No Products Found</h3>
                <p className="text-xs text-slate-600 font-medium">
                  No products found matching "{productSearch}" inside {activeCategory?.name}.
                </p>
                <button
                  type="button"
                  onClick={() => updateParam('prod_search', '')}
                  className="px-6 py-2.5 bg-[#B17F59] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md hover:bg-[#986743] transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch pt-2">
                {filteredProducts.map((product, idx) => (
                  <ScrollReveal key={product.id} variant="fade-up" delay={100 * ((idx % 6) + 1)}>
                    <ProductCard product={product} onInquire={onOpenInquiry} />
                  </ScrollReveal>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
