import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, Mail, Eye, EyeOff, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { 
  SUPER_ADMIN_IDENTITY, 
  isSuperAdminIdentity, 
  getUserByEmail, 
  verifyPassword,
  setCurrentSession, 
  generateSimulatedJwt 
} from '../utils/storage';
import { UserAccount } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminUser: UserAccount) => void;
  onSwitchToCustomerLogin: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToCustomerLogin
}) => {
  const [identity, setIdentity] = useState(SUPER_ADMIN_IDENTITY);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanIdentity = identity.trim().toLowerCase();
    
    // Strict restriction: Super Admin access is strictly reserved for designated identity jayeshofficial.com
    if (!isSuperAdminIdentity(cleanIdentity)) {
      setError(`Access Denied: Administrative privileges are strictly reserved for the designated super admin (${SUPER_ADMIN_IDENTITY}).`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user = getUserByEmail(cleanIdentity);

      if (!user || user.role !== 'admin') {
        setError(`Administrative record for ${cleanIdentity} was not located.`);
        return;
      }

      if (!verifyPassword(password, user.passwordHash)) {
        setError('Authentication failed. Invalid master administrative credentials.');
        return;
      }

      // Successful login - create simulated JWT session
      const token = generateSimulatedJwt(user);
      user.lastLogin = new Date().toISOString();
      user.token = token;
      
      setCurrentSession(user);
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="admin-login-modal"
        className="relative w-full max-w-md bg-[#0B192C] text-white rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden"
      >
        {/* Top Metallic Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-heading uppercase tracking-wider text-amber-400 font-bold block">
                  Root Governance
                </span>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Super Admin Console
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Access Policy Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-heading text-[11px] uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Restricted Super Admin Entity</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Administrative oversight is cryptographically restricted to verified identity: <strong className="text-amber-400 font-mono">{SUPER_ADMIN_IDENTITY}</strong>.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-red-300">Access Denied</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="admin-identity-field"
                className="block text-xs font-semibold text-slate-300 mb-1.5 font-heading uppercase tracking-wider"
              >
                Super Admin Identity
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-identity-field"
                  type="text"
                  required
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="jayeshofficial.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password-field"
                  className="block text-xs font-semibold text-slate-300 font-heading uppercase tracking-wider"
                >
                  Master Administrative Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-field"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-98 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <span>Verifying Cryptographic Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate to /admin</span>
                </>
              )}
            </button>
          </form>

          {/* Customer Portal Link */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Are you an institutional client?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToCustomerLogin();
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <span>Client Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
