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
