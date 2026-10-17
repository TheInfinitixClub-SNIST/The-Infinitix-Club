import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Sprout, Compass, Crown } from 'lucide-react';

interface HierarchyTier {
  id: string;
  title: string;
  role: string;
  description: string;
  tierCode: string;
  status: string;
  icon: React.ElementType;
  accent: 'emerald' | 'cyan' | 'purple';
  tagColor: string;
  accentText: string;
  dotColor: string;
  iconContainer: string;
  hoverBorder: string;
  hoverShadow: string;
  radialGlow: string;
  ambientColor: string;
}

const HIERARCHY_TIERS: HierarchyTier[] = [
  {
    id: 'data-groots',
    title: 'Data Groots',
    role: 'Foundation & First-Year Members / Core Learners',
    description:
      'The budding talent pool beginning their journey in Data Science, participating in entry-level bootcamps, workshops, and peer projects.',
    tierCode: 'Tier 01 · Learners',
    status: 'Core Learners',
    icon: Sprout,
    accent: 'emerald',
    tagColor: 'text-emerald-400',
    accentText: 'text-emerald-300',
    dotColor: 'bg-emerald-400',
    iconContainer:
      'bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 ring-2 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    hoverBorder: 'hover:border-emerald-400/50',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(16,185,129,0.18)]',
    radialGlow:
      'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(16,185,129,0.14),transparent_40%)]',
    ambientColor: 'bg-emerald-500/30',
  },
  {
    id: 'data-guides',
    title: 'Data Guides',
    role: 'Mentors & Project Leads',
    description:
      'Experienced members guiding peer groups, organizing code sprints, managing hackathon teams, and mentoring the Data Groots.',
    tierCode: 'Tier 02 · Mentors',
    status: 'Project Leads',
    icon: Compass,
    accent: 'cyan',
    tagColor: 'text-cyan-400',
    accentText: 'text-cyan-300',
    dotColor: 'bg-cyan-400',
    iconContainer:
      'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 ring-2 ring-cyan-500/20 shadow-[0_0_20px_rgba(0,242,254,0.2)]',
    hoverBorder: 'hover:border-cyan-400/50',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(0,242,254,0.18)]',
    radialGlow:
      'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.14),transparent_40%)]',
    ambientColor: 'bg-cyan-500/30',
  },
  {
    id: 'data-heads',
    title: 'Data Heads',
    role: 'Executive Leadership & Strategic Heads',
    description:
      'The driving core overseeing club operations, industrial outreach, workshop curricula, technical research tracks, and university collaborations.',
    tierCode: 'Tier 03 · Leadership',
    status: 'Executive Council',
    icon: Crown,
    accent: 'purple',
    tagColor: 'text-purple-400',
    accentText: 'text-purple-300',
    dotColor: 'bg-purple-400',
    iconContainer:
      'bg-purple-500/10 border border-purple-400/30 text-purple-300 ring-2 ring-purple-500/20 shadow-[0_0_20px_rgba(138,43,226,0.2)]',
    hoverBorder: 'hover:border-purple-400/50',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(138,43,226,0.18)]',
    radialGlow:
      'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(138,43,226,0.14),transparent_40%)]',
    ambientColor: 'bg-purple-600/30',
  },
];

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

interface TierCardProps {
  tier: HierarchyTier;
}

const TierCard: React.FC<TierCardProps> = ({ tier }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = tier.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${tier.hoverBorder} ${tier.hoverShadow}`}
    >
      {/* Mouse-following Radial Spotlight */}
      <div
        className={`pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 ${tier.radialGlow}`}
        aria-hidden="true"
      />

      {/* Top subtle corner highlight glow */}
      <div
        className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none ${tier.ambientColor}`}
        aria-hidden="true"
      />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Tier Icon Container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 mb-6 ${tier.iconContainer}`}>
          <Icon className="w-7 h-7" />
        </div>

        {/* Tier Title */}
        <h3 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-cyan-200 transition-colors">
          {tier.title}
        </h3>

        {/* Tier Description */}
        <p className="text-sm text-slate-300 leading-relaxed font-normal flex-1">
          {tier.description}
        </p>
      </div>
    </motion.div>
  );
};

export const Warehouse: React.FC = () => {
  return (
    <section id="warehouse" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Section Header: Clean, bold title without bracketed badges or subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight">
          The{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Warehouse
          </span>
        </h2>
      </div>

      {/* 3-Card Horizontal Grid: Club Hierarchy & Structure */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {HIERARCHY_TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </motion.div>
    </section>
  );
};
