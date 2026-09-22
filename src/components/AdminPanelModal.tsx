import React, { useState, useMemo } from 'react';
import { 
  ProductItem, 
  UserAccount, 
  CustomerInquiry, 
  OrderRecord, 
  OrderStatus, 
  PaymentMethod,
  SiteContent,
  BankingSettings
} from '../types';
import { 
  SUPER_ADMIN_IDENTITY, 
  isSuperAdminIdentity,
  saveProducts, 
  getStoredUsers, 
  saveUsers, 
  setUserPassword, 
  createCustomerUser, 
  updateCustomerUser, 
  deleteCustomerUser, 
  toggleCustomerStatus,
  deleteProduct,
  updateProduct,
  addProduct,
  resetProductsToDefault,
  getStoredOrders,
  saveOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  getStoredBankingSettings,
  saveBankingSettings,
  resetBankingSettings,
  DEFAULT_BANKING_SETTINGS,
  getStoredSiteContent,
  saveSiteContent,
  resetSiteContent,
  logoutSession
} from '../utils/storage';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Users, 
  KeyRound, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Image as ImageIcon, 
  RotateCcw, 
  Copy, 
  Lock, 
  LogOut, 
  ExternalLink,
  ClipboardList,
  FileText,
  DollarSign,
  Truck,
  Clock,
  Eye,
  Check,
  Send,
  Sliders,
  Building,
  CreditCard,
  QrCode,
  Smartphone,
  Save,
  Ban
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  products: ProductItem[];
  onProductsUpdated: (products: ProductItem[]) => void;
  siteContent: SiteContent;
  onSiteContentUpdated: (content: SiteContent) => void;
  orders: OrderRecord[];
  onOrdersUpdated: (orders: OrderRecord[]) => void;
  bankingSettings?: BankingSettings;
  onBankingSettingsUpdated?: (settings: BankingSettings) => void;
  onLogout: () => void;
}

// Preset curated images for easy 1-click image replacement
const CURATED_IMAGE_PRESETS = [
  { label: 'Fresh Mature Coconuts', url: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Red Nashik Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Organic Ginger Roots', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80' },
  { label: '1121 Basmati Rice Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Whole Indian Turmeric Fingers', url: 'https://images.unsplash.com/photo-1615485290161-5ef214041b63?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Green Malabar Cardamom', url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Export Coir Peat & Pith', url: 'https://images.unsplash.com/photo-1599818816942-0f0c05caad80?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Red Chilli Guntur Teja', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1000&q=80' }
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  products,
  onProductsUpdated,
  siteContent,
  onSiteContentUpdated,
  orders,
  onOrdersUpdated,
  bankingSettings: propBankingSettings,
  onBankingSettingsUpdated,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'content' | 'customers' | 'banking' | 'security'>('orders');
  
  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  
  // Confirmation & Dispatch Transition Modals
  const [confirmingOrder, setConfirmingOrder] = useState<OrderRecord | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState('');
  
  const [dispatchingOrder, setDispatchingOrder] = useState<OrderRecord | null>(null);
  const [dispatchTatInput, setDispatchTatInput] = useState('3–5 business days via BlueDart Air');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierNoticeInput, setCarrierNoticeInput] = useState('Customs cleared and freight carrier assigned.');

  // Order Cancellation & Deletion Safeguard Modals
  const [cancellingOrder, setCancellingOrder] = useState<OrderRecord | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState('Consignment requirement revised by consignee.');
  const [deletingOrder, setDeletingOrder] = useState<OrderRecord | null>(null);

  // Banking Settings State
  const [bankingForm, setBankingForm] = useState<BankingSettings>(() => propBankingSettings || getStoredBankingSettings());

  // Product state
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'listed' | 'delisted'>('all');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Site Content State
  const [localContent, setLocalContent] = useState<SiteContent>(siteContent);

  // Customer state
  const [usersList, setUsersList] = useState<UserAccount[]>(() => getStoredUsers());
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [targetUserForPassword, setTargetUserForPassword] = useState<UserAccount | null>(null);
  const [newPasswordForUser, setNewPasswordForUser] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null);

  // Admin changing own password
  const [adminCurrentPass, setAdminCurrentPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Notification toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // STRICT ACCESS CHECK: Only verified designated super admin (jayeshofficial.com)
  const isAuthorizedSuperAdmin = 
    currentUser && 
    currentUser.role === 'admin' && 
    isSuperAdminIdentity(currentUser.email);

  if (!isOpen) return null;

  if (!isAuthorizedSuperAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/85 backdrop-blur-md animate-fadeIn font-body">
        <div className="max-w-md w-full bg-[#0B192C] border border-red-500/50 rounded-2xl p-6 sm:p-8 text-white space-y-4 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white">
            Administrative Access Denied
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Admin console and `/admin` routes are strictly restricted to the verified Super Admin entity:
            <br />
            <strong className="text-amber-400 font-mono text-sm block mt-1">{SUPER_ADMIN_IDENTITY}</strong>
          </p>
          <div className="pt-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close & Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (ord.company && ord.company.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (ord.destinationPort && ord.destinationPort.toLowerCase().includes(orderSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (orderFilter !== 'all' && ord.status !== orderFilter) return false;
    return true;
  });

  // Filtered Products
  const filteredProducts = products.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      prod.origin.toLowerCase().includes(productSearch.toLowerCase()) ||
      prod.grade.toLowerCase().includes(productSearch.toLowerCase()) ||
      (prod.sku && prod.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
      prod.categoryLabel.toLowerCase().includes(productSearch.toLowerCase());
    
    if (!matchesSearch) return false;

    if (productFilter === 'listed') return !prod.isDelisted;
    if (productFilter === 'delisted') return !!prod.isDelisted;
    return true;
  });

  // Filtered Customers
  const filteredCustomers = usersList.filter(u => {
    if (isSuperAdminIdentity(u.email)) return false; // Show only customers in directory
    return (
      u.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (u.country && u.country.toLowerCase().includes(customerSearch.toLowerCase()))
    );
  });

  // Status flow handler
  const handleStatusChangeRequest = (order: OrderRecord, nextStatus: OrderStatus) => {
    if (nextStatus === 'Order Confirmed') {
      // Prompt for verified Payment Reference Number
      setConfirmingOrder(order);
      setPaymentRefInput(order.paymentReference || '');
    } else if (nextStatus === 'Order Dispatched') {
      // Trigger Estimated Delivery TAT / Tracking notice input
      setDispatchingOrder(order);
      setDispatchTatInput(order.dispatchTat || '3–5 business days via BlueDart Air');
      setTrackingNumberInput(order.trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setCarrierNoticeInput(order.carrierNotice || 'Cleared at export terminal; maritime freight transit commenced.');
    } else if (nextStatus === 'Order Cancelled') {
      // Trigger Order Cancellation Modal
      setCancellingOrder(order);
      setCancellationReasonInput(order.cancellationReason || 'Consignment requirement revised by client / quota adjustment.');
    } else {
      // Direct update
      const updated = updateOrderStatus(order.id, nextStatus);
      const allOrders = getStoredOrders();
      onOrdersUpdated(allOrders);
      showToast(`Order #${order.orderNumber} status transitioned to "${nextStatus}".`);
    }
  };

  const handleSaveConfirmedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmingOrder) return;

    if (!paymentRefInput.trim()) {
      alert('A verified Payment Reference Number is mandatory to confirm this order.');
      return;
    }

    const updated = updateOrderStatus(confirmingOrder.id, 'Order Confirmed', {
      paymentReference: paymentRefInput.trim()
    });

    const allOrders = getStoredOrders();
    onOrdersUpdated(allOrders);
    showToast(`Order #${confirmingOrder.orderNumber} confirmed with verified payment ref ${paymentRefInput.trim()}`);
    setConfirmingOrder(null);
    setPaymentRefInput('');
  };

  const handleSaveDispatchedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder) return;

    if (!dispatchTatInput.trim()) {
      alert('Estimated Delivery TAT is required for dispatched orders.');
      return;
    }

    const updated = updateOrderStatus(dispatchingOrder.id, 'Order Dispatched', {
      dispatchTat: dispatchTatInput.trim(),
      trackingNumber: trackingNumberInput.trim(),
      carrierNotice: carrierNoticeInput.trim()
    });

    const allOrders = getStoredOrders();
    onOrdersUpdated(allOrders);
    showToast(`Order #${dispatchingOrder.orderNumber} marked as DISPATCHED (TAT: ${dispatchTatInput.trim()})`);
    setDispatchingOrder(null);
  };

  const handleSaveCancelledOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    if (!cancellationReasonInput.trim()) {
      alert('Please specify a cancellation reason.');
      return;
    }

    cancelOrder(cancellingOrder.id, cancellationReasonInput.trim());
    const allOrders = getStoredOrders();
    onOrdersUpdated(allOrders);
    showToast(`Order #${cancellingOrder.orderNumber} marked as CANCELLED.`);
    setCancellingOrder(null);
    setCancellationReasonInput('');
  };

  const handleConfirmDeleteOrder = () => {
    if (!deletingOrder) return;
    deleteOrder(deletingOrder.id);
    const allOrders = getStoredOrders();
    onOrdersUpdated(allOrders);
    showToast(`Order #${deletingOrder.orderNumber} permanently deleted.`);
    setDeletingOrder(null);
  };

  // Banking Settings Actions
  const handleSaveBankingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveBankingSettings(bankingForm);
    onBankingSettingsUpdated?.(bankingForm);
    showToast('Payment gateway & banking settings saved! Reflected in all checkout views.');
  };

  const handleResetBankingSettings = () => {
    if (window.confirm('Reset payment gateway and banking credentials to default Jayesh Wagh (wagh.jayesh@oksbi) configuration?')) {
      const restored = resetBankingSettings();
      setBankingForm(restored);
      onBankingSettingsUpdated?.(restored);
      showToast('Banking settings restored to default.');
    }
  };

  // Product Actions
  const handleToggleDelist = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const nextState = !p.isDelisted;
        showToast(nextState ? `Product '${p.name}' archived (delisted).` : `Product '${p.name}' listed (live).`);
        return { ...p, isDelisted: nextState };
      }
      return p;
    });
    saveProducts(updated);
    onProductsUpdated(updated);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete '${productName}'?`)) {
      const updated = deleteProduct(productId);
      onProductsUpdated(updated);
      showToast(`Product '${productName}' removed from catalog.`);
    }
  };

  const handleSaveProductEdit = (productData: ProductItem) => {
    let updated: ProductItem[];
    if (isCreatingProduct) {
      updated = addProduct(productData);
      showToast(`New commodity '${productData.name}' created and listed!`);
    } else {
      updated = updateProduct(productData);
      showToast(`Product '${productData.name}' updated successfully!`);
    }
    onProductsUpdated(updated);
    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  const handleResetProducts = () => {
    if (window.confirm('Reset all commodities back to factory default specifications?')) {
      const restored = resetProductsToDefault();
      onProductsUpdated(restored);
      showToast('Commodity catalog restored to defaults.');
    }
  };

  // Content Actions
  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteContent(localContent);
    onSiteContentUpdated(localContent);
    showToast('Site content and legal notices updated live!');
  };

  const handleResetContent = () => {
    if (window.confirm('Reset hero banners, contact details, and disclaimers to factory defaults?')) {
      const reset = resetSiteContent();
      setLocalContent(reset);
      onSiteContentUpdated(reset);
      showToast('Site content restored to defaults.');
    }
  };

  // Customer Actions
  const handleToggleCustomerStatus = (userId: string) => {
    const updated = toggleCustomerStatus(userId);
    setUsersList(updated);
    const target = updated.find(u => u.id === userId);
    showToast(`Customer account is now ${target?.status.toUpperCase()}`);
  };

  const handleDeleteCustomer = (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete customer account for ${email}?`)) {
      try {
        const updated = deleteCustomerUser(userId);
        setUsersList(updated);
        showToast(`Customer account ${email} removed.`);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleAdminSetPasswordForUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForPassword) return;

    if (newPasswordForUser.trim().length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    const success = setUserPassword(targetUserForPassword.id, newPasswordForUser.trim());
    if (success) {
      const updated = getStoredUsers();
      setUsersList(updated);
      setPasswordChangeSuccess(`Password for ${targetUserForPassword.email} has been updated.`);
      setTimeout(() => {
        setTargetUserForPassword(null);
        setNewPasswordForUser('');
        setPasswordChangeSuccess(null);
        showToast(`Password updated for user ${targetUserForPassword.email}`);
      }, 1500);
    }
  };

  const handleAdminSelfPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg(null);

    if (adminNewPass.length < 6) {
      setAdminPassMsg({ type: 'error', text: 'New password must have at least 6 characters.' });
      return;
    }

    if (adminNewPass !== adminConfirmPass) {
      setAdminPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const success = setUserPassword(SUPER_ADMIN_IDENTITY, adminNewPass);
    if (success) {
      setAdminPassMsg({ type: 'success', text: `Super Admin master credentials for ${SUPER_ADMIN_IDENTITY} updated!` });
      setAdminCurrentPass('');
      setAdminNewPass('');
      setAdminConfirmPass('');
      showToast('Master admin password updated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0B192C]/85 backdrop-blur-md animate-fadeIn font-body">
      <div 
        id="admin-panel-modal"
        className="relative w-full max-w-6xl bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden text-slate-800 h-[94vh] flex flex-col"
      >
        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute top-4 right-4 z-50 bg-[#0B192C] text-amber-400 border border-amber-400/40 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Master Dark Top Bar */}
        <div className="bg-[#0B192C] text-white px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-white tracking-tight">
                  Arca Ventures Global <span className="text-amber-400 font-normal">| Super Admin Console</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                  /admin
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Verified Root Super Admin:</span>
                <strong className="text-amber-400 font-mono">{SUPER_ADMIN_IDENTITY}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Store View"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Store</span>
            </button>

            <button
              onClick={() => {
                logoutSession();
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              aria-label="Close Admin Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
              <span>Order & RFQ Command ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Catalog & CRUD ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Site Content & Disclaimers</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Customer Accounts ({filteredCustomers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('banking')}
              className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'banking'
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Payment Gateway & Banking</span>
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
              <span>Security & Passwords</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow bg-slate-50">
          
          {/* TAB 1: ORDER & RFQ COMMAND CENTER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Order Controls Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search order #, customer, company, port..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>

                  {/* Filter Status Selector */}
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0B192C]"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="Order Received">Order Received</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Order In-Process">Order In-Process</option>
                    <option value="Order Dispatched">Order Dispatched</option>
                    <option value="Order Cancelled">Order Cancelled</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>Pending Confirmation: <strong className="text-amber-600 font-bold">{orders.filter(o => o.status === 'Order Received').length}</strong></span>
                  <span>•</span>
                  <span>In-Process / Dispatched: <strong className="text-emerald-700 font-bold">{orders.filter(o => o.status === 'Order In-Process' || o.status === 'Order Dispatched').length}</strong></span>
                </div>
              </div>

              {/* Orders Listing */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400 text-xs">
                    No orders or RFQs match your filter criteria.
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const statusColors: Record<OrderStatus, string> = {
                      'Order Received': 'bg-amber-100 text-amber-900 border-amber-300',
                      'Order Confirmed': 'bg-blue-100 text-blue-900 border-blue-300',
                      'Order In-Process': 'bg-purple-100 text-purple-900 border-purple-300',
                      'Order Dispatched': 'bg-emerald-100 text-emerald-900 border-emerald-300',
                      'Order Cancelled': 'bg-red-100 text-red-900 border-red-300',
                      'Delivered': 'bg-slate-100 text-slate-800 border-slate-300'
                    };

                    return (
                      <div 
                        key={ord.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
                      >
                        {/* Top Line */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-heading font-bold text-slate-900 text-base font-mono">
                              {ord.orderNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusColors[ord.status]}`}>
                              {ord.status}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Status Transition Control Dropdown & Permanent Deletion Safeguard */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 font-semibold font-heading uppercase">
                              Update Flow:
                            </span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChangeRequest(ord, e.target.value as OrderStatus)}
                              className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-[#0B192C] focus:outline-none focus:border-[#0B192C] cursor-pointer"
                            >
                              <option value="Order Received">Order Received</option>
                              <option value="Order Confirmed">Order Confirmed (Verify Payment Ref)</option>
                              <option value="Order In-Process">Order In-Process</option>
                              <option value="Order Dispatched">Order Dispatched (Set Delivery TAT)</option>
                              <option value="Order Cancelled">Order Cancelled (Record Reason)</option>
                              <option value="Delivered">Delivered</option>
                            </select>

                            <button
                              onClick={() => setDeletingOrder(ord)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Permanently Delete Order Safeguard"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Middle Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Client Metadata */}
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                              Client & Destination
                            </span>
                            <div className="font-bold text-slate-900">{ord.customerName}</div>
                            <div className="text-slate-600 font-medium">{ord.company || 'Consignee Entity'}</div>
                            <div className="text-slate-500 font-mono text-[11px]">{ord.customerEmail} • {ord.customerPhone || 'N/A'}</div>
                            <div className="text-slate-600 mt-1">
                              <strong>Discharge:</strong> {ord.destinationPort || 'Direct Port'} ({ord.incoterm})
                            </div>
                          </div>

                          {/* Line Items */}
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                              Itemized Commodities
                            </span>
                            <div className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                                  <div className="font-bold text-slate-800">{it.productName}</div>
                                  <div className="text-[11px] text-slate-500 flex justify-between">
                                    <span>SKU: {it.sku || 'N/A'}</span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {it.quantity} {it.unit}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Commercial Settlement & Logistics */}
                          <div className="space-y-2">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                                Commercial Settlement
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 font-mono text-sm">
                                  ${(ord.totalEstimatedValue || 0).toLocaleString()} USD
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                  ord.paymentStatus === 'Verified' 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : ord.paymentStatus === 'Paid'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  Payment: {ord.paymentStatus}
                                </span>
                              </div>
                              {ord.paymentReference && (
                                <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                                  Ref: <strong className="text-slate-900">{ord.paymentReference}</strong> ({ord.paymentMethod || 'Wire/Online'})
                                </div>
                              )}
                            </div>

                            {/* Dispatch TAT & Notice */}
                            {ord.dispatchTat && (
                              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-0.5">
                                <div className="font-bold flex items-center gap-1">
                                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>TAT: {ord.dispatchTat}</span>
                                </div>
                                {ord.trackingNumber && (
                                  <div className="font-mono text-[10px]">Tracking/BL: {ord.trackingNumber}</div>
                                )}
                              </div>
                            )}

                            {ord.cancellationReason && (
                              <div className="p-2 rounded bg-red-50 border border-red-200 text-red-900 text-[11px] space-y-0.5">
                                <div className="font-bold flex items-center gap-1 text-red-800">
                                  <Ban className="w-3.5 h-3.5 text-red-600" />
                                  <span>Cancellation: {ord.cancellationReason}</span>
                                </div>
                                {ord.cancelledAt && (
                                  <div className="text-[10px] text-red-600 font-mono">
                                    Terminated on {new Date(ord.cancelledAt).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            )}

                            {ord.clientNotes && (
                              <div className="text-[11px] text-slate-500 italic">
                                "{ord.clientNotes}"
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Product Controls Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search commodities, SKU, origin, grade..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                    <button
                      onClick={() => setProductFilter('all')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                        productFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      All ({products.length})
                    </button>
                    <button
                      onClick={() => setProductFilter('listed')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                        productFilter === 'listed' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      Listed ({products.filter(p => !p.isDelisted).length})
                    </button>
                    <button
                      onClick={() => setProductFilter('delisted')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                        productFilter === 'delisted' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      Delisted/Archived ({products.filter(p => p.isDelisted).length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetProducts}
                    className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCreatingProduct(true);
                      setEditingProduct({
                        id: `prod-${Date.now()}`,
                        sku: `AVG-NEW-${Math.floor(100 + Math.random() * 900)}`,
                        name: '',
                        category: 'vegetables-fruits',
                        categoryLabel: 'Fruits & Vegetables',
                        origin: 'Maharashtra & Southern India',
                        imageUrl: CURATED_IMAGE_PRESETS[0].url,
                        shortDescription: '',
                        fullDescription: '',
                        priceMode: 'indicative',
                        indicativePrice: '$950 / MT CIF',
                        moistureContent: 'Below 10%',
                        purity: '99.5% Export Grade',
                        shelfLife: '60 Days',
                        grade: 'Grade A Export',
                        packagingOptions: ['PP Bags (25kg)', 'Jute Gunny Bags', 'Custom Master Cartons'],
                        moq: '1 x 20ft FCL',
                        loadAbility: '24 MT per 40ft Container',
                        exportPorts: ['JNPT Nhava Sheva', 'Mundra Port'],
                        certifications: ['APEDA', 'FSSAI', 'Phytosanitary'],
                        highlights: ['Export Grade', 'Strictly Sorted'],
                        isDelisted: false
                      });
                    }}
                    className="py-2 px-4 rounded-lg bg-[#0B192C] hover:bg-slate-900 text-amber-400 text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Commodity</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => {
                  const isDelisted = !!prod.isDelisted;
                  return (
                    <div 
                      key={prod.id} 
                      className={`bg-white rounded-xl border transition-all duration-200 p-4 flex flex-col justify-between shadow-xs ${
                        isDelisted 
                          ? 'border-amber-300 bg-amber-50/20 opacity-85' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Image Preview with Status Badge */}
                        <div className="relative h-44 rounded-lg overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${isDelisted ? 'grayscale-[40%]' : ''}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = CURATED_IMAGE_PRESETS[0].url;
                            }}
                          />
                          
                          <div className="absolute top-2.5 left-2.5">
                            {isDelisted ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider font-heading shadow-md">
                                Archived / Delisted
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider font-heading shadow-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                                Listed (Live)
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                            {prod.sku || 'SKU-PENDING'}
                          </div>
                        </div>

                        {/* Title & Category */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-heading uppercase tracking-wider font-bold text-emerald-800">
                              {prod.categoryLabel}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-amber-700">
                              {prod.priceMode === 'rfq_only' ? 'RFQ Only' : (prod.indicativePrice || 'Indicative')}
                            </span>
                          </div>

                          <h3 className="font-heading font-bold text-slate-900 text-base leading-snug line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {prod.shortDescription}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase">Origin</span>
                            <span className="font-medium truncate block">{prod.origin}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase">MOQ</span>
                            <span className="font-medium truncate block">{prod.moq}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions Bottom Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleDelist(prod.id)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isDelisted
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          }`}
                        >
                          {isDelisted ? 'Restore to Catalog' : 'Archive (Delist)'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setIsCreatingProduct(false);
                              setEditingProduct(prod);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Specifications, SKU, Price & Image"
                          >
                            <Edit3 className="w-4 h-4 text-blue-600" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SITE CONTENT EDITOR */}
          {activeTab === 'content' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-600 block">
                      Live Portal Content Manager
                    </span>
                    <h3 className="font-heading text-lg font-bold text-slate-900">
                      Edit Hero Banners, Legal Disclaimers & Contact Coordinates
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Directly updates live copy across arcavenglobal.com headers, compliance footers, and contact sections.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetContent}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Content Defaults</span>
                  </button>
                </div>

                <form onSubmit={handleSaveSiteContent} className="space-y-5">
                  {/* Hero Section Copy */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Hero Banner & Value Proposition</span>
                    </h4>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Hero Trust Badge
                      </label>
                      <input
                        type="text"
                        value={localContent.heroBadge}
                        onChange={(e) => setLocalContent({ ...localContent, heroBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={localContent.heroHeadline}
                        onChange={(e) => setLocalContent({ ...localContent, heroHeadline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Subheadline Description
                      </label>
                      <textarea
                        rows={3}
                        value={localContent.heroSubheadline}
                        onChange={(e) => setLocalContent({ ...localContent, heroSubheadline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Hero Tagline / Operational Pillars
                      </label>
                      <input
                        type="text"
                        value={localContent.heroTagline}
                        onChange={(e) => setLocalContent({ ...localContent, heroTagline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Legal Disclaimers & Compliance */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Legal Disclaimers & Export Compliance Notice</span>
                    </h4>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Export Trade Disclaimer
                      </label>
                      <textarea
                        rows={2}
                        value={localContent.legalDisclaimer}
                        onChange={(e) => setLocalContent({ ...localContent, legalDisclaimer: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Regulatory & Certification Statement (APEDA / FSSAI / Spices Board)
                      </label>
                      <textarea
                        rows={2}
                        value={localContent.exportRegulatoryNotice}
                        onChange={(e) => setLocalContent({ ...localContent, exportRegulatoryNotice: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Contact Coordinates */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>Corporate Contact Addresses & Coordinates</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Headquarters Address
                        </label>
                        <input
                          type="text"
                          value={localContent.contactAddress}
                          onChange={(e) => setLocalContent({ ...localContent, contactAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Export Terminals / Ports
                        </label>
                        <input
                          type="text"
                          value={localContent.contactTerminal}
                          onChange={(e) => setLocalContent({ ...localContent, contactTerminal: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Trade Desk Phone
                        </label>
                        <input
                          type="text"
                          value={localContent.contactPhone}
                          onChange={(e) => setLocalContent({ ...localContent, contactPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Official Email
                        </label>
                        <input
                          type="email"
                          value={localContent.contactEmail}
                          onChange={(e) => setLocalContent({ ...localContent, contactEmail: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Trade Desk Hours
                        </label>
                        <input
                          type="text"
                          value={localContent.contactHours}
                          onChange={(e) => setLocalContent({ ...localContent, contactHours: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save and Publish Content to Public Website</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search customer by name, email, company..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <button
                  onClick={() => setIsCreatingCustomer(true)}
                  className="py-2 px-4 rounded-lg bg-[#0B192C] hover:bg-slate-900 text-amber-400 text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Customer Account</span>
                </button>
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-heading uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Customer Name & Entity</th>
                      <th className="py-3 px-4">Corporate Contact</th>
                      <th className="py-3 px-4">Registered Date</th>
                      <th className="py-3 px-4">Access Status</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No matching customer accounts found.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                            <div className="text-slate-500 font-medium">{user.company || 'Private Trading Entity'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{user.country || 'International'}</div>
                            <div className="text-slate-400 text-[11px] font-mono">{user.phone || 'No direct phone'}</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleCustomerStatus(user.id)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                user.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                              }`}
                            >
                              {user.status} (Toggle)
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setTargetUserForPassword(user);
                                  setNewPasswordForUser('');
                                }}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                                title="Reset access credentials"
                              >
                                <KeyRound className="w-3 h-3 text-amber-600" />
                                <span>Reset Password</span>
                              </button>

                              <button
                                onClick={() => handleDeleteCustomer(user.id, user.email)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                                title="Delete user account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PAYMENT GATEWAY & BANKING SETTINGS */}
          {activeTab === 'banking' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-600 block">
                        Commercial Settlement Gateway
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Live Synchronized
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 mt-0.5">
                      Payment Gateway & Banking Settings
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure the active receiver UPI ID, primary Bank Account Number, IFSC code, and Beneficiary details. All checkout views, dynamically generated UPI payment links, and on-screen QR codes update immediately.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetBankingSettings}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Factory Defaults</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Form: 7 Columns */}
                  <form onSubmit={handleSaveBankingSettings} className="lg:col-span-7 space-y-4">
                    {/* Primary Receiver Section */}
                    <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-amber-500" />
                        <span>UPI Merchant & Instant QR Receiver</span>
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Active Receiver UPI ID *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankingForm.upiId}
                          onChange={(e) => setBankingForm({ ...bankingForm, upiId: e.target.value.trim() })}
                          placeholder="e.g. wagh.jayesh@oksbi"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0B192C]"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Default: <strong className="text-slate-600 font-mono">wagh.jayesh@oksbi</strong>. Directly encodes into customer on-screen QR codes and deep intent triggers.
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Beneficiary / Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankingForm.accountHolderName}
                          onChange={(e) => setBankingForm({ ...bankingForm, accountHolderName: e.target.value })}
                          placeholder="e.g. Jayesh Wagh"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0B192C]"
                        />
                      </div>
                    </div>

                    {/* Bank Wire & Net Banking Details */}
                    <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2">
                        <Building className="w-4 h-4 text-emerald-600" />
                        <span>Direct Wire & Commercial Bank Coordinates</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Primary Bank Account Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankingForm.accountNumber}
                            onChange={(e) => setBankingForm({ ...bankingForm, accountNumber: e.target.value.trim() })}
                            placeholder="e.g. 50100492817291"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0B192C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            IFSC / RTGS / NEFT Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankingForm.ifscCode}
                            onChange={(e) => setBankingForm({ ...bankingForm, ifscCode: e.target.value.trim().toUpperCase() })}
                            placeholder="e.g. SBIN0001234"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0B192C]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Commercial Bank Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankingForm.bankName}
                            onChange={(e) => setBankingForm({ ...bankingForm, bankName: e.target.value })}
                            placeholder="e.g. State Bank of India"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                            Branch Location
                          </label>
                          <input
                            type="text"
                            value={bankingForm.branchName || ''}
                            onChange={(e) => setBankingForm({ ...bankingForm, branchName: e.target.value })}
                            placeholder="e.g. Nariman Point Corporate Commercial, Mumbai"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          International SWIFT / BIC Code
                        </label>
                        <input
                          type="text"
                          value={bankingForm.swiftBic || ''}
                          onChange={(e) => setBankingForm({ ...bankingForm, swiftBic: e.target.value.trim().toUpperCase() })}
                          placeholder="e.g. SBININBBXXX"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#0B192C]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Settlement Instructions & Escrow Notes
                        </label>
                        <textarea
                          rows={2}
                          value={bankingForm.payoutNotes || ''}
                          onChange={(e) => setBankingForm({ ...bankingForm, payoutNotes: e.target.value })}
                          placeholder="Official settlement notes displayed to commercial clients on proforma checkout..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Broadcast Banking Settings</span>
                      </button>
                    </div>
                  </form>

                  {/* Right: Live Customer Checkout Preview Card: 5 Columns */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live Customer Preview</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Simulated Checkout</span>
                      </div>

                      {/* Preview QR Box */}
                      <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <div className="w-36 h-36 bg-white p-1 rounded-lg flex items-center justify-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(`upi://pay?pa=${bankingForm.upiId}&pn=${encodeURIComponent(bankingForm.accountHolderName)}&cu=INR`)}`}
                            alt="Live Generated QR Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-emerald-600" />
                          <span>Scan to Pay ({bankingForm.upiId})</span>
                        </span>
                      </div>

                      {/* Displayed Credentials */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">Account Holder:</span>
                          <strong className="text-white">{bankingForm.accountHolderName}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">Receiver UPI ID:</span>
                          <strong className="font-mono text-amber-300">{bankingForm.upiId}</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">Bank Name:</span>
                          <span className="text-slate-200">{bankingForm.bankName}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">Account #:</span>
                          <span className="font-mono text-slate-200">{bankingForm.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">IFSC / Code:</span>
                          <span className="font-mono text-slate-200">{bankingForm.ifscCode}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
                        Whenever any field on the left is updated and saved, all modal checkouts across arcavenglobal.com immediately adapt to this receiver account.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-600 block">
                  Root Governance
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Super Admin Identity & Access Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Designated Super Admin Entity: <strong className="text-slate-900 font-mono">{SUPER_ADMIN_IDENTITY}</strong>.
                </p>
              </div>

              {adminPassMsg && (
                <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  adminPassMsg.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}>
                  {adminPassMsg.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  <span>{adminPassMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleAdminSelfPasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    New Super Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminNewPass}
                    onChange={(e) => setAdminNewPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminConfirmPass}
                    onChange={(e) => setAdminConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#0B192C] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Update Super Admin Password</span>
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Strict Security Assertion:</span>
                <p>
                  Zero plaintext credentials policy enforced. All administrative changes and catalog edits are cryptographically signed under identity <strong>{SUPER_ADMIN_IDENTITY}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: VERIFY PAYMENT REF FOR ORDER CONFIRMATION */}
        {confirmingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Confirm Order #{confirmingOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setConfirmingOrder(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                As required by governance policy, transitioning an order to <strong>Order Confirmed</strong> requires entering and verifying a legitimate Payment Reference Number (e.g. Bank UTR, SWIFT/IBAN ref, or Gateway Transaction ID).
              </p>

              <form onSubmit={handleSaveConfirmedOrder} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Verified Payment Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentRefInput}
                    onChange={(e) => setPaymentRefInput(e.target.value)}
                    placeholder="e.g. TXN-ENBD-982341 or UPI-UTR-891241"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingOrder(null)}
                    className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-[#0B192C] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DISPATCH TAT & TRACKING NOTICE */}
        {dispatchingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Dispatch Order #{dispatchingOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setDispatchingOrder(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Provide the carrier dispatch details and estimated delivery turnaround time (TAT) to notify the customer.
              </p>

              <form onSubmit={handleSaveDispatchedOrder} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Estimated Delivery TAT Notice *
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchTatInput}
                    onChange={(e) => setDispatchTatInput(e.target.value)}
                    placeholder="e.g. 5–7 business days via air freight"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Bill of Lading / Air Waybill / Tracking #
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. AWB-157-89024182 or BL-MAEU-98214481"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Carrier / Export Yard Notice
                  </label>
                  <input
                    type="text"
                    value={carrierNoticeInput}
                    onChange={(e) => setCarrierNoticeInput(e.target.value)}
                    placeholder="e.g. Cleared at Nhava Sheva CFS"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDispatchingOrder(null)}
                    className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Mark Dispatched
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ORDER CANCELLATION */}
        {cancellingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-600" />
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Cancel Order #{cancellingOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setCancellingOrder(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Cancelling this order will transition its status to <strong>Order Cancelled</strong>, notify the consignee, and cease commercial freight booking.
              </p>

              <form onSubmit={handleSaveCancelledOrder} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Official Cancellation Reason *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={cancellationReasonInput}
                    onChange={(e) => setCancellationReasonInput(e.target.value)}
                    placeholder="e.g. Consignee requested commercial specification revision / export quota amendment."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancellingOrder(null)}
                    className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Keep Active
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ORDER DELETION SAFEGUARD DIALOG */}
        {deletingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl border border-red-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Delete Order #{deletingOrder.orderNumber}?
                  </h3>
                </div>
                <button
                  onClick={() => setDeletingOrder(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-800 text-xs leading-relaxed space-y-1">
                <span className="font-bold block">Permanent Deletion Safeguard:</span>
                <p>
                  Are you sure you want to permanently delete order <strong>#{deletingOrder.orderNumber}</strong> for {deletingOrder.customerName}? This action will remove the record from browser storage and order tracking. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingOrder(null)}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteOrder}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESET PASSWORD FOR CUSTOMER */}
        {targetUserForPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Reset Customer Password
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setTargetUserForPassword(null);
                    setPasswordChangeSuccess(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="font-semibold text-slate-800">{targetUserForPassword.name}</div>
                <div className="text-slate-500 font-mono text-[11px]">{targetUserForPassword.email}</div>
                <div className="text-slate-400 text-[10px]">{targetUserForPassword.company}</div>
              </div>

              {passwordChangeSuccess ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{passwordChangeSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleAdminSetPasswordForUser} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                      Assign New Plain Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPasswordForUser}
                      onChange={(e) => setNewPasswordForUser(e.target.value)}
                      placeholder="e.g. ExportTrader2026!"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:border-[#0B192C]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Will be cryptographically hashed upon save.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTargetUserForPassword(null)}
                      className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 bg-[#0B192C] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Save Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL: CREATE CUSTOMER */}
        {isCreatingCustomer && (
          <CreateCustomerModal
            onClose={() => setIsCreatingCustomer(false)}
            onCustomerCreated={(newCust) => {
              setUsersList(getStoredUsers());
              setIsCreatingCustomer(false);
              showToast(`Customer account for ${newCust.email} registered!`);
            }}
          />
        )}

        {/* MODAL: EDIT / CREATE COMMODITY PRODUCT */}
        {(editingProduct || isCreatingProduct) && editingProduct && (
          <EditProductModal
            product={editingProduct}
            isNew={isCreatingProduct}
            onClose={() => {
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            onSave={handleSaveProductEdit}
          />
        )}
      </div>
    </div>
  );
};

// SUBCOMPONENT: CREATE CUSTOMER MODAL
interface CreateCustomerModalProps {
  onClose: () => void;
  onCustomerCreated: (user: UserAccount) => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ onClose, onCustomerCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const newUser = createCustomerUser({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || 'Institutional Buyer',
        country: country.trim() || 'Global',
        phone: phone.trim() || '',
        password: password.trim(),
        status: 'active',
        notes: 'Created by Super Admin'
      });
      onCustomerCreated(newUser);
    } catch (err: any) {
      setError(err.message || 'Failed to create customer account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn font-body">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-heading font-bold text-slate-900 text-lg">
            Register Customer Account
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
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
                placeholder="e.g. Tariq Aziz"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Company / Entity *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Aziz Agri Importers"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@domain.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Qatar"
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
                placeholder="+974 4400 1234"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Initial Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-[#0B192C] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// SUBCOMPONENT: EDIT / CREATE COMMODITY MODAL
interface EditProductModalProps {
  product: ProductItem;
  isNew?: boolean;
  onClose: () => void;
  onSave: (product: ProductItem) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isNew = false,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ProductItem>({ ...product });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn font-body">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              {isNew ? 'Add New Commodity Product' : `Edit: ${formData.name}`}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. 1121 Raw Extra Long Basmati Rice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Commodity SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. AVG-RIC-1121"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  const labelMap: Record<string, string> = {
                    'vegetables-fruits': 'Fruits & Vegetables',
                    'grains-pulses': 'Grains & Pulses',
                    'specialty-spices': 'Specialty Spices',
                    'coconut-products': 'Coconut Products'
                  };
                  setFormData({ ...formData, category: cat, categoryLabel: labelMap[cat] || 'Agro Commodity' });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="vegetables-fruits">Fruits & Vegetables</option>
                <option value="grains-pulses">Grains & Pulses</option>
                <option value="specialty-spices">Specialty Spices</option>
                <option value="coconut-products">Coconut Products</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Pricing / RFQ Mode
              </label>
              <select
                value={formData.priceMode || 'indicative'}
                onChange={(e) => setFormData({ ...formData, priceMode: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="indicative">Indicative Trade Price</option>
                <option value="rfq_only">Custom RFQ Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Indicative Price per MT/Unit
              </label>
              <input
                type="text"
                value={formData.indicativePrice || ''}
                onChange={(e) => setFormData({ ...formData, indicativePrice: e.target.value })}
                placeholder="e.g. $1,150 / MT CIF"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Short Description (Catalog Summary)
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Full Technical Description & Export Grade Specs
            </label>
            <textarea
              rows={3}
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          {/* Image URL Uploader & Previewer */}
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Image URL & Live Preview
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-24 h-24 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = CURATED_IMAGE_PRESETS[0].url;
                  }}
                />
              </div>

              <div className="space-y-2 flex-grow w-full">
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="text-slate-500 font-bold self-center">Presets:</span>
                  {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Origin</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Grade</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">MOQ</label>
              <input
                type="text"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Loadability</label>
              <input
                type="text"
                value={formData.loadAbility}
                onChange={(e) => setFormData({ ...formData, loadAbility: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-[#0B192C] hover:bg-slate-900 text-amber-400 rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              {isNew ? 'Create & Publish Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
