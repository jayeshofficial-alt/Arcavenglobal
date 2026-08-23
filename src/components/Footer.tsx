import React from 'react';
import { COMPANY_DETAILS } from '../data/productsData';
import { ArrowUp, Phone, Mail, MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#001233] text-white border-t border-gray-900 relative font-body">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand & Monogram */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-sm flex items-center justify-center text-white font-heading text-xs italic">
                AG
              </div>
              <span className="text-white font-heading text-lg font-bold tracking-tight">
                ARCAVENTURE <span className="text-[#FF8C00]">GLOBAL</span>
              </span>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm font-body">
              Arcaventure Global (arcavenglobal.com) is an Indian merchant exporter supplying certified organic fresh produce, grains, spices, and coconut derivatives across 38+ countries with strict phytosanitary quality protocols.
            </p>

            <div className="text-[11px] text-[#2D5A27] bg-[#2D5A27]/20 border border-[#2D5A27]/40 px-3 py-1 rounded inline-block font-semibold">
              Certified Merchant Exporter • Global Quality Protocols
            </div>

            {/* Social Text Badges (Editorial Style) */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[10px] font-heading font-bold text-gray-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-colors"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[10px] font-heading font-bold text-gray-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-colors"
                aria-label="Twitter"
              >
                TW
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[10px] font-heading font-bold text-gray-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-colors"
                aria-label="LinkedIn"
              >
                LN
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[10px] font-heading font-bold text-gray-400 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-colors"
                aria-label="Instagram"
              >
                IG
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-widest">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#home" className="hover:text-[#FF8C00] transition-colors">Home Portal</a></li>
              <li><a href="#about" className="hover:text-[#FF8C00] transition-colors">About Our Brand</a></li>
              <li><a href="#products" className="hover:text-[#FF8C00] transition-colors">Export Catalog</a></li>
              <li><a href="#quality" className="hover:text-[#FF8C00] transition-colors">Quality Protocol</a></li>
              <li><a href="#gallery" className="hover:text-[#FF8C00] transition-colors">Photo Gallery</a></li>
              <li><a href="#contact" className="hover:text-[#FF8C00] transition-colors">Contact Trade Desk</a></li>
            </ul>
          </div>

          {/* Col 3: Contact with Editorial Circular Badges */}
          <div className="lg:col-span-4 space-y-3.5 text-xs text-gray-300">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-widest">
              REGISTERED OFFICE
            </h4>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[#FF8C00] text-[10px] flex-shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-gray-400 text-xs leading-relaxed">
                {COMPANY_DETAILS.headquarters.addressLine1}, {COMPANY_DETAILS.headquarters.addressLine2}, India - {COMPANY_DETAILS.headquarters.pincode}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[#FF8C00] text-[10px] flex-shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="text-gray-300 text-xs">{COMPANY_DETAILS.contact.phonePrimary}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[#FF8C00] text-[10px] flex-shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-gray-300 text-xs">{COMPANY_DETAILS.contact.emailPrimary}</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="text-center sm:text-left font-body">
            <p>© {new Date().getFullYear()} Arcaventure Global (arcavenglobal.com). All Rights Reserved.</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-gray-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-200 cursor-pointer">Terms of Trade</span>
            <span>•</span>
            <span className="hover:text-gray-200 cursor-pointer">Incoterms 2020</span>

            {/* Back to Top */}
            <button
              id="back-to-top-btn"
              onClick={scrollToTop}
              className="p-2 rounded-full border border-gray-700 hover:border-[#FF8C00] hover:text-[#FF8C00] text-white transition-colors ml-2 cursor-pointer"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

