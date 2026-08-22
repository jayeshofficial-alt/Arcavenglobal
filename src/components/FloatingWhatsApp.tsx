import React from 'react';
import { MessageCircle } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Arcaventure Global Export Desk, I would like to inquire about organic food export quotations and product availability.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group font-body">
      {/* Tooltip on hover */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-full bg-[#001233] text-white text-[11px] font-heading font-bold uppercase tracking-wider shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
        WhatsApp Trade Desk
      </span>

      {/* Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Contact Arcaventure Global on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
      </a>
    </div>
  );
};

