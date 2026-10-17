import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Users, FlaskConical, Rocket } from 'lucide-react';

const stats = [
  {
    number: '500+',
    label: 'Active Members',
    detail: 'Undergrads, research scholars, and data enthusiasts across all years',
    icon: Users,
    color: 'from-cyan-400 to-blue-400',
  },
  {
    number: '30+',
    label: 'Hands-on Labs',
    detail: 'Intensive code sprints, Kaggle teardowns, and architecture workshops',
    icon: FlaskConical,
    color: 'from-blue-400 to-purple-400',
  },
  {
    number: '10+',
    label: 'Real-world Projects Built',
    detail: 'Full-stack AI systems, open-source repos, and deployed predictive apps',
    icon: Rocket,
    color: 'from-purple-400 to-pink-400',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const Mission: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    bannerRef.current.style.setProperty('--mouse-x', `${x}px`);
    bannerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="mission" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-cyan-500/15 rounded-3xl blur-2xl opacity-75 -z-10"
        aria-hidden="true"
      />

      <motion.div
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="group relative w-full rounded-2xl md:rounded-3xl bg-slate-950/80 border border-white/15 hover:border-cyan-400/40 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-6 sm:p-10 lg:p-12 overflow-hidden transition-all duration-300"
      >
        {/* Dynamic mouse-following spotlight */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(800px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.1),transparent_50%)] -z-0"
          aria-hidden="true"
        />

        {/* Top subtle decorative pattern */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Main Content Area */}
        <div className="relative z-10">
          <motion.div variants={itemVariants} className="max-w-4xl mb-8 sm:mb-10">
            {/* Header */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Our{' '}
              <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
                Mission
              </span>
            </h2>
          </motion.div>

          {/* 3-Part Metrics Strip */}
          <motion.div
            variants={itemVariants}
            className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="relative flex flex-col justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300 group/stat"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.number}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover/stat:scale-110 group-hover/stat:text-cyan-300 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 tracking-wide">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {stat.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
