import React from 'react';
import { Target, Sparkles, Globe, HeartHandshake, FileText, CheckCircle } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';

interface AboutSectionProps {
  onLearnMoreQuality?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section id="about" className="py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5A27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF8C00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Section Header (Editorial Style) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#2D5A27] font-heading font-semibold tracking-widest text-xs uppercase mb-3 block">
            About Arcaventure Global
          </span>
          
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#001233] tracking-tight">
            Bridging Authentic <span className="text-[#2D5A27] italic font-serif">Organic Farming</span> to the World
          </h2>
          <div className="w-12 h-1 bg-[#FF8C00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Two-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Multi-Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              
              {/* Image 1: Organic Farm & Coconut Harvest */}
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg shadow-sm group relative h-64 sm:h-72 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=800&q=80"
                    alt="Organic Coconut and Produce Farming in Tamil Nadu"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8C00]">Direct Harvest</span>
                    <p className="text-xs sm:text-sm font-bold leading-tight font-heading">120+ Partner Farms in Pollachi & Nilgiris</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg shadow-sm group relative h-44 sm:h-52 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
                    alt="Specialty Cardamom and Indian Spices Curing"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Pure Aroma</span>
                    <p className="text-xs sm:text-sm font-bold leading-tight font-heading">Zero-Pesticide Spices & Herbs</p>
                  </div>
                </div>
              </div>

              {/* Image 2: Global Container Shipping & Quality Checks */}
              <div className="space-y-4 pt-8 sm:pt-10">
                <div className="overflow-hidden rounded-lg shadow-sm group relative h-44 sm:h-52 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
                    alt="Optical Sortex Grain Sorting"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8C00]">Sortex Clean</span>
                    <p className="text-xs sm:text-sm font-bold leading-tight font-heading">99.8% Grain Purity Standards</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg shadow-sm group relative h-64 sm:h-72 border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                    alt="Maritime Reefer Cargo Container Logistics at Tuticorin Port"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Cold Chain Logistics</span>
                    <p className="text-xs sm:text-sm font-bold leading-tight font-heading">Tuticorin & Cochin Port Hubs</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Experience Floating Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-4 rounded-xl bg-[#001233] text-white shadow-xl border border-white/20 text-center flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#FF8C00] font-heading">14+</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Years of Export</span>
              <span className="text-[10px] text-emerald-400 font-medium mt-0.5">Global Reliability</span>
            </div>
          </div>

          {/* Right Column: Brand Story & Mission */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#001233] leading-snug">
                Arcaventure Global is a premier merchant exporter delivering authentic Indian agricultural excellence.
              </h3>
              
              <p className="text-slate-600 font-body text-sm sm:text-base leading-relaxed">
                Headquartered in the vibrant trade city of <strong className="text-[#001233]">Coimbatore, Tamil Nadu</strong>, Arcaventure Global specializes in sourcing, processing, and exporting certified organic fresh vegetables, premium 1121 Basmati rice, handpicked Indian spices, and natural coconut by-products to international buyers across the Middle East, Europe, North America, and Asia-Pacific.
              </p>

              <p className="text-slate-600 font-body text-xs sm:text-sm leading-relaxed">
                We bridge the gap between conscientious local farmers and global importers by enforcing rigorous post-harvest hygiene, laser sorting, moisture control, and customized food-grade packaging that safeguards freshness from field to overseas destination port.
              </p>
            </div>

            {/* Mission Box with Editorial Card Style */}
            <div
              id="about-mission-box"
              className="p-6 sm:p-7 rounded-xl bg-[#001233] text-white shadow-md relative overflow-hidden border border-gray-800"
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-800">
                <Target className="w-5 h-5 text-[#FF8C00]" />
                <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider">
                  Our Core Mission
                </h4>
              </div>

              <div className="space-y-4">
                {/* 1. Value */}
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 p-1 rounded-sm bg-[#FF8C00]/20 text-[#FF8C00] flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Superior Value & Quality Guarantee</h5>
                    <p className="text-xs text-slate-300 font-body mt-0.5 leading-relaxed">
                      To deliver high-nutrition, unadulterated organic products with stringent phytosanitary conformance, competitive FOB/CIF pricing, and zero compromise on food safety.
                    </p>
                  </div>
                </div>

                {/* 2. Environment */}
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 p-1 rounded-sm bg-[#2D5A27]/40 text-emerald-400 flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Environmental Stewardship & Pure Soil Health</h5>
                    <p className="text-xs text-slate-300 font-body mt-0.5 leading-relaxed">
                      To champion regenerative, chemical-free cultivation practices that preserve soil microbiology, conserve water tables, and eliminate synthetic pesticide runoff.
                    </p>
                  </div>
                </div>

                {/* 3. Growth */}
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 p-1 rounded-sm bg-sky-500/20 text-sky-400 flex-shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Sustainable Farmer & Global Partner Growth</h5>
                    <p className="text-xs text-slate-300 font-body mt-0.5 leading-relaxed">
                      To empower rural smallholder farming communities with fair trade procurement while fostering long-term, trustworthy partnerships with international distributors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Snapshot & Download Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {COMPANY_DETAILS.certifications.slice(0, 4).map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-50 text-slate-700 text-[11px] font-semibold border border-gray-200"
                  >
                    <CheckCircle className="w-3 h-3 text-[#2D5A27]" />
                    {cert.name}
                  </span>
                ))}
              </div>

              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-[#001233] text-[#001233] font-heading text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#001233] hover:text-white"
              >
                <FileText className="w-4 h-4 text-[#FF8C00]" />
                <span>Explore Catalog</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
