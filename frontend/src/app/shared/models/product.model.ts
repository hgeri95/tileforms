export interface ProductVariant {
  id: string;
  color: string | null;
  size: string | null;
  sku: string;
  priceOverride: number | null;
  stockQuantity: number;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  category: 'BOX' | 'COFFEE_TABLE';
  imageUrl: string | null;
  isActive: boolean;
  variants: ProductVariant[];
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductFilter {
  category?: string;
  page?: number;
  size?: number;
}
