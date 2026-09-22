import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Send,
  FileCheck2,
  Globe2,
  Lock
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/productsData';

interface HeroProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onRequestQuote
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactEmail = 'contact@arcavenglobal.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Construct mailto link as fallback
      const subject = encodeURIComponent(`Formal Trade Inquiry - ${companyInput || emailInput}`);
      const body = encodeURIComponent(
        `Dear Arcaven Global Commercial Desk,\n\n` +
        `We would like to register a formal inquiry for international trade partnerships and commodities.\n\n` +
        `Company / Inquirer: ${companyInput || 'Not specified'}\n` +
        `Contact Email: ${emailInput}\n\n` +
        `Best regards,`
      );
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }, 400);
  };

  return (
    <section 
      id="home" 
      className="relative pt-[104px] sm:pt-[108px] bg-[#001233] text-white overflow-hidden border-b border-slate-800"
    >
      {/* Subtle Corporate Architectural Grid & Lighting */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Subtle Ambient Gold & Slate Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-slate-700/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-16 lg:pb-20">
        
        {/* Brand Header & Subtle 'Platform Under Setup' Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 sm:pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center font-heading font-bold text-white text-sm shadow-sm backdrop-blur-sm">
              <span className="text-amber-400 font-extrabold">A</span>G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Arcaven <span className="text-amber-400">Global</span>
                </span>
                <span className="text-slate-400 text-xs font-mono hidden md:inline">
                  arcavenglobal.com
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                International Trade & Merchant Export
              </p>
            </div>
          </div>

          {/* Subtle Badge: 'Platform Under Setup' */}
          <div className="flex items-center">
            <div 
              id="platform-setup-badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-xs backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span>Platform Under Setup</span>
            </div>
          </div>
        </div>

        {/* Hero Main Content Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Headlines, Compliance Notice, and Email Capture */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Primary Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest font-heading">
                <Building2 className="w-3.5 h-3.5" />
                <span>Global Commerce Infrastructure</span>
              </div>

              <h1 
                id="hero-primary-headline"
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.15]"
              >
                Building Global Trade & Partnerships{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  — Launching Soon
                </span>
              </h1>
            </div>

            {/* Compliance Notice / Subtext (Exact text required) */}
            <div 
              id="compliance-notice-box"
              className="relative p-5 sm:p-6 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex-shrink-0 mt-0.5">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[11px] font-heading font-bold text-amber-300 uppercase tracking-wider block">
                    Statutory & Compliance Notice
                  </span>
                  <p 
                    id="hero-compliance-subtext"
                    className="font-body text-slate-300 text-sm sm:text-[15px] leading-relaxed"
                  >
                    Arcaven Global is currently completing standard corporate documentation and statutory legal formalities. Full platform features, international trade listings, and client onboarding will go live shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action / Inquiries: Clean Email Capture Input Field */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label 
                  htmlFor="inquiry-email-input" 
                  className="text-xs sm:text-sm font-semibold text-slate-200 font-heading flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>For formal inquiries, reach us at:</span>
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-amber-400 hover:text-amber-300 underline font-mono text-xs sm:text-sm transition-colors ml-1"
                  >
                    [{contactEmail}]
                  </a>
                </label>

                {/* Instant Copy Email button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-0.5 px-2 rounded border border-slate-800 hover:border-amber-400/40 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied Email</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Email Capture Form */}
              <form 
                onSubmit={handleFormSubmit}
                className="bg-slate-900/60 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-2 shadow-lg"
              >
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    id="inquiry-company-input"
                    type="text"
                    placeholder="Your Company / Institution"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                  <input
                    id="inquiry-email-input"
                    type="email"
                    required
                    placeholder="corporate.email@domain.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <button
                  id="inquiry-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-400 hover:bg-amber-500 text-[#001233] px-6 py-2.5 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 whitespace-nowrap shadow-md"
                >
                  {isSubmitting ? (
                    <span>Routing...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {isSubmitted && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Inquiry registered for <strong>{emailInput}</strong>. A prefilled dispatch email to <strong>{contactEmail}</strong> has been opened.
                  </span>
                </div>
              )}

              <p className="text-[11px] text-slate-400 font-body">
                Official inquiries are directed to our merchant desk. We reply with verified specs, export capacity, and proforma sheets.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-request-quote-btn"
                onClick={onRequestQuote}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-5 py-2.5 rounded-lg font-heading text-xs font-semibold tracking-wider transition-all duration-150 flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Request Quotation / RFQ</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                id="hero-explore-catalog-btn"
                onClick={onExploreProducts}
                className="text-slate-300 hover:text-white px-4 py-2.5 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Preview Upcoming Commodities</span>
                <span className="text-amber-400">↓</span>
              </button>
            </div>

          </div>

          {/* Right Column: Clean Corporate Contact Card */}
          <div className="lg:col-span-5">
            <div 
              id="corporate-contact-card"
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle card accent top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-slate-700" />

              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-white tracking-tight">
                    Corporate Contact Card
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Arcaven Global Liaison & Commercial Desk
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Contact Card Details */}
              <div className="space-y-4 text-xs font-body">
                
                {/* Official Email */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Formal Inquiries Channel</span>
                    <span className="text-amber-400 font-semibold">Official Desk</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="font-mono text-sm text-amber-400 hover:text-amber-300 font-semibold truncate transition-colors"
                    >
                      {contactEmail}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                      title="Copy email"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Direct Trade Desk Phone & WhatsApp */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Direct Trade Desk / WhatsApp</span>
                    <span className="text-emerald-400 font-semibold">Active Line</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="font-mono text-sm text-slate-200 font-semibold">
                      {COMPANY_DETAILS.contact.phonePrimary}
                    </span>
                    <a
                      href={`https://wa.me/${COMPANY_DETAILS.contact.whatsapp}?text=${encodeURIComponent('Hello Arcaven Global Trade Desk, I would like to inquire about international trade & partnerships.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Message WhatsApp
                    </a>
                  </div>
                </div>

                {/* Headquarters Location */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-slate-400">
                    <span>Registered Location</span>
                  </div>
                  <div className="flex items-start gap-2 pt-0.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {COMPANY_DETAILS.headquarters.addressLine1}, {COMPANY_DETAILS.headquarters.addressLine2}, {COMPANY_DETAILS.headquarters.state}
                    </span>
                  </div>
                </div>

                {/* Corporate Operating Standards */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300">4-Hour Trade SLA</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">Statutory Compliant</span>
                  </div>
                </div>

              </div>

              {/* Direct Mailto Action */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <a
                  href={`mailto:${contactEmail}?subject=Direct%20Trade%20Inquiry%20-%20Arcaven%20Global`}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold font-heading uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Direct Email to Trade Desk</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Status Ribbon at the Bottom of Hero */}
        <div className="mt-12 sm:mt-16 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold">Status: Pending Regulatory & Formal Filings</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span>International Trade Desk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Statutory Compliance in Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Inquiries Open at {contactEmail}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
