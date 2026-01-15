// src/types/flashSale.ts

export interface FlashSaleProduct {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  quantity?: number;
  contents?: string[];
}

export interface FlashSaleType {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  
  startDate: string;
  endDate: string;
  isActive: boolean;
  
  products: FlashSaleProduct[];
  
  bannerImageUrl?: string;
  bannerText?: string;
  
  pickupInstructions?: string;
  disclaimers?: string[];
  giftMessageEnabled: boolean;
  
  orderCount: number;
  totalRevenue: number;
  
  createdAt?: string;
  updatedAt?: string;
}
