import React, { useState, useRef, useEffect } from 'react';
import { Instagram, Linkedin, MapPin, Mail } from 'lucide-react';
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

        {/* ================================================================
          FOOTER: Club Footer with Social Links, Nav & Contact
        ================================================================ */}
        <footer id="contact" className="mt-24">
          {/* Main Footer Body */}
          <div className="border-t border-white/10 bg-[#0b0d19]/80 backdrop-blur-xl py-12 px-6 rounded-t-2xl">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

              {/* ── Left Column: Reach Out ── */}
              <div className="flex flex-col items-center md:items-start gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white tracking-tight">Reach Out</h3>
                  <p className="text-sm text-slate-400 mt-1">We are eager to connect</p>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.instagram.com/theinfinitixclub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Infinitix Club Instagram"
                    className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300 hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-500/10 transition-all duration-300"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/the-infinitix-club"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Infinitix Club LinkedIn"
                    className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-500/10 transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://maps.app.goo.gl/sreenidhi-snist"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Sreenidhi Institute of Science and Technology on Google Maps"
                    className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <MapPin className="w-4 h-4" />
                  </a>
                </div>

                {/* Quick Navigation */}
                <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    { label: 'Home', href: '#home' },
                    { label: 'About Us', href: '#vision-section' },
                    { label: 'Our Events', href: '#events' },
                    { label: 'Our Team', href: '#team' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* ── Right Column: Send us a Data Packet! ── */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white tracking-tight">Send us a Data Packet!</h3>
                </div>

                <a
                  href="mailto:theinfinitixclub@gmail.com"
                  className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/25 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-cyan-200 transition-colors tracking-wide">
                    theinfinitixclub@gmail.com
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Strip */}
          <div className="bg-[#0b0d19] border-t border-white/5 py-4 px-6">
            <p className="text-center text-xs text-slate-500">
              &copy; The Infinitix Club - SNIST, All Rights Reserved
            </p>
          </div>
        </footer>
      </div>



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
