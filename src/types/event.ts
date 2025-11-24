export interface EventType {
  _id: string;
  title: string;
  date: string; // ISO date string
  location: string;
  time: string;
  description?: string;
  isPublished: boolean;

  // 🔽 New fields to support the details modal
  address?: string;
  externalUrl?: string;
  heroImageUrl?: string;
}
