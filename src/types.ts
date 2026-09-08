export type TourType = 'yoga' | 'hiking' | 'eco' | 'cultural';
export type Difficulty = 'easy' | 'moderate' | 'hard';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  destination: string;
  tour_type: TourType;
  difficulty: Difficulty;
  duration_days: number;
  price_toman: number;
  image_url: string;
  gallery: string[];
  description: string;
  itinerary: ItineraryDay[];
  included_services: string[];
  guide_name: string;
  guide_bio: string;
  guide_avatar_url: string;
  safety_guidelines: string[];
  max_group_size: number;
  rating: number;
}

export interface Booking {
  id?: string;
  tour_id: string;
  full_name: string;
  phone: string;
  national_id: string;
  room_sharing: boolean;
  receipt_file_name: string | null;
  status?: string;
  created_at?: string;
}

export const tourTypeLabels: Record<TourType, string> = {
  yoga: 'یوگا و سلامتی',
  hiking: 'کوهپیمایی',
  eco: 'اکوتور',
  cultural: 'فرهنگی',
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: 'آسان',
  moderate: 'متوسط',
  hard: 'سخت',
};

export const tourTypeIcons: Record<TourType, string> = {
  yoga: 'yoga',
  hiking: 'hiking',
  eco: 'eco',
  cultural: 'cultural',
};

export function formatToman(amount: number): string {
  return amount.toLocaleString('fa-IR');
}
