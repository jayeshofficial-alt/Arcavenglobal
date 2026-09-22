import React, { useState, useMemo } from 'react';
import { 
  ProductItem, 
  UserAccount, 
  CustomerInquiry,
  ProductCategory 
} from '../types';
import { 
  ADMIN_EMAIL, 
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
  logoutSession
} from '../utils/storage';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Users, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  Copy, 
  Lock, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  products: ProductItem[];
  onProductsUpdated: (products: ProductItem[]) => void;
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
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'security'>('products');
  
  // Product state
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'listed' | 'delisted'>('all');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Customer state
  const [usersList, setUsersList] = useState<UserAccount[]>(() => getStoredUsers());
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<UserAccount | null>(null);

  // Set Password modal for specific user (Admin sets password for customer)
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

  // STRICT ACCESS CHECK: Only jayeshofficial@gmail.com is allowed admin access
  const isAuthorizedAdmin = 
    currentUser && 
    currentUser.role === 'admin' && 
    currentUser.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!isOpen) return null;

  if (!isAuthorizedAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="max-w-md w-full bg-[#001233] border border-red-500/50 rounded-2xl p-6 sm:p-8 text-white space-y-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white">
            Administrative Access Denied
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Admin privileges are strictly restricted to designated User ID:
            <br />
            <strong className="text-amber-400 font-mono text-sm block mt-1">{ADMIN_EMAIL}</strong>
          </p>
          <div className="pt-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close & Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products
  const filteredProducts = products.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      prod.origin.toLowerCase().includes(productSearch.toLowerCase()) ||
      prod.grade.toLowerCase().includes(productSearch.toLowerCase()) ||
      prod.categoryLabel.toLowerCase().includes(productSearch.toLowerCase());
    
    if (!matchesSearch) return false;

    if (productFilter === 'listed') return !prod.isDelisted;
    if (productFilter === 'delisted') return !!prod.isDelisted;
    return true;
  });

  // Filtered Customers
  const filteredCustomers = usersList.filter(u => {
    if (u.role === 'admin') return false; // Show only customers in customer table
    return (
      u.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (u.country && u.country.toLowerCase().includes(customerSearch.toLowerCase()))
    );
  });

  // Product Actions
  const handleToggleDelist = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const nextState = !p.isDelisted;
        showToast(nextState ? `Product '${p.name}' is now DELISTED (hidden from public catalog).` : `Product '${p.name}' is now LISTED (live on catalog).`);
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
      showToast(`Product '${productName}' deleted.`);
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
    if (window.confirm('Reset all commodities back to factory default specifications? Any custom edits will be restored.')) {
      const restored = resetProductsToDefault();
      onProductsUpdated(restored);
      showToast('Commodity catalog restored to defaults.');
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

  // ADMIN SETTING PASSWORD FOR CUSTOMER USER
  const handleAdminSetPasswordForUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForPassword) return;

    if (newPasswordForUser.trim().length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }

    const success = setUserPassword(targetUserForPassword.id, newPasswordForUser.trim());
    if (success) {
      const updated = getStoredUsers();
      setUsersList(updated);
      setPasswordChangeSuccess(`Password for ${targetUserForPassword.email} set to: "${newPasswordForUser.trim()}"`);
      setTimeout(() => {
        setTargetUserForPassword(null);
        setNewPasswordForUser('');
        setPasswordChangeSuccess(null);
        showToast(`Password updated for user ${targetUserForPassword.email}`);
      }, 1800);
    }
  };

  // ADMIN CHANGING OWN PASSWORD
  const handleAdminSelfPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg(null);

    if (adminCurrentPass !== currentUser.password) {
      setAdminPassMsg({ type: 'error', text: 'Current admin password is incorrect.' });
      return;
    }

    if (adminNewPass.length < 6) {
      setAdminPassMsg({ type: 'error', text: 'New password must have at least 6 characters.' });
      return;
    }

    if (adminNewPass !== adminConfirmPass) {
      setAdminPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const success = setUserPassword(ADMIN_EMAIL, adminNewPass);
    if (success) {
      setAdminPassMsg({ type: 'success', text: `Admin password for ${ADMIN_EMAIL} updated successfully!` });
      setAdminCurrentPass('');
      setAdminNewPass('');
      setAdminConfirmPass('');
      showToast('Admin password changed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        id="admin-panel-modal"
        className="relative w-full max-w-6xl bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden font-body text-slate-800 h-[92vh] flex flex-col"
      >
        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute top-4 right-4 z-50 bg-[#001233] text-amber-400 border border-amber-400/40 px-4 py-2 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Master Dark Top Bar */}
        <div className="bg-[#001233] text-white px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold text-white tracking-tight">
                  Arca Ventures Global <span className="text-amber-400 font-normal">| Executive Admin Console</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                  Master Root
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Authorized Admin ID:</span>
                <strong className="text-amber-400 font-mono">{ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public View"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Public Website</span>
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
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close Admin Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-[#001233] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Commodity Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'customers'
                  ? 'bg-[#001233] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Customer Accounts ({filteredCustomers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-[#001233] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Admin Security & Passwords</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
            <span>Live Catalog: <strong className="text-emerald-700 font-bold">{products.filter(p => !p.isDelisted).length}</strong></span>
            <span>•</span>
            <span>Delisted: <strong className="text-amber-700 font-bold">{products.filter(p => p.isDelisted).length}</strong></span>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-grow bg-slate-50">
          {/* TAB 1: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              {/* Product Controls Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search commodities, origin, grade..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#001233]"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                    <button
                      onClick={() => setProductFilter('all')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        productFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      All ({products.length})
                    </button>
                    <button
                      onClick={() => setProductFilter('listed')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        productFilter === 'listed' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      Listed ({products.filter(p => !p.isDelisted).length})
                    </button>
                    <button
                      onClick={() => setProductFilter('delisted')}
                      className={`px-2.5 py-1 rounded font-medium transition-colors ${
                        productFilter === 'delisted' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'
                      }`}
                    >
                      Delisted ({products.filter(p => p.isDelisted).length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetProducts}
                    className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restore catalog to original specifications"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCreatingProduct(true);
                      setEditingProduct({
                        id: `prod-${Date.now()}`,
                        name: '',
                        category: 'vegetables-fruits',
                        categoryLabel: 'Fruits & Vegetables',
                        origin: 'Maharashtra & Southern India',
                        imageUrl: CURATED_IMAGE_PRESETS[0].url,
                        shortDescription: '',
                        fullDescription: '',
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
                    className="py-2 px-4 rounded-lg bg-[#2D5A27] hover:bg-[#23471f] text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Commodity</span>
                  </button>
                </div>
              </div>

              {/* Product Grid / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => {
                  const isDelisted = !!prod.isDelisted;
                  return (
                    <div 
                      key={prod.id} 
                      className={`bg-white rounded-xl border transition-all duration-200 p-4 flex flex-col justify-between shadow-xs ${
                        isDelisted 
                          ? 'border-amber-200 bg-amber-50/20 opacity-85' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Image & Status Badge */}
                        <div className="relative h-44 rounded-lg overflow-hidden mb-3 bg-slate-100 border border-slate-200">
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.name}
                            className={`w-full h-full object-cover transition-transform duration-300 ${isDelisted ? 'grayscale-[40%]' : ''}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = CURATED_IMAGE_PRESETS[0].url;
                            }}
                          />
                          
                          {/* Live / Delisted Badge */}
                          <div className="absolute top-2.5 left-2.5">
                            {isDelisted ? (
                              <span className="px-2 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider font-heading shadow-md">
                                Delisted (Draft)
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-[#2D5A27] text-white text-[10px] font-bold uppercase tracking-wider font-heading shadow-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                                Listed (Live)
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                            {prod.grade}
                          </div>
                        </div>

                        {/* Title & Category */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-heading uppercase tracking-wider font-semibold text-[#2D5A27]">
                            {prod.categoryLabel}
                          </span>
                          <h3 className="font-heading font-bold text-slate-900 text-base leading-snug line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {prod.shortDescription}
                          </p>
                        </div>

                        {/* Specs overview */}
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
                        {/* List/Delist Toggle Button */}
                        <button
                          onClick={() => handleToggleDelist(prod.id)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isDelisted
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          }`}
                        >
                          {isDelisted ? 'List Product' : 'Delist Product'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setIsCreatingProduct(false);
                              setEditingProduct(prod);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Information, Specs & Image"
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

          {/* TAB 2: CUSTOMER MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="space-y-5">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search customer by name, email, company..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#001233]"
                  />
                </div>

                <button
                  onClick={() => setIsCreatingCustomer(true)}
                  className="py-2 px-4 rounded-lg bg-[#001233] hover:bg-slate-900 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add New Customer User</span>
                </button>
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-heading uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Customer / Entity</th>
                      <th className="py-3 px-4">Contact & Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Current Password</th>
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
                            <div className="text-slate-500 font-medium">{user.company || 'Private Entity'}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{user.country || 'Global'}</div>
                            <div className="text-slate-400 text-[11px]">{user.phone || 'No phone'}</div>
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

                          {/* Password column with prompt to change */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200 w-max text-[11px]">
                              <span>••••••••</span>
                              <button
                                onClick={() => {
                                  setTargetUserForPassword(user);
                                  setNewPasswordForUser(user.password || '');
                                }}
                                className="ml-1 text-blue-600 hover:text-blue-800 underline font-sans text-[11px] font-semibold cursor-pointer"
                              >
                                Set Password
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Set password button */}
                              <button
                                onClick={() => {
                                  setTargetUserForPassword(user);
                                  setNewPasswordForUser(user.password || '');
                                }}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                                title="Set or reset password for this user"
                              >
                                <KeyRound className="w-3 h-3 text-amber-600" />
                                <span>Set Password</span>
                              </button>

                              {/* Delete button */}
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

          {/* TAB 3: ADMIN SECURITY & PASSWORDS */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-600 block">
                  Root Governance
                </span>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  Admin Credentials & Password Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure root password credentials for Master Admin User ID: <strong className="text-slate-900 font-mono">{ADMIN_EMAIL}</strong>.
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
                    Current Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminCurrentPass}
                    onChange={(e) => setAdminCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Initial default password is <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">ArcaAdmin@2026</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    New Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminNewPass}
                    onChange={(e) => setAdminNewPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-heading uppercase tracking-wider">
                    Confirm New Admin Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={adminConfirmPass}
                    onChange={(e) => setAdminConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#001233] hover:bg-slate-900 text-amber-400 font-heading text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Update Admin Password</span>
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Security Policy Enforcement:</span>
                <p>
                  As mandated, administrative privileges and control over product delisting, content edits, and customer password updates are strictly granted solely to <strong className="text-slate-900 font-mono">{ADMIN_EMAIL}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: ADMIN SET PASSWORD FOR CUSTOMER USER */}
        {targetUserForPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Set User Password
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setTargetUserForPassword(null);
                    setPasswordChangeSuccess(null);
                  }}
                  className="text-slate-400 hover:text-slate-600"
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
                      Assign New Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPasswordForUser}
                      onChange={(e) => setNewPasswordForUser(e.target.value)}
                      placeholder="e.g. ExportTrader2026!"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:border-[#001233]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      The user can immediately log in with this new password or change it in their portal.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTargetUserForPassword(null)}
                      className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-3 bg-[#001233] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Save Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL: CREATE NEW CUSTOMER */}
        {isCreatingCustomer && (
          <CreateCustomerModal
            onClose={() => setIsCreatingCustomer(false)}
            onCustomerCreated={(newCust) => {
              setUsersList(getStoredUsers());
              setIsCreatingCustomer(false);
              showToast(`Customer account for ${newCust.email} created!`);
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
  const [password, setPassword] = useState('Customer@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newUser = createCustomerUser({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || 'Institutional Buyer',
        country: country.trim() || 'Global',
        phone: phone.trim() || '',
        password: password.trim(),
        status: 'active',
        notes: 'Created by Master Admin'
      });
      onCustomerCreated(newUser);
    } catch (err: any) {
      setError(err.message || 'Failed to create customer account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-heading font-bold text-slate-900 text-lg">
            Create Customer User Account
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
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
              Set Initial Password *
            </label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. Customer@123"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Admin and customer can change this password at any time.
            </p>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-[#001233] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider cursor-pointer"
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
  isNew,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ProductItem>({ ...product });
  const [previewError, setPreviewError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Commodity name is required.');
      return;
    }
    onSave(formData);
  };

  const handleSelectPreset = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setPreviewError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-body">
        {/* Top Header */}
        <div className="bg-[#001233] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-400 block">
              Admin Catalog Management
            </span>
            <h3 className="font-heading text-lg font-bold text-white">
              {isNew ? 'Create New Commodity Entry' : `Edit Product: ${product.name}`}
            </h3>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* 1. Basic Information */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#2D5A27]" />
              <span>Basic Information & Classification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 1121 Steam Extra Long Basmati Rice"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Scientific Name
                </label>
                <input
                  type="text"
                  value={formData.scientificName || ''}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  placeholder="e.g. Oryza sativa"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as ProductItem['category'];
                    const labelMap: Record<string, string> = {
                      'vegetables-fruits': 'Fruits & Vegetables',
                      'grains-pulses': 'Grains & Pulses',
                      'specialty-spices': 'Specialty Spices',
                      'coconut-products': 'Coconut Products'
                    };
                    setFormData({
                      ...formData,
                      category: cat,
                      categoryLabel: labelMap[cat] || 'Agri Commodity'
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                >
                  <option value="vegetables-fruits">Fruits & Vegetables</option>
                  <option value="grains-pulses">Grains & Pulses</option>
                  <option value="specialty-spices">Specialty Spices</option>
                  <option value="coconut-products">Coconut Products</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Origin Region *
                </label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g. Nashik, Maharashtra, India"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Export Grade *
                </label>
                <input
                  type="text"
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="e.g. Grade A Premium (550g+)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#001233]"
                />
              </div>
            </div>
          </div>

          {/* 2. Image Selection & Preview */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Product Image & Visual Assets</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setPreviewError(false);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:border-[#001233]"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Or Select High-Res Curated Preset:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                          formData.imageUrl === preset.url
                            ? 'bg-[#001233] text-white border-[#001233] font-bold'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Live Preview</span>
                <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 relative">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                  {previewError && (
                    <div className="absolute inset-0 bg-red-100/90 text-red-600 text-xs flex items-center justify-center p-2 text-center">
                      Invalid image URL
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description & Narrative */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5">
              Content & Commercial Narrative
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Short Description (Catalog Cards) *
              </label>
              <textarea
                required
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary of quality, aroma, and commercial application..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#001233]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Technical Description (Product Modal) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="In-depth details on harvesting, curing, phytosanitary handling, and transport stability..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#001233]"
              />
            </div>
          </div>

          {/* 4. Specifications & Trade Data */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5">
              Export Specifications & Standards
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Moisture Content
                </label>
                <input
                  type="text"
                  value={formData.moistureContent}
                  onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                  placeholder="e.g. 11.5% max"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Purity / Foreign Matter
                </label>
                <input
                  type="text"
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                  placeholder="e.g. 99% Free from impurities"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Shelf Life
                </label>
                <input
                  type="text"
                  value={formData.shelfLife}
                  onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                  placeholder="e.g. 24 Months"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Minimum Order Quantity (MOQ) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                  placeholder="e.g. 1 x 20ft FCL (18 MT)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Load Ability per Container *
                </label>
                <input
                  type="text"
                  required
                  value={formData.loadAbility}
                  onChange={(e) => setFormData({ ...formData, loadAbility: e.target.value })}
                  placeholder="e.g. 26 MT per 40ft HQ Container"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
            </div>

            {/* List / Delist Status Toggle in form */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  Catalog Listing Status
                </span>
                <span className="text-[11px] text-slate-500">
                  {formData.isDelisted ? 'Delisted (Hidden from prospective buyers)' : 'Listed (Visible on public product catalog)'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isDelisted: !formData.isDelisted })}
                className={`py-1.5 px-3.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  formData.isDelisted
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-[#2D5A27] text-white hover:bg-[#23471f]'
                }`}
              >
                {formData.isDelisted ? 'Make Listed (Live)' : 'Delist (Draft)'}
              </button>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#001233] hover:bg-slate-900 text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isNew ? 'Create & Save Commodity' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
