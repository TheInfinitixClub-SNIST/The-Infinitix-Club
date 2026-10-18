import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Instagram } from 'lucide-react';
import { supabase, TeamMember } from '../lib/supabase';
import { INITIAL_TEAM_MEMBERS } from '../lib/seed';

// Helper function to extract 2-letter uppercase initials for fallback avatars
const getInitials = (name: string): string => {
  if (!name) return 'IC';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'IC';
  const nonHonorifics = parts.filter(
    (p) => !/^(dr\.?|prof\.?|mr\.?|ms\.?|mrs\.?)$/i.test(p)
  );
  const target = nonHonorifics.length > 0 ? nonHonorifics : parts;
  if (target.length === 1) return target[0].slice(0, 2).toUpperCase();
  return (target[0][0] + target[target.length - 1][0]).toUpperCase();
};

const FALLBACK_TEAM: TeamMember[] = INITIAL_TEAM_MEMBERS.map((m, index) => ({
  ...m,
  id: `fallback-${index + 1}`,
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (error) {
        setMembers(FALLBACK_TEAM);
      } else if (data && data.length > 0) {
        setMembers(data as TeamMember[]);
      } else {
        setMembers(FALLBACK_TEAM);
      }
    } catch {
      setMembers(FALLBACK_TEAM);
    }
  };

  useEffect(() => {
    fetchTeamMembers();

    const channel = supabase
      .channel('team_members_live_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members' },
        () => {
          fetchTeamMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Split into distinct leadership tiers
  const whoDrivesMembers = members.filter(
    (m) =>
      m.tier === 'who_drives' ||
      (m.tier === 'advisory' &&
        /hod|head of department|faculty advisor|patron/i.test(m.role))
  );

  const advisoryMembers = members.filter(
    (m) => m.tier === 'advisory' && !whoDrivesMembers.includes(m)
  );

  const steeringMembers = members.filter((m) => m.tier === 'steering');
  const techMembers = members.filter((m) => m.tier === 'working_tech');
  const nonTechMembers = members.filter((m) => m.tier === 'working_non_tech');

  return (
    <section id="team" className="relative w-full max-w-7xl mx-auto my-20 sm:my-28 px-4 sm:px-6 lg:px-8">
      <div className="space-y-20 sm:space-y-24">
        {/*
          ========================================================================
          1. "Who Drives Our Club" (Horizontal Capsule Cards - Style 1)
          ========================================================================
        */}
        {whoDrivesMembers.length > 0 && (
          <div>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
              <span className="text-white">Who Drives </span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Our Club</span>
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {whoDrivesMembers.map((member) => (
                <HorizontalCapsuleCard key={member.id} member={member} />
              ))}
            </motion.div>
          </div>
        )}

        {/*
          ========================================================================
          2. "Advisory Board Members" (Horizontal Capsule Cards - Style 1)
          ========================================================================
        */}
        {advisoryMembers.length > 0 && (
          <div>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
              <span className="text-white">Advisory Board </span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Members</span>
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {advisoryMembers.map((member) => (
                <HorizontalCapsuleCard key={member.id} member={member} />
              ))}
            </motion.div>
          </div>
        )}

        {/*
          ========================================================================
          3. "Steering Body" (Vertical Full-Picture Cards - Style 2)
          ========================================================================
        */}
        {steeringMembers.length > 0 && (
          <div>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
              <span className="text-white">Steering </span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Body</span>
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {steeringMembers.map((member) => (
                <VerticalCard key={member.id} member={member} />
              ))}
            </motion.div>
          </div>
        )}

        {/*
          ========================================================================
          4. "Working Body" (Sub-rows: Technical Team & Non-Technical Team)
          ========================================================================
        */}
        {(techMembers.length > 0 || nonTechMembers.length > 0) && (
          <div>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-10">
              <span className="text-white">Working </span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Body</span>
            </h3>

            <div className="space-y-12">
              {/* Sub-row 1: Technical Team */}
              {techMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="w-1 h-5 bg-cyan-400 rounded-full" aria-hidden="true" />
                    <h4 className="text-lg font-bold text-cyan-200 tracking-wide">
                      Technical Team
                    </h4>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  >
                    {techMembers.map((member) => (
                      <VerticalCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Sub-row 2: Non-Technical Team */}
              {nonTechMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="w-1 h-5 bg-purple-400 rounded-full" aria-hidden="true" />
                    <h4 className="text-lg font-bold text-cyan-200 tracking-wide">
                      Non-Technical Team
                    </h4>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  >
                    {nonTechMembers.map((member) => (
                      <VerticalCard key={member.id} member={member} />
                    ))}
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/*
  ==============================================================================
  STRUCTURE STYLE 1: Horizontal Pill / Capsule Panel Card
  Used for: "Who Drives Our Club" & "Advisory Board Members"
  ==============================================================================
*/
interface CardProps {
  member: TeamMember;
}

const HorizontalCapsuleCard: React.FC<CardProps> = ({ member }) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(member.name);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full md:rounded-[40px] p-3 pr-8 flex items-center gap-6 relative group hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* 1. Member Photo: Circular portrait */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shrink-0 ring-2 ring-white/15 group-hover:ring-cyan-400/60 transition-all duration-300 bg-slate-900 flex items-center justify-center">
        {member.image_url && !imgError ? (
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-cyan-500/30 via-purple-600/30 to-cyan-400/20 flex items-center justify-center text-cyan-200 font-bold text-xl tracking-wider select-none">
            {initials}
          </div>
        )}
      </div>

      {/* 2. Info & Details: Name & Designation / Department */}
      <div className="flex-1 min-w-0">
        <h4 className="text-lg md:text-xl font-bold text-white tracking-wide truncate">
          {member.name}
        </h4>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
          {member.role}
          {member.department ? ` · ${member.department}` : ''}
        </p>
      </div>

      {/* 3. Social Action: Clean rounded glass buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-cyan-400 transition-colors"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {member.instagram_url && (
          <a
            href={member.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-cyan-400 transition-colors"
            aria-label={`${member.name}'s Instagram profile`}
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

/*
  ==============================================================================
  STRUCTURE STYLE 2: Full-Picture Vertical Card
  Used for: "Steering Body", "Technical Team", and "Non-Technical Team"
  ==============================================================================
*/
const VerticalCard: React.FC<CardProps> = ({ member }) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(member.name);

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center group hover:border-purple-400/50 hover:shadow-[0_0_24px_rgba(138,43,226,0.25)] transition-all duration-500 hover:-translate-y-2"
    >
      {/* 1. Photo Container: Full rectangular/square photo with smooth rounded corners aspect-[4/5] */}
      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-white/10 bg-slate-900 mb-4 flex items-center justify-center">
        {member.image_url && !imgError ? (
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-purple-500/25 via-cyan-500/20 to-purple-400/15 flex items-center justify-center text-cyan-200 font-bold text-2xl tracking-wider select-none">
            {initials}
          </div>
        )}
      </div>

      {/* 2. Member Info: Name in bold typography */}
      <h4 className="text-lg font-bold text-white mt-1 tracking-tight">
        {member.name}
      </h4>

      {/* 3. Role / Designation: Uppercase cyan text */}
      <p className="text-xs font-semibold tracking-wider text-cyan-400 mt-1 uppercase">
        {member.role}
      </p>

      {/* 4. Social Links: Centered row with Instagram and LinkedIn buttons */}
      <div className="flex items-center justify-center gap-3 mt-3">
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-cyan-400 transition-colors shadow-sm"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {member.instagram_url && (
          <a
            href={member.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-cyan-400 transition-colors shadow-sm"
            aria-label={`${member.name}'s Instagram profile`}
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};
