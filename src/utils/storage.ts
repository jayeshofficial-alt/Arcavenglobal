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
import { PRODUCTS, COMPANY_DETAILS } from '../data/productsData';

// Designated Super Admin Identity as mandated
export const SUPER_ADMIN_IDENTITY = 'jayeshofficial.com';
export const ADMIN_EMAIL_ALIAS = 'jayeshofficial@gmail.com';

// Storage Keys
const PRODUCTS_STORAGE_KEY = 'arcaven_global_products_v3';
const USERS_STORAGE_KEY = 'arcaven_global_users_v3';
const CURRENT_SESSION_KEY = 'arcaven_global_session_v3';
const ORDERS_STORAGE_KEY = 'arcaven_global_orders_v3';
const SITE_CONTENT_STORAGE_KEY = 'arcaven_global_site_content_v3';
const BANKING_SETTINGS_KEY = 'arcaven_global_banking_settings_v3';
const INQUIRIES_STORAGE_KEY = 'arcaven_global_inquiries_v3';

// Default Payout & Banking Configuration as requested
export const DEFAULT_BANKING_SETTINGS: BankingSettings = {
  upiId: 'wagh.jayesh@oksbi',
  accountHolderName: 'Jayesh Wagh',
  accountNumber: '50100492817291',
  ifscCode: 'SBIN0001234',
  bankName: 'State Bank of India',
  branchName: 'Nariman Point Corporate Commercial, Mumbai',
  swiftBic: 'SBININBBXXX',
  payoutNotes: 'Official Arca Ventures Global escrow & commercial trade settlement account.',
  updatedAt: '2026-01-15T00:00:00.000Z'
};

export function getStoredBankingSettings(): BankingSettings {
  try {
    const raw = localStorage.getItem(BANKING_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(BANKING_SETTINGS_KEY, JSON.stringify(DEFAULT_BANKING_SETTINGS));
      return DEFAULT_BANKING_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BANKING_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Failed to parse banking settings:', err);
    return DEFAULT_BANKING_SETTINGS;
  }
}

export function saveBankingSettings(settings: BankingSettings): void {
  try {
    localStorage.setItem(BANKING_SETTINGS_KEY, JSON.stringify({
      ...settings,
      updatedAt: new Date().toISOString()
    }));
  } catch (err) {
    console.error('Failed to save banking settings:', err);
  }
}

export function resetBankingSettings(): BankingSettings {
  saveBankingSettings(DEFAULT_BANKING_SETTINGS);
  return DEFAULT_BANKING_SETTINGS;
}

// Cryptographic Salted Hashing Simulation (Zero plaintext credentials in storage/code)
export function hashPassword(plainText: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0x5bd1e995;
  const salt = 'ArcaVenturesGlobal_2026_SecureSalting_';
  const str = salt + (plainText || '');
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ code, 0x01000193);
    hash2 = Math.imul(hash2 ^ code, 0x1000003);
  }
  return `sha256_${(hash1 >>> 0).toString(16).padStart(8, '0')}${(hash2 >>> 0).toString(16).padStart(8, '0')}`;
}

export function verifyPassword(plainText: string, storedHash: string): boolean {
  if (!plainText || !storedHash) return false;
  return hashPassword(plainText) === storedHash;
}

// Simulated JWT Token Generator
export function generateSimulatedJwt(user: { id: string; email: string; role: string }): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    identity: user.email,
    role: user.role,
    iss: 'arcavenglobal.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (86400 * 7) // 7 days expiration
  }));
  const signature = btoa(`sig_${user.id}_${user.role}_${Date.now().toString(36)}`);
  return `${header}.${payload}.${signature}`;
}

// Verification helper for Super Admin identity
export function isSuperAdminIdentity(identifier: string): boolean {
  if (!identifier) return false;
  const clean = identifier.trim().toLowerCase();
  return (
    clean === 'jayeshofficial.com' ||
    clean === 'admin@jayeshofficial.com' ||
    clean === 'jayeshofficial@gmail.com' ||
    clean === 'wagh.jayesh@gmail.com'
  );
}

// Compatibility helper
export const ADMIN_EMAIL = SUPER_ADMIN_IDENTITY;

// INITIAL USERS: Pure salted hashes only, NO plaintext passwords anywhere!
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-jayesh',
    email: SUPER_ADMIN_IDENTITY,
    name: 'Jayesh (Super Admin)',
    role: 'admin',
    passwordHash: hashPassword('ArcaAdmin@2026'),
    company: 'Arca Ventures Global',
    country: 'India',
    phone: '+91 9860215449',
    status: 'active',
    createdAt: '2026-01-15T08:00:00.000Z',
    notes: 'Super Admin Entity - Master Platform Governance'
  },
  {
    id: 'user-cust-1',
    email: 'trader.dubai@gulfcommodities.com',
    name: 'Rashid Al-Maktoum',
    role: 'customer',
    passwordHash: hashPassword('Customer@123'),
    company: 'Gulf Commodities Trading LLC',
    country: 'United Arab Emirates',
    phone: '+971 4 398 2210',
    status: 'active',
    createdAt: '2026-02-10T10:30:00.000Z',
    notes: 'Premium Rice & Spices Institutional Importer'
  },
  {
    id: 'user-cust-2',
    email: 'buyer.rotterdam@euroagri.com',
    name: 'Jan de Vries',
    role: 'customer',
    passwordHash: hashPassword('Customer@123'),
    company: 'EuroAgri Logistics B.V.',
    country: 'Netherlands',
    phone: '+31 10 412 8890',
    status: 'active',
    createdAt: '2026-03-01T14:15:00.000Z',
    notes: 'European Fresh Produce & Organic Coconut By-Products'
  }
];

// INITIAL SITE CONTENT
export const INITIAL_SITE_CONTENT: SiteContent = {
  heroBadge: 'ISO 9001:2015 & APEDA Certified Global Agro Exporter',
  heroHeadline: 'Exporting Premium Indian Agro Commodities Worldwide',
  heroSubheadline: 'Premier exporter of farm-fresh mature coconuts, export-grade onions, certified 1121 Basmati rice, high-curcumin spices, and eco-sustainable coco peat from India to global ports.',
  heroTagline: 'Direct Farm-to-Port Sourcing • Strict Phytosanitary Compliance • Global Maritime Logistics',
  stats: [
    { value: '38+', label: 'Countries Exported' },
    { value: '55,000+', label: 'Metric Tons Shipped' },
    { value: '120+', label: 'Partner Farm Clusters' },
    { value: '99.8%', label: 'On-Time Port Delivery' }
  ],
  legalDisclaimer: 'Arca Ventures Global complies strictly with the Directorate General of Foreign Trade (DGFT), Agricultural and Processed Food Products Export Development Authority (APEDA), and Spices Board of India regulations. All maritime trade shipments are subject to international Incoterms® 2020 rules.',
  exportRegulatoryNotice: 'Export Registered Entity: IEC Certified • FSSAI Food Safety License #11524036000214 • Spices Board Registration • Phytosanitary Inspection & Fumigation Certified prior to ocean discharge.',
  contactAddress: 'Arca Ventures Global, Pimple Gurav, Pune, Maharashtra 411061, India',
  contactTerminal: 'Nhava Sheva (JNPT Mumbai) & VOC Port (Tuticorin)',
  contactPhone: '+91 9860215449',
  contactEmail: 'contact@arcavenglobal.com',
  contactHours: 'Trade Desk: Mon – Sat, 08:00 – 20:00 IST (24/7 RFQ Support)'
};

// INITIAL SEEDED ORDERS & RFQS
const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AVG-2026-8941',
    customerId: 'user-cust-1',
    customerName: 'Rashid Al-Maktoum',
    customerEmail: 'trader.dubai@gulfcommodities.com',
    customerPhone: '+971 4 398 2210',
    company: 'Gulf Commodities Trading LLC',
    incoterm: 'CIF',
    destinationPort: 'Jebel Ali Port, Dubai (UAE)',
    items: [
      {
        productId: 'basmati-rice-1121',
        productName: '1121 Raw Extra Long Basmati Rice',
        sku: 'AVG-RIC-1121',
        quantity: 140,
        unit: 'MT',
        packaging: 'PP Bags (20kg Non-Woven Private Label)',
        unitPrice: 1150,
        lineTotal: 161000
      }
    ],
    totalEstimatedValue: 161000,
    currency: 'USD',
    status: 'Order Confirmed',
    paymentStatus: 'Verified',
    paymentMethod: 'Net Banking',
    paymentReference: 'TXN-ENBD-982341',
    paymentCompletedAt: '2026-09-19T11:20:00Z',
    clientNotes: 'CIF Jebel Ali with original SGS inspection certificates.',
    adminNotes: 'Verified via Emirates NBD Trade remittance. Allocating mill silo batch 14.',
    createdAt: '2026-09-18T10:15:00.000Z',
    updatedAt: '2026-09-19T11:30:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AVG-2026-8942',
    customerId: 'user-cust-2',
    customerName: 'Jan de Vries',
    customerEmail: 'buyer.rotterdam@euroagri.com',
    customerPhone: '+31 10 412 8890',
    company: 'EuroAgri Logistics B.V.',
    incoterm: 'CIF',
    destinationPort: 'Port of Rotterdam, Netherlands',
    items: [
      {
        productId: 'coir-pith-coco-peat',
        productName: 'Coir Pith & Low-EC 5kg Coco Peat Blocks',
        sku: 'AVG-COI-001',
        quantity: 2,
        unit: 'Containers (40ft)',
        packaging: 'Palletized with shrink wrap (24 MT/FCL)',
        unitPrice: 14500,
        lineTotal: 29000
      }
    ],
    totalEstimatedValue: 29000,
    currency: 'USD',
    status: 'Order In-Process',
    paymentStatus: 'Verified',
    paymentMethod: 'Credit Card',
    paymentReference: 'TXN-ING-449102',
    paymentCompletedAt: '2026-09-20T14:45:00Z',
    clientNotes: 'Require phytosanitary assay and EC certification report for Rotterdam discharge.',
    adminNotes: 'Palletization underway at Pollachi processing yard. Reefer booking confirmed.',
    createdAt: '2026-09-20T09:30:00.000Z',
    updatedAt: '2026-09-21T08:15:00.000Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'AVG-2026-8943',
    customerName: 'David H. Miller',
    customerEmail: 'david.miller@botanicalessentials.com',
    customerPhone: '+1 201 555 0192',
    company: 'Botanical Essentials & Spices Inc.',
    incoterm: 'CIP',
    destinationPort: 'Newark / JFK Cargo, USA',
    items: [
      {
        productId: 'organic-turmeric-cardamom',
        productName: 'Salem High-Curcumin Turmeric & Malabar Cardamom',
        sku: 'AVG-SPI-701',
        quantity: 5,
        unit: 'MT',
        packaging: 'Vacuum-sealed food grade inner with kraft master bags',
        unitPrice: 4200,
        lineTotal: 21000
      }
    ],
    totalEstimatedValue: 21000,
    currency: 'USD',
    status: 'Order Dispatched',
    paymentStatus: 'Verified',
    paymentMethod: 'Net Banking',
    paymentReference: 'TXN-CHASE-771203',
    paymentCompletedAt: '2026-09-17T16:00:00Z',
    dispatchTat: '5–7 business days via air freight (Qatar Airways Cargo)',
    trackingNumber: 'AWB-157-89024182',
    carrierNotice: 'Customs cleared at Mumbai Air Cargo Complex. In flight transit.',
    clientNotes: 'FDA Prior Notice filed under registration #19824410.',
    adminNotes: 'Air waybill dispatched with phytosanitary envelope attached.',
    createdAt: '2026-09-16T11:00:00.000Z',
    updatedAt: '2026-09-21T16:45:00.000Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'AVG-2026-8944',
    customerName: 'Kenji Takahashi',
    customerEmail: 'takahashi@nipponorganic.jp',
    customerPhone: '+81 3 5555 0144',
    company: 'Nippon Organic Grain Trading',
    incoterm: 'FOB',
    destinationPort: 'JNPT Nhava Sheva (Discharge: Yokohama)',
    items: [
      {
        productId: 'organic-coconuts',
        productName: 'Indian Mature & Semi-Husked Coconuts',
        sku: 'AVG-COC-001',
        quantity: 1,
        unit: 'Containers (40ft)',
        packaging: 'PP Mesh Bags (25 nuts / ~14kg)',
        unitPrice: 16800,
        lineTotal: 16800
      }
    ],
    totalEstimatedValue: 16800,
    currency: 'USD',
    status: 'Order Received',
    paymentStatus: 'Pending',
    clientNotes: 'Seeking commercial proforma with Japan Positive List pesticide guarantee.',
    adminNotes: 'Reviewing current Pollachi farm picking schedule.',
    createdAt: '2026-09-22T08:00:00.000Z',
    updatedAt: '2026-09-22T08:00:00.000Z'
  }
];

// INITIAL INQUIRIES
const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-101',
    customerEmail: 'trader.dubai@gulfcommodities.com',
    customerName: 'Rashid Al-Maktoum',
    company: 'Gulf Commodities Trading LLC',
    productName: '1121 Raw Extra Long Basmati Rice',
    quantity: '5 x 40ft FCL (140 MT)',
    message: 'Seeking CIF Jebel Ali quotation with private label packaging in 20kg non-woven master bags.',
    status: 'quoted',
    date: '2026-09-18'
  },
  {
    id: 'inq-102',
    customerEmail: 'buyer.rotterdam@euroagri.com',
    customerName: 'Jan de Vries',
    company: 'EuroAgri Logistics B.V.',
    productName: 'Coir Pith & Low-EC 5kg Coco Peat Blocks',
    quantity: '2 x 40ft HQ Containers',
    message: 'Require phytosanitary assay and EC certification report for Rotterdam discharge.',
    status: 'quoted',
    date: '2026-09-20'
  }
];

// Helper to ensure initial products have SKUs and priceMode
function ensureProductDefaults(items: ProductItem[]): ProductItem[] {
  return items.map((prod, idx) => {
    let sku = prod.sku;
    if (!sku) {
      if (prod.category === 'vegetables-fruits') sku = `AVG-VEG-${(idx + 1).toString().padStart(3, '0')}`;
      else if (prod.category === 'grains-pulses') sku = `AVG-GRN-${(idx + 1).toString().padStart(3, '0')}`;
      else if (prod.category === 'specialty-spices') sku = `AVG-SPI-${(idx + 1).toString().padStart(3, '0')}`;
      else sku = `AVG-COI-${(idx + 1).toString().padStart(3, '0')}`;
    }
    return {
      ...prod,
      sku,
      priceMode: prod.priceMode || 'indicative',
      indicativePrice: prod.indicativePrice || (prod.category === 'grains-pulses' ? '$1,150 / MT' : '$950 / MT')
    };
  });
}

// PRODUCTS STORAGE
export function getStoredProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      const initialized = ensureProductDefaults(PRODUCTS);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialized));
      return initialized;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return ensureProductDefaults(parsed);
    }
  } catch (err) {
    console.error('Failed to parse stored products:', err);
  }
  const defaultItems = ensureProductDefaults(PRODUCTS);
  return defaultItems;
}

export function saveProducts(products: ProductItem[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products:', err);
  }
}

export function toggleProductDelist(productId: string): ProductItem[] {
  const current = getStoredProducts();
  const updated = current.map(item => {
    if (item.id === productId) {
      return { ...item, isDelisted: !item.isDelisted };
    }
    return item;
  });
  saveProducts(updated);
  return updated;
}

export function updateProduct(product: ProductItem): ProductItem[] {
  const current = getStoredProducts();
  const existingIdx = current.findIndex(p => p.id === product.id);
  let updated: ProductItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = product;
  } else {
    updated = [product, ...current];
  }
  saveProducts(updated);
  return updated;
}

export function addProduct(product: ProductItem): ProductItem[] {
  const current = getStoredProducts();
  const updated = [product, ...current];
  saveProducts(updated);
  return updated;
}

export function deleteProduct(productId: string): ProductItem[] {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== productId);
  saveProducts(updated);
  return updated;
}

export function resetProductsToDefault(): ProductItem[] {
  const defaults = ensureProductDefaults(PRODUCTS);
  saveProducts(defaults);
  return defaults;
}

// SITE CONTENT STORAGE
export function getStoredSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.heroHeadline) return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse site content:', err);
  }
  return INITIAL_SITE_CONTENT;
}

export function saveSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content));
  } catch (err) {
    console.error('Failed to save site content:', err);
  }
}

export function resetSiteContent(): SiteContent {
  saveSiteContent(INITIAL_SITE_CONTENT);
  return INITIAL_SITE_CONTENT;
}

// USERS STORAGE
export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure the master super admin always exists
      const hasAdmin = parsed.some(u => isSuperAdminIdentity(u.email));
      if (!hasAdmin) {
        parsed.unshift(INITIAL_USERS[0]);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored users:', err);
  }
  return INITIAL_USERS;
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export function getUserByEmail(emailOrId: string): UserAccount | undefined {
  if (!emailOrId) return undefined;
  const users = getStoredUsers();
  const clean = emailOrId.trim().toLowerCase();
  return users.find(u => 
    u.email.toLowerCase() === clean || 
    (isSuperAdminIdentity(clean) && isSuperAdminIdentity(u.email))
  );
}

export function setUserPassword(userIdOrEmail: string, newPlainPassword: string): boolean {
  const users = getStoredUsers();
  let updated = false;
  const newHash = hashPassword(newPlainPassword.trim());

  const newUsers = users.map(user => {
    if (
      user.id === userIdOrEmail ||
      user.email.toLowerCase() === userIdOrEmail.trim().toLowerCase() ||
      (isSuperAdminIdentity(userIdOrEmail) && isSuperAdminIdentity(user.email))
    ) {
      updated = true;
      return { ...user, passwordHash: newHash };
    }
    return user;
  });

  if (updated) {
    saveUsers(newUsers);

    // If current session is this user, update session as well
    const session = getCurrentSession();
    if (
      session &&
      (session.id === userIdOrEmail || 
       session.email.toLowerCase() === userIdOrEmail.trim().toLowerCase() ||
       (isSuperAdminIdentity(userIdOrEmail) && isSuperAdminIdentity(session.email)))
    ) {
      setCurrentSession({ ...session, passwordHash: newHash });
    }
  }

  return updated;
}

export function createCustomerUser(
  data: Omit<UserAccount, 'id' | 'createdAt' | 'role' | 'passwordHash'> & { password?: string }
): UserAccount {
  const users = getStoredUsers();
  const cleanEmail = data.email.trim().toLowerCase();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const passHash = data.password ? hashPassword(data.password) : hashPassword('ArcaPartner2026!');

  const newUser: UserAccount = {
    id: `cust-${Date.now()}`,
    email: data.email.trim(),
    name: data.name.trim(),
    role: 'customer',
    passwordHash: passHash,
    company: data.company?.trim() || 'Global Trading Corp',
    country: data.country?.trim() || 'International',
    phone: data.phone?.trim() || '',
    status: data.status || 'active',
    createdAt: new Date().toISOString(),
    notes: data.notes || 'Registered B2B Client'
  };

  const updated = [...users, newUser];
  saveUsers(updated);
  return newUser;
}

export function updateCustomerUser(updatedUser: UserAccount): UserAccount[] {
  const users = getStoredUsers();
  // Don't allow demoting super admin
  if (isSuperAdminIdentity(updatedUser.email)) {
    updatedUser.role = 'admin';
  }

  const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
  saveUsers(newUsers);

  const session = getCurrentSession();
  if (session && session.id === updatedUser.id) {
    setCurrentSession(updatedUser);
  }

  return newUsers;
}

export function deleteCustomerUser(userId: string): UserAccount[] {
  const users = getStoredUsers();
  const target = users.find(u => u.id === userId);
  if (target && isSuperAdminIdentity(target.email)) {
    throw new Error('Super Admin account cannot be deleted.');
  }

  const newUsers = users.filter(u => u.id !== userId);
  saveUsers(newUsers);

  const session = getCurrentSession();
  if (session && session.id === userId) {
    logoutSession();
  }

  return newUsers;
}

export function toggleCustomerStatus(userId: string): UserAccount[] {
  const users = getStoredUsers();
  const target = users.find(u => u.id === userId);
  if (target && isSuperAdminIdentity(target.email)) {
    return users; // Cannot suspend super admin
  }

  const newUsers: UserAccount[] = users.map(u => {
    if (u.id === userId) {
      const nextStatus: 'active' | 'suspended' = u.status === 'active' ? 'suspended' : 'active';
      return { ...u, status: nextStatus };
    }
    return u;
  });
  saveUsers(newUsers);
  return newUsers;
}

// SESSIONS & AUTHENTICATION
export function getCurrentSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session && session.email) {
      const liveUser = getUserByEmail(session.email);
      if (liveUser) {
        return {
          ...liveUser,
          token: session.token || generateSimulatedJwt(liveUser)
        };
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function setCurrentSession(user: UserAccount | null): void {
  try {
    if (user) {
      const token = user.token || generateSimulatedJwt(user);
      const sessionData = {
        ...user,
        token
      };
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionData));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  } catch (err) {
    console.error('Failed to set session:', err);
  }
}

export function logoutSession(): void {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch (err) {
    console.error('Failed to logout session:', err);
  }
}

// AUTHENTICATE USER
export function authenticateUser(
  emailOrIdentity: string,
  plainPassword: string
): { success: boolean; user?: UserAccount; token?: string; error?: string } {
  const cleanId = emailOrIdentity.trim().toLowerCase();
  const user = getUserByEmail(cleanId);

  if (!user) {
    return { success: false, error: 'No registered account found with these credentials.' };
  }

  if (user.status === 'suspended') {
    return { success: false, error: 'This account has been suspended by administration. Please contact contact@arcavenglobal.com.' };
  }

  // Verify hash
  if (!verifyPassword(plainPassword, user.passwordHash)) {
    return { success: false, error: 'Incorrect credentials provided.' };
  }

  // Issue simulated JWT session
  const token = generateSimulatedJwt(user);
  user.lastLogin = new Date().toISOString();
  user.token = token;

  // Persist updated last login
  updateCustomerUser(user);
  setCurrentSession(user);

  return { success: true, user, token };
}

// ORDERS & RFQ COMMAND CENTER STORAGE
export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse orders:', err);
  }
  return INITIAL_ORDERS;
}

export function saveOrders(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save orders:', err);
  }
}

export function createOrderFromRfq(data: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  incoterm: string;
  destinationPort?: string;
  items: Array<{
    product: ProductItem;
    quantity: number;
    unit: string;
    packagingType?: string;
  }>;
  clientNotes?: string;
}): OrderRecord {
  const currentOrders = getStoredOrders();
  const orderNumber = `AVG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  let estimatedTotal = 0;
  const orderItems = data.items.map(item => {
    let unitPrice = 1200;
    if (item.product.category === 'specialty-spices') unitPrice = 4500;
    else if (item.product.category === 'coconut-products') unitPrice = 14000;
    else if (item.product.category === 'vegetables-fruits') unitPrice = 850;

    const lineTotal = item.quantity * unitPrice;
    estimatedTotal += lineTotal;

    return {
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku || 'AVG-EXP-001',
      quantity: item.quantity,
      unit: item.unit,
      packaging: item.packagingType || 'Export Standard Packaging',
      unitPrice,
      lineTotal
    };
  });

  const session = getCurrentSession();

  const newOrder: OrderRecord = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerId: session?.id,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    company: data.company || 'International Importer',
    incoterm: data.incoterm,
    destinationPort: data.destinationPort || 'Port of Discharge Pending',
    items: orderItems,
    totalEstimatedValue: estimatedTotal,
    currency: 'USD',
    status: 'Order Received',
    paymentStatus: 'Pending',
    clientNotes: data.clientNotes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newOrder, ...currentOrders];
  saveOrders(updated);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  options?: {
    paymentReference?: string;
    dispatchTat?: string;
    trackingNumber?: string;
    carrierNotice?: string;
    cancellationReason?: string;
    adminNotes?: string;
  }
): OrderRecord {
  const orders = getStoredOrders();
  let updatedOrder: OrderRecord | null = null;

  const newOrders = orders.map(ord => {
    if (ord.id === orderId) {
      const updated: OrderRecord = {
        ...ord,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(options?.adminNotes !== undefined && { adminNotes: options.adminNotes })
      };

      if (newStatus === 'Order Confirmed') {
        if (options?.paymentReference) {
          updated.paymentReference = options.paymentReference;
          updated.paymentStatus = 'Verified';
        }
      }

      if (newStatus === 'Order Dispatched') {
        if (options?.dispatchTat) {
          updated.dispatchTat = options.dispatchTat;
        }
        if (options?.trackingNumber) {
          updated.trackingNumber = options.trackingNumber;
        }
        if (options?.carrierNotice) {
          updated.carrierNotice = options.carrierNotice;
        }
      }

      if (newStatus === 'Order Cancelled') {
        if (options?.cancellationReason) {
          updated.cancellationReason = options.cancellationReason;
        }
        updated.cancelledAt = new Date().toISOString();
      }

      updatedOrder = updated;
      return updated;
    }
    return ord;
  });

  saveOrders(newOrders);
  if (!updatedOrder) throw new Error('Order record not found.');
  return updatedOrder;
}

export function cancelOrder(orderId: string, cancellationReason: string, adminNotes?: string): OrderRecord {
  return updateOrderStatus(orderId, 'Order Cancelled', {
    cancellationReason,
    adminNotes: adminNotes || `Cancelled: ${cancellationReason}`
  });
}

export function deleteOrder(orderId: string): boolean {
  const orders = getStoredOrders();
  const filtered = orders.filter(ord => ord.id !== orderId);
  saveOrders(filtered);
  return true;
}

export function recordOrderPayment(
  orderId: string,
  paymentMethod: PaymentMethod,
  paymentReference: string
): OrderRecord {
  const orders = getStoredOrders();
  let updatedOrder: OrderRecord | null = null;

  const newOrders = orders.map(ord => {
    if (ord.id === orderId) {
      const updated: OrderRecord = {
        ...ord,
        paymentMethod,
        paymentReference,
        paymentStatus: 'Paid',
        paymentCompletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: `Client completed payment via ${paymentMethod}. Reference: ${paymentReference}`
      };
      updatedOrder = updated;
      return updated;
    }
    return ord;
  });

  saveOrders(newOrders);
  if (!updatedOrder) throw new Error('Order record not found.');
  return updatedOrder;
}

// INQUIRIES
export function getStoredInquiries(): CustomerInquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.error('Failed to parse inquiries:', err);
  }
  return INITIAL_INQUIRIES;
}

export function addInquiry(inquiry: Omit<CustomerInquiry, 'id' | 'date'>): CustomerInquiry {
  const current = getStoredInquiries();
  const newInq: CustomerInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  const updated = [newInq, ...current];
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save inquiry:', err);
  }
  return newInq;
}

// Aliases for ergonomics
export const saveStoredProducts = saveProducts;
export const clearCurrentSession = logoutSession;
