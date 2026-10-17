import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  MapPin,
  ExternalLink,
  Tag,
  Ticket,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import { supabase, ClubEvent, EventCategory } from '../lib/supabase';

import orientationImg from '../assets/images/infinitix_orientation_1792077162224.jpg';
import workshopImg from '../assets/images/infinitix_workshop_1792077162417.jpg';
import hackathonImg from '../assets/images/infinitix_hackathon_1792077160334.jpg';

const FALLBACK_EVENTS: ClubEvent[] = [
  // Upcoming Events
  {
    id: 'up-1',
    title: 'GenAI & Autonomous Agent Hackfest 2026',
    category: 'upcoming',
    event_date: 'November 14-15, 2026',
    venue: 'Main Campus Auditorium & AI Research Lab',
    tags: ['GenAI', 'Multi-Agent', 'Hackathon'],
    cover_image_url: hackathonImg,
    registration_link: 'https://forms.gle/infinitix-agent-hackfest-2026',
    description:
      'A 36-hour flagship hackathon challenging engineering students to architect multimodal AI agents, autonomous tool-use workflows, and real-time enterprise AI solutions with mentorship from leading AI researchers.',
  },
  {
    id: 'up-2',
    title: 'Deep Learning & Neural Graphics Masterclass',
    category: 'upcoming',
    event_date: 'December 05, 2026',
    venue: 'Block IV Computing Complex, SNIST',
    tags: ['Deep Learning', 'PyTorch', 'Computer Vision'],
    cover_image_url: workshopImg,
    registration_link: 'https://forms.gle/infinitix-neural-masterclass',
    description:
      'Intensive hands-on workshop covering NeRFs, 3D Gaussian Splatting, diffusion models, and real-time PyTorch inference optimization on modern GPU clusters.',
  },

  // Recent Events
  {
    id: 'rec-1',
    title: 'Club Orientation & Induction 2025',
    category: 'recent',
    event_date: 'August 24, 2025',
    venue: 'Auditorium Hall 1, SNIST Campus',
    tags: ['Cohort Onboarding', 'Keynote', 'Roadmaps'],
    cover_image_url: orientationImg,
    registration_link: null,
    description:
      'The Infinitix Annual Induction marked the commencement of our academic session. Over 250 freshers gathered at the main campus auditorium for an interactive keynote introducing club initiatives, project roadmaps, and the upcoming competitive hackathon calendar.',
  },
  {
    id: 'rec-2',
    title: 'Machine Learning Bootcamp: Zero to Kaggle',
    category: 'recent',
    event_date: 'October 12-13, 2025',
    venue: 'AI Research Computing Lab, Block IV',
    tags: ['Hands-on Sprint', 'Machine Learning', 'Kaggle'],
    cover_image_url: workshopImg,
    registration_link: null,
    description:
      'An immersive 2-day technical bootcamp where students transitioned from raw dataset ingestion to hyperparameter tuning and model deployment. Mentors guided cohorts through real-world Kaggle datasets and feature engineering pipelines.',
  },
  {
    id: 'rec-3',
    title: 'Data Hackathon: CodeSprint Sprint 2.0',
    category: 'recent',
    event_date: 'January 18-19, 2026',
    venue: 'Central Campus Incubation Center, SNIST',
    tags: ['24-Hour Hackathon', 'Data Science', 'Prototypes'],
    cover_image_url: hackathonImg,
    registration_link: null,
    description:
      'Our flagship annual 24-hour sprint brought together 40+ multidisciplinary teams. Participants solved pressing challenges across Healthcare AI, Smart Campus Analytics, and Financial Fraud Detection with live cloud container deployments.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export const Events: React.FC = () => {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'recent'>('all');
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching events, using fallback dataset:', error.message);
        setEvents(FALLBACK_EVENTS);
      } else if (data && data.length > 0) {
        setEvents(data as ClubEvent[]);
        setIsLiveSynced(true);
      } else {
        setEvents(FALLBACK_EVENTS);
      }
    } catch (err) {
      console.warn('Network error while fetching events:', err);
      setEvents(FALLBACK_EVENTS);
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter events based on active category tab
  const upcomingEvents = events.filter((e) => e.category === 'upcoming');
  const recentEvents = events.filter((e) => e.category === 'recent');

  const displayedEvents =
    activeTab === 'upcoming'
      ? upcomingEvents
      : activeTab === 'recent'
      ? recentEvents
      : events;

  // Modal escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEvent]);

  return (
    <section id="events" className="relative w-full max-w-7xl mx-auto my-16 sm:my-24 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Our Club{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Events
          </span>
        </h2>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 max-w-md mx-auto backdrop-blur-md">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            All Events ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Upcoming ({upcomingEvents.length})
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === 'recent'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-400/40 shadow-[0_0_15px_rgba(138,43,226,0.2)]'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            Recent ({recentEvents.length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        key={activeTab}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {displayedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onSelect={() => setSelectedEvent(event)}
          />
        ))}
      </motion.div>

      {/* Empty state if category has no events */}
      {displayedEvents.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Events Found</h3>
          <p className="text-xs text-slate-400">
            Check back soon for new announcements or switch categories above.
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

interface EventCardProps {
  event: ClubEvent;
  onSelect: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isUpcoming = event.category === 'upcoming';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const imageSrc =
    event.cover_image_url ||
    (isUpcoming ? workshopImg : orientationImg);

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col rounded-2xl bg-white/[0.03] backdrop-blur-xl border overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] ${
        isUpcoming
          ? 'border-cyan-400/30 hover:border-cyan-400/70 hover:shadow-[0_16px_40px_rgba(0,242,254,0.22)]'
          : 'border-white/10 hover:border-purple-400/50 hover:shadow-[0_16px_40px_rgba(138,43,226,0.18)]'
      }`}
    >
      {/* Mouse-following Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.12),transparent_40%)] -z-0"
        aria-hidden="true"
      />

      {/* Visual Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = orientationImg;
          }}
        />

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d19] via-[#0b0d19]/40 to-transparent" />

        {/* Date & Category Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          {event.event_date && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-950/85 border border-white/20 text-slate-200 backdrop-blur-md shadow-md flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>{event.event_date}</span>
            </span>
          )}

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-md ${
              isUpcoming
                ? 'bg-cyan-950/90 border border-cyan-400/50 text-cyan-300'
                : 'bg-purple-950/90 border border-purple-400/40 text-purple-300'
            }`}
          >
            {isUpcoming ? 'Upcoming' : 'Recent'}
          </span>
        </div>

        {/* Venue Chip bottom left */}
        {event.venue && (
          <div className="absolute bottom-2.5 left-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 truncate max-w-full">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="relative z-10 flex flex-col flex-1 p-6 justify-between">
        <div>
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {event.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.05] border border-white/10 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-cyan-200 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6 line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
          {/* If Upcoming & Has Registration Link -> Registration Button */}
          {isUpcoming && event.registration_link && (
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all duration-300 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Register Now</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          )}

          {/* Explore / View Details Button */}
          <button
            onClick={onSelect}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 backdrop-blur-md transition-all duration-300 cursor-pointer group/btn"
          >
            <span>{isUpcoming ? 'View Event Details' : 'Explore Highlights'}</span>
            <div className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover/btn:translate-x-1 group-hover/btn:bg-cyan-400/20 transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface EventModalProps {
  event: ClubEvent;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const isUpcoming = event.category === 'upcoming';
  const imageSrc =
    event.cover_image_url ||
    (isUpcoming ? workshopImg : orientationImg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0b0d19]/80 backdrop-blur-xl -z-10"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl rounded-3xl bg-slate-950/95 border border-cyan-400/40 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(0,242,254,0.15)] overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-event-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 border border-white/20 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Banner Image */}
        <div className="relative aspect-[16/9] w-full max-h-72 overflow-hidden bg-slate-900">
          <img
            src={imageSrc}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = orientationImg;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                isUpcoming
                  ? 'bg-cyan-950/90 border border-cyan-400/50 text-cyan-300'
                  : 'bg-purple-950/90 border border-purple-400/40 text-purple-300'
              }`}
            >
              {isUpcoming ? 'Upcoming Event' : 'Recent Event'}
            </span>
            {event.event_date && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-white/20 text-slate-300 backdrop-blur-md flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{event.event_date}</span>
              </span>
            )}
            {event.venue && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-white/20 text-slate-300 backdrop-blur-md flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>{event.venue}</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 id="modal-event-title" className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {event.title}
            </h2>

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-950/50 border border-cyan-400/30 text-cyan-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            {event.registration_link ? (
              <a
                href={event.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>Register / Join Event</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">
                {isUpcoming ? 'Registration details coming soon' : 'Registration closed'}
              </span>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-slate-300 hover:text-white font-semibold text-xs tracking-wide transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
