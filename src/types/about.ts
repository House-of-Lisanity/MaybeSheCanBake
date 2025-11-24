// src/types/about.ts

export interface AboutSectionType {
  _id: string;
  sectionKey: string; // or a union like "baker" | "bakery" | "ingredients" | ...
  title: string;
  subtitle?: string;
  body: string;

  imageUrl?: string;
  imagePublicId?: string;
  imageAlt?: string;

  isVisible: boolean;
  sortOrder?: number;
  adminNotes?: string;

  createdAt?: string;
  updatedAt?: string;
}
