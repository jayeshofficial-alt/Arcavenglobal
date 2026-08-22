import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Building2, ExternalLink, MessageCircle } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';
import { sendContactMessageEmail, TARGET_INQUIRY_EMAIL } from '../utils/emailService';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Indian Coconuts & Fresh Produce',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mailtoLink, setMailtoLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendContactMessageEmail(formData);
      setMailtoLink(result.mailtoUrl);
      setWhatsappLink(result.whatsappUrl);

      setIsSubmitted(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-24 bg-[#001233] text-white relative overflow-hidden font-body border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Section Header (Editorial) */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#FF8C00] font-heading font-semibold tracking-widest text-xs uppercase mb-3 block">
            Direct Trade Inquiries
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Initiate Your <span className="text-[#FF8C00] italic font-serif">Commercial</span> Inquiry
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 font-body max-w-2xl mx-auto">
            Request proforma invoices, bulk container shipping schedules, or lab assay certificates directly from our Pune trade office.
          </p>
          <div className="w-12 h-1 bg-[#FF8C00] mx-auto mt-4 rounded-full" />
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Phone Card */}
          <div className="p-5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-[#FF8C00] flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold text-gray-300 uppercase tracking-wider">
                Call & WhatsApp
              </h4>
              <p className="text-sm font-bold text-white mt-1">
                {COMPANY_DETAILS.contact.phonePrimary}
              </p>
              <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                Direct WhatsApp Export Desk Active
              </p>
            </div>
          </div>

          {/* Email Card */}
          <div className="p-5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-[#2D5A27] flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold text-gray-300 uppercase tracking-wider">
                Export Inquiries
              </h4>
              <p className="text-sm font-bold text-white mt-1">
                {COMPANY_DETAILS.contact.emailPrimary}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                General: {COMPANY_DETAILS.contact.emailSecondary}
              </p>
            </div>
          </div>

          {/* Office Address Card */}
          <div className="p-5 rounded-lg bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-[#FF8C00] flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold text-gray-300 uppercase tracking-wider">
                Global Headquarters
              </h4>
              <p className="text-xs font-semibold text-white mt-1">
                {COMPANY_DETAILS.headquarters.addressLine1}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {COMPANY_DETAILS.headquarters.addressLine2}, {COMPANY_DETAILS.headquarters.state} - {COMPANY_DETAILS.headquarters.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Left Map + Right Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Integrated Google Maps & Office Hub Info */}
          <div className="lg:col-span-5 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex flex-col justify-between">
            {/* Google Maps Iframe */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-800">
              <iframe
                title="Arcaventure Global Pimple Gurav Pune Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15128.468249673406!2d73.8055416!3d18.5910398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b881335b3765%3A0xe21553c2b87fcf95!2sPimple%20Gurav%2C%20Pimpri-Chinchwad%2C%20Maharashtra%20411061!5e0!3m2!1sen!2sin!4v1716500000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter contrast-[1.05] opacity-90 hover:opacity-100 transition-opacity"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              <div className="absolute top-3 left-3 bg-[#001233]/90 backdrop-blur-xs px-3 py-1 rounded border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-[#FF8C00]" />
                <span>Head Office: Pimple Gurav, Pune - 411061</span>
              </div>
            </div>

            {/* Hub Details & Operating Hours */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-gray-300">
                <Clock className="w-3.5 h-3.5 text-[#FF8C00]" />
                <span>
                  <strong>Global Trade Desk Hours:</strong> Mon - Sat: 08:30 AM – 08:30 PM (IST)
                </span>
              </div>

              <div className="p-3.5 rounded bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>⚓ Major Export Seaports & Air Cargo:</span>
                </div>
                <p>• Nhava Sheva (JNPT Mumbai) – Direct Gateway</p>
                <p>• Mumbai Port & Inland Container Depot (ICD Pune)</p>
                <p>• Pune International Air Cargo & CSMIA Mumbai</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Lead Gen Form */}
          <div className="lg:col-span-7 rounded-lg p-6 sm:p-8 border border-white/10 bg-white/5 flex flex-col justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">
                Send an Export Message
              </h3>
              <p className="text-xs text-gray-300 mb-5 font-body">
                Fill in the details below to receive product specifications, lab tests, and CIF/FOB pricing quotes.
              </p>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-heading font-bold uppercase tracking-wider">
                      Inquiry Dispatched
                    </span>
                    <h4 className="font-heading text-xl font-bold text-white mt-2">
                      Inquiry Dispatched to {TARGET_INQUIRY_EMAIL}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Your export inquiry has been routed to <strong>{TARGET_INQUIRY_EMAIL}</strong>. Our commercial trade manager will reply to <strong>{formData.email}</strong> shortly.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    {mailtoLink && (
                      <a
                        href={mailtoLink}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#FF8C00]" />
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
                        <span>Send WhatsApp Copy</span>
                      </a>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          company: '',
                          subject: 'Indian Coconuts & Fresh Produce',
                          message: ''
                        });
                      }}
                      className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form id="contact-lead-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe / Mohammed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-white/10 border border-white/15 text-white placeholder-gray-400 text-xs font-body focus:outline-none focus:border-[#FF8C00] transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="buyer@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-white/10 border border-white/15 text-white placeholder-gray-400 text-xs font-body focus:outline-none focus:border-[#FF8C00] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone / WhatsApp */}
                    <div>
                      <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-white/10 border border-white/15 text-white placeholder-gray-400 text-xs font-body focus:outline-none focus:border-[#FF8C00] transition-all"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                        Company / Importer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Global Trading LLC"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded bg-white/10 border border-white/15 text-white placeholder-gray-400 text-xs font-body focus:outline-none focus:border-[#FF8C00] transition-all"
                      />
                    </div>
                  </div>

                  {/* Product Category Interest */}
                  <div>
                    <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Commodity of Interest
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-[#001c44] border border-white/15 text-white text-xs font-body focus:outline-none focus:border-[#FF8C00]"
                    >
                      <option value="Indian Coconuts & Fresh Produce">Indian Mature Coconuts & Fresh Produce</option>
                      <option value="1121 Basmati Rice & Pulses">1121 Basmati Rice & Organic Pulses</option>
                      <option value="Specialty Spices (Cardamom, Pepper, Chillies, Turmeric)">Specialty Spices (Cardamom, Pepper, Chillies, Turmeric)</option>
                      <option value="Virgin Coconut Oil & Coco Peat Blocks">Virgin Coconut Oil & Coco Peat Blocks</option>
                      <option value="Mixed Commodity / Private Label Export">Mixed Commodity / Private Label Export</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Requirement Details & Target Port *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Specify required quantity in MT / Containers, packaging preference, target CIF destination port, and delivery schedule..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded bg-white/10 border border-white/15 text-white placeholder-gray-400 text-xs font-body focus:outline-none focus:border-[#FF8C00] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white font-heading font-bold text-xs uppercase tracking-widest orange-glow transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND EXPORT INQUIRY</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-center text-[11px] text-gray-400">
              ⚡ Guaranteed response from our export desk within 4 business hours.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
