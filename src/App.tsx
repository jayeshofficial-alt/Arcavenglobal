/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { ProcessAndQuality } from './components/ProcessAndQuality';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RfqCartDrawer } from './components/RfqCartDrawer';
import { QuickQuoteModal } from './components/QuickQuoteModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileInstallBanner } from './components/MobileInstallBanner';
import { PlayStoreGuideModal } from './components/PlayStoreGuideModal';
import { ProductItem, RfqItem } from './types';

export default function App() {
  const [cartItems, setCartItems] = useState<RfqItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);
  const [isPlayStoreGuideOpen, setIsPlayStoreGuideOpen] = useState(false);

  // Add to Quote Basket
  const handleAddToCart = (
    product: ProductItem,
    customQty = 1,
    unit: any = 'Containers (40ft)',
    packaging?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + customQty,
          unit: unit || updated[existingIndex].unit,
          packagingType: packaging || updated[existingIndex].packagingType
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: customQty,
            unit: unit || 'Containers (40ft)',
            packagingType: packaging || product.packagingOptions[0]
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFB] text-[#1E293B]">
      {/* Top Mobile PWA & Play Store Install Notification Banner */}
      <MobileInstallBanner onOpenPlayStoreGuide={() => setIsPlayStoreGuideOpen(true)} />

      {/* Sticky Transparent-to-Solid Glassmorphism Navigation */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
        onOpenPlayStoreGuide={() => setIsPlayStoreGuideOpen(true)}
      />

      {/* Main Single-Page Sections */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onExploreProducts={scrollToProducts}
          onRequestQuote={() => setIsQuickQuoteOpen(true)}
        />

        {/* About Us Section */}
        <AboutSection />

        {/* Product Categories & Catalog */}
        <ProductCatalog
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={(product) => handleAddToCart(product, 1)}
          cartItems={cartItems}
        />

        {/* Quality Protocol & Export Logistics */}
        <ProcessAndQuality />

        {/* Gallery Section */}
        <GallerySection />

        {/* International Client Testimonials */}
        <TestimonialsSection />

        {/* Contact & Lead Gen with Integrated Google Maps */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenPlayStoreGuide={() => setIsPlayStoreGuideOpen(true)} />

      {/* Mobile Native-Style Bottom App Navigation Bar */}
      <MobileBottomNav
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
        onOpenPlayStoreGuide={() => setIsPlayStoreGuideOpen(true)}
      />

      {/* Product Detail "Learn More" Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* RFQ / Sample Basket Drawer */}
      <RfqCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={isQuickQuoteOpen}
        onClose={() => setIsQuickQuoteOpen(false)}
      />

      {/* Google Play Store & Android App Hub Modal */}
      <PlayStoreGuideModal
        isOpen={isPlayStoreGuideOpen}
        onClose={() => setIsPlayStoreGuideOpen(false)}
        onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
      />

      {/* Floating WhatsApp Quick Connect */}
      <FloatingWhatsApp />
    </div>
  );
}

