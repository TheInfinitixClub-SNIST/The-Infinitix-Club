import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Users,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Search,
  Filter,
  Image as ImageIcon,
  Ticket,
  MapPin,
  Linkedin,
  Instagram,
  RefreshCw,
  Database,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  supabase,
  TeamMember,
  ClubEvent,
  HeroSlide,
  TeamTier,
  EventCategory,
} from '../lib/supabase';
import { seedInitialData } from '../lib/seed';

export const AdminPortal: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<'team' | 'events' | 'slides'>('team');

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamTierFilter, setTeamTierFilter] = useState<string>('all');
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Events state
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('all');
  const [editingEvent, setEditingEvent] = useState<Partial<ClubEvent> | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<ClubEvent | null>(null);

  // Hero Slides state
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isSlidesLoading, setIsSlidesLoading] = useState(false);
  const [slideSearch, setSlideSearch] = useState('');
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);

  // Action status toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await seedInitialData(supabase);
      const parts = [];
      if (res.teamInserted > 0) parts.push(`${res.teamInserted} team members`);
      if (res.eventsInserted > 0) parts.push(`${res.eventsInserted} events`);
      if (res.slidesInserted > 0) parts.push(`${res.slidesInserted} hero slides`);

      if (parts.length > 0) {
        showToast(`Successfully seeded ${parts.join(', ')} into Supabase!`);
      } else if (res.errors.length > 0) {
        showToast(`Notice: ${res.errors[0]}`, 'error');
      } else {
        showToast('All initial records are synchronized.');
      }
      await fetchTeam();
      await fetchEvents();
      await fetchSlides();
    } catch (err: any) {
      showToast(err.message || 'Seeding failed', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Check auth session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch team members
  const fetchTeam = async () => {
    setIsTeamLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTeamMembers((data || []) as TeamMember[]);
    } catch (err: any) {
      console.error('Fetch team error:', err);
      showToast(err.message || 'Failed to load team members', 'error');
    } finally {
      setIsTeamLoading(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    setIsEventsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents((data || []) as ClubEvent[]);
    } catch (err: any) {
      console.error('Fetch events error:', err);
      showToast(err.message || 'Failed to load events', 'error');
    } finally {
      setIsEventsLoading(false);
    }
  };

  // Fetch hero slides
  const fetchSlides = async () => {
    setIsSlidesLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSlides((data || []) as HeroSlide[]);
    } catch (err: any) {
      console.error('Fetch slides error:', err);
      showToast(err.message || 'Failed to load hero slides', 'error');
    } finally {
      setIsSlidesLoading(false);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (session) {
      fetchTeam();
      fetchEvents();
      fetchSlides();
    }
  }, [session]);

  // Auth handler (Login Only)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmittingAuth(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setSession(data.session);
      showToast('Logged in successfully!');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      showToast('Signed out of admin portal');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Team Member CRUD
  const handleOpenAddMember = () => {
    setEditingMember({
      name: '',
      role: '',
      tier: 'steering',
      department: '',
      bio: '',
      image_url: '',
      linkedin_url: '',
      instagram_url: '',
      order_index: teamMembers.length + 1,
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name || !editingMember.role || !editingMember.tier) {
      showToast('Name, Role, and Tier are required', 'error');
      return;
    }

    try {
      const payload = {
        name: editingMember.name,
        role: editingMember.role,
        tier: editingMember.tier,
        department: editingMember.department || null,
        bio: editingMember.bio || null,
        image_url: editingMember.image_url || null,
        linkedin_url: editingMember.linkedin_url || null,
        instagram_url: editingMember.instagram_url || null,
        order_index: editingMember.order_index ? Number(editingMember.order_index) : 0,
      };

      if (editingMember.id) {
        // Update
        const { error } = await supabase
          .from('team_members')
          .update(payload)
          .eq('id', editingMember.id);
        if (error) throw error;
        showToast(`Updated member: ${editingMember.name}`);
      } else {
        // Insert
        const { error } = await supabase.from('team_members').insert([payload]);
        if (error) throw error;
        showToast(`Added new member: ${editingMember.name}`);
      }

      setIsMemberModalOpen(false);
      setEditingMember(null);
      fetchTeam();
    } catch (err: any) {
      showToast(err.message || 'Failed to save member', 'error');
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberToDelete.id);
      if (error) throw error;
      showToast(`Removed member: ${memberToDelete.name}`);
      setMemberToDelete(null);
      fetchTeam();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete member', 'error');
    }
  };

  // Events CRUD
  const handleOpenAddEvent = () => {
    setEditingEvent({
      title: '',
      category: 'upcoming',
      description: '',
      event_date: '',
      venue: '',
      cover_image_url: '',
      registration_link: '',
      tags: [],
    });
    setTagsInput('');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: ClubEvent) => {
    setEditingEvent({ ...event });
    setTagsInput(event.tags ? event.tags.join(', ') : '');
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title || !editingEvent.category || !editingEvent.description) {
      showToast('Title, Category, and Description are required', 'error');
      return;
    }

    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: editingEvent.title,
        category: editingEvent.category,
        description: editingEvent.description,
        event_date: editingEvent.event_date || null,
        venue: editingEvent.venue || null,
        cover_image_url: editingEvent.cover_image_url || null,
        registration_link: editingEvent.registration_link || null,
        tags: parsedTags,
      };

      if (editingEvent.id) {
        // Update
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', editingEvent.id);
        if (error) throw error;
        showToast(`Updated event: ${editingEvent.title}`);
      } else {
        // Insert
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        showToast(`Created new event: ${editingEvent.title}`);
      }

      setIsEventModalOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || 'Failed to save event', 'error');
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventToDelete.id);
      if (error) throw error;
      showToast(`Removed event: ${eventToDelete.title}`);
      setEventToDelete(null);
      fetchEvents();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  // Slide modal handlers
  const handleOpenAddSlide = () => {
    setEditingSlide({
      image_url: '',
      title: '',
      order_index: slides.length + 1,
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.image_url) {
      showToast('Image URL is required', 'error');
      return;
    }

    try {
      const payload = {
        image_url: editingSlide.image_url.trim(),
        title: editingSlide.title ? editingSlide.title.trim() : null,
        order_index:
          typeof editingSlide.order_index === 'number'
            ? editingSlide.order_index
            : slides.length + 1,
      };

      if (editingSlide.id) {
        const { error } = await supabase
          .from('hero_slides')
          .update(payload)
          .eq('id', editingSlide.id);
        if (error) throw error;
        showToast('Updated hero slide successfully!');
      } else {
        const { error } = await supabase.from('hero_slides').insert([payload]);
        if (error) throw error;
        showToast('Created new hero slide!');
      }

      setIsSlideModalOpen(false);
      setEditingSlide(null);
      fetchSlides();
    } catch (err: any) {
      showToast(err.message || 'Failed to save slide', 'error');
    }
  };

  const handleDeleteSlide = async () => {
    if (!slideToDelete) return;
    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideToDelete.id);
      if (error) throw error;
      showToast('Removed hero slide successfully!');
      setSlideToDelete(null);
      fetchSlides();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete slide', 'error');
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const currentSlide = slides[index];
    const targetSlide = slides[targetIndex];

    try {
      const currentOrder = currentSlide.order_index ?? index + 1;
      const targetOrder = targetSlide.order_index ?? targetIndex + 1;
      const newCurrentOrder =
        targetOrder === currentOrder
          ? direction === 'up'
            ? currentOrder - 1
            : currentOrder + 1
          : targetOrder;

      await Promise.all([
        supabase
          .from('hero_slides')
          .update({ order_index: newCurrentOrder })
          .eq('id', currentSlide.id),
        supabase
          .from('hero_slides')
          .update({ order_index: currentOrder })
          .eq('id', targetSlide.id),
      ]);

      showToast('Reordered slide successfully!');
      fetchSlides();
    } catch (err: any) {
      showToast(err.message || 'Failed to reorder slide', 'error');
    }
  };

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0b0d19] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-cyan-400">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,242,254,0.3)]" />
          <span className="text-sm font-semibold tracking-wider uppercase text-slate-300">
            Verifying Infinitix Admin Clearance...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated -> Login Screen
  if (!session) {
    return (
      <div className="min-h-screen w-full bg-[#0b0d19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient lighting backgrounds */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Back to Home Button */}
        <a
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/40 text-xs font-semibold text-slate-300 hover:text-white transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Infinitix</span>
        </a>

        {/* Glassmorphic Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md rounded-3xl bg-[#0b0d19]/80 backdrop-blur-2xl border border-cyan-400/30 p-8 sm:p-10 shadow-[0_0_60px_rgba(0,242,254,0.15)] z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,242,254,0.3)] mb-4">
              <Shield className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Admin Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              /infinite Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Secure administrative access for Infinitix Club council
            </p>
          </div>

          {/* Error Alert */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{authError}</span>
            </motion.div>
          )}

          {/* Success Alert */}
          {authSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5"
            >
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{authSuccess}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@infinitix.club"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 focus:bg-white/[0.07] text-white text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 focus:bg-white/[0.07] text-white text-xs outline-none transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.5)] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmittingAuth ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Authenticate & Enter</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Filtered lists
  const filteredTeam = teamMembers.filter((m) => {
    const matchesTier = teamTierFilter === 'all' || m.tier === teamTierFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(teamSearch.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const filteredEvents = events.filter((e) => {
    const matchesCategory =
      eventCategoryFilter === 'all' || e.category === eventCategoryFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.description.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSlides = slides.filter((s) => {
    if (!slideSearch) return true;
    return (
      (s.title || '').toLowerCase().includes(slideSearch.toLowerCase()) ||
      s.image_url.toLowerCase().includes(slideSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#0b0d19] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-xl border ${
              toastMessage.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-200 shadow-red-950/50'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0b0d19]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-[#8a2be2] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0d19] rounded-[10px] flex items-center justify-center text-cyan-300 font-black text-sm">
                  ∞
                </div>
              </div>
              <span className="font-extrabold tracking-tight text-white text-base">
                INFINITIX
              </span>
            </a>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Portal /infinite
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-[11px] text-slate-400">Signed in as</span>
              <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                {session?.user?.email}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-red-500/15 border border-white/10 hover:border-red-400/40 text-xs font-semibold text-slate-300 hover:text-red-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Team</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">{teamMembers.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {teamMembers.filter((m) => m.tier === 'who_drives').length} Drives ·{' '}
              {teamMembers.filter((m) => m.tier === 'advisory').length} Advisory ·{' '}
              {teamMembers.filter((m) => m.tier === 'steering').length} Steering ·{' '}
              {teamMembers.filter((m) => m.tier === 'working_tech' || m.tier === 'working_non_tech').length} Working
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Events</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{events.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {events.filter((e) => e.category === 'upcoming').length} Upcoming ·{' '}
              {events.filter((e) => e.category === 'recent').length} Recent
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Hero Slides</span>
              <ImageIcon className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-2xl font-bold text-white">{slides.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Homepage Carousel Slides</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Supabase DB</span>
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected &amp; Live
            </div>
            <div className="text-[11px] text-slate-500 mt-2 truncate">
              {import.meta.env.VITE_SUPABASE_URL || 'sihuxkmkkwxvrizfbdnn.supabase.co'}
            </div>
          </div>
        </div>

        {/* Setup Banner if DB is empty */}
        {teamMembers.length === 0 && events.length === 0 && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Initial Database Setup</h4>
                <p className="text-xs text-slate-300">
                  Supabase tables are connected. Click below to populate all club members and events into your live database.
                </p>
              </div>
            </div>
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isSeeding ? 'Seeding Tables...' : 'Seed Default Club Data'}
            </button>
          </div>
        )}

        {/* Tab Selector & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10 w-fit flex-wrap">
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Members ({teamMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'slides'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Hero Slides ({slides.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Populate Supabase tables with initial club team members, events, and hero slides"
            >
              {isSeeding ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <Database className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>{isSeeding ? 'Seeding...' : 'Seed Initial Data'}</span>
            </button>

            {activeTab === 'team' ? (
              <button
                onClick={handleOpenAddMember}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            ) : activeTab === 'events' ? (
              <button
                onClick={handleOpenAddEvent}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            ) : (
              <button
                onClick={handleOpenAddSlide}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hero Slide</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: TEAM MEMBERS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'who_drives', 'advisory', 'steering', 'working_tech', 'working_non_tech'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTeamTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      teamTierFilter === tier
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {tier.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name or role..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Team Members Grid */}
            {isTeamLoading ? (
              <div className="py-12 text-center text-cyan-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-xs">Fetching members from Supabase...</span>
              </div>
            ) : filteredTeam.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">No team members found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Add your first advisory, steering, or working body member using the button above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTeam.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl transition-all shadow-lg group"
                  >
                    <div>
                      <div className="flex items-start gap-3.5 mb-3">
                        <img
                          src={
                            member.image_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              member.name
                            )}&background=0b0d19&color=00f2fe&bold=true`
                          }
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover bg-slate-900 border border-cyan-400/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-base truncate group-hover:text-cyan-200 transition-colors">
                            {member.name}
                          </h4>
                          <p className="text-xs font-medium text-cyan-400 truncate">
                            {member.role}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/[0.06] border border-white/10 text-slate-300">
                            {member.tier.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {member.department && (
                        <p className="text-xs text-slate-400 mb-2 truncate">
                          {member.department}
                        </p>
                      )}

                      {member.bio && (
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-300"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.instagram_url && (
                          <a
                            href={member.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-pink-400"
                            aria-label="Instagram"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditMember(member)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 transition-colors cursor-pointer"
                          aria-label="Edit Member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                          aria-label="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: EVENTS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex items-center gap-2">
                {['all', 'upcoming', 'recent'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEventCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      eventCategoryFilter === cat
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Events Grid */}
            {isEventsLoading ? (
              <div className="py-12 text-center text-cyan-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-xs">Fetching events from Supabase...</span>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">No events found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Create your first recent or upcoming event using the Add Event button above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col justify-between rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-purple-400/40 overflow-hidden backdrop-blur-xl transition-all shadow-lg group"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                      {event.cover_image_url ? (
                        <img
                          src={event.cover_image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950">
                          <ImageIcon className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <span
                        className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                          event.category === 'upcoming'
                            ? 'bg-cyan-950/90 border border-cyan-400/50 text-cyan-300'
                            : 'bg-purple-950/90 border border-purple-400/40 text-purple-300'
                        }`}
                      >
                        {event.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {event.event_date && (
                          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{event.event_date}</span>
                          </div>
                        )}

                        <h4 className="font-bold text-white text-base mb-2 group-hover:text-cyan-200 transition-colors line-clamp-1">
                          {event.title}
                        </h4>

                        {event.venue && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 truncate">
                            <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                          {event.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        {event.registration_link ? (
                          <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:underline"
                          >
                            <Ticket className="w-3 h-3" />
                            <span>Registration Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">No link</span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditEvent(event)}
                            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 transition-colors cursor-pointer"
                            aria-label="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEventToDelete(event)}
                            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                            aria-label="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: HERO SLIDES MANAGEMENT
           ========================================================================= */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-xs text-slate-400">
                Displaying <span className="text-white font-bold">{filteredSlides.length}</span> of{' '}
                <span className="text-white font-bold">{slides.length}</span> hero slides
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={slideSearch}
                  onChange={(e) => setSlideSearch(e.target.value)}
                  placeholder="Search slides..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                />
              </div>
            </div>

            {/* Slides Cards Grid */}
            {isSlidesLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-cyan-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-xs font-semibold text-slate-400">Loading hero slides...</span>
              </div>
            ) : filteredSlides.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Hero Slides Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  {slideSearch
                    ? 'No slides match your search query.'
                    : 'Add slides or click "Seed Initial Data" above to populate default showcase slides.'}
                </p>
                <button
                  onClick={handleOpenAddSlide}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Slide</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="group relative rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 overflow-hidden transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail with order badge */}
                      <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                        <img
                          src={slide.image_url}
                          alt={slide.title || 'Hero Slide'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e: any) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold backdrop-blur-md">
                          #{slide.order_index ?? index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-white truncate">
                          {slide.title || (
                            <span className="text-slate-500 italic font-normal">
                              No caption provided
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-1 font-mono">
                          {slide.image_url}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between">
                      {/* Reorder Buttons (Move Up / Move Down) */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSlide(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Move Slide Earlier in Sequence"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSlide(index, 'down')}
                          disabled={index === filteredSlides.length - 1}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Move Slide Later in Sequence"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit & Delete Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditSlide(slide)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-200 border border-white/10 transition-colors cursor-pointer"
                          aria-label="Edit Slide"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSlideToDelete(slide)}
                          className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                          aria-label="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: ADD / EDIT TEAM MEMBER (With Live Avatar Preview)
         ========================================================================= */}
      <AnimatePresence>
        {isMemberModalOpen && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMemberModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#0b0d19] border border-cyan-400/40 p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-white mb-1">
                {editingMember.id ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Fill out the member details. Changes will synchronize with the public site immediately.
              </p>

              <form onSubmit={handleSaveMember} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ''}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, name: e.target.value })
                      }
                      placeholder="e.g. Dr. K. S. Rao / Rohan Varma"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Role / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.role || ''}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, role: e.target.value })
                      }
                      placeholder="e.g. Faculty Mentor / President"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tier Group *
                    </label>
                    <select
                      value={editingMember.tier || 'steering'}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          tier: e.target.value as TeamTier,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0d19] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="who_drives">Who Drives Our Club (HOD / Faculty Advisor)</option>
                      <option value="advisory">Advisory Board Member</option>
                      <option value="steering">Steering Body</option>
                      <option value="working_tech">Working Body (Technical Team)</option>
                      <option value="working_non_tech">Working Body (Non-Technical Team)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Department / Domain
                    </label>
                    <input
                      type="text"
                      value={editingMember.department || ''}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, department: e.target.value })
                      }
                      placeholder="e.g. Department of CSE & AI, SNIST"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Avatar URL with Live Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Avatar Image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      value={editingMember.image_url || ''}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, image_url: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />

                    {/* Live Preview Avatar */}
                    <div className="w-10 h-10 rounded-full border border-cyan-400/40 overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={
                          editingMember.image_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            editingMember.name || 'Member'
                          )}&background=0b0d19&color=00f2fe&bold=true`
                        }
                        alt="Live preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://ui-avatars.com/api/?name=Member&background=0b0d19&color=00f2fe';
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Instant preview updates live on the right.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={editingMember.linkedin_url || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          linkedin_url: e.target.value,
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={editingMember.instagram_url || ''}
                      onChange={(e) =>
                        setEditingMember({
                          ...editingMember,
                          instagram_url: e.target.value,
                        })
                      }
                      placeholder="https://instagram.com/username"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bio / Executive Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingMember.bio || ''}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, bio: e.target.value })
                    }
                    placeholder="Brief description of their responsibilities or research focus..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    value={editingMember.order_index ?? 0}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        order_index: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-28 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsMemberModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    {editingMember.id ? 'Save Changes' : 'Create Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: ADD / EDIT EVENT (With Live Image Preview)
         ========================================================================= */}
      <AnimatePresence>
        {isEventModalOpen && editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEventModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#0b0d19] border border-cyan-400/40 p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-white mb-1">
                {editingEvent.id ? 'Edit Event' : 'Add New Event'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Publish or update hackathons, workshops, and cohort bootcamps.
              </p>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title || ''}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, title: e.target.value })
                      }
                      placeholder="e.g. AI Agent Hackathon 2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingEvent.category || 'upcoming'}
                      onChange={(e) =>
                        setEditingEvent({
                          ...editingEvent,
                          category: e.target.value as EventCategory,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0b0d19] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none cursor-pointer"
                    >
                      <option value="upcoming">Upcoming Event</option>
                      <option value="recent">Recent Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Event Date / Timeline
                    </label>
                    <input
                      type="text"
                      value={editingEvent.event_date || ''}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, event_date: e.target.value })
                      }
                      placeholder="e.g. November 14-15, 2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Venue / Location
                    </label>
                    <input
                      type="text"
                      value={editingEvent.venue || ''}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, venue: e.target.value })
                      }
                      placeholder="e.g. Main Auditorium & AI Lab, SNIST"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Cover Image URL with Live Banner Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={editingEvent.cover_image_url || ''}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        cover_image_url: e.target.value,
                      })
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none mb-2"
                  />

                  {editingEvent.cover_image_url && (
                    <div className="relative aspect-[16/8] max-h-32 rounded-xl overflow-hidden border border-cyan-400/30 bg-slate-900">
                      <img
                        src={editingEvent.cover_image_url}
                        alt="Live banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-1 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-cyan-300 font-mono">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Registration Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registration Link (URL for RSVP / Form)
                  </label>
                  <input
                    type="url"
                    value={editingEvent.registration_link || ''}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        registration_link: e.target.value,
                      })
                    }
                    placeholder="https://forms.gle/... or https://unstop.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Shows prominent "Register Now" button on the upcoming event card.
                  </span>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. GenAI, PyTorch, Hackathon"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingEvent.description || ''}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, description: e.target.value })
                    }
                    placeholder="Comprehensive description of agenda, requirements, and prizes..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    {editingEvent.id ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {(memberToDelete || eventToDelete) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setMemberToDelete(null);
                setEventToDelete(null);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#0b0d19] border border-red-500/40 p-6 shadow-2xl z-10 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Confirm Deletion</h4>
              <p className="text-xs text-slate-400 mb-6">
                Are you sure you want to permanently delete{' '}
                <span className="text-white font-semibold">
                  "{memberToDelete?.name || eventToDelete?.title || slideToDelete?.title || 'this slide'}"
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setMemberToDelete(null);
                    setEventToDelete(null);
                    setSlideToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    memberToDelete
                      ? handleDeleteMember
                      : eventToDelete
                      ? handleDeleteEvent
                      : handleDeleteSlide
                  }
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: ADD / EDIT HERO SLIDE (With Live Banner Preview)
         ========================================================================= */}
      <AnimatePresence>
        {isSlideModalOpen && editingSlide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSlideModalOpen(false);
                setEditingSlide(null);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#0b0d19] border border-cyan-400/40 p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden"
            >
              <h3 className="text-xl font-bold text-white mb-1">
                {editingSlide.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Manage the high-impact sliding banner showcasing club hackathons, workshops, and milestones.
              </p>

              <form onSubmit={handleSaveSlide} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingSlide.image_url || ''}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, image_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/... or /assets/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none mb-2"
                  />

                  {/* Live Banner Preview */}
                  {editingSlide.image_url && (
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-cyan-400/30 bg-slate-900 mt-2">
                      <img
                        src={editingSlide.image_url}
                        alt="Live banner preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-cyan-300 font-mono">
                        Live 16:9 Banner Preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Slide Title / Caption (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingSlide.title || ''}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, title: e.target.value })
                      }
                      placeholder="e.g. AI Hackathon 2026 Showcase"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Displayed as a sleek overlay badge on the slide.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display Order Index
                    </label>
                    <input
                      type="number"
                      value={editingSlide.order_index ?? ''}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          order_index: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="1, 2, 3..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 focus:border-cyan-400 text-white text-xs outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Controls sequential playback order.
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlideModalOpen(false);
                      setEditingSlide(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-[#8a2be2] hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                  >
                    {editingSlide.id ? 'Save Changes' : 'Save Slide'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
