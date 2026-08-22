import React from 'react';
import { TESTIMONIALS } from '../data/productsData';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden font-body border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Section Header (Editorial) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF8C00] font-heading font-semibold tracking-widest text-xs uppercase mb-3 block">
            Client Voices & Trade Reviews
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#001233] tracking-tight">
            Trusted by Importers & <span className="text-[#2D5A27] italic font-serif">Distributors</span> Worldwide
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-body max-w-2xl mx-auto">
            Read what global procurement heads, hypermarket chains, and food processing companies say about our delivery accuracy and produce quality.
          </p>
          <div className="w-12 h-1 bg-[#FF8C00] mx-auto mt-4 rounded-full" />
        </div>

        {/* 4-Card Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              id={`testimonial-card-${test.id}`}
              className="p-6 rounded-lg bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all"
            >
              <div>
                {/* Quote Icon & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#FF8C00]/30" />
                </div>

                <p className="text-xs text-gray-600 font-body leading-relaxed italic mb-5">
                  "{test.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-xs font-bold text-[#001233]">
                      {test.clientName}
                    </h4>
                    <p className="text-[11px] text-gray-500">{test.company}</p>
                  </div>
                  <span className="text-xl" title={test.country}>{test.countryFlag}</span>
                </div>

                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-heading font-semibold text-[#2D5A27]">
                  <CheckCircle className="w-3 h-3 text-[#2D5A27]" />
                  <span className="truncate">{test.productPurchased}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
