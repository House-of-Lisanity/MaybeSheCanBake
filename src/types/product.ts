// types/product.ts

export enum ProductCategory {
  All = "All",
  Cookies = "Cookies",
  DessertBars = "Dessert Bars",
  Muffins = "Muffins",
  Cakes = "Cakes",
}

export interface ProductType {
  _id: string;
  name: string;
  category: ProductCategory;
  price?: string;
  description?: string;
  highlights?: string[];
  ingredients?: string[];
  imageUrl?: string;
  isAvailable: boolean;
}
