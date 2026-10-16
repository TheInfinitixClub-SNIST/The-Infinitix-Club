import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Users, Building2, Sparkles, ArrowUpRight } from 'lucide-react';

interface OfferingItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  tags: string[];
  accentColor: 'cyan' | 'purple';
}

const OFFERINGS: OfferingItem[] = [
  {
    id: 'workshops',
    icon: BookOpen,
    title: 'Regular Workshops',
    description:
      'Interactive, practical sessions covering Core Python, Exploratory Data Analysis, Machine Learning pipelines, and modern AI toolchains.',
    tags: ['Core Python', 'EDA', 'ML Pipelines', 'AI Toolchains'],
    accentColor: 'cyan',
  },
  {
    id: 'hackathons',
    icon: Trophy,
    title: 'Hackathons & Competitions',
    description:
      'High-tempo sprint hackathons, Kaggle-style internal leaderboards, and real-world algorithmic challenges.',
    tags: ['Sprint Hackathons', 'Kaggle Challenges', 'Algorithm Sprints'],
    accentColor: 'purple',
  },
  {
    id: 'mentorship',
    icon: Users,
    title: 'Mentorship Programs',
    description:
      '1-on-1 and cohort guidance from seniors and alumni covering technical projects, research, and career paths.',
    tags: ['1-on-1 Guidance', 'Project Reviews', 'Career Pathways'],
    accentColor: 'cyan',
  },
  {
    id: 'industry',
    icon: Building2,
    title: 'Industrial Visits & Tech Talks',
    description:
      'Guided visits to corporate data hubs, live keynote sessions, and panels hosted by industry practitioners.',
    tags: ['Data Hub Tours', 'Live Keynotes', 'Practitioner Panels'],
    accentColor: 'purple',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface OfferingCardProps {
  offering: OfferingItem;
}

const OfferingCard: React.FC<OfferingCardProps> = ({ offering }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = offering.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const isCyan = offering.accentColor === 'cyan';

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${
        isCyan
          ? 'hover:border-cyan-400/50 hover:shadow-[0_12px_40px_rgba(0,242,254,0.12)]'
          : 'hover:border-purple-400/50 hover:shadow-[0_12px_40px_rgba(138,43,226,0.12)]'
      }`}
    >
      {/* Mouse-following Radial Spotlight */}
      <div
        className={`pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 ${
          isCyan
            ? 'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.12),transparent_40%)]'
            : 'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(138,43,226,0.12),transparent_40%)]'
        }`}
        aria-hidden="true"
      />

      {/* Top subtle corner highlight */}
      <div
        className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none ${
          isCyan ? 'bg-cyan-500/30' : 'bg-purple-600/30'
        }`}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Sleek micro-icon in a rounded neon ring */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              isCyan
                ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 ring-2 ring-cyan-500/20 shadow-[0_0_16px_rgba(0,242,254,0.2)]'
                : 'bg-purple-500/10 border border-purple-400/30 text-purple-300 ring-2 ring-purple-500/20 shadow-[0_0_16px_rgba(138,43,226,0.2)]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              isCyan
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'
                : 'bg-purple-500/15 text-purple-300 border border-purple-400/30'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight group-hover:text-cyan-200 transition-colors">
          {offering.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {offering.description}
        </p>
      </div>

      {/* Pill tags */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-1.5">
        {offering.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              isCyan
                ? 'bg-cyan-950/40 border-cyan-500/20 text-cyan-300'
                : 'bg-purple-950/40 border-purple-500/20 text-purple-300'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const Offerings: React.FC = () => {
  return (
    <section id="offerings" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {/* Minimalist pill badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(0,242,254,0.2)]">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>[ WHAT WE PROVIDE ]</span>
        </div>

        {/* Section Title with cyan-to-purple gradient accent */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          Our{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Offerings
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Equipping students with industry-grade skills through structured workshops, high-tempo hackathons,
          collaborative mentorship, and immersive exposure to the frontier of data and AI.
        </p>
      </div>

      {/* 4-Card Responsive Grid with Staggered Viewport Entry */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {OFFERINGS.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} />
        ))}
      </motion.div>
    </section>
  );
};
