export interface CartItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantInfo: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productVariantId: string;
  quantity: number;
}
