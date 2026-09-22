import React, { useState } from 'react';
import { 
  UserAccount, 
  OrderRecord, 
  OrderStatus, 
  PaymentMethod 
} from '../types';
import { 
  updateCustomerUser, 
  setUserPassword, 
  logoutSession,
  getStoredOrders 
} from '../utils/storage';
import { 
  User, 
  Building, 
  Globe, 
  Phone, 
  Mail, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ClipboardList, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  FileText,
  DollarSign,
  Package,
  Calendar,
  KeyRound,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  orders: OrderRecord[];
  onOrdersUpdated: (orders: OrderRecord[]) => void;
  onOpenPaymentForOrder: (order: OrderRecord) => void;
  onLogout: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  onOrdersUpdated,
  onOpenPaymentForOrder,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'security'>('orders');

  // Profile fields
  const [name, setName] = useState(currentUser?.name || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  // Filter active orders belonging to this customer (exclude soft-deleted trash records)
  const myOrders = orders.filter(ord => 
    !ord.isDeleted && (
      ord.customerId === currentUser.id || 
      ord.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
    )
  );

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserAccount = {
      ...currentUser,
      name: name.trim(),
      company: company.trim(),
      country: country.trim(),
      phone: phone.trim()
    };
    updateCustomerUser(updatedUser);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword.length < 6) {
      setPassError('Password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    const success = setUserPassword(currentUser.id, newPassword);
    if (success) {
      setPassSuccess('Account password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(null), 3000);
    } else {
      setPassError('Failed to update password.');
    }
  };

  const statusColors: Record<OrderStatus, string> = {
    'Order Received': 'bg-amber-100 text-amber-900 border-amber-300',
    'Order Confirmed': 'bg-blue-100 text-blue-900 border-blue-300',
    'Order In-Process': 'bg-purple-100 text-purple-900 border-purple-300',
    'Order Dispatched': 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Order Cancelled': 'bg-red-100 text-red-900 border-red-300',
    'Delivered': 'bg-slate-100 text-slate-800 border-slate-300'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B192C]/80 backdrop-blur-md animate-fadeIn font-body">
      <div 
        id="customer-portal-modal"
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 h-[90vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="bg-[#0B192C] text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                  {currentUser.company || currentUser.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {currentUser.email} • {currentUser.country || 'Global Importer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutSession();
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Consignments & Orders ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>Company Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#0B192C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Account Security</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow bg-slate-50">
          
          {/* TAB 1: MY ORDERS & CONSIGNMENTS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-base">
                    Active Consignments & Commercial Orders
                  </h4>
                  <p className="text-xs text-slate-500">
                    Track real-time shipment status, dispatch turnaround, and settle proforma invoices.
                  </p>
                </div>
              </div>

              {myOrders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-700">No active commercial orders found</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add commodities to your RFQ Cart from the public catalog to request commercial terms and dispatch schedules.
                  </p>
                  <button
                    onClick={onClose}
                    className="py-2 px-4 bg-[#0B192C] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    Browse Export Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((ord) => {
                    const needsPayment = ord.paymentStatus === 'Pending';

                    return (
                      <div
                        key={ord.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5"
                      >
                        {/* Top Line */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-heading font-bold text-slate-900 text-base font-mono">
                              {ord.orderNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[ord.status]}`}>
                              {ord.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Payment Trigger */}
                          <div className="flex items-center gap-2">
                            {ord.status === 'Order Cancelled' ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                <span>Order Cancelled</span>
                              </div>
                            ) : needsPayment ? (
                              <button
                                onClick={() => {
                                  onOpenPaymentForOrder(ord);
                                }}
                                className="py-1.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 animate-pulse"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Pay Invoice (${(ord.totalEstimatedValue || 0).toLocaleString()} USD)</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Payment {ord.paymentStatus}: {ord.paymentReference}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Itemized Line Items */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Consignment Line Items
                            </span>
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                                <div className="font-bold text-slate-800">{it.productName}</div>
                                <div className="text-[11px] text-slate-500 flex justify-between">
                                  <span>SKU: {it.sku}</span>
                                  <span className="font-mono font-bold text-slate-900">{it.quantity} {it.unit}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Destination & Logistics */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Discharge & Incoterm
                            </span>
                            <div className="text-slate-800 font-medium">
                              <strong>Discharge Port:</strong> {ord.destinationPort || 'Direct discharge'}
                            </div>
                            <div className="text-slate-600">
                              <strong>Incoterm:</strong> {ord.incoterm}
                            </div>
                            <div className="text-slate-500 font-mono text-[11px]">
                              Total: ${(ord.totalEstimatedValue || 0).toLocaleString()} USD
                            </div>
                          </div>

                          {/* Dispatch Status / TAT */}
                          <div className="space-y-2">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Logistics Notice & TAT
                            </span>

                            {ord.status === 'Order Cancelled' ? (
                              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-950 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-xs text-red-800">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span>Consignment Cancelled</span>
                                </div>
                                {ord.cancellationReason && (
                                  <div className="text-[11px] text-red-700 italic">
                                    "{ord.cancellationReason}"
                                  </div>
                                )}
                                {ord.cancelledAt && (
                                  <div className="text-[10px] text-red-600 font-mono">
                                    Terminated: {new Date(ord.cancelledAt).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            ) : ord.dispatchTat ? (
                              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-xs">
                                  <Truck className="w-4 h-4 text-emerald-700" />
                                  <span>Estimated Delivery: {ord.dispatchTat}</span>
                                </div>
                                {ord.trackingNumber && (
                                  <div className="font-mono text-[11px] text-emerald-800">
                                    Tracking / BL: <strong>{ord.trackingNumber}</strong>
                                  </div>
                                )}
                                {ord.carrierNotice && (
                                  <div className="text-[11px] text-emerald-700 italic">
                                    "{ord.carrierNotice}"
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                                Consignment is pending dispatch scheduling by the trade desk.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-heading font-bold text-slate-900 text-base">
                  Corporate Profile & Importer Credentials
                </h4>
                <p className="text-xs text-slate-500">
                  Keep your company coordinates updated for bill of lading and export clearance documentation.
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Corporate Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Country of Discharge
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#0B192C] hover:bg-slate-900 text-white font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Save Profile Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-heading font-bold text-slate-900 text-base">
                  Update Account Password
                </h4>
                <p className="text-xs text-slate-500">
                  Update your client login credentials. Password will be securely hashed with enterprise cryptographic salt.
                </p>
              </div>

              {passError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
