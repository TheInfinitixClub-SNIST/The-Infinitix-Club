import React from 'react';
import { InfinitixEmblem } from './Logos.tsx';

export const VisionCard: React.FC = () => {
  return (
    <section
      id="vision-section"
      className="relative w-full max-w-7xl mx-auto my-10 sm:my-14"
    >
      {/* Background radial glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/15 via-indigo-600/15 to-purple-600/15 rounded-3xl blur-xl opacity-75 -z-10" />

      {/* Wide Panoramic Banner Container */}
      <div className="relative w-full rounded-2xl md:rounded-3xl bg-slate-950/80 border border-white/15 hover:border-cyan-400/40 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl px-6 sm:px-10 lg:px-12 py-7 sm:py-9 transition-all duration-300">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          {/* 
            Left Column: Free-Standing Borderless Infinitix Club Logo
            - Removed enclosing card/box wrapper (no background, border, or inner card styling)
            - Logo stands completely free and borderless directly on the main card background
            - Prominent, sharp, and properly centered vertically alongside the vision text
          */}
          <div className="flex items-center justify-center shrink-0 w-full md:w-60 lg:w-72 self-center py-2">
            <InfinitixEmblem className="w-52 sm:w-60 md:w-64 lg:w-72 h-auto max-h-36 sm:max-h-40 object-contain filter drop-shadow-[0_8px_30px_rgba(0,242,254,0.4)] transition-transform duration-300 hover:scale-105" />
          </div>

          {/* Vertical Subtle Hairline Divider (Desktop) */}
          <div
            className="hidden md:block w-[1px] self-stretch bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0"
            aria-hidden="true"
          />

          {/* Right Column: Heading & Vision Paragraph */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
              <span>Club Foundation</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Our Purpose</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight text-white mb-3.5 flex items-center justify-center md:justify-start">
              Vision Of Our Club
            </h2>
            <p className="text-sm sm:text-base lg:text-[15px] text-slate-200 font-normal leading-relaxed text-pretty">
              To empower individuals with cutting-edge data science knowledge and skills, fostering
              a collaborative environment where members can solve real-world problems, innovate,
              and lead in the rapidly evolving field of data science. We aim to create a dynamic
              community where learning is limitless, curiosity is nurtured, and practical
              applications of data drive impactful change. Through continuous exploration, mentorship,
              and industry connections, we aspire to shape future data scientists who are equipped to
              tackle complex challenges and contribute meaningfully to society.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
