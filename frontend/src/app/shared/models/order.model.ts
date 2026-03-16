export interface OrderItem {
  id: string;
  productVariantId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string | null;
  email: string;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  trackingNumber: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderRequest {
  email: string;
  shippingAddressId?: string;
  billingAddressId?: string;
  currency?: string;
  items: Array<{
    productVariantId: string;
    quantity: number;
    unitPrice: number;
  }>;
}
