import React from 'react';
import { ArrowRight, ShieldCheck, Award, Truck, CheckCircle2 } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';

interface HeroProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onRequestQuote
}) => {
  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCategory = (category: string) => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // trigger event if needed
      window.dispatchEvent(new CustomEvent('selectCategory', { detail: category }));
    }
  };

  return (
    <section id="home" className="pt-[102px] sm:pt-[100px] bg-white">
      {/* Editorial Split Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] border-b border-gray-100">
        
        {/* Left Column: Architectural Editorial Typography */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center bg-white relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-[#2D5A27]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <span className="inline-block text-[#2D5A27] font-heading font-semibold tracking-widest text-xs mb-4 uppercase">
              Premium Export & Import
            </span>

            <h1
              id="hero-headline"
              className="font-heading text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] text-[#001233] mb-6 tracking-tight"
            >
              Global Excellence <br />
              in <span className="text-[#2D5A27] italic font-serif">Organic</span> Nutrition.
            </h1>

            <p
              id="hero-subtext"
              className="font-body text-[#555555] text-sm sm:text-base max-w-lg mb-8 leading-relaxed"
            >
              Premium Fresh Vegetables, Grains, and Spices Exported Worldwide. We bridge the gap between sustainable farming in India and global dining tables with certified quality assurance.
            </p>

            {/* Editorial Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-view-products-btn"
                onClick={onExploreProducts}
                className="bg-[#001233] hover:bg-[#002255] text-white px-8 py-3.5 font-heading text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 shadow-sm"
              >
                VIEW PRODUCTS
              </button>

              <button
                id="hero-get-quote-btn"
                onClick={onRequestQuote}
                className="border border-[#001233] text-[#001233] hover:bg-gray-50 px-8 py-3.5 font-heading text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95"
              >
                REQUEST QUOTE
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-gray-100">
              <div>
                <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#001233]">
                  38+
                </div>
                <div className="text-[11px] text-gray-500 font-body uppercase tracking-wider mt-0.5">
                  Export Countries
                </div>
              </div>

              <div>
                <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#FF8C00]">
                  55,000+ MT
                </div>
                <div className="text-[11px] text-gray-500 font-body uppercase tracking-wider mt-0.5">
                  Annual Volume
                </div>
              </div>

              <div>
                <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#2D5A27]">
                  100%
                </div>
                <div className="text-[11px] text-gray-500 font-body uppercase tracking-wider mt-0.5">
                  Lab Certified
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Hero Cover & Floating Glass Badge */}
        <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-full overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
            alt="Organic Produce Sourcing & Export"
            className="absolute inset-0 w-full h-full object-cover scale-105 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-100 transition-all duration-700"
            loading="eager"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/30 lg:from-white/40 lg:via-transparent lg:to-black/40" />

          {/* Editorial Glass Overlay Badge */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 glass p-5 sm:p-6 rounded-xl max-w-xs shadow-2xl backdrop-blur-md border border-white/30">
            <div className="flex gap-2.5 items-center mb-2">
              <div className="w-2.5 h-2.5 bg-[#FF8C00] rounded-full animate-pulse" />
              <span className="text-white font-heading text-[11px] font-bold tracking-widest uppercase">
                Latest Export Batch
              </span>
            </div>
            <p className="text-white/95 text-xs italic leading-relaxed font-body">
              Our latest harvest of Organic Turmeric, Fresh Coconuts, and Premium Basmati Grains is ready for port dispatch.
            </p>
          </div>
        </div>

      </div>

      {/* Editorial 3-Column Category Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 lg:px-10 py-8 bg-[#fdfdfd] border-b border-gray-100">
        
        {/* Category 1: Fruits & Vegetables */}
        <div
          onClick={() => scrollToCategory('vegetables')}
          className="group cursor-pointer p-3 rounded-lg hover:bg-white transition-colors"
        >
          <div className="h-[140px] mb-3 overflow-hidden rounded-md relative shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=600"
              alt="Fresh Organic Vegetables"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#2D5A27]/20 group-hover:bg-[#2D5A27]/10 transition-colors" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#001233]/80 text-[10px] text-white font-bold uppercase tracking-wider">
              Produce
            </div>
          </div>
          <h3 className="font-heading text-sm font-bold text-[#001233] flex justify-between items-center">
            <span>FRUITS & VEGETABLES</span>
            <span className="text-[#FF8C00] group-hover:translate-x-1.5 transition-transform">→</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-body">
            Freshly harvested, nutrient-rich seasonal organic produce and mature coconuts.
          </p>
        </div>

        {/* Category 2: Grains & Pulses */}
        <div
          onClick={() => scrollToCategory('grains')}
          className="group cursor-pointer p-3 rounded-lg hover:bg-white transition-colors"
        >
          <div className="h-[140px] mb-3 overflow-hidden rounded-md relative shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600"
              alt="Basmati Rice & Grains"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#001233]/20 group-hover:bg-[#001233]/10 transition-colors" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#001233]/80 text-[10px] text-white font-bold uppercase tracking-wider">
              Grains
            </div>
          </div>
          <h3 className="font-heading text-sm font-bold text-[#001233] flex justify-between items-center">
            <span>GRAINS & PULSES</span>
            <span className="text-[#FF8C00] group-hover:translate-x-1.5 transition-transform">→</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-body">
            High-grade pulses, long-grain 1121 Basmati rice for international commercial markets.
          </p>
        </div>

        {/* Category 3: Specialty Spices */}
        <div
          onClick={() => scrollToCategory('spices')}
          className="group cursor-pointer p-3 rounded-lg hover:bg-white transition-colors"
        >
          <div className="h-[140px] mb-3 overflow-hidden rounded-md relative shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600"
              alt="Indian Specialty Spices"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-[#FF8C00]/20 group-hover:bg-[#FF8C00]/10 transition-colors" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#001233]/80 text-[10px] text-white font-bold uppercase tracking-wider">
              Spices
            </div>
          </div>
          <h3 className="font-heading text-sm font-bold text-[#001233] flex justify-between items-center">
            <span>SPECIALTY SPICES</span>
            <span className="text-[#FF8C00] group-hover:translate-x-1.5 transition-transform">→</span>
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 font-body">
            Pure, aromatic spices sourced directly from the spice capital belts of India.
          </p>
        </div>

      </div>

      {/* Certifications Ribbon */}
      <div className="bg-white py-4 px-6 lg:px-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
            <span>FSSAI & Global GAP Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FF8C00]" />
            <span>Spices Board of India Registered</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2D5A27]" />
            <span>Phytosanitary & Lab Assay Tested</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#001233]" />
            <span>FOB / CIF Seaport Logistics to 38+ Countries</span>
          </div>
        </div>
      </div>
    </section>
  );
};
