import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface MobileInstallBannerProps {
  onOpenPlayStoreGuide: () => void;
}

export const MobileInstallBanner: React.FC<MobileInstallBannerProps> = ({ onOpenPlayStoreGuide }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      onOpenPlayStoreGuide();
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <aside
      id="mobile-install-app-banner"
      aria-label="Install Arcaventure Global App"
      className="bg-gradient-to-r from-[#001233] via-[#002255] to-[#001233] border-b border-amber-500/30 text-white px-3 py-2 sm:py-2.5 relative z-30 transition-all shadow-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF8C00] to-[#FFB703] text-white flex items-center justify-center shrink-0 shadow-xs border border-white/20">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-heading font-bold text-white tracking-wide">
              <span>Arcaventure Global App</span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[9px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
                PWA / Android Ready
              </span>
            </div>
            <p className="text-[11px] text-gray-300 line-clamp-1 font-body">
              Instant B2B quotes, offline catalog & WhatsApp trade desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="install-pwa-action-btn"
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-full bg-[#FF8C00] hover:bg-[#e67e00] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{deferredPrompt ? 'Install App' : 'Play Store & App'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss app banner"
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
