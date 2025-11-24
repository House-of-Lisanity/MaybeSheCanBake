import { CategoryType } from "./category";

export interface ProductType {
  _id: string;
  name: string;
  category: string | CategoryType;

  price?: string;
  description?: string;
  ingredients?: string[];

  imageUrl?: string;
  imagePublicId?: string;

  isAvailable: boolean;
  isVisible: boolean;
  showInGallery: boolean;
  isFeatured: boolean;

  dietary?: string[];
  allergens?: string[];
  flavors?: string[];
  tags?: string[];
  highlights?: string[];
  texture?: string;
  season?: string;
  shelfLife?: string;
  storage?: string;
  availability?: string;
  servings?: number;
}
