import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  ArrowRight,
  BrainCircuit,
  Database,
  Terminal,
} from 'lucide-react';
import { VolumetricLightBeam } from './components/VolumetricLightBeam.tsx';
import { StickyNavbar } from './components/StickyNavbar.tsx';
import { ShowcaseCarousel } from './components/ShowcaseCarousel.tsx';
import { VisionCard } from './components/VisionCard.tsx';
import { DevControlPanel, DevCustomizerState } from './components/DevControlPanel.tsx';
import { SnistLogo } from './components/Logos.tsx';

const DEFAULT_CUSTOMIZER: DevCustomizerState = {
  primaryColor: '#00f2fe',
  secondaryColor: '#8a2be2',
  useCustomAngle: false,
  customAngleDeg: 145,
  intensityPercent: 95,
  spreadAngleDeg: 42,
  animationSpeedSec: 14,
  particleCount: 88,
  twinkleRate: 1.0,
  idleMotion: true,
  showParticles: true,
};

export default function App() {
  // Illuminate switch state (default: Dark Mode with rich cyan/purple beam active)
  const [isIlluminated, setIsIlluminated] = useState(false);

  // Dev Live Customizer State
  const [customizer, setCustomizer] = useState<DevCustomizerState>(DEFAULT_CUSTOMIZER);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Ref to track toggle button position for origin anchoring
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const [originCoord, setOriginCoord] = useState<{ x: number; y: number } | null>(null);

  const updateToggleOrigin = () => {
    if (toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setOriginCoord({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  useEffect(() => {
    updateToggleOrigin();
    window.addEventListener('resize', updateToggleOrigin, { passive: true });
    window.addEventListener('scroll', updateToggleOrigin, { passive: true });
    return () => {
      window.removeEventListener('resize', updateToggleOrigin);
      window.removeEventListener('scroll', updateToggleOrigin);
    };
  }, []);

  const handleCustomizerChange = (updated: Partial<DevCustomizerState>) => {
    setCustomizer((prev) => ({ ...prev, ...updated }));
  };

  const handleResetCustomizer = () => {
    setCustomizer(DEFAULT_CUSTOMIZER);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0b0d19] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 
        ========================================================================
        1. THE VOLUMETRIC LIGHT BEAM CANVAS (Background Layer)
        ========================================================================
      */}
      <VolumetricLightBeam
        isIlluminated={isIlluminated}
        coreColor={customizer.primaryColor}
        secondaryColor={customizer.secondaryColor}
        backgroundColor="#0b0d19"
        intensityMultiplier={customizer.intensityPercent / 100}
        spreadAngleDeg={customizer.spreadAngleDeg}
        customAngleDeg={customizer.useCustomAngle ? customizer.customAngleDeg : null}
        cycleDurationSec={customizer.animationSpeedSec}
        particleCount={customizer.particleCount}
        twinkleRate={customizer.twinkleRate}
        idleMotion={customizer.idleMotion}
        showParticles={customizer.showParticles}
        originOverride={originCoord}
      />

      {/* 
        ========================================================================
        2. STICKY NAVIGATION BAR (Dynamic Logo Reveal on Scroll)
        - Only SNIST logo visible on page load and throughout Vision section.
        - Infinitix logo reveals strictly after user completely scrolls past Vision.
        ========================================================================
      */}
      <StickyNavbar />

      {/* Page Content Container: Carousel takes center stage unobstructed */}
      <div id="home" className="relative z-10 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* 
          ========================================================================
          3. HERO ZONE: CLEAN, UNOBSTRUCTED CAROUSEL SHOWCASE
          - No distracting headline or text overlays.
          - Pure photo showcase with timer bar and navigation arrows.
          ========================================================================
        */}
        <div className="w-full mb-12 sm:mb-16">
          <ShowcaseCarousel />
        </div>

        {/* 
          ========================================================================
          4. EXPANDED VISION CARD (Broad max-w-7xl breadth)
          - id="vision-section" used by navbar to trigger logo slide-in
          ========================================================================
        */}
        <VisionCard />

        {/* 
          ========================================================================
          5. CLUB DOMAINS & EVENTS (Provides Natural Page Scroll Depth)
          ========================================================================
        */}
        <section id="events" className="mt-16 sm:mt-24 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase block mb-1">
                Active Initiatives
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Core Focus Tracks
              </h2>
            </div>
            <a
              href="#about"
              className="text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-1 group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Track 1 */}
            <div className="group rounded-2xl bg-slate-950/60 border border-white/10 hover:border-cyan-400/40 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,242,254,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Deep Learning & Generative AI
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exploring transformer architectures, diffusion pipelines, and LLM fine-tuning techniques for applied research.
              </p>
            </div>

            {/* Track 2 */}
            <div className="group rounded-2xl bg-slate-950/60 border border-white/10 hover:border-indigo-400/40 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Predictive Analytics & Big Data
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hands-on ETL pipeline construction, high-throughput distributed computing, and statistical inference modeling.
              </p>
            </div>

            {/* Track 3 */}
            <div className="group rounded-2xl bg-slate-950/60 border border-white/10 hover:border-purple-400/40 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Competitive Hackathons & Datathons
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Representing SNIST in national and international Kaggle challenges, algorithmic data sprints, and codeathons.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Our Team & Community */}
        <section id="team" className="mt-16 sm:mt-24 max-w-7xl mx-auto rounded-3xl bg-slate-950/60 border border-white/10 p-8 sm:p-12 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase block mb-1">
                Student Leadership
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Our Team & Mentorship
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Department of CSE & AI</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-xs text-cyan-300 font-medium">SNIST Hyderabad</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            Infinitix operates under the academic guidance of distinguished faculty advisors and industry veterans at
            Sreenidhi Institute of Science and Technology. Led by student coordinators across technical research,
            event logistics, industry outreach, and media production, our community is open to all passionate learners.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-6 border-t border-white/10">
            <span>2026 Executive Council</span>
            <span aria-hidden="true">·</span>
            <span>Peer Research Mentors</span>
            <span aria-hidden="true">·</span>
            <span>Kaggle Grandmaster Workshops</span>
            <span aria-hidden="true">·</span>
            <span>Weekly Hands-on Code Labs</span>
          </div>
        </section>

        {/* Section: Contact & Join */}
        <footer id="contact" className="mt-20 pt-10 pb-6 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SnistLogo showText={false} />
            <span>Sreenidhi Institute of Science and Technology · Infinitix Club</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#home" className="hover:text-cyan-300 transition-colors">Back to Top</a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              Open Live Customizer
            </button>
          </div>
        </footer>
      </div>

      {/* 
        ========================================================================
        6. HIDDEN / COLLAPSIBLE "DEV CONTROL PANEL" (Live Customizer)
        - Floating toggle button in bottom-right corner
        ========================================================================
      */}
      <aside aria-label="Dev controls" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-cyan-400/40 hover:border-cyan-300 text-slate-200 hover:text-white shadow-[0_0_25px_rgba(0,242,254,0.3)] backdrop-blur-xl transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Open lighting customizer"
        >
          <div className="p-1 rounded-full bg-cyan-400/20 text-cyan-300 group-hover:rotate-45 transition-transform duration-300">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
            Customize Lighting
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>
      </aside>

      {/* Slide-out Customizer Drawer */}
      <DevControlPanel
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        state={customizer}
        onChange={handleCustomizerChange}
        onReset={handleResetCustomizer}
        isIlluminated={isIlluminated}
        onToggleIlluminate={() => setIsIlluminated((prev) => !prev)}
      />
    </main>
  );
}
