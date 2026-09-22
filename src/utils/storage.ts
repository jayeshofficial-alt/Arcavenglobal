import { ProductItem, UserAccount, CustomerInquiry } from '../types';
import { PRODUCTS } from '../data/productsData';

export const ADMIN_EMAIL = 'jayeshofficial@gmail.com';

const PRODUCTS_STORAGE_KEY = 'arcaven_global_products_v2';
const USERS_STORAGE_KEY = 'arcaven_global_users_v2';
const CURRENT_SESSION_KEY = 'arcaven_global_session_v2';
const INQUIRIES_STORAGE_KEY = 'arcaven_global_inquiries_v2';

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-jayesh',
    email: ADMIN_EMAIL,
    name: 'Jayesh (Admin)',
    role: 'admin',
    password: 'ArcaAdmin@2026',
    company: 'Arca Ventures Global',
    country: 'India',
    phone: '+91 9860215449',
    status: 'active',
    createdAt: '2026-01-15T08:00:00.000Z',
    notes: 'Primary Master Admin Account'
  },
  {
    id: 'user-cust-1',
    email: 'trader.dubai@gulfcommodities.com',
    name: 'Rashid Al-Maktoum',
    role: 'customer',
    password: 'Customer@123',
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
    password: 'Customer@123',
    company: 'EuroAgri Logistics B.V.',
    country: 'Netherlands',
    phone: '+31 10 412 8890',
    status: 'active',
    createdAt: '2026-03-01T14:15:00.000Z',
    notes: 'European Fresh Produce & Organic Coconut By-Products'
  }
];

const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-101',
    customerEmail: 'trader.dubai@gulfcommodities.com',
    customerName: 'Rashid Al-Maktoum',
    company: 'Gulf Commodities Trading LLC',
    productName: '1121 Raw Extra Long Basmati Rice',
    quantity: '5 x 40ft FCL (140 MT)',
    message: 'Seeking CIF Jebel Ali quotation with private label packaging in 20kg non-woven master bags.',
    status: 'reviewed',
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
    status: 'new',
    date: '2026-09-21'
  }
];

// PRODUCTS STORAGE
export function getStoredProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      // Initialize with default products
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored products:', err);
  }
  return PRODUCTS;
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
  saveProducts(PRODUCTS);
  return PRODUCTS;
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
      // Ensure the master admin always exists
      const hasAdmin = parsed.some(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
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

export function getUserByEmail(email: string): UserAccount | undefined {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function setUserPassword(userIdOrEmail: string, newPassword: string): boolean {
  const users = getStoredUsers();
  let updated = false;
  const newUsers = users.map(user => {
    if (
      user.id === userIdOrEmail ||
      user.email.toLowerCase() === userIdOrEmail.trim().toLowerCase()
    ) {
      updated = true;
      return { ...user, password: newPassword };
    }
    return user;
  });

  if (updated) {
    saveUsers(newUsers);

    // If current session is this user, update session as well
    const session = getCurrentSession();
    if (
      session &&
      (session.id === userIdOrEmail || session.email.toLowerCase() === userIdOrEmail.trim().toLowerCase())
    ) {
      setCurrentSession({ ...session, password: newPassword });
    }
  }

  return updated;
}

export function createCustomerUser(
  data: Omit<UserAccount, 'id' | 'createdAt' | 'role'>
): UserAccount {
  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser: UserAccount = {
    ...data,
    id: `cust-${Date.now()}`,
    role: 'customer',
    status: data.status || 'active',
    createdAt: new Date().toISOString()
  };

  const updated = [...users, newUser];
  saveUsers(updated);
  return newUser;
}

export function updateCustomerUser(updatedUser: UserAccount): UserAccount[] {
  const users = getStoredUsers();
  // Don't allow changing role of master admin
  if (updatedUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
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
  // Prevent deleting master admin
  const target = users.find(u => u.id === userId);
  if (target && target.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    throw new Error('Master Admin account cannot be deleted.');
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
  if (target && target.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return users; // Cannot suspend admin
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

// SESSIONS
export function getCurrentSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Re-verify that user still exists in current user registry
    if (session && session.email) {
      const liveUser = getUserByEmail(session.email);
      if (liveUser) {
        return liveUser;
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
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
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

