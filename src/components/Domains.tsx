import React, { useRef } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Palette,
  CalendarCheck,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

interface DomainWing {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  accent: 'cyan' | 'purple' | 'emerald' | 'amber';
  colorClasses: {
    border: string;
    hoverBorder: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    iconRing: string;
    spotlight: string;
    glow: string;
    gradient: string;
  };
  pillars: string[];
}

const DOMAIN_WINGS: DomainWing[] = [
  {
    id: 'tech',
    name: 'Technical & Research Wing',
    shortName: 'Core Research',
    tagline: 'Architecting Models & Data Engines',
    description:
      'Pioneering core data science architectures, deep learning model evaluation, generative algorithms, and rigorous technical paper dissections.',
    icon: Cpu,
    accent: 'cyan',
    colorClasses: {
      border: 'border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-400/60',
      badgeBg: 'bg-cyan-950/50',
      badgeText: 'text-cyan-300',
      badgeBorder: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/10',
      iconBorder: 'border-cyan-400/30',
      iconText: 'text-cyan-300',
      iconRing: 'ring-cyan-500/20',
      spotlight: 'rgba(0,242,254,0.14)',
      glow: 'shadow-[0_0_30px_rgba(0,242,254,0.18)]',
      gradient: 'from-cyan-400 to-blue-500',
    },
    pillars: [
      'Machine Learning & Deep Neural Nets',
      'Transformers, NLP & Computer Vision',
      'Predictive Modeling & Feature Engineering',
      'Technical Documentation & Benchmarks',
    ],
  },
  {
    id: 'design',
    name: 'Design & Media Wing',
    shortName: 'Visual Branding',
    tagline: 'Visualizing Systems & Brand Aesthetics',
    description:
      'Translating complex algorithmic ideas into intuitive visual narratives, cinematic motion design, interface mockups, and cohesive club branding.',
    icon: Palette,
    accent: 'purple',
    colorClasses: {
      border: 'border-purple-500/20',
      hoverBorder: 'hover:border-purple-400/60',
      badgeBg: 'bg-purple-950/50',
      badgeText: 'text-purple-300',
      badgeBorder: 'border-purple-500/30',
      iconBg: 'bg-purple-500/10',
      iconBorder: 'border-purple-400/30',
      iconText: 'text-purple-300',
      iconRing: 'ring-purple-500/20',
      spotlight: 'rgba(138,43,226,0.14)',
      glow: 'shadow-[0_0_30px_rgba(138,43,226,0.18)]',
      gradient: 'from-purple-400 to-fuchsia-500',
    },
    pillars: [
      'UI/UX Design & Human-Data Interaction',
      'Visual Identity & Brand Systems',
      'Motion Graphics & Video Production',
      'Digital Storytelling & Infographics',
    ],
  },
  {
    id: 'events',
    name: 'Event Management & Logistics',
    shortName: 'Operations',
    tagline: 'Orchestrating Hackathons & Live Sprints',
    description:
      'Engineers of seamless operational execution, from 24-hour hackathons and hands-on laboratory setups to speaker itineraries and stage coordination.',
    icon: CalendarCheck,
    accent: 'emerald',
    colorClasses: {
      border: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-400/60',
      badgeBg: 'bg-emerald-950/50',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10',
      iconBorder: 'border-emerald-400/30',
      iconText: 'text-emerald-300',
      iconRing: 'ring-emerald-500/20',
      spotlight: 'rgba(52,211,153,0.14)',
      glow: 'shadow-[0_0_30px_rgba(52,211,153,0.18)]',
      gradient: 'from-emerald-400 to-teal-500',
    },
    pillars: [
      'Hackathon Orchestration & Sprints',
      'Lab Infrastructure & AV Setup',
      'Speaker Hospitality & Keynote Scheduling',
      'Participant Operations & Real-time Support',
    ],
  },
  {
    id: 'pr',
    name: 'Public Relations & Outreach',
    shortName: 'Community Growth',
    tagline: 'Amplifying Reach & Corporate Alliances',
    description:
      'Cultivating industrial sponsorships, alumni connections, cross-campus partnerships, and establishing high-impact collaborative data ecosystems.',
    icon: Megaphone,
    accent: 'amber',
    colorClasses: {
      border: 'border-amber-500/20',
      hoverBorder: 'hover:border-amber-400/60',
      badgeBg: 'bg-amber-950/50',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-400/30',
      iconText: 'text-amber-300',
      iconRing: 'ring-amber-500/20',
      spotlight: 'rgba(251,191,36,0.14)',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.18)]',
      gradient: 'from-amber-400 to-orange-500',
    },
    pillars: [
      'Corporate Sponsorships & Alliances',
      'Campus Ecosystem Outreach',
      'Industry Keynote Speaker Relations',
      'Alumni Mentorship Networks',
    ],
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
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

interface DomainCardProps {
  wing: DomainWing;
}

const DomainCard: React.FC<DomainCardProps> = ({ wing }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = wing.icon;
  const c = wing.colorClasses;

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
      className={`group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border ${c.border} ${c.hoverBorder} p-7 sm:p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] hover:${c.glow}`}
    >
      {/* Mouse-following Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${c.spotlight}, transparent 40%)`,
        }}
        aria-hidden="true"
      />

      {/* Top subtle corner highlight */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: c.spotlight }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header Micro-Icon and Badge */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${c.iconBg} border ${c.iconBorder} ${c.iconText} ring-2 ${c.iconRing}`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${c.badgeBg} ${c.badgeBorder} ${c.badgeText}`}
          >
            {wing.shortName}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight group-hover:text-cyan-200 transition-colors">
          {wing.name}
        </h3>

        {/* Sub-tagline */}
        <p className={`text-xs font-semibold uppercase tracking-wider mb-3 bg-gradient-to-r ${c.gradient} bg-clip-text text-transparent`}>
          {wing.tagline}
        </p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
          {wing.description}
        </p>

        {/* Pillars List */}
        <div className="space-y-2 mb-4">
          {wing.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.badgeBg} border ${c.badgeBorder}`}
              />
              <span className="text-xs text-slate-300 font-medium truncate">
                {pillar}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom subtle indicator */}
      <div className="relative z-10 pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px] font-mono">Infinitix Domain</span>
        <span className={`text-[11px] font-semibold ${c.badgeText} flex items-center gap-1 group-hover:translate-x-0.5 transition-transform`}>
          <span>Active Division</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
};

export const Domains: React.FC = () => {
  return (
    <section id="domains" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight">
          Core Domains &{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Wings
          </span>
        </h2>
      </div>

      {/* Interactive 4-Card Domain Matrix with Dual-Color Accents */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {DOMAIN_WINGS.map((wing) => (
          <DomainCard key={wing.id} wing={wing} />
        ))}
      </motion.div>
    </section>
  );
};
