import React, { useRef } from 'react';
import { motion } from 'motion/react';

import workshopImg from '../assets/images/infinitix_workshop_1792077162417.jpg';
import hackathonImg from '../assets/images/infinitix_hackathon_1792077160334.jpg';
import mentorshipImg from '../assets/images/infinitix_team_1792077160651.jpg';
import industrialImg from '../assets/images/infinitix_orientation_1792077162224.jpg';

interface OfferingItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  accentGlow?: 'cyan' | 'purple';
}

const OFFERINGS: OfferingItem[] = [
  {
    id: 'workshops',
    title: 'Regular Workshops',
    image: workshopImg,
    alt: 'Infinitix Regular Workshops',
    accentGlow: 'cyan',
  },
  {
    id: 'hackathons',
    title: 'Hackathons',
    image: hackathonImg,
    alt: 'Infinitix Hackathons & Competitions',
    accentGlow: 'purple',
  },
  {
    id: 'mentorship',
    title: 'Mentorship Programs',
    image: mentorshipImg,
    alt: 'Infinitix Mentorship Programs',
    accentGlow: 'cyan',
  },
  {
    id: 'industrial',
    title: 'Industrial Visits',
    image: industrialImg,
    alt: 'Infinitix Industrial Visits & Field Exploration',
    accentGlow: 'purple',
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
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

interface OfferingCardProps {
  offering: OfferingItem;
}

const OfferingCard: React.FC<OfferingCardProps> = ({ offering }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const isCyan = offering.accentGlow === 'cyan';

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${
        isCyan
          ? 'hover:border-cyan-400/40 hover:shadow-[0_12px_40px_rgba(0,242,254,0.18)]'
          : 'hover:border-purple-400/40 hover:shadow-[0_12px_40px_rgba(138,43,226,0.18)]'
      }`}
    >
      {/* Mouse-following Radial Spotlight */}
      <div
        className={`pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
          isCyan
            ? 'bg-[radial-gradient(400px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.14),transparent_50%)]'
            : 'bg-[radial-gradient(400px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(138,43,226,0.14),transparent_50%)]'
        }`}
        aria-hidden="true"
      />

      {/* Top / Main Area: High-quality visual photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900/90">
        <img
          src={offering.image}
          alt={offering.alt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle cinematic gradient vignette at bottom of photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Bottom Area: Clean centered offering title */}
      <div className="relative z-20 py-4 px-4 sm:py-5 sm:px-5 flex items-center justify-center text-center bg-slate-950/40">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
          {offering.title}
        </h3>
      </div>
    </motion.div>
  );
};

export const Offerings: React.FC = () => {
  return (
    <section id="offerings" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Section Header: Clean, prominent title without badges or subtitle */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight">
          Our{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Offerings
          </span>
        </h2>
      </div>

      {/* 4-Card Visual Showcase Grid with Staggered Viewport Entry */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {OFFERINGS.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} />
        ))}
      </motion.div>
    </section>
  );
};
