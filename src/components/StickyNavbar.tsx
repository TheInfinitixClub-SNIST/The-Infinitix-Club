import React, { useState, useEffect } from 'react';
import { SnistLogo } from './Logos.tsx';
import { Menu, X } from 'lucide-react';

interface StickyNavbarProps {
  isIlluminated?: boolean;
  onToggleIlluminate?: () => void;
  toggleRef?: React.RefObject<HTMLButtonElement | null>;
}

export const StickyNavbar: React.FC<StickyNavbarProps> = () => {
  const [hasScrolledPastVision, setHasScrolledPastVision] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const visionSection = document.getElementById('vision-section');
    if (!visionSection) return;

    // Check function using boundingClientRect
    const updateVisibility = () => {
      const rect = visionSection.getBoundingClientRect();
      // Only visible when the bottom boundary of #vision-section has scrolled past the top
      // (exited above the viewport top / past the sticky navbar, rect.bottom <= 70)
      const isPast = rect.bottom <= 70;
      setHasScrolledPastVision(isPast);
    };

    // IntersectionObserver targeting #vision-section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Vision section is currently within viewport -> Keep Infinitix logo hidden
            setHasScrolledPastVision(false);
          } else {
            // Section is out of viewport: check whether it exited above or is below
            if (entry.boundingClientRect.bottom <= 70) {
              setHasScrolledPastVision(true);
            } else {
              setHasScrolledPastVision(false);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-70px 0px 0px 0px',
        threshold: [0, 0.1, 1],
      }
    );

    observer.observe(visionSection);

    // Initial check on mount
    updateVisibility();

    // Scroll listener for real-time 60fps tracking
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#vision-section' },
    { label: 'Our Events', href: '#events' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <header className="fixed top-4 inset-x-0 mx-auto w-[92%] max-w-6xl z-50 select-none">
      {/* 
        ========================================================================
        Floating Island Geometry & Translucent Glassmorphism
        - justify-between anchors logos comfortably on left, nav links on right
        ========================================================================
      */}
      <nav className="relative flex items-center justify-between px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#0b0d19]/50 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300">
        {/* 
          ======================================================================
          LEFT: LOGOS CONTAINER
          - Contains ONLY the logo images (no redundant text blocks)
          - On landing: Only the SNIST logo image is visible
          - On scrolling past Vision: Infinitix logo smoothly slides in BEFORE the SNIST logo
          - Ample breathing room and width (gap-4 sm:gap-6, min-w-[180px])
          ======================================================================
        */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 min-w-[180px]">
          {/* Infinitix Infinity Logo Transitioning Container (Slides in before SNIST) */}
          <div
            className={`flex items-center gap-4 sm:gap-6 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hasScrolledPastVision
                ? 'max-w-[180px] opacity-100 translate-x-0 pointer-events-auto'
                : 'max-w-0 opacity-0 -translate-x-3 pointer-events-none'
            }`}
            aria-hidden={!hasScrolledPastVision}
          >
            <a
              href="#home"
              className="relative flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl sm:rounded-2xl shrink-0 transition-transform duration-200 hover:scale-105"
              aria-label="THE INFINITIX CLUB Home"
            >
              {/* Softened & Curved Logo Container (Removes harsh 90-degree corners) */}
              <div className="relative flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden px-2.5 py-1 bg-white/95 border border-white/20 shadow-[0_0_12px_rgba(138,43,226,0.25)] backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(138,43,226,0.4)]">
                <img
                  src="/mbmb.png"
                  alt="THE INFINITIX CLUB"
                  className="h-7 sm:h-8 w-auto object-contain rounded-lg shrink-0"
                  loading="eager"
                />
              </div>
            </a>

            {/* Clean hairline divider between Infinitix and SNIST */}
            <div
              className="w-[1px] h-5 bg-white/25 shrink-0"
              aria-hidden="true"
            />
          </div>

          {/* SNIST Logo Image Only (Clean image anchor, no extra text block) */}
          <a
            href="#home"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-0.5 shrink-0 transition-transform duration-200 hover:scale-105"
            aria-label="SNIST Home"
          >
            <SnistLogo showText={false} />
          </a>
        </div>

        {/* 
          ======================================================================
          RIGHT: NAVIGATION LINKS
          - "Join Club" button removed completely
          - Nav links shifted toward right side with clean spacing (gap-8 lg:gap-10)
          ======================================================================
        */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-white/75 hover:text-cyan-300 transition-colors duration-200 py-1 tracking-wide hover:drop-shadow-[0_0_8px_rgba(0,242,254,0.3)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Floating Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 rounded-2xl bg-[#0b0d19]/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 text-xs font-medium text-white/80 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
