/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { ProductItem, RfqItem, UserAccount } from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  ADMIN_EMAIL
} from './utils/storage';

export default function App() {
  const [cartItems, setCartItems] = useState<RfqItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);

  // Authentication & Dynamic Products State
  const [products, setProducts] = useState<ProductItem[]>(() => getStoredProducts());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSession());

  // Modal Visibilities
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);

  // Synchronize state with storage
  useEffect(() => {
    const stored = getStoredProducts();
    setProducts(stored);
  }, []);

  const handleAdminLoginSuccess = (user: UserAccount) => {
    setCurrentSession(user);
    setCurrentUser(user);
    setIsAdminLoginOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleCustomerLoginSuccess = (user: UserAccount) => {
    setCurrentSession(user);
    setCurrentUser(user);
    setIsCustomerAuthOpen(false);
    setIsCustomerPortalOpen(true);
  };

  const handleLogout = () => {
    clearCurrentSession();
    setCurrentUser(null);
    setIsAdminPanelOpen(false);
    setIsCustomerPortalOpen(false);
  };

  const handleProductsUpdated = (updatedProducts: ProductItem[]) => {
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);
  };

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

  const isAdmin = currentUser?.role === 'admin' && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFB] text-[#1E293B]">
      {/* Sticky Transparent-to-Solid Glassmorphism Navigation */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
        currentUser={currentUser}
        onOpenCustomerLogin={() => setIsCustomerAuthOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onLogout={handleLogout}
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

        {/* Product Categories & Dynamic Catalog with Delist Filter & Admin Banner */}
        <ProductCatalog
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={(product) => handleAddToCart(product, 1)}
          cartItems={cartItems}
          products={products}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          isAdminLoggedIn={isAdmin}
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
      <Footer
        onOpenCustomerLogin={() => setIsCustomerAuthOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isAdminLoggedIn={isAdmin}
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

      {/* Floating WhatsApp Quick Connect */}
      <FloatingWhatsApp />

      {/* Admin Login Modal (Restricted to jayeshofficial@gmail.com) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Full Admin Panel Modal (Products CRUD & List/Delist, User Management & Passwords) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={currentUser}
        products={products}
        onProductsUpdated={handleProductsUpdated}
        onLogout={handleLogout}
      />

      {/* Customer Login & Registration Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onLoginSuccess={handleCustomerLoginSuccess}
      />

      {/* Customer Self-Service Portal Modal (Profile, Password Management & History) */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          setCurrentSession(updated);
        }}
        onLogout={handleLogout}
      />
    </div>
  );
}

