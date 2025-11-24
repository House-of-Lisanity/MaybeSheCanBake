// src/types/category.ts
export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  order?: number;
  imageUrl?: string;
  description?: string;
}
