import { SupabaseClient } from '@supabase/supabase-js';
import { TeamMember, ClubEvent, TeamTier } from './supabase';

export interface SeedTeamMemberPayload {
  name: string;
  role: string;
  department: string | null;
  tier: TeamTier;
  image_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  bio: string | null;
  order_index: number;
}

export const INITIAL_TEAM_MEMBERS: SeedTeamMemberPayload[] = [
  // 1. Who Drives Our Club (HOD & Faculty Advisor)
  {
    name: 'Dr. Jaffar Sadiq',
    role: 'Head of Department',
    department: 'Department of CSE & AI, SNIST',
    tier: 'who_drives',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: null,
    bio: 'Pioneering institutional research, departmental roadmaps, and cutting-edge machine intelligence education.',
    order_index: 1,
  },
  {
    name: 'Dr. K. Premnadh',
    role: 'Faculty Advisor',
    department: 'Department of CSE & AI, SNIST',
    tier: 'who_drives',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: null,
    bio: 'Guiding student hackathon cohorts, competitive tech sprints, and laboratory research infrastructure.',
    order_index: 2,
  },

  // 2. Advisory Board Members
  {
    name: 'Anjanna Reddy',
    role: 'Advisory Board Member',
    department: 'Institutional Advisory Board',
    tier: 'advisory',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: null,
    bio: 'Advising on institutional alignment, industrial research partnerships, and student mentorship.',
    order_index: 1,
  },
  {
    name: 'P. Rishikesh',
    role: 'Advisory Board Member',
    department: 'Technical Advisory Board',
    tier: 'advisory',
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: null,
    bio: 'Steering high-performance technical frameworks, data hackathons, and corporate relations.',
    order_index: 2,
  },

  // 3. Steering Body
  {
    name: 'Rohan Varma',
    role: 'President',
    department: 'Executive Council',
    tier: 'steering',
    image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Overseeing club operations, strategic project sprints, and university competitions.',
    order_index: 1,
  },
  {
    name: 'Meghana Reddy',
    role: 'General Secretary',
    department: 'Executive Council',
    tier: 'steering',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Orchestrating executive council communications, financial governance, and session coordination.',
    order_index: 2,
  },
  {
    name: 'Aditya Challa',
    role: 'Public Relations Head',
    department: 'Executive Council',
    tier: 'steering',
    image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Leading external club alliances, brand outreach, press communication, and event sponsorships.',
    order_index: 3,
  },

  // 4. Working Body -> Technical Team
  {
    name: 'Kavya Sharma',
    role: 'Technical Head',
    department: 'Technical Team',
    tier: 'working_tech',
    image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Directing technical curricula, code reviews, container architectures, and hands-on bootcamps.',
    order_index: 1,
  },
  {
    name: 'Sai Teja',
    role: 'R&D Head',
    department: 'Technical Team',
    tier: 'working_tech',
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Managing experimental deep learning projects, Kaggle pipelines, and open-source models.',
    order_index: 2,
  },
  {
    name: 'Pranav Nair',
    role: 'Data Guide Coordinator',
    department: 'Technical Team',
    tier: 'working_tech',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Guiding junior cohorts in Python data engineering, matrix math, and statistical analysis.',
    order_index: 3,
  },

  // 5. Working Body -> Non-Technical Team
  {
    name: 'Pooja Nair',
    role: 'Marketing Head',
    department: 'Non-Technical Team',
    tier: 'working_non_tech',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Strategizing club marketing campaigns, newsletter publications, and member engagement.',
    order_index: 1,
  },
  {
    name: 'Vikas Chenna',
    role: 'Designing Head',
    department: 'Non-Technical Team',
    tier: 'working_non_tech',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Crafting high-fidelity motion graphics, digital brand identities, and presentation assets.',
    order_index: 2,
  },
  {
    name: 'Sneha Roy',
    role: 'Publicity Head',
    department: 'Non-Technical Team',
    tier: 'working_non_tech',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Coordinating cross-department publicity blitzes, campus notices, and online promotions.',
    order_index: 3,
  },
  {
    name: 'Rahul Verma',
    role: 'Organizing Head',
    department: 'Non-Technical Team',
    tier: 'working_non_tech',
    image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Managing auditorium bookings, venue staging, audio-visual technical setups, and schedules.',
    order_index: 4,
  },
  {
    name: 'Divya Reddy',
    role: 'Documentation Head',
    department: 'Non-Technical Team',
    tier: 'working_non_tech',
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    linkedin_url: 'https://linkedin.com',
    instagram_url: 'https://instagram.com',
    bio: 'Documenting technical workshops, managing club repositories, and generating activity summaries.',
    order_index: 5,
  },
];

export const INITIAL_EVENTS: Omit<ClubEvent, 'id' | 'created_at'>[] = [
  // Upcoming Events
  {
    title: 'GenAI & Autonomous Agent Hackfest 2026',
    category: 'upcoming',
    event_date: 'November 14-15, 2026',
    venue: 'Main Campus Auditorium & AI Research Lab',
    tags: ['GenAI', 'Multi-Agent', 'Hackathon'],
    cover_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    registration_link: 'https://forms.gle/infinitix-agent-hackfest-2026',
    description:
      'A 36-hour flagship hackathon challenging engineering students to architect multimodal AI agents, autonomous tool-use workflows, and real-time enterprise AI solutions with mentorship from leading AI researchers.',
  },
  {
    title: 'Deep Learning & Neural Graphics Masterclass',
    category: 'upcoming',
    event_date: 'December 05, 2026',
    venue: 'Block IV Computing Complex, SNIST',
    tags: ['Deep Learning', 'PyTorch', 'Computer Vision'],
    cover_image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    registration_link: 'https://forms.gle/infinitix-neural-masterclass',
    description:
      'Intensive hands-on workshop covering NeRFs, 3D Gaussian Splatting, diffusion models, and real-time PyTorch inference optimization on modern GPU clusters.',
  },

  // Recent Events
  {
    title: 'Club Orientation & Induction 2025',
    category: 'recent',
    event_date: 'August 24, 2025',
    venue: 'Auditorium Hall 1, SNIST Campus',
    tags: ['Cohort Onboarding', 'Keynote', 'Roadmaps'],
    cover_image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
    registration_link: null,
    description:
      'The Infinitix Annual Induction marked the commencement of our academic session. Over 250 freshers gathered at the main campus auditorium for an interactive keynote introducing club initiatives, project roadmaps, and the upcoming competitive hackathon calendar.',
  },
  {
    title: 'Machine Learning Bootcamp: Zero to Kaggle',
    category: 'recent',
    event_date: 'October 12-13, 2025',
    venue: 'AI Research Computing Lab, Block IV',
    tags: ['Hands-on Sprint', 'Machine Learning', 'Kaggle'],
    cover_image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    registration_link: null,
    description:
      'An immersive 2-day technical bootcamp where students transitioned from raw dataset ingestion to hyperparameter tuning and model deployment. Mentors guided cohorts through real-world Kaggle datasets and feature engineering pipelines.',
  },
  {
    title: 'Data Hackathon: CodeSprint 2.0',
    category: 'recent',
    event_date: 'January 18-19, 2026',
    venue: 'Central Campus Incubation Center, SNIST',
    tags: ['24-Hour Hackathon', 'Data Science', 'Prototypes'],
    cover_image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    registration_link: null,
    description:
      'Our flagship annual 24-hour sprint brought together 40+ multidisciplinary teams. Participants solved pressing challenges across Healthcare AI, Smart Campus Analytics, and Financial Fraud Detection with live cloud container deployments.',
  },
];

export async function seedInitialData(client: SupabaseClient): Promise<{
  teamInserted: number;
  eventsInserted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let teamInserted = 0;
  let eventsInserted = 0;

  // Clean, strictly validated payload to ensure every tier is valid and non-empty
  const validTiers = new Set([
    'who_drives',
    'advisory',
    'steering',
    'working_tech',
    'working_non_tech',
  ]);

  const sanitizedTeam = INITIAL_TEAM_MEMBERS.map((m) => {
    if (!validTiers.has(m.tier)) {
      throw new Error(`Invalid tier '${m.tier}' for member '${m.name}'`);
    }
    return {
      name: m.name.trim(),
      role: m.role.trim(),
      tier: m.tier,
      department: m.department ? m.department.trim() : null,
      image_url: m.image_url ? m.image_url.trim() : null,
      linkedin_url: m.linkedin_url ? m.linkedin_url.trim() : null,
      instagram_url: m.instagram_url ? m.instagram_url.trim() : null,
      bio: m.bio ? m.bio.trim() : null,
      order_index: typeof m.order_index === 'number' ? m.order_index : 0,
    };
  });

  // Attempt batch insertion first
  try {
    const { data, error } = await client
      .from('team_members')
      .insert(sanitizedTeam)
      .select();

    if (error) {
      errors.push(`Team members batch insert error: ${error.message}`);
      // Fallback: Try item by item insertion
      for (const member of sanitizedTeam) {
        try {
          const res = await client.from('team_members').insert([member]).select();
          if (res.error) {
            errors.push(`Failed member '${member.name}': ${res.error.message}`);
          } else if (res.data) {
            teamInserted += res.data.length;
          }
        } catch (itemErr: any) {
          errors.push(`Failed member '${member.name}': ${itemErr.message}`);
        }
      }
    } else if (data) {
      teamInserted = data.length;
    }
  } catch (err: any) {
    errors.push(`Team members exception: ${err.message}`);
  }

  // Check if events table already has entries; if empty, seed events
  try {
    const { data: existingEvents } = await client
      .from('events')
      .select('id')
      .limit(1);

    if (!existingEvents || existingEvents.length === 0) {
      const { data, error } = await client
        .from('events')
        .insert(INITIAL_EVENTS)
        .select();

      if (error) {
        errors.push(`Events seed error: ${error.message}`);
      } else if (data) {
        eventsInserted = data.length;
      }
    } else {
      eventsInserted = existingEvents.length;
    }
  } catch (err: any) {
    errors.push(`Events exception: ${err.message}`);
  }

  return { teamInserted, eventsInserted, errors };
}
