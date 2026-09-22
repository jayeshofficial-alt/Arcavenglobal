import React, { useState } from 'react';
import { User, Lock, Mail, Building, Globe, Phone, Eye, EyeOff, AlertTriangle, CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { 
  getUserByEmail, 
  createCustomerUser, 
  authenticateUser,
  SUPER_ADMIN_IDENTITY 
} from '../utils/storage';
import { UserAccount } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (customer: UserAccount) => void;
  onSwitchToAdminLogin: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToAdminLogin
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = authenticateUser(loginEmail, loginPassword);

      if (!res.success || !res.user) {
        setError(res.error || 'Invalid corporate email or password.');
        return;
      }

      onLoginSuccess(res.user);
      onClose();
    }, 350);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regEmail || !regPassword || !regName) {
      setError('Please provide all mandatory fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      try {
        const newUser = createCustomerUser({
          email: regEmail.trim(),
          name: regName.trim(),
          company: regCompany.trim() || 'Institutional Partner',
          country: regCountry.trim() || 'International',
          phone: regPhone.trim() || '',
          password: regPassword,
          status: 'active',
          notes: 'Registered via Customer Portal'
        });

        // Auto authenticate and issue session
        const auth = authenticateUser(regEmail.trim(), regPassword);
        setSuccessMsg('Account registered successfully! Access granted.');
        setTimeout(() => {
          if (auth.user) onLoginSuccess(auth.user);
          else onLoginSuccess(newUser);
          onClose();
        }, 600);
      } catch (err: any) {
        setError(err.message || 'Failed to create partner account.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="customer-auth-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden font-body text-slate-800 max-h-[90vh] flex flex-col"
      >
        {/* Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#0B192C] via-emerald-600 to-amber-500" />

        {/* Header with Mode Tabs */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-emerald-700">
                Institutional Client Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                Verified B2B
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0B192C] mt-1">
              {mode === 'login' ? 'Client Account Sign In' : 'Register Institutional Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review active export quotes, track container consignments, and complete secure payments.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-3 flex border-b border-gray-100 bg-white">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`pb-3 px-4 font-heading text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              mode === 'login'
                ? 'text-[#0B192C] border-b-2 border-[#0B192C]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`pb-3 px-4 font-heading text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              mode === 'register'
                ? 'text-[#0B192C] border-b-2 border-[#0B192C]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Register Partner Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label 
                  htmlFor="customer-login-email"
                  className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider"
                >
                  Corporate Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="customer-login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="partner@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="customer-login-password"
                    className="block text-xs font-semibold text-slate-700 font-heading uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Encrypted Session Auth
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="customer-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C] focus:ring-1 focus:ring-[#0B192C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="customer-login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-white font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70 shadow-md"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Sign In to Customer Dashboard</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Company / Entity *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="e.g. Vance Trading Corp"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="m.vance@vancetrading.com"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Country of Discharge
                  </label>
                  <input
                    type="text"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    placeholder="e.g. Singapore"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Direct Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+65 6789 0123"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                  Create Account Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Credentials are cryptographically salted and hashed.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70 mt-2 shadow-md"
              >
                {isSubmitting ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Verified Customer Account</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch to Admin Gate */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Executive Governance:</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToAdminLogin();
              }}
              className="text-[#0B192C] hover:text-amber-600 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Super Admin Gate ({SUPER_ADMIN_IDENTITY})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
