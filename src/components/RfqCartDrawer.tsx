import React, { useState } from 'react';
import { RfqItem } from '../types';
import { X, Trash2, ShoppingBag, Send, CheckCircle2, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RfqCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RfqItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const RfqCartDrawer: React.FC<RfqCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [incoterm, setIncoterm] = useState('CIF');
  const [destinationPort, setDestinationPort] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    setTimeout(() => {
      onClearCart();
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      id="rfq-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end font-body"
      onClick={onClose}
    >
      <div
        id="rfq-drawer-container"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#001233] text-white flex items-center justify-between border-b border-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-[#FF8C00]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider">Export RFQ Basket</h3>
              <p className="text-[11px] text-gray-400">
                {items.length} {items.length === 1 ? 'Product' : 'Products'} selected for RFQ
              </p>
            </div>
          </div>

          <button
            id="rfq-drawer-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-[#2D5A27] rounded-full flex items-center justify-center mx-auto border border-[#2D5A27]/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-xl font-bold text-[#001233]">
                Export RFQ Received!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto font-body">
                Thank you, <strong>{buyerName}</strong>. Our international trade desk at Arcaventure Global will email your official proforma quotation within 4 business hours.
              </p>
              <div className="p-3 rounded bg-gray-50 border border-gray-200 text-xs text-gray-600">
                A formal quotation has been queued for <strong>{buyerEmail}</strong>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-base font-bold text-[#001233]">
                Your Quote Basket is Empty
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Browse our fresh vegetables, aromatic spices, and grains to add them to your commercial inquiry.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#001233] text-white text-xs font-heading font-bold uppercase tracking-wider hover:bg-[#FF8C00] transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Product Item List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-heading font-bold text-gray-400 uppercase tracking-widest">
                  <span>Selected Products</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded bg-gray-50 border border-gray-200 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-xs font-bold text-[#001233] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">
                        Pack: {item.packagingType || item.product.packagingOptions[0]}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-heading font-bold text-[#001233]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-600">
                          {item.unit}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Commercial Trade Terms Configurator */}
              <form id="rfq-commercial-form" onSubmit={handleSubmitQuote} className="space-y-3 pt-3 border-t border-gray-200">
                <h4 className="text-[11px] font-heading font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#FF8C00]" />
                  <span>Buyer Information & Trade Terms</span>
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Incoterms *
                    </label>
                    <select
                      value={incoterm}
                      onChange={(e) => setIncoterm(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-white focus:border-[#FF8C00] focus:outline-none"
                    >
                      <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                      <option value="FOB">FOB (Free on Board - India Ports)</option>
                      <option value="CFR">CFR (Cost and Freight)</option>
                      <option value="EXW">EXW (Ex-Factory Coimbatore)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Destination Port *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jebel Ali"
                      required
                      value={destinationPort}
                      onChange={(e) => setDestinationPort(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 focus:border-[#FF8C00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 focus:border-[#FF8C00] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Importer / Enterprise"
                      required
                      value={buyerCompany}
                      onChange={(e) => setBuyerCompany(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 focus:border-[#FF8C00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 focus:border-[#FF8C00] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+971 / +1 / +44 ..."
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 focus:border-[#FF8C00] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="submit-rfq-btn"
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-heading font-bold text-xs uppercase tracking-widest orange-glow transition-all flex items-center justify-center gap-2 active:scale-98 mt-3 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SUBMIT OFFICIAL EXPORT RFQ</span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-[11px] text-gray-500">
          🔒 ISO 9001:2015 & APEDA Certified Export Desk • Fast Response Guaranteed
        </div>
      </div>
    </div>
  );
};
