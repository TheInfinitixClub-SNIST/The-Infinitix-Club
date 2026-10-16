import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  FolderGit2,
  MapPin,
  Database,
  FileCode2,
  ExternalLink,
  Download,
  Terminal,
  BookMarked,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ResourceCardData {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  items: { name: string; tag: string; level?: string }[];
  actionLabel: string;
  actionIcon: React.ElementType;
  accent: 'cyan' | 'purple' | 'blue';
}

const RESOURCES: ResourceCardData[] = [
  {
    id: 'roadmaps',
    badge: 'CURATED TRACKS',
    title: 'Learning Roadmaps',
    description:
      'Structured step-by-step curricula from foundational mathematical statistics up to cutting-edge generative deep learning architectures.',
    icon: MapPin,
    items: [
      { name: 'Python & Scientific Computing', tag: 'Level 1', level: 'Beginner' },
      { name: 'Linear Algebra & ML Mathematics', tag: 'Level 2', level: 'Intermediate' },
      { name: 'Scikit-Learn & Classical Estimators', tag: 'Level 3', level: 'Intermediate' },
      { name: 'PyTorch, Transformers & LLM Tuning', tag: 'Level 4', level: 'Advanced' },
    ],
    actionLabel: 'Explore Roadmaps',
    actionIcon: ExternalLink,
    accent: 'cyan',
  },
  {
    id: 'datasets',
    badge: 'DATA REPOSITORY',
    title: 'Dataset Vault & Notebooks',
    description:
      'Standardized datasets, sanitized competition benchmarks, and modular starter Jupyter notebooks primed for rapid experimentation.',
    icon: Database,
    items: [
      { name: 'Customer Churn & Tabular Benchmarks', tag: 'Parquet / CSV' },
      { name: 'Financial Time-Series Analytics', tag: 'Normalized' },
      { name: 'Baseline EDA & Feature Pipelines', tag: 'Jupyter .ipynb' },
      { name: 'End-to-End Model Evaluation Suite', tag: 'Jupyter .ipynb' },
    ],
    actionLabel: 'Access Dataset Vault',
    actionIcon: ExternalLink,
    accent: 'purple',
  },
  {
    id: 'cheatsheets',
    badge: 'RAPID REFERENCE',
    title: 'Cheat Sheets & Reference Docs',
    description:
      'High-density reference summaries for lightning-quick syntax lookups, vectorization paradigms, and performance tuning tips.',
    icon: FileCode2,
    items: [
      { name: 'Pandas Vectorization & Method Chaining', tag: 'PDF Guide' },
      { name: 'NumPy Broadcasting & Tensor Ops', tag: 'One-Pager' },
      { name: 'High-Performance SQL Optimization', tag: 'Quickref' },
      { name: 'Scikit-Learn Model Selection Matrix', tag: 'Cheatsheet' },
    ],
    actionLabel: 'Download Cheat Sheets',
    actionIcon: Download,
    accent: 'blue',
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

interface BentoCardProps {
  resource: ResourceCardData;
}

const BentoCard: React.FC<BentoCardProps> = ({ resource }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = resource.icon;
  const ActionIcon = resource.actionIcon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const isCyan = resource.accent === 'cyan';
  const isPurple = resource.accent === 'purple';

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${
        isCyan
          ? 'hover:border-cyan-400/50 hover:shadow-[0_12px_40px_rgba(0,242,254,0.14)]'
          : isPurple
          ? 'hover:border-purple-400/50 hover:shadow-[0_12px_40px_rgba(138,43,226,0.14)]'
          : 'hover:border-blue-400/50 hover:shadow-[0_12px_40px_rgba(96,165,250,0.14)]'
      }`}
    >
      {/* Dynamic mouse-following radial spotlight on hover */}
      <div
        className={`pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 ${
          isCyan
            ? 'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.12),transparent_40%)]'
            : isPurple
            ? 'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(138,43,226,0.12),transparent_40%)]'
            : 'bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(96,165,250,0.12),transparent_40%)]'
        }`}
        aria-hidden="true"
      />

      {/* Top subtle corner highlight */}
      <div
        className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none ${
          isCyan ? 'bg-cyan-500/30' : isPurple ? 'bg-purple-600/30' : 'bg-blue-600/30'
        }`}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Card Header & Micro-Icon */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
              isCyan
                ? 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 ring-2 ring-cyan-500/20 shadow-[0_0_16px_rgba(0,242,254,0.2)]'
                : isPurple
                ? 'bg-purple-500/10 border border-purple-400/30 text-purple-300 ring-2 ring-purple-500/20 shadow-[0_0_16px_rgba(138,43,226,0.2)]'
                : 'bg-blue-500/10 border border-blue-400/30 text-blue-300 ring-2 ring-blue-500/20 shadow-[0_0_16px_rgba(96,165,250,0.2)]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
              isCyan
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                : isPurple
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
            }`}
          >
            {resource.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-cyan-200 transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
          {resource.description}
        </p>

        {/* Resource Items Stack */}
        <div className="space-y-2 mb-6">
          {resource.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-cyan-400/70" />
                <span className="text-xs text-slate-200 font-medium truncate">
                  {item.name}
                </span>
              </div>
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-400 font-mono">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Link Action Button with Cyan Hover Glow */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <a
          href="#contact"
          className="group/btn relative w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span>{resource.actionLabel}</span>
          <ActionIcon className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
};

export const Warehouse: React.FC = () => {
  return (
    <section id="warehouse" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(0,242,254,0.2)]">
          <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>[ OPEN REPOSITORY ]</span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          The{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Warehouse
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Our centralized digital vault. Access structured learning roadmaps, standardized machine learning
          datasets, production notebooks, and downloadable cheatsheets open for all campus innovators.
        </p>
      </div>

      {/* 3-Column Bento Resource Vault with Staggered Viewport Entry */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {RESOURCES.map((resource) => (
          <BentoCard key={resource.id} resource={resource} />
        ))}
      </motion.div>
    </section>
  );
};
