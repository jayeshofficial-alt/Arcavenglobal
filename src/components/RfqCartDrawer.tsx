import React, { useState } from 'react';
import { RfqItem, OrderRecord } from '../types';
import { X, Trash2, ShoppingBag, Send, CheckCircle2, Globe, Mail, ExternalLink, MessageCircle, CreditCard } from 'lucide-react';
import { sendRfqCartEmail, TARGET_INQUIRY_EMAIL } from '../utils/emailService';
import { createOrderFromRfq } from '../utils/storage';
import confetti from 'canvas-confetti';

interface RfqCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: RfqItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCreated?: (order: OrderRecord) => void;
  onOpenPaymentModal?: (order: OrderRecord) => void;
}

export const RfqCartDrawer: React.FC<RfqCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onOpenPaymentModal
}) => {
  const [incoterm, setIncoterm] = useState('CIF');
  const [destinationPort, setDestinationPort] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<OrderRecord | null>(null);
  const [mailtoLink, setMailtoLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  if (!isOpen) return null;

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) return;

    setIsSubmitting(true);
    try {
      // 1. Create order record in storage (shows up in Super Admin Command Center & Customer Portal)
      const order = createOrderFromRfq({
        customerName: buyerName,
        customerEmail: buyerEmail,
        customerPhone: buyerPhone,
        company: buyerCompany,
        incoterm,
        destinationPort: destinationPort || 'Port of Discharge Pending',
        items: items.map(i => ({
          product: i.product,
          quantity: i.quantity,
          unit: i.unit,
          packagingType: i.packagingType
        })),
        clientNotes
      });

      setCreatedOrder(order);
      if (onOrderCreated) {
        onOrderCreated(order);
      }

      // 2. Dispatch email notification and generate direct links
      const result = await sendRfqCartEmail({
        buyerName,
        buyerEmail,
        buyerCompany,
        buyerPhone,
        incoterm,
        destinationPort,
        items: items.map(i => ({
          name: i.product.name,
          quantity: i.quantity,
          unit: i.unit,
          packaging: i.packagingType
        }))
      });

      setMailtoLink(result.mailtoUrl);
      setWhatsappLink(result.whatsappUrl);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting RFQ basket:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndClear = () => {
    onClearCart();
    setSubmitted(false);
    setCreatedOrder(null);
    onClose();
  };

  return (
    <div
      id="rfq-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#0B192C]/70 backdrop-blur-xs flex justify-end font-body animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="rfq-drawer-container"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-[#0B192C] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                Export RFQ Basket
              </h3>
              <p className="text-[11px] text-slate-400">
                {items.length} {items.length === 1 ? 'Commodity' : 'Commodities'} selected for commercial quote
              </p>
            </div>
          </div>

          <button
            id="rfq-drawer-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-heading font-bold uppercase tracking-wider">
                  Order & RFQ Dispatched
                </span>
                <h4 className="font-heading text-xl font-bold text-slate-900 mt-2">
                  Quote Dispatched to Trade Desk
                </h4>
                {createdOrder && (
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Commercial Order Record: <strong className="text-slate-900">{createdOrder.orderNumber}</strong>
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-slate-900">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>Routed to: <span className="text-slate-900 font-mono">{TARGET_INQUIRY_EMAIL}</span></span>
                </div>
                <p className="text-slate-600 leading-relaxed font-body">
                  Thank you, <strong>{buyerName}</strong> ({buyerCompany || 'Consignee'}). Your quote for {items.length} line item(s) has been entered into the Super Admin Command Center under status <strong className="text-amber-700">Order Received</strong>.
                </p>
              </div>

              {/* Instant Payment Trigger */}
              {createdOrder && onOpenPaymentModal && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-900">
                      Settle Commercial Invoice
                    </span>
                    <span className="font-mono font-bold text-xs text-emerald-900">
                      ${(createdOrder.totalEstimatedValue || 0).toLocaleString()} USD
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    You can settle or deposit against this proforma invoice right away via Cards, Net Banking, or UPI QR code.
                  </p>
                  <button
                    onClick={() => {
                      onOpenPaymentModal(createdOrder);
                      handleFinishAndClear();
                    }}
                    className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Digital Checkout</span>
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-1">
                {mailtoLink && (
                  <a
                    href={mailtoLink}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B192C] hover:bg-slate-900 text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open in Email Client</span>
                  </a>
                )}

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Copy via WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleFinishAndClear}
                  className="w-full py-2 text-xs font-heading font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider underline cursor-pointer mt-1"
                >
                  Clear Basket & Return to Catalog
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-sm font-bold text-slate-700 uppercase tracking-wider">
                Your RFQ Basket is Empty
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our export catalog and click "Add to RFQ" on any agricultural commodity to generate an official quote.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Product items list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-heading uppercase tracking-wider border-b border-slate-100 pb-2">
                  <span>Selected Commodities</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-500 hover:text-red-700 text-[10px] font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-heading font-bold text-slate-900 text-sm">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Origin: {item.product.origin}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        Packaging: {item.packagingType || 'Standard Export'}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-heading uppercase text-slate-400 font-bold">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 px-2 py-0.5 border border-slate-300 rounded text-center text-xs font-mono font-bold bg-white"
                        />
                        <span className="text-[11px] text-slate-600 font-medium">{item.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitQuote} className="space-y-3.5 pt-2 border-t border-slate-100">
                <span className="block font-heading text-xs font-bold uppercase tracking-wider text-slate-700">
                  Consignee Details & Incoterm
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Incoterm *
                    </label>
                    <select
                      value={incoterm}
                      onChange={(e) => setIncoterm(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 bg-slate-50"
                    >
                      <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                      <option value="FOB">FOB (Free On Board - Indian Port)</option>
                      <option value="CNF">CNF / CFR (Cost & Freight)</option>
                      <option value="EXW">EXW (Ex-Works / Mill Yard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Discharge Port
                    </label>
                    <input
                      type="text"
                      value={destinationPort}
                      onChange={(e) => setDestinationPort(e.target.value)}
                      placeholder="e.g. Jebel Ali / Rotterdam"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Contact person"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Company / Importer
                    </label>
                    <input
                      type="text"
                      value={buyerCompany}
                      onChange={(e) => setBuyerCompany(e.target.value)}
                      placeholder="Corporate trading entity"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="trader@company.com"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Special Packaging / Certification Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Private label branding, fumigation requirement, FDA prior notice..."
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? (
                    <span>Routing to Global Trade Desk...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit RFQ & Generate Order</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
