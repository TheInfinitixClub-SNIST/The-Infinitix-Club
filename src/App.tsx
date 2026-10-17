import React, { useState, useRef, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import { VolumetricLightBeam } from './components/VolumetricLightBeam.tsx';
import { StickyNavbar } from './components/StickyNavbar.tsx';
import { ShowcaseCarousel } from './components/ShowcaseCarousel.tsx';
import { VisionCard } from './components/VisionCard.tsx';
import { Offerings } from './components/Offerings.tsx';
import { Mission } from './components/Mission.tsx';
import { Warehouse } from './components/Warehouse.tsx';
import { Events } from './components/Events.tsx';
import { Team } from './components/Team.tsx';
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

      {/* Page Content Container */}
      <div id="home" className="relative z-10 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/*
          ========================================================================
          3. HERO ZONE: SHOWCASE CAROUSEL
          ========================================================================
        */}
        <div className="w-full mb-12 sm:mb-16">
          <ShowcaseCarousel />
        </div>

        {/*
          ========================================================================
          4. VISION CARD
          ========================================================================
        */}
        <VisionCard />

        {/*
          ========================================================================
          SECTION 2: OUR OFFERINGS
          ========================================================================
        */}
        <Offerings />

        {/*
          ========================================================================
          SECTION 3: OUR MISSION
          ========================================================================
        */}
        <Mission />

        {/*
          ========================================================================
          SECTION 4: THE WAREHOUSE (Resources & Knowledge Hub)
          ========================================================================
        */}
        <Warehouse />

        {/*
          ========================================================================
          SECTION 5: OUR RECENT EVENTS
          ========================================================================
        */}
        <Events />

        {/* Section: Who Drives Our Club (Dynamic Team) */}
        <Team />

        {/* Section: Contact & Join */}
        <footer id="contact" className="mt-20 pt-10 pb-6 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SnistLogo showText={false} />
            <span>Sreenidhi Institute of Science and Technology · Infinitix Club</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#home" className="hover:text-cyan-300 transition-colors">Back to Top</a>
            <span aria-hidden="true">·</span>
            <a
              href="/infinite"
              className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Council Portal</span>
            </a>
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
        HIDDEN / COLLAPSIBLE "DEV CONTROL PANEL" (Live Customizer)
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
