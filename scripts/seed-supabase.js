/**
 * Standalone CLI Seeding Script for Infinitix Supabase Database
 * Usage: node scripts/seed-supabase.js [OPTIONAL_SERVICE_ROLE_KEY]
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sihuxkmkkwxvrizfbdnn.supabase.co';
const SUPABASE_KEY = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-dwuvsBF9r_2N0vW4zCpOA_J4PBylRi';

console.log(`Connecting to Supabase at: ${SUPABASE_URL}`);
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_TEAM_MEMBERS = [
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

async function seed() {
  console.log('Seeding team_members...');
  const { data: teamData, error: teamErr } = await client
    .from('team_members')
    .insert(INITIAL_TEAM_MEMBERS)
    .select();

  if (teamErr) {
    console.error('Error inserting team_members:', teamErr.message);
  } else {
    console.log(`Successfully seeded ${teamData.length} team members!`);
  }
}

seed();
