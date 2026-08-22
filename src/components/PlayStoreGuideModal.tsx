import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Copy,
  ExternalLink,
  Download,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  Globe,
  ArrowRight,
  Info,
  QrCode
} from 'lucide-react';

interface PlayStoreGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickQuote: () => void;
}

export const PlayStoreGuideModal: React.FC<PlayStoreGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenQuickQuote
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'assets' | 'install'>('publish');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const appDescriptionShort =
    'Certified organic fresh vegetables, basmati rice, coconuts & spices export portal.';
  
  const appDescriptionLong = `Arcaventure Global (arcavenglobal.com) is a premier merchant exporter of certified organic fresh vegetables, premium 1121 Basmati rice & non-basmati grains, specialty Indian spices, and natural coconut products.

KEY FEATURES:
• Instant Container RFQ & Quotation Calculator (FOB, CIF, CFR, EXW)
• Certified Organic Fresh Vegetables: Red Onions, G4 Green Chillies, Cavendish Bananas, Fresh Ginger
• Premium Indian Spices: Alleppey Green Cardamom, Guntur Dry Red Chilli, Erode Turmeric, Cumin & Black Pepper
• Coconut Products: Semi-Husked Coconuts, 650g/5kg Coco Peat Blocks, Coconut Shell Charcoal
• APEDA, FSSAI, Spices Board & ISO 9001:2015 Quality Protocols
• Real-time WhatsApp Trade Desk & Logistics Coordination (Nhava Sheva JNPT, Mumbai & Western Corridor)

Head Office: Pimple Gurav, Pune - 411061, Maharashtra, India.
Contact: +91 9860215449 | info@arcavenglobal.com`;

  return (
    <div
      id="play-store-guide-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-body overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="play-store-guide-modal-content"
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#001233] via-[#002255] to-[#001233] p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF8C00] to-[#FFB703] text-white flex items-center justify-center shadow-lg border border-white/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-heading font-bold uppercase tracking-wider border border-emerald-500/30">
                  Android & Google Play Ready
                </span>
                <span className="text-xs text-amber-400 font-bold">PWA / TWA</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
                Arcaventure Global Mobile App & Play Store Hub
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('publish')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'publish'
                  ? 'bg-[#FF8C00] text-white shadow-sm'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🚀 Publish to Google Play
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'assets'
                  ? 'bg-[#FF8C00] text-white shadow-sm'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📋 Store Assets & Details
            </button>
            <button
              onClick={() => setActiveTab('install')}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'install'
                  ? 'bg-[#FF8C00] text-white shadow-sm'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📲 Install on Phone Now
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-700 text-xs sm:text-sm space-y-6">
          {/* TAB 1: HOW TO PUBLISH TO GOOGLE PLAY */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              {/* Recommended 1-Click Method */}
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border-2 border-amber-200 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-heading font-bold text-[#001233] text-sm sm:text-base">
                    <span className="w-6 h-6 rounded-full bg-[#FF8C00] text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Method 1: PWABuilder (Recommended — No Code / 5 Mins)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Official Microsoft & Google Tool
                  </span>
                </div>

                <p className="text-gray-600 mt-2 text-xs leading-relaxed font-body">
                  PWABuilder turns this web application into a fully certified Android App Bundle (<code className="text-[#001233] font-mono bg-amber-100 px-1 rounded">.aab</code>) and APK signed for the Google Play Store in 3 simple steps:
                </p>

                <ol className="mt-3 space-y-2 text-xs list-decimal list-inside text-gray-700 font-body">
                  <li>
                    Open <strong>PWABuilder.com</strong> in your browser:
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#FF8C00] hover:underline font-bold ml-1"
                    >
                      <span>https://www.pwabuilder.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Paste your domain URL: <code className="bg-white px-2 py-0.5 rounded border border-gray-300 font-mono text-[#001233] font-bold">https://arcavenglobal.com</code> and click <strong>Start</strong>.
                  </li>
                  <li>
                    Click <strong>Package for Stores</strong> → select <strong>Google Play (Android)</strong>.
                  </li>
                  <li>
                    Fill in your package name: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300 font-mono font-bold text-[#001233]">com.arcavenglobal.app</code>, set app version (e.g. 1.0.0), and download the signed <code className="bg-white px-1 font-mono font-bold text-[#001233]">.aab</code> package.
                  </li>
                  <li>
                    Upload the downloaded package to your <strong>Google Play Console</strong> dashboard!
                  </li>
                </ol>

                <div className="mt-4 pt-3 border-t border-amber-200/80 flex flex-wrap items-center gap-2">
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#001233] hover:bg-[#002255] text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Launch PWABuilder.com</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF8C00]" />
                  </a>

                  <a
                    href="https://play.google.com/console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white text-xs font-heading font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Open Google Play Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Method 2: Bubblewrap CLI */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-heading font-bold text-[#001233] text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Method 2: Google Bubblewrap CLI (Command-Line TWA)</span>
                </div>

                <p className="text-gray-600 mt-2 text-xs leading-relaxed font-body">
                  If you or your developer prefer building locally via Node.js CLI to generate the Android project directly:
                </p>

                <div className="mt-3 bg-[#001233] text-white p-3 rounded-lg font-mono text-[11px] space-y-1.5 relative overflow-x-auto">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'npm install -g @bubblewrap/cli\nbubblewrap init --manifest=https://arcavenglobal.com/manifest.json\nbubblewrap build',
                        'bubblewrap'
                      )
                    }
                    className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'bubblewrap' ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <p className="text-gray-400"># 1. Install Google's official Bubblewrap tool</p>
                  <p className="text-emerald-400">npm install -g @bubblewrap/cli</p>
                  <p className="text-gray-400 mt-2"># 2. Initialize project from your live manifest</p>
                  <p className="text-emerald-400">
                    bubblewrap init --manifest=https://arcavenglobal.com/manifest.json
                  </p>
                  <p className="text-gray-400 mt-2"># 3. Build signed Android App Bundle (.aab)</p>
                  <p className="text-emerald-400">bubblewrap build</p>
                </div>
              </div>

              {/* Method 3: Google Play Submission Steps */}
              <div className="p-4 sm:p-5 rounded-xl bg-blue-50/60 border border-blue-200">
                <h4 className="font-heading font-bold text-[#001233] text-sm mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Google Play Console Submission Checklist</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Google Developer Account:</strong> $25 one-time registration fee.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Target SDK:</strong> Android 14 / API level 34 (Default).</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Privacy Policy URL:</strong> https://arcavenglobal.com</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Digital Asset Links:</strong> Ready in <code className="text-blue-700">/.well-known/assetlinks.json</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORE LISTING ASSETS & METADATA */}
          {activeTab === 'assets' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-xs font-body">
                Copy and paste these pre-formatted store listing descriptions and assets directly into your Google Play Console store listing page:
              </p>

              {/* App Title */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-gray-700 uppercase tracking-wider">
                    App Title (Max 30 chars)
                  </span>
                  <button
                    onClick={() => copyToClipboard('Arcaventure Global - Food Export', 'title')}
                    className="text-xs text-[#FF8C00] hover:text-[#e67e00] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'title' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-white border border-gray-200 text-xs font-bold text-[#001233]">
                  Arcaventure Global - Food Export
                </div>
              </div>

              {/* Short Description */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-gray-700 uppercase tracking-wider">
                    Short Description (Max 80 chars)
                  </span>
                  <button
                    onClick={() => copyToClipboard(appDescriptionShort, 'short')}
                    className="text-xs text-[#FF8C00] hover:text-[#e67e00] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'short' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-white border border-gray-200 text-xs text-gray-800">
                  {appDescriptionShort}
                </div>
              </div>

              {/* Full Description */}
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-gray-700 uppercase tracking-wider">
                    Full Description (Formatted for Play Store)
                  </span>
                  <button
                    onClick={() => copyToClipboard(appDescriptionLong, 'full')}
                    className="text-xs text-[#FF8C00] hover:text-[#e67e00] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'full' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded bg-white border border-gray-200 text-[11px] text-gray-700 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto">
                  {appDescriptionLong}
                </pre>
              </div>

              {/* Graphics Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <img src="/icon.svg" alt="App Icon" className="w-12 h-12 rounded-xl shadow-xs" />
                  <div>
                    <h5 className="font-heading font-bold text-xs text-[#001233]">High-Res App Icon</h5>
                    <p className="text-[11px] text-gray-500">512 × 512 px PNG (32-bit)</p>
                    <a
                      href="/icon.svg"
                      download="arcaventure-icon.svg"
                      className="text-[11px] text-[#FF8C00] font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Icon</span>
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#001233] to-[#FF8C00] text-white flex items-center justify-center text-[10px] font-bold text-center">
                    1024x500
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-xs text-[#001233]">Feature Graphic</h5>
                    <p className="text-[11px] text-gray-500">1024 × 500 px Banner (JPEG/PNG)</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Included in branding</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSTALL ON PHONE IMMEDIATELY */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-heading font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>How to Install on Android Phone in 10 Seconds</span>
                </h4>
                <ol className="mt-2 space-y-2 text-xs text-emerald-800 list-decimal list-inside font-body">
                  <li>Open <strong>arcavenglobal.com</strong> on your mobile Google Chrome browser.</li>
                  <li>Tap the <strong>three dots menu (⋮)</strong> in the top right corner.</li>
                  <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install App"</strong>.</li>
                  <li>The app will be installed on your Android home screen with the official icon, opening in full-screen standalone mode!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-heading font-bold text-[#001233] text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-700" />
                  <span>How to Install on Apple iPhone (iOS)</span>
                </h4>
                <ol className="mt-2 space-y-2 text-xs text-slate-700 list-decimal list-inside font-body">
                  <li>Open <strong>arcavenglobal.com</strong> in Safari on your iPhone.</li>
                  <li>Tap the <strong>Share button (square with arrow ↑)</strong> at the bottom.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
            <ShieldCheck className="w-4 h-4 text-[#2D5A27]" />
            <span>Official Android App Bundle & PWA specification ready</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenQuickQuote();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white text-xs font-heading font-bold uppercase tracking-wider orange-glow cursor-pointer"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
