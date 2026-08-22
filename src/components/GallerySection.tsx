import React, { useState, useMemo } from 'react';
import { GALLERY_ITEMS } from '../data/productsData';
import { GalleryItem } from '../types';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'harvest' | 'processing' | 'packaging' | 'logistics'>('all');
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filterTabs: { id: 'all' | 'harvest' | 'processing' | 'packaging' | 'logistics'; label: string }[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'harvest', label: 'Farm & Harvest' },
    { id: 'processing', label: 'Quality & Milling' },
    { id: 'packaging', label: 'Export Packaging' },
    { id: 'logistics', label: 'Port Logistics' },
  ];

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  const openLightbox = (item: GalleryItem) => {
    setActiveLightbox(item);
  };

  const nextLightbox = () => {
    if (!activeLightbox) return;
    const currentIndex = filteredItems.findIndex(i => i.id === activeLightbox.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setActiveLightbox(filteredItems[nextIndex]);
  };

  const prevLightbox = () => {
    if (!activeLightbox) return;
    const currentIndex = filteredItems.findIndex(i => i.id === activeLightbox.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setActiveLightbox(filteredItems[prevIndex]);
  };

  return (
    <section id="gallery" className="py-20 lg:py-24 bg-white relative font-body border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Section Header (Editorial) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#2D5A27] font-heading font-semibold tracking-widest text-xs uppercase mb-3 block">
            Operations & Quality In Focus
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#001233] tracking-tight">
            Field, Processing & <span className="text-[#2D5A27] italic font-serif">Export</span> Gallery
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-body max-w-2xl mx-auto">
            Witness our authentic farm operations, modern automated cleaning facilities, custom food-grade packaging, and seaport container stuffing.
          </p>
          <div className="w-12 h-1 bg-[#2D5A27] mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                id={`gallery-filter-${tab.id}`}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setShowAll(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D5A27] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-Column Square / Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              id={`gallery-item-${item.id}`}
              onClick={() => openLightbox(item)}
              className="group relative h-64 rounded-lg overflow-hidden shadow-xs cursor-pointer bg-gray-900 border border-gray-100"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-heading font-bold uppercase tracking-wider">
                  {item.categoryLabel}
                </span>
              </div>

              {/* Title & Caption */}
              <div className="absolute bottom-3 left-3 right-3 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <h4 className="font-heading text-sm font-bold leading-tight group-hover:text-[#FF8C00] transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 font-body">
                  {item.caption}
                </p>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {filteredItems.length > 8 && (
          <div className="text-center mt-10">
            <button
              id="gallery-view-more-btn"
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2.5 rounded-full border border-[#001233] text-[#001233] hover:bg-[#001233] hover:text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              {showAll ? 'Show Fewer Photos' : 'View More Operations Photos'}
            </button>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#001233] rounded-lg overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevLightbox}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextLightbox}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Preview */}
            <div className="max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Lightbox Details */}
            <div className="p-5 bg-[#001233] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-heading font-bold text-[#FF8C00] uppercase tracking-wider">
                  {activeLightbox.categoryLabel}
                </span>
                <h3 className="font-heading text-base sm:text-lg font-bold mt-0.5">
                  {activeLightbox.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1 font-body">
                  {activeLightbox.caption}
                </p>
              </div>

              <span className="px-3 py-1 rounded bg-white/10 text-[11px] font-medium text-gray-200 whitespace-nowrap">
                Arcaventure Global Operations
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
