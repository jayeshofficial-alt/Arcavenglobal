export type ProductCategory = 
  | 'all'
  | 'vegetables-fruits'
  | 'grains-pulses'
  | 'specialty-spices'
  | 'coconut-products';

export interface ProductItem {
  id: string;
  name: string;
  category: 'vegetables-fruits' | 'grains-pulses' | 'specialty-spices' | 'coconut-products';
  categoryLabel: string;
  sku?: string;
  scientificName?: string;
  origin: string;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  moistureContent: string;
  purity: string;
  shelfLife: string;
  grade: string;
  packagingOptions: string[];
  moq: string; // Minimum Order Quantity
  loadAbility: string; // e.g. "24 MT per 40ft FCL Reefer"
  exportPorts: string[];
  certifications: string[];
  highlights: string[];
  isFeatured?: boolean;
  isDelisted?: boolean;
  priceMode?: 'rfq_only' | 'indicative';
  indicativePrice?: string; // e.g. "$1,150 / MT CIF"
  unitPriceNumeric?: number; // Numeric indicative price (USD)
  moqNumeric?: number; // Minimum Order Quantity numeric threshold (e.g. 1 container or 20 MT)
}

export type UserRole = 'admin' | 'customer';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string; // Salted secure hash representation - zero plaintext!
  token?: string; // JWT token simulation
  company?: string;
  phone?: string;
  country?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'Order Received'
  | 'Order Confirmed'
  | 'Order In-Process'
  | 'Order Dispatched'
  | 'Order Cancelled'
  | 'Delivered';

export type PaymentMethod = 
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'UPI';

export interface BankingSettings {
  upiId: string; // Default: "wagh.jayesh@oksbi"
  accountHolderName: string; // Default: "Jayesh Wagh"
  accountNumber: string; // e.g. "50100492817291"
  ifscCode: string; // e.g. "SBIN0001234"
  bankName: string; // e.g. "State Bank of India"
  branchName?: string;
  swiftBic?: string;
  payoutNotes?: string;
  isGatewayActive: boolean; // Active Commercial Operations vs Temporarily Suspend Transactions
  suspensionNotice?: string; // Corporate statutory notice
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  unit: string;
  packaging?: string;
  unitPrice?: number;
  lineTotal?: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string; // e.g. "AVG-2026-8941"
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  incoterm: string;
  destinationPort?: string;
  items: OrderItem[];
  totalEstimatedValue?: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: 'Pending' | 'Paid' | 'Verified';
  paymentMethod?: PaymentMethod;
  paymentReference?: string; // Captured Transaction / UTR / Reference ID
  paymentCompletedAt?: string;
  dispatchTat?: string; // Estimated Delivery TAT / Tracking Notice e.g. "3–5 business days via BlueDart Air"
  trackingNumber?: string;
  carrierNotice?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  clientNotes?: string;
  adminNotes?: string;
  isDeleted?: boolean; // Tier 1: Soft Delete to Trash Bin / Archive
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContent {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  stats: Array<{ label: string; value: string }>;
  legalDisclaimer: string;
  exportRegulatoryNotice: string;
  contactAddress: string;
  contactTerminal: string;
  contactPhone: string;
  contactEmail: string;
  contactHours: string;
  footerDisclaimer?: string;
}

export interface CustomerInquiry {
  id: string;
  customerEmail: string;
  customerName: string;
  company?: string;
  productName?: string;
  quantity?: string;
  message: string;
  status: 'new' | 'reviewed' | 'quoted' | 'closed';
  date: string;
}

export interface RfqItem {
  product: ProductItem;
  quantity: number;
  unit: 'MT' | 'Containers (20ft)' | 'Containers (40ft)' | 'Sample Box (5kg)';
  packagingType: string;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'harvest' | 'processing' | 'packaging' | 'logistics';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  company: string;
  country: string;
  countryFlag: string;
  comment: string;
  rating: number;
  productPurchased: string;
}

