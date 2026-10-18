import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { supabase, HeroSlide } from '../lib/supabase';
import hackathonImg from '../assets/images/infinitix_hackathon_1792077160334.jpg';
import workshopImg from '../assets/images/infinitix_workshop_1792077162417.jpg';
import teamImg from '../assets/images/infinitix_team_1792077160651.jpg';
import orientationImg from '../assets/images/infinitix_orientation_1792077162224.jpg';

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'hackathon',
    image_url: hackathonImg,
    title: 'Infinitix Hackathon Showcase',
    order_index: 1,
  },
  {
    id: 'workshop',
    image_url: workshopImg,
    title: 'Infinitix AI Workshop',
    order_index: 2,
  },
  {
    id: 'team',
    image_url: teamImg,
    title: 'Infinitix Club Team',
    order_index: 3,
  },
  {
    id: 'orientation',
    image_url: orientationImg,
    title: 'Infinitix Orientation Day',
    order_index: 4,
  },
];

const SLIDE_DURATION_MS = 5500; // 5.5 seconds per slide

export const ShowcaseCarousel: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 for current slide

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Fetch dynamic hero slides from Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('order_index', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setSlides(data as HeroSlide[]);
        } else {
          setSlides(FALLBACK_SLIDES);
        }
      } catch (err) {
        console.warn('Failed to load hero slides from Supabase, using fallback:', err);
        setSlides(FALLBACK_SLIDES);
      }
    };

    fetchSlides();
  }, []);

  // Reset index if slides change and index is out of bounds
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Smooth slide timer loop with Netflix-style progress bar
  useEffect(() => {
    if (isPaused || slides.length === 0) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgress(currentProgress);

      if (elapsed >= SLIDE_DURATION_MS) {
        elapsedBeforePauseRef.current = 0;
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      }

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [currentIndex, isPaused, slides.length]);

  const handleSlideChange = (newIndex: number) => {
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    setCurrentIndex(newIndex);
    startTimeRef.current = Date.now();
  };

  const handlePrev = () => {
    if (slides.length === 0) return;
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    handleSlideChange(prev);
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    const next = (currentIndex + 1) % slides.length;
    handleSlideChange(next);
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full group select-none"
      onMouseEnter={() => {
        setIsPaused(true);
        elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
    >
      {/* 
        Cinema-Style Outer Frame:
        Clean, unobstructed showcase with rounded corners, subtle neon border, and soft stage glow
      */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.35/1] rounded-2xl md:rounded-3xl overflow-hidden border border-cyan-500/25 bg-slate-950/80 shadow-[0_0_50px_rgba(0,242,254,0.15)] backdrop-blur-xl">
        {/* Render Slides with smooth cross-fade */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Showcase image */}
              <img
                src={slide.image_url}
                alt={slide.title || 'Infinitix Showcase Slide'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-10000 ease-out group-hover:scale-105"
              />

              {/* Minimalist bottom gradient for text contrast and progress bar visibility */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Optional Title Badge Overlay */}
              {slide.title && (
                <div className="absolute bottom-10 left-6 sm:bottom-12 sm:left-10 z-20 pointer-events-none max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-950/70 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                      {slide.title}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Floating Arrow Controls (Left/Right) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-white/20 hover:border-cyan-400 text-slate-200 hover:text-cyan-200 backdrop-blur-md transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 border border-white/20 hover:border-cyan-400 text-slate-200 hover:text-cyan-200 backdrop-blur-md transition-all duration-200 opacity-80 group-hover:opacity-100 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Subtle Pause/Play indicator badge on hover */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
          {isPaused ? (
            <>
              <Pause className="w-2.5 h-2.5 text-amber-300" />
              <span>Paused</span>
            </>
          ) : (
            <>
              <Play className="w-2.5 h-2.5 text-cyan-300 fill-cyan-300" />
              <span>Auto-playing</span>
            </>
          )}
        </div>

        {/* 
          ======================================================================
          Netflix/Hotstar Style Multi-Segment Slim Timer Progress Bars
          ======================================================================
        */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-6 right-6 sm:left-10 sm:right-10 z-30 flex items-center gap-2">
            {slides.map((slide, index) => {
              const isCurrent = index === currentIndex;
              const isCompleted = index < currentIndex;
              const fillWidth = isCurrent ? `${progress}%` : isCompleted ? '100%' : '0%';

              return (
                <button
                  key={slide.id}
                  onClick={() => handleSlideChange(index)}
                  aria-label={`Jump to slide ${index + 1}`}
                  className="group/bar flex-1 h-2 py-1 cursor-pointer focus-visible:outline-none"
                >
                  {/* Track background */}
                  <div className="relative w-full h-1 rounded-full bg-white/25 group-hover/bar:bg-white/40 overflow-hidden transition-all duration-200">
                    {/* Active progress fill */}
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-r from-cyan-400 to-indigo-400 shadow-[0_0_8px_#00f2fe]'
                          : isCompleted
                          ? 'bg-white/80'
                          : 'bg-transparent'
                      }`}
                      style={{
                        width: fillWidth,
                        transitionDuration: isCurrent ? '50ms' : '300ms',
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
