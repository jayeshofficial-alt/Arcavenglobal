import React from 'react';
import { Home, Package, Zap, ShoppingBag, Smartphone, MessageCircle } from 'lucide-react';
import { RfqItem } from '../types';

interface MobileBottomNavProps {
  cartItems: RfqItem[];
  onOpenCart: () => void;
  onOpenQuickQuote: () => void;
  onOpenPlayStoreGuide: () => void;
  activeSection?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartItems,
  onOpenCart,
  onOpenQuickQuote,
  onOpenPlayStoreGuide
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      id="mobile-bottom-app-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#001233]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 shadow-2xl safe-area-bottom"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto text-[10px] font-heading font-semibold">
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center py-1 text-gray-300 hover:text-white active:text-[#FF8C00] transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Products */}
        <button
          id="mobile-nav-products"
          onClick={() => scrollTo('products')}
          className="flex flex-col items-center justify-center py-1 text-gray-300 hover:text-white active:text-[#FF8C00] transition-colors cursor-pointer"
        >
          <Package className="w-5 h-5 mb-0.5 text-[#FF8C00]" />
          <span>Catalog</span>
        </button>

        {/* Instant Quote (Center Hero Action) */}
        <button
          id="mobile-nav-quote"
          onClick={onOpenQuickQuote}
          className="flex flex-col items-center justify-center -mt-4 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF8C00] to-[#FFB703] text-white flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition-transform border-2 border-[#001233]">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <span className="text-[9px] font-bold text-[#FFB703] mt-0.5 tracking-wider uppercase">Quote</span>
        </button>

        {/* RFQ Basket */}
        <button
          id="mobile-nav-basket"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-gray-300 hover:text-white active:text-[#FF8C00] transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          {totalCartCount > 0 && (
            <span className="absolute top-0.5 right-4 w-4 h-4 rounded-full bg-[#FF8C00] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {totalCartCount > 9 ? '9+' : totalCartCount}
            </span>
          )}
          <span>Basket</span>
        </button>

        {/* Play Store & App Guide */}
        <button
          id="mobile-nav-playstore"
          onClick={onOpenPlayStoreGuide}
          className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 active:scale-95 transition-colors cursor-pointer"
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span>Play App</span>
        </button>
      </div>
    </nav>
  );
};
