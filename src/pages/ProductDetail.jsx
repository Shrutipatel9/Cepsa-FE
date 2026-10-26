import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Send, ShieldCheck, Layers, Sparkles, Box, Maximize2 } from 'lucide-react';
import api from '../services/api';

import Skeleton, { ProductDetailSkeleton } from '../components/Skeleton';

export default function ProductDetail({ onOpenInquiry }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/public/products/${id}`);
        setProduct(res.data);
        const mainImg = res.data.images?.find((img) => img.is_primary)?.image_url || res.data.images?.[0]?.image_url;
        setSelectedImage(mainImg || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80');
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Product Not Found</h2>
        <p className="text-xs text-slate-500 font-medium">The product code or ID requested does not exist in our system.</p>
        <Link to="/catalog" className="inline-block px-4 py-2 bg-slate-900 text-white font-bold rounded-md text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-slate-50 text-slate-900">

      {/* Back Link */}
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4 text-cepsa-gold" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left Image & Thumbnail Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-4/3 w-full bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl group">
            <img
              fetchpriority="high"
              decoding="async"
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {product.is_new && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-cepsa-gold text-slate-950 text-xs font-bold uppercase rounded-md shadow-md">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === img.image_url ? 'border-cepsa-gold scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={img.image_url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="space-y-6">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-cepsa-gold text-xs font-mono font-bold rounded-md">
                {product.product_code}
              </span>
              <span className="text-xs font-semibold text-slate-500">{product.category?.name}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              {product.title}
            </h1>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
              {product.description || 'Premium engineered tile surface with high strength, zero water retention, and stain resistance.'}
            </p>
          </div>

          {/* Quick Attribute Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Finish</span>
              <span className="font-semibold text-slate-900 text-sm">{product.finish?.name || 'High Gloss'}</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Dimensions</span>
              <span className="font-semibold text-slate-900 text-sm">{product.size?.dimensions || '600x1200 mm'}</span>
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Thickness</span>
              <span className="font-semibold text-slate-900 text-sm">{product.thickness_mm} mm</span>
            </div>
          </div>

          {/* Specification Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h4 className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Packaging & Technical Specs
            </h4>

            <div className="grid grid-cols-2 gap-y-3 text-xs">
              <div className="text-slate-500 font-medium">Pieces Per Box:</div>
              <div className="text-slate-900 font-bold">{product.pieces_per_box} pcs</div>

              <div className="text-slate-500 font-medium">Coverage Per Box:</div>
              <div className="text-slate-900 font-bold">{product.coverage_sqft} sq ft</div>

              <div className="text-slate-500 font-medium">Water Absorption:</div>
              <div className="text-slate-900 font-bold">&lt; 0.05% (Vitrified Standard)</div>

              <div className="text-slate-500 font-medium">Application Areas:</div>
              <div className="text-cepsa-gold font-bold">{product.application_tags}</div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => onOpenInquiry(product.product_code)}
              className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4 text-cepsa-gold" /> Request Quote for Code {product.product_code}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
