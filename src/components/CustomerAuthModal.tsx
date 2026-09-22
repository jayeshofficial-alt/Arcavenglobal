import React, { useState } from 'react';
import { User, Lock, Mail, Building, Globe, Phone, Eye, EyeOff, AlertTriangle, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { getUserByEmail, createCustomerUser, setCurrentSession, getStoredUsers } from '../utils/storage';
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
      const cleanEmail = loginEmail.trim().toLowerCase();
      const user = getUserByEmail(cleanEmail);

      if (!user) {
        setError('No registered customer account found with this email address.');
        return;
      }

      if (user.status === 'suspended') {
        setError('Your account has been temporarily suspended by the administrator. Please contact contact@arcavenglobal.com.');
        return;
      }

      if (user.password !== loginPassword) {
        setError('Incorrect password. Please verify or contact the administrator to reset your password.');
        return;
      }

      // Successful login
      user.lastLogin = new Date().toISOString();
      setCurrentSession(user);
      onLoginSuccess(user);
      onClose();
    }, 300);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regEmail || !regPassword || !regName) {
      setError('Please fill in all mandatory fields.');
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
          country: regCountry.trim() || 'Global',
          phone: regPhone.trim() || '',
          password: regPassword,
          status: 'active',
          notes: 'Self-registered institutional client'
        });

        setSuccessMsg('Account registered successfully! You are now logged in.');
        setCurrentSession(newUser);
        setTimeout(() => {
          onLoginSuccess(newUser);
          onClose();
        }, 800);
      } catch (err: any) {
        setError(err.message || 'Failed to create customer account.');
      }
    }, 400);
  };

  const handleQuickFillCustomer = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="customer-auth-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden font-body text-slate-800 max-h-[90vh] flex flex-col"
      >
        {/* Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#2D5A27] via-emerald-500 to-[#FF8C00]" />

        {/* Header with Mode Tabs */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#2D5A27] block">
              B2B Client Portal
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#001233]">
              {mode === 'login' ? 'Institutional Customer Login' : 'Register New Partner Account'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Access certified trade specifications, manage RFQs, and secure proforma invoices.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-3 flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`pb-3 px-4 font-heading text-xs font-bold uppercase tracking-wider transition-colors relative ${
              mode === 'login'
                ? 'text-[#001233] border-b-2 border-[#001233]'
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
            className={`pb-3 px-4 font-heading text-xs font-bold uppercase tracking-wider transition-colors relative ${
              mode === 'register'
                ? 'text-[#001233] border-b-2 border-[#001233]'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Register Partner Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
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
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27]"
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
                  <span className="text-[11px] text-gray-500">
                    Managed by Admin & User
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
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="customer-login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#001233] hover:bg-slate-900 text-white font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Customer Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#FF8C00]" />
                  </>
                )}
              </button>

              {/* Demo Accounts Quick-Fill Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-heading font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                  ⚡ Demo Customer Credentials (Click to Autofill):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFillCustomer('trader.dubai@gulfcommodities.com', 'Customer@123')}
                    className="p-2 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 block truncate">Rashid (Gulf Commodities)</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Pass: Customer@123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFillCustomer('buyer.rotterdam@euroagri.com', 'Customer@123')}
                    className="p-2 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 block truncate">Jan (EuroAgri B.V.)</span>
                    <span className="text-[10px] text-gray-500 font-mono block">Pass: Customer@123</span>
                  </button>
                </div>
              </div>
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Country of Operation
                  </label>
                  <input
                    type="text"
                    value={regCountry}
                    onChange={(e) => setRegCountry(e.target.value)}
                    placeholder="e.g. Singapore"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                  Set Your Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  You or the administrator can change this password later in account settings.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#2D5A27] hover:bg-[#23471f] text-white font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Switch to Admin Gate */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Arca Ventures Executive Desk?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToAdminLogin();
              }}
              className="text-[#001233] hover:text-[#FF8C00] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Console (jayeshofficial@gmail.com)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
