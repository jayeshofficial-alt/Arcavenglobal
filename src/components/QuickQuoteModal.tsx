import React, { useState } from 'react';
import { X, Globe2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/productsData';
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
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div
      id="quick-quote-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-body"
      onClick={onClose}
    >
      <div
        id="quick-quote-modal-container"
        className="relative bg-white rounded-lg max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-[#2D5A27] rounded-full flex items-center justify-center mx-auto border border-[#2D5A27]/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#001233]">
              Quote Request Submitted!
            </h3>
            <p className="text-xs text-gray-600 font-body">
              Thank you, <strong>{formData.name}</strong>. Our international commerce desk will send an official proforma invoice and shipping timetable to <strong>{formData.email}</strong>.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold uppercase tracking-widest text-[#FF8C00] mb-1">
              <Globe2 className="w-3.5 h-3.5" />
              <span>International Trade Inquiry</span>
            </div>

            <h2 className="font-heading text-2xl font-bold text-[#001233]">
              Request Export Price & Proforma
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-5 font-body">
              Get direct container rates (FOB / CIF) and lab certificate assays.
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
                    placeholder="+971 / +1 / +44 ..."
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
                    <option value="EXW">EXW (Coimbatore)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Destination Port *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jebel Ali"
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
                className="w-full py-2.5 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-heading font-bold text-xs uppercase tracking-widest orange-glow transition-all active:scale-98 cursor-pointer mt-1"
              >
                SEND COMMERCIAL RFQ
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A27]" />
              <span>APEDA & ISO 9001:2015 Verified • No Spam Assurance</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
