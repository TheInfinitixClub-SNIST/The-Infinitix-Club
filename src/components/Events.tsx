import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  Users,
  Award,
  Clock,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';

import orientationImg from '../assets/images/infinitix_orientation_1792077162224.jpg';
import workshopImg from '../assets/images/infinitix_workshop_1792077162417.jpg';
import hackathonImg from '../assets/images/infinitix_hackathon_1792077160334.jpg';

interface EventData {
  id: string;
  title: string;
  date: string;
  badge: string;
  summary: string;
  fullDescription: string;
  image: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  location: string;
}

const RECENT_EVENTS: EventData[] = [
  {
    id: 'orientation',
    title: 'Club Orientation & Induction',
    date: 'August 24, 2025',
    badge: 'Cohort Onboarding',
    summary:
      'Onboarding the incoming cohort with live product demos, roadmap presentations, and hands-on club walkthroughs.',
    fullDescription:
      'The Infinitix Annual Induction marked the commencement of our academic session. Over 250 freshers gathered at the main campus auditorium for an interactive keynote introducing club initiatives, project roadmaps, and the upcoming competitive hackathon calendar. Senior domain leads demonstrated real-time computer vision models and neural network applications.',
    image: orientationImg,
    stats: [
      { label: 'Attendees', value: '250+' },
      { label: 'Cohorts Formed', value: '8' },
      { label: 'Live Demos', value: '4' },
    ],
    highlights: [
      'Welcome address by Faculty Advisor & Department Dean',
      'Unveiling of the 2025-2026 Technical Roadmaps & Learning Vault',
      'Interactive live Q&A panel with Infinitix Alumni working at Tier-1 tech firms',
      'On-the-spot algorithmic puzzle challenges and merchandise giveaways',
    ],
    location: 'Auditorium Hall 1, SNIST Campus',
  },
  {
    id: 'bootcamp',
    title: 'Machine Learning Bootcamp',
    date: 'October 12-13, 2025',
    badge: 'Hands-on Sprint',
    summary:
      'Weekend intensive sprint building, tuning, and evaluating predictive models on complex real-world tabular data.',
    fullDescription:
      'An immersive 2-day technical bootcamp where students transitioned from raw dataset ingestion to hyperparameter tuning and model deployment. Mentors guided cohorts through real-world Kaggle datasets, addressing common pain points like data leakage, feature engineering for high-cardinality features, and ROC-AUC metric optimization.',
    image: workshopImg,
    stats: [
      { label: 'Participants', value: '180+' },
      { label: 'Models Trained', value: '75+' },
      { label: 'Lab Hours', value: '16h' },
    ],
    highlights: [
      'Deep dive into Pandas vectorization, NumPy matrix math, and Scikit-Learn pipelines',
      'Hands-on feature engineering sprint: target encoding, polynomial features, and PCA',
      'Ensemble modeling: XGBoost, LightGBM, and Random Forest comparative benchmarking',
      'Live leaderboards with automated model evaluation scripts',
    ],
    location: 'AI Research Computing Lab, Block IV',
  },
  {
    id: 'hackathon',
    title: 'Data Hackathon: CodeSprint',
    date: 'January 18-19, 2026',
    badge: '24-Hour Hackathon',
    summary:
      'High-energy 24-hour hackathon building full-stack data applications, predictive pipelines, and generative AI prototypes.',
    fullDescription:
      'Our flagship annual 24-hour sprint brought together 40+ multidisciplinary teams. Participants solved pressing challenges across Healthcare AI, Smart Campus Analytics, and Financial Fraud Detection. Sponsored by top tech partners, teams presented working prototypes to a panel of corporate data scientists and academic judges.',
    image: hackathonImg,
    stats: [
      { label: 'Hackers', value: '160+' },
      { label: 'Teams', value: '42' },
      { label: 'Projects Deployed', value: '38' },
    ],
    highlights: [
      '24 hours of non-stop coding, model training, and prototype architecture',
      'Midnight mentor check-ins with industry data engineers and ML researchers',
      'Live deployment judging on cloud containers with automated stress tests',
      'Exciting cash prize pool and direct internship interview fast-tracks',
    ],
    location: 'Central Campus Incubation Center, SNIST',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
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

export const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
      }
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
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(0,242,254,0.2)]">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>[ PAST INITIATIVES & RECAP ]</span>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          Our Recent{' '}
          <span className="bg-gradient-to-r from-[#00f2fe] via-cyan-300 to-[#8a2be2] bg-clip-text text-transparent">
            Events
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          From intensive weekend bootcamps to overnight hackathons and cohort inductions — explore the energy,
          milestones, and community triumphs that define the Infinitix journey.
        </p>
      </div>

      {/* Cinema-Grade 3-Column Event Showcase */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
      >
        {RECENT_EVENTS.map((event) => {
          return (
            <EventCard
              key={event.id}
              event={event}
              onSelect={() => setSelectedEvent(event)}
            />
          );
        })}
      </motion.div>

      {/* Explore Highlights Modal */}
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
  event: EventData;
  onSelect: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:-translate-y-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] hover:shadow-[0_16px_40px_rgba(0,242,254,0.15)]"
    >
      {/* Mouse-following Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(600px_circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),rgba(0,242,254,0.12),transparent_40%)] -z-0"
        aria-hidden="true"
      />

      {/* High-Res Cinema-grade Visual Container (aspect-[16/10]) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d19] via-[#0b0d19]/40 to-transparent" />

        {/* Date & Cohort Pill Badges floating at top */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-950/80 border border-white/20 text-slate-200 backdrop-blur-md shadow-md flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>{event.date}</span>
          </span>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 backdrop-blur-md shadow-md">
            {event.badge}
          </span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="relative z-10 flex flex-col flex-1 p-6 sm:p-7 justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:text-cyan-200 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
            {event.summary}
          </p>
        </div>

        {/* "Explore Highlights" Modal Trigger */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onSelect}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] backdrop-blur-md transition-all duration-300 cursor-pointer group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>Explore Highlights</span>
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
  event: EventData;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
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
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 backdrop-blur-md">
              {event.badge}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-white/20 text-slate-300 backdrop-blur-md flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{event.date}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-white/20 text-slate-300 backdrop-blur-md flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{event.location}</span>
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 id="modal-event-title" className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {event.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.fullDescription}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            {event.stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Key Event Highlights */}
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Session Key Highlights</span>
            </h4>
            <div className="space-y-2">
              {event.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Close Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(0,242,254,0.2)] cursor-pointer"
            >
              Close Highlights
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
