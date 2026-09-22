import React, { useState } from 'react';
import { UserAccount, ProductItem } from '../types';
import { setUserPassword, getStoredInquiries, logoutSession } from '../utils/storage';
import { User, Lock, KeyRound, Building, Globe, Mail, Phone, CheckCircle2, AlertTriangle, ShieldCheck, FileText, ArrowRight, X, LogOut } from 'lucide-react';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserUpdated: (user: UserAccount) => void;
  onLogout: () => void;
  onOpenCatalog: () => void;
  onOpenQuickQuote: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  onLogout,
  onOpenCatalog,
  onOpenQuickQuote
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'rfqs'>('profile');
  
  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (currentPass !== currentUser.password) {
      setPassError('The current password entered is incorrect.');
      return;
    }

    if (newPass.length < 6) {
      setPassError('New password must contain at least 6 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);

    setTimeout(() => {
      setIsChangingPass(false);
      const success = setUserPassword(currentUser.id, newPass);
      if (success) {
        setPassSuccess('Your password has been securely updated!');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        onUserUpdated({ ...currentUser, password: newPass });
      } else {
        setPassError('Failed to update password. Please try again.');
      }
    }, 350);
  };

  const customerInquiries = getStoredInquiries().filter(
    inq => inq.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="customer-portal-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden font-body text-slate-800 max-h-[90vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="bg-[#001233] text-white p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-white">
                    {currentUser.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified B2B Client
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{currentUser.company || 'Institutional Partner'}</span>
                  <span>•</span>
                  <span>{currentUser.country || 'Global Trade'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2.5 px-3 text-xs font-heading font-semibold uppercase tracking-wider transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Details
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`pb-2.5 px-3 text-xs font-heading font-semibold uppercase tracking-wider transition-colors relative flex items-center gap-1.5 ${
                activeTab === 'security'
                  ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>

            <button
              onClick={() => setActiveTab('rfqs')}
              className={`pb-2.5 px-3 text-xs font-heading font-semibold uppercase tracking-wider transition-colors relative flex items-center gap-1.5 ${
                activeTab === 'rfqs'
                  ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Trade Inquiries ({customerInquiries.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-heading uppercase tracking-wider font-semibold">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>Registered Email</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 font-mono">{currentUser.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-heading uppercase tracking-wider font-semibold">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    <span>Company Name</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{currentUser.company || 'Not Specified'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-heading uppercase tracking-wider font-semibold">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span>Country of Port</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{currentUser.country || 'Global'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-heading uppercase tracking-wider font-semibold">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>Phone / WhatsApp</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{currentUser.phone || '+91 9860215449'}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-heading font-bold text-[#2D5A27] text-sm">
                    Ready to initiate a container-level order?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Browse our live listed export catalog with certified phytosanitary standards.
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCatalog();
                    }}
                    className="flex-1 sm:flex-initial py-2 px-3.5 bg-[#2D5A27] hover:bg-[#23471f] text-white rounded-lg text-xs font-bold font-heading uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Catalog
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQuickQuote();
                    }}
                    className="flex-1 sm:flex-initial py-2 px-3.5 bg-[#FF8C00] hover:bg-[#e67e00] text-white rounded-lg text-xs font-bold font-heading uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Direct RFQ
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading text-base font-bold text-[#001233]">
                  Set / Change Your Account Password
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your personal client portal credentials. Note: The administrator can also securely reset your password if requested.
                </p>
              </div>

              {passError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="py-2.5 px-5 bg-[#001233] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isChangingPass ? 'Updating...' : 'Save New Password'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'rfqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#001233]">
                    Your Submitted Quotes & Requests
                  </h3>
                  <p className="text-xs text-gray-500">
                    Track the progress of your institutional commercial inquiries.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenQuickQuote();
                  }}
                  className="py-1.5 px-3 bg-[#FF8C00] hover:bg-[#e67e00] text-white rounded-lg text-xs font-bold font-heading uppercase tracking-wider transition-colors cursor-pointer"
                >
                  + New RFQ
                </button>
              </div>

              {customerInquiries.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">No quote requests recorded yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Submit an RFQ or add products to your quotation basket.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerInquiries.map((inq) => (
                    <div key={inq.id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#001233]">{inq.productName || 'General Commodity RFQ'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                          {inq.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold text-slate-700">Volume:</span> {inq.quantity || 'Container Load'}
                      </div>
                      <p className="text-xs text-gray-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{inq.message}"
                      </p>
                      <div className="text-[11px] text-gray-400">
                        Submitted on: {inq.date} • Handled by Pune Trade Desk
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
