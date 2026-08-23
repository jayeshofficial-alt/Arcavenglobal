import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { RfqItem } from '../types';

interface NavbarProps {
  cartItems: RfqItem[];
  onOpenCart: () => void;
  onOpenQuickQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenQuickQuote,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section spy
      const sections = ['home', 'about', 'products', 'quality', 'gallery', 'contact'];
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#home', id: 'home' },
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'PRODUCTS', href: '#products', id: 'products' },
    { name: 'QUALITY', href: '#quality', id: 'quality' },
    { name: 'GALLERY', href: '#gallery', id: 'gallery' },
    { name: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        {/* Preparing for Launch Announcement Banner */}
        <div id="launch-banner" className="bg-[#001233] text-white py-2 px-4 border-b border-white/10 w-full">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-heading font-bold bg-[#FF8C00] text-white uppercase tracking-wider">
                Notice
              </span>
              <span className="font-heading font-semibold text-xs sm:text-sm text-slate-100">
                Preparing for Launch — Stay tuned for something meaningful.
              </span>
            </div>
            <div className="flex items-center gap-2.5 mx-auto sm:mx-0 text-[11px] text-gray-300">
              <span className="hidden md:inline text-gray-400">Share Export Queries:</span>
              <button
                id="banner-request-quote-btn"
                onClick={onOpenQuickQuote}
                className="text-[#FF8C00] hover:text-white font-bold underline transition-colors cursor-pointer"
              >
                Request Quote
              </button>
              <span className="text-gray-600">•</span>
              <a
                id="banner-shop-now-btn"
                href="#products"
                onClick={(e) => scrollToSection(e, '#products')}
                className="text-emerald-400 hover:text-white font-bold underline transition-colors cursor-pointer"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>

        <div className="h-[64px] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
            {/* Editorial Brand Logo */}
            <a
              id="header-logo-link"
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <div className="w-8 h-8 bg-[#001233] rounded-sm flex items-center justify-center text-white font-heading text-xs italic tracking-tighter shadow-xs">
                AG
              </div>
              <span className="text-[#001233] font-heading text-lg sm:text-xl font-bold tracking-tight">
                ARCAVENTURE <span className="text-[#FF8C00]">GLOBAL</span>
              </span>
            </a>

            {/* Desktop Navigation Links (Editorial uppercase & spacing) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <div className="flex gap-5 xl:gap-6 text-[13px] font-semibold text-[#001233]/70">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      id={`nav-link-${link.id}`}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className={`transition-colors duration-150 relative py-1 ${
                        isActive
                          ? 'text-[#FF8C00]'
                          : 'hover:text-[#FF8C00]'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF8C00] rounded-full" />
                      )}
                    </a>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
                {/* RFQ Cart Icon */}
                <button
                  id="cart-drawer-trigger"
                  onClick={onOpenCart}
                  className="relative p-2 text-[#001233]/80 hover:text-[#FF8C00] transition-colors rounded-lg hover:bg-gray-50 cursor-pointer"
                  title="View Sample Order / RFQ Basket"
                  aria-label="View quotation cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#2D5A27] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {totalCartCount}
                    </span>
                  )}
                </button>

                {/* Editorial SHOP NOW Pill Button with orange-glow */}
                <button
                  id="header-cta-quote-btn"
                  onClick={onOpenQuickQuote}
                  className="bg-[#FF8C00] hover:bg-[#e67e00] text-white px-5 py-2 rounded-full font-heading text-[12px] font-bold tracking-wider uppercase orange-glow transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  SHOP NOW
                </button>
              </div>
            </nav>

            {/* Mobile Right Controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                id="mobile-cart-btn"
                onClick={onOpenCart}
                className="relative p-2 text-[#001233] hover:text-[#FF8C00]"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute 0 right-0 min-w-[16px] h-4 px-1 bg-[#2D5A27] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {totalCartCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#001233] hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-nav-drawer"
            className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white border-l border-gray-100 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#001233] rounded-sm flex items-center justify-center text-white font-heading text-xs italic">
                    AG
                  </div>
                  <span className="text-[#001233] font-heading text-base font-bold">
                    ARCAVENTURE <span className="text-[#FF8C00]">GLOBAL</span>
                  </span>
                </div>
                <button
                  id="mobile-nav-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    id={`mobile-link-${link.id}`}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="block px-4 py-3 rounded-lg text-sm font-semibold font-heading text-[#001233]/80 hover:text-[#FF8C00] hover:bg-gray-50 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <button
                id="mobile-drawer-quote-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickQuote();
                }}
                className="w-full py-3 rounded-full bg-[#FF8C00] text-white font-heading font-bold text-xs uppercase tracking-wider orange-glow text-center shadow-md transition-colors cursor-pointer"
              >
                REQUEST EXPORT QUOTE
              </button>

              <div className="text-[11px] text-gray-500 text-center space-y-1">
                <p className="font-semibold text-slate-700">Pimple Gurav, Pune - 411061, Maharashtra, India</p>
                <p>Verified Agricultural Merchant Exporter</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

