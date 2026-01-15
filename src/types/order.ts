// src/types/order.ts

export interface OrderItem {
  productId?: string;
  productName: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderType {
  _id: string;
  type: "regular" | "flash_sale";
  flashSaleId?: string;
  
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  items: OrderItem[];
  subtotal: number;
  total: number;
  
  pickupLocation?: string;
  pickupDate?: string;
  deliveryNotes?: string;
  
  giftMessage?: string;
  isGift: boolean;
  
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  
  adminNotes?: string;
  
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: string;
  
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  
  createdAt?: string;
  updatedAt?: string;
}
