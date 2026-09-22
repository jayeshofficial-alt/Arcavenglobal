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
  Lock,
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { COMPANY_DETAILS, PRODUCTS } from '../data/productsData';

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
  const [inquiryType, setInquiryType] = useState('Institutional Partnership');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCommodityPreview, setShowCommodityPreview] = useState(false);

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
      
      const subject = encodeURIComponent(`Executive Partnership Inquiry - ${companyInput || emailInput}`);
      const body = encodeURIComponent(
        `Dear Arca Ventures Global Executive Desk,\n\n` +
        `We would like to register a formal executive inquiry regarding: ${inquiryType}.\n\n` +
        `Company / Institution: ${companyInput || 'Institutional Inquirer'}\n` +
        `Contact Email: ${emailInput}\n` +
        `Domain: arcavenglobal.com\n\n` +
        `We request preliminary trade specifications, bilateral partnership guidelines, and communication upon statutory pre-launch completion.\n\n` +
        `Sincerely,\n` +
        `${companyInput || 'Executive Partner'}`
      );
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }, 400);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-[96px] sm:pt-[104px] pb-16 lg:pb-24 bg-[#000d21] text-white overflow-hidden flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-body"
    >
      {/* Precision Geometric Grid Background & Architectural Ambience */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:28px_28px]" />
      
      {/* Subtle Corporate Lighting / Enterprise Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-gradient-to-b from-amber-500/10 via-slate-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full flex-grow flex flex-col justify-center">
        
        {/* Top Corporate Brand Header & 'Platform Under Setup' Status Badge */}
        <div className="pt-4 sm:pt-6 pb-8 sm:pb-12 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            {/* Elegant Monogram Emblem */}
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center font-heading font-extrabold text-white text-base shadow-lg shadow-black/40 backdrop-blur-md">
              <span className="text-amber-400 tracking-tighter">A</span>
              <span className="text-slate-200">V</span>
              <span className="text-slate-400 text-xs ml-0.5">G</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Arca Ventures <span className="text-amber-400">Global</span>
                </span>
                <span className="hidden md:inline-flex text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  arcavenglobal.com
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
                Strategic B2B Commerce • International Trade & Commodity Corridors
              </p>
            </div>
          </div>

          {/* Prominent Status Badge: 'Platform Under Setup' */}
          <div className="flex items-center gap-3">
            <div 
              id="platform-setup-status-badge"
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-sm backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span className="font-heading tracking-wide">Platform Under Setup</span>
            </div>

            <a
              href={`mailto:${contactEmail}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Desk</span>
            </a>
          </div>
        </div>

        {/* Hero Main Presentation Layout */}
        <div className="py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headlines, Compliance Disclaimer, and Inquiries Input */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8">
            
            {/* Pre-launch Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[11px] font-heading font-semibold text-slate-300 uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Enterprise Global Operations</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">Pre-Launch Stage</span>
            </div>

            {/* Primary Hero Headline */}
            <h1 
              id="hero-primary-headline"
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Building Strategic Global Partnerships{' '}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                — Launching Soon
              </span>
            </h1>

            {/* Legal / Compliance Disclaimer (Exact wording required) */}
            <div 
              id="legal-compliance-disclaimer-box"
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle silver/gold accent accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-slate-400 to-slate-800" />
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex-shrink-0 mt-0.5">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-heading font-bold text-amber-300 uppercase tracking-wider">
                      Regulatory & Statutory Pre-Launch Notice
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                      Formal Filing Stage
                    </span>
                  </div>
                  
                  {/* Exact text */}
                  <p 
                    id="compliance-disclaimer-text"
                    className="font-body text-slate-200 text-sm sm:text-[15px] leading-relaxed"
                  >
                    Arca Ventures Global is currently completing standard corporate documentation and statutory legal formalities. Commercial operations, client onboarding, and platform features will launch shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact / Inquiries Section: Sleek Card & Input Element */}
            <div className="space-y-3.5 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-200 font-heading flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>For executive inquiries:</span>
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-amber-400 hover:text-amber-300 underline font-mono text-xs sm:text-sm transition-colors font-bold ml-0.5"
                  >
                    {contactEmail}
                  </a>
                </span>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-1 px-2.5 rounded-md border border-slate-800 hover:border-amber-400/40 bg-slate-900/60 cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied Email</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sleek Input Element for Executive Inquiries */}
              <form 
                onSubmit={handleFormSubmit}
                className="bg-slate-900/80 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-2 shadow-xl backdrop-blur-sm"
              >
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    id="executive-organization-input"
                    type="text"
                    placeholder="Company or Government Entity"
                    value={companyInput}
                    onChange={(e) => setCompanyInput(e.target.value)}
                    className="px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                  <input
                    id="executive-email-input"
                    type="email"
                    required
                    placeholder="executive@domain.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <button
                  id="submit-executive-inquiry-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-5 py-2.5 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 whitespace-nowrap shadow-md"
                >
                  {isSubmitting ? (
                    <span>Opening Dispatch...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {isSubmitted && (
                <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Your inquiry request has been initiated for <strong>{emailInput}</strong>. A pre-addressed formal dispatch to <strong>{contactEmail}</strong> has been opened in your email client.
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Executive Turnaround: Within 4 Business Hours</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confidential Bilateral Handling</span>
                </span>
              </div>
            </div>

            {/* Quick Interactive Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="preview-commodity-catalog-btn"
                onClick={() => setShowCommodityPreview(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-5 py-2.5 rounded-lg font-heading text-xs font-semibold tracking-wider transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Preview Upcoming Trade Catalog</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                id="request-proforma-quote-btn"
                onClick={onRequestQuote}
                className="text-slate-300 hover:text-white px-4 py-2.5 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer underline decoration-slate-600 hover:decoration-amber-400"
              >
                <span>Request Preliminary Proforma Spec</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            </div>

          </div>

          {/* Right Column: Sleek Corporate Contact Card & Strategic Foundations */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Sleek Executive Liaison Card */}
            <div 
              id="executive-contact-card"
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle metallic silver top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-slate-300 to-slate-700" />

              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-heading text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Executive Liaison Card</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Arca Ventures Global • Commercial Directorate
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Liaison Attributes */}
              <div className="space-y-3.5 text-xs font-body">
                
                {/* Formal Inquiries Email Item */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Official Executive Inquiries</span>
                    <span className="text-amber-400 font-semibold">Active Desk</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="font-mono text-sm text-amber-400 hover:text-amber-300 font-bold truncate transition-colors"
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

                {/* Direct Executive Trade Line */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Executive Telephone & WhatsApp</span>
                    <span className="text-emerald-400 font-semibold">Commercial Liaison</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="font-mono text-sm text-slate-200 font-semibold">
                      {COMPANY_DETAILS.contact.phonePrimary}
                    </span>
                    <a
                      href={`https://wa.me/${COMPANY_DETAILS.contact.whatsapp}?text=${encodeURIComponent('Hello Arca Ventures Global Executive Desk, I am reaching out regarding formal partnerships & trade inquiries.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Open WhatsApp
                    </a>
                  </div>
                </div>

                {/* Registered Location */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-slate-400">
                    <span>Corporate Base & Export Hub</span>
                  </div>
                  <div className="flex items-start gap-2 pt-0.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {COMPANY_DETAILS.headquarters.addressLine1}, {COMPANY_DETAILS.headquarters.addressLine2}, {COMPANY_DETAILS.headquarters.state}
                    </span>
                  </div>
                </div>

                {/* Statutory Status Row */}
                <div className="pt-1 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300">Corporate Filings</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">Standard Legals</span>
                  </div>
                </div>

              </div>

              {/* Direct Mail Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <a
                  href={`mailto:${contactEmail}?subject=Executive%20Partnership%20Inquiry%20-%20Arca%20Ventures%20Global`}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold font-heading uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-950" />
                  <span>Email Executive Desk Directly</span>
                </a>
              </div>

            </div>

            {/* Strategic Pillars Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
                <span className="text-[10px] font-heading uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  Pillar 01
                </span>
                <span className="text-xs font-semibold text-slate-200 block">
                  Global Commodities
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  1121 Rice, Spices, Organics & Agro products
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
                <span className="text-[10px] font-heading uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Pillar 02
                </span>
                <span className="text-xs font-semibold text-slate-200 block">
                  B2B Contracts
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Institutional vetting & proforma SLA terms
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Pre-launch Status Banner Bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold">Status: Regulatory Documentation & Filings in Progress</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Domain: arcavenglobal.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Pre-Launch Legal Formalities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Inquiries: {contactEmail}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Commodity Specifications Modal Preview */}
      {showCommodityPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-400">
                  Pre-Launch Commodity Catalog
                </span>
                <h3 className="font-heading text-lg font-bold text-white">
                  Upcoming Trade Commodities & Specifications
                </h3>
              </div>
              <button
                onClick={() => setShowCommodityPreview(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border border-slate-800 hover:border-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Upon statutory clearance and legal filings completion, Arca Ventures Global will commence active commercial dispatch for these premium commodity lines:
            </p>

            <div className="space-y-3">
              {PRODUCTS.slice(0, 5).map((prod) => (
                <div key={prod.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-heading text-xs font-bold text-slate-100 block">
                      {prod.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {prod.category} • Origin: {prod.origin} • Moisture: {prod.moistureContent}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold px-2 py-1 bg-amber-400/10 rounded border border-amber-400/20">
                    {prod.grade}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                To receive complete technical assay sheets, reach: <strong className="text-amber-400">{contactEmail}</strong>
              </span>
              <button
                onClick={() => {
                  setShowCommodityPreview(false);
                  onRequestQuote();
                }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
