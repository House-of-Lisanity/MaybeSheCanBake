export interface GalleryType {
  _id: string;
  url: string;
  caption?: string;
  isPublished: boolean;
  isHero: boolean;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
