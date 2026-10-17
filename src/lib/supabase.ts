import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Check your .env file (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
