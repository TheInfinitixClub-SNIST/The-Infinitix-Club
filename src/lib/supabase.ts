import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://sihuxkmkkwxvrizfbdnn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_-dwuvsBF9r_2N0vW4zCpOA_J4PBylRi';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = (() => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Falling back to default Supabase client configuration:', err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
  }
})();

export type TeamTier = 'who_drives' | 'advisory' | 'steering' | 'working_tech' | 'working_non_tech';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: TeamTier;
  image_url?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  bio?: string | null;
  department?: string | null;
  order_index?: number | null;
  created_at?: string;
}

export type EventCategory = 'recent' | 'upcoming';

export interface ClubEvent {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  event_date?: string | null;
  venue?: string | null;
  tags?: string[] | null;
  cover_image_url?: string | null;
  registration_link?: string | null;
  created_at?: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title?: string | null;
  order_index?: number | null;
  created_at?: string;
}
