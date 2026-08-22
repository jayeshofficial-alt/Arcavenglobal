import React, { useState } from 'react';
import { X, Globe2, CheckCircle2, ShieldCheck, Mail, Send, ExternalLink, MessageCircle } from 'lucide-react';
import { PRODUCTS } from '../data/productsData';
import { sendQuickQuoteEmail, TARGET_INQUIRY_EMAIL } from '../utils/emailService';
import confetti from 'canvas-confetti';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: PRODUCTS[0].name,
    quantity: '1 Container (40ft High Cube)',
    incoterm: 'CIF',
    destinationPort: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mailtoLink, setMailtoLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendQuickQuoteEmail(formData);
      setMailtoLink(result.mailtoUrl);
      setWhatsappLink(result.whatsappUrl);
      
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSubmitted(true);

      // Promptly open WhatsApp directly in new tab with the filled quote details
      if (result.whatsappUrl) {
        setTimeout(() => {
          try {
            window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
          } catch (err) {
            console.warn('Popup blocked, available via button:', err);
          }
        }, 600);
      }
    } catch (err) {
      console.error('Failed to submit quote:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      id="quick-quote-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-body"
      onClick={handleResetAndClose}
    >
      <div
        id="quick-quote-modal-container"
        className="relative bg-white rounded-lg max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-[#2D5A27] rounded-full flex items-center justify-center mx-auto border border-[#2D5A27]/20 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#2D5A27] text-[11px] font-heading font-bold uppercase tracking-wider">
                Inquiry Dispatched Successfully
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#001233] mt-2">
                Export Quote Sent to Trade Desk!
              </h3>
            </div>

            {/* Email Dispatch Notice Box */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-left text-xs text-gray-700 space-y-2">
              <div className="flex items-center gap-2 font-heading font-bold text-[#001233]">
                <Mail className="w-4 h-4 text-[#FF8C00]" />
                <span>Forwarded to: <span className="text-[#FF8C00]">{TARGET_INQUIRY_EMAIL}</span></span>
              </div>
              <p className="text-gray-600 leading-relaxed font-body">
                Thank you, <strong>{formData.name}</strong> ({formData.company || 'Buyer'}). A copy of your inquiry for <strong>{formData.product}</strong> ({formData.quantity}) has been routed to <strong>{TARGET_INQUIRY_EMAIL}</strong> and our team will issue an official proforma invoice to <strong>{formData.email}</strong> within 4 business hours.
              </p>
            </div>

            {/* Action buttons on success */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              {mailtoLink && (
                <a
                  href={mailtoLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#001233] hover:bg-[#002255] text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Email App</span>
                </a>
              )}

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp (+91 9860215449)</span>
                </a>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="text-xs font-heading font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider underline cursor-pointer"
              >
                Close & Return to Products
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase tracking-widest text-[#FF8C00] mb-1">
              <Globe2 className="w-3.5 h-3.5" />
              <span>International Trade Inquiry • {TARGET_INQUIRY_EMAIL}</span>
            </div>

            <h2 className="font-heading text-2xl font-bold text-[#001233]">
              Request Export Price & Proforma
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-5 font-body">
              Get direct container rates (FOB / CIF) and lab certificate assays directly at <strong>{TARGET_INQUIRY_EMAIL}</strong>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Company / Buyer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 / +1 / +44 / +91 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Product Required *
                </label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none bg-gray-50 font-medium"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Estimated Volume *
                  </label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none bg-white"
                  >
                    <option value="1 Container (40ft High Cube)">1 x 40ft Container</option>
                    <option value="Multiple 40ft Containers">Multiple Containers</option>
                    <option value="1 Container (20ft FCL)">1 x 20ft Container</option>
                    <option value="Trial Air Cargo / Sample">Trial Air Cargo (500kg - 2MT)</option>
                    <option value="Sample Box (5kg)">Courier Sample Box (5kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Trade Term
                  </label>
                  <select
                    value={formData.incoterm}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none bg-white"
                  >
                    <option value="CIF">CIF (Port of Discharge)</option>
                    <option value="FOB">FOB (Indian Ports)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                    <option value="EXW">EXW (Pune / Factory)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Destination Port *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jebel Ali / Rotterdam"
                    value={formData.destinationPort}
                    onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Additional Packaging or Specs Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need 25kg PP bags private labeled, moisture certificate required..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:border-[#FF8C00] focus:outline-none resize-none font-body"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-heading font-bold text-xs uppercase tracking-widest orange-glow transition-all active:scale-98 cursor-pointer mt-1 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>DISPATCHING INQUIRY...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND COMMERCIAL RFQ TO {TARGET_INQUIRY_EMAIL}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>APEDA & ISO 9001:2015 Verified • Inquiry received at {TARGET_INQUIRY_EMAIL}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

