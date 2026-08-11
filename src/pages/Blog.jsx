import React, { useState } from 'react';
import { Newspaper, ArrowRight, X } from 'lucide-react';

export default function Blog() {
  const [activePost, setActivePost] = useState(null);

  const posts = [
    {
      id: 1,
      title: "Selecting Rimless Closets for Modern Bathroom Architecture",
      category: "Sanitaryware Guide",
      date: "July 2026",
      excerpt: "Discover why rimless bowl technology is revolutionizing bathroom hygiene, saving water, and eliminating hard-water stain buildup.",
      content: "Rimless water closet designs eliminate the traditional overhanging rim where dirt and limescale accumulate. By using dual-jet siphonic water acceleration, CEPSA rimless closets distribute water evenly around the inner bowl, achieving 100% surface hygiene with every single flush."
    },
    {
      id: 2,
      title: "Large Format Vitrified Slabs in Living Rooms & Hotel Lobbies",
      category: "Surface Trends",
      date: "June 2026",
      excerpt: "How seamless 800x1600mm bookmatch marble slabs create grand open-plan interiors with minimal grout lines.",
      content: "Large format glazed vitrified slabs offer the opulent aesthetic of natural quarry marble without the porosity or sealing maintenance. Engineered with 9.5mm thickness, these slabs deliver high flexural strength for heavy footfall commercial and residential floors."
    },
    {
      id: 3,
      title: "Luxury Hotel Suite Bathware Specification & Custom Finishes",
      category: "Architecture & Hospitality",
      date: "May 2026",
      excerpt: "A comprehensive look inside CEPSA’s custom ceramic wash basin installations across 5-star resort properties.",
      content: "Hospitality projects require sanitaryware that can withstand rigorous commercial cleaning while preserving satin matte and high-gloss aesthetics. CEPSA's silver-ion antibacterial glaze ensures long term brilliance."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FBF9F5] text-slate-900">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold text-[#B17F59] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Newspaper className="w-4 h-4" /> CERAMIC INSIGHTS & ARTICLES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-950">
          CEPSA Design Journal & Architecture Blog
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-medium">
          Read expert insights on ceramic manufacturing technology, bathroom interior trends, and tile specification guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-md p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#B17F59]">
                <span>{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">{post.title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{post.excerpt}</p>
            </div>

            <button
              onClick={() => setActivePost(post)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#B17F59] hover:underline pt-2"
            >
              Read Full Article <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-8 shadow-2xl space-y-4">
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="text-xs font-mono font-bold text-[#B17F59] uppercase">{activePost.category} // {activePost.date}</span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">{activePost.title}</h2>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">{activePost.content}</p>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActivePost(null)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-md"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
