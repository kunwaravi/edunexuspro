import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import GoogleReviewCta from '../components/atoms/GoogleReviewCta';
import ErrorState from '../components/atoms/ErrorState';
import {
  LogIn, UserPlus, Mail, Lock, User, GraduationCap,
  ShieldCheck, CheckCircle2, Send, MessageSquare, BookOpen,
  Cpu, Code2, Server, Wifi, Terminal, Database,
  Trophy, ArrowRight, Zap, Sparkles, LayoutGrid,
  ChevronDown, ChevronUp, ChevronRight, Wrench, Building2,
  FileText, Table2, Presentation, Monitor, Coffee, Braces, Atom,
  Layers, TerminalSquare, Network, CircuitBoard, Radio, MemoryStick,
  Lightbulb, Binary, PencilRuler, Boxes, Keyboard,
  Infinity as InfinityIcon, Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/atoms/Button';
import Dialog from '../components/atoms/Dialog';
import FormField from '../components/molecules/FormField';
import Card from '../components/atoms/Card';
import PageContainer from '../components/layout/PageContainer';
import CourseCard from '../components/molecules/CourseCard';
import { coursesConfig } from '../config/courses';
import { useCourses } from '../hooks/useCourses';
import { scrollToId } from '../lib/motion';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

// TASK 7 — curated "Choose Your Learning Path" section. Every listed course is
// a real catalog course; the path just sequences them for beginners. No fake data.
const LEARNING_PATHS = [
  {
    id: 'office',
    title: 'Office Professional',
    desc: 'From zero to confident documents, spreadsheets and presentations — the foundation of every desk job.',
    icon: FileText,
    color: 'from-sky-500/20 via-sky-600/10 to-transparent',
    border: 'border-sky-500/30',
    iconClass: 'text-sky-400',
    courses: ['Computer Fundamentals', 'MS Word', 'MS Excel', 'MS PowerPoint'],
    start: 'Beginner',
    category: 'computer-office',
  },
  {
    id: 'web',
    title: 'Web Developer',
    desc: 'Build modern websites and apps — from your first HTML page to full React interfaces.',
    icon: Code2,
    color: 'from-rose-500/20 via-rose-600/10 to-transparent',
    border: 'border-rose-500/30',
    iconClass: 'text-rose-400',
    courses: ['HTML & CSS', 'JavaScript', 'React', 'Node.js'],
    start: 'Beginner',
    category: 'web-development',
  },
  {
    id: 'embedded',
    title: 'Embedded Engineer',
    desc: 'Program microcontrollers and connect the physical world to software — C, embedded systems and IoT.',
    icon: CircuitBoard,
    color: 'from-orange-500/20 via-orange-600/10 to-transparent',
    border: 'border-orange-500/30',
    iconClass: 'text-orange-400',
    courses: ['C & Systems Programming', 'Embedded Systems & RTOS', 'IoT & Smart Interfacing', 'ESP32 Projects'],
    start: 'Beginner',
    category: 'embedded-systems',
  },
  {
    id: 'cad',
    title: 'CAD Designer',
    desc: 'Draft, model and visualise — from 2D technical drawings to parametric 3D solid design.',
    icon: PencilRuler,
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent',
    border: 'border-emerald-500/30',
    iconClass: 'text-emerald-400',
    courses: ['AutoCAD 2D', 'Civil CADD', 'Mechanical CADD'],
    start: 'Beginner',
    category: 'cad-design',
  },
];

// TASK 7 / Phase 3 — "Why EduNexus". Every claim below describes something the
// platform actually does (module → quiz → challenge → verifiable certificate).
// Deliberately no pricing claim, no "accredited" wording, and no invented
// outcome statistics — the numbers live in the proof row under this grid and
// come from the live database.
const WHY_EDUNEXUS = [
  {
    icon: BookOpen,
    title: 'Structured Curriculum',
    desc: 'Multi-module tracks that build in order — each topic closes with its own quiz, so gaps surface early.',
    accent: 'text-sky-400',
    ring: 'border-sky-500/30',
  },
  {
    icon: Terminal,
    title: 'Hands-On Practice',
    desc: 'Coding challenges, a browser sandbox and timed practice arenas — not slideware.',
    accent: 'text-emerald-400',
    ring: 'border-emerald-500/30',
  },
  {
    icon: ShieldCheck,
    title: 'Verifiable Certificate',
    desc: 'Every certificate carries a unique credential ID and QR code that anyone can check on the public verify page.',
    accent: 'text-amber-400',
    ring: 'border-amber-500/30',
  },
  {
    icon: GraduationCap,
    title: 'Self-Paced Access',
    desc: 'No fixed batches or class timings — start today and progress at whatever pace your schedule allows.',
    accent: 'text-violet-400',
    ring: 'border-violet-500/30',
  },
];

// TASK 7 / Phase 3 — "How It Works". The four steps mirror the real product
// flow: catalog → enrolment → modules/quizzes → certificate verification.
const HOW_IT_WORKS = [
  {
    icon: LayoutGrid,
    title: 'Choose a course',
    desc: 'Browse the catalog and pick a track — or follow a curated learning path if you are starting from zero.',
  },
  {
    icon: GraduationCap,
    title: 'Enrol and learn',
    desc: 'Work through the modules at your own pace, with each topic backed by notes and a practice quiz.',
  },
  {
    icon: Terminal,
    title: 'Practise and test',
    desc: 'Reinforce each module with coding challenges and the practice arena before the final assessment.',
  },
  {
    icon: ShieldCheck,
    title: 'Get certified',
    desc: 'Pass, download your certificate, and share the credential ID or QR code so anyone can verify it.',
  },
];


const coursePresentation: Record<string, { color: string; icon: any; colSpan: string }> = {
  // Presentation-only (icon, accent gradient, bento column span) — the catalog
  // API is the single source for ALL course business data (title/desc/difficulty/
  // duration/category/price/module count/certificate/tags). Nothing content-like
  // may live here (TASK 5 / spec Q).
  'C': { color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30', icon: Code2, colSpan: 'md:col-span-3' },
  'C++': { color: 'from-purple-500/20 via-purple-600/10 to-transparent border-purple-500/30', icon: Cpu, colSpan: 'md:col-span-3' },
  'IoT': { color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30', icon: Wifi, colSpan: 'md:col-span-2' },
  'Embedded': { color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30', icon: Server, colSpan: 'md:col-span-4' },
  'WebDesign': { color: 'from-pink-500/20 via-pink-600/10 to-transparent border-pink-500/30', icon: Terminal, colSpan: 'md:col-span-2' },
  'Python': { color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30', icon: Terminal, colSpan: 'md:col-span-2' },
  'SQL': { color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30', icon: Database, colSpan: 'md:col-span-2' },
  'CADDED_Mech': { color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30', icon: Wrench, colSpan: 'md:col-span-3' },
  'CADDED_Civil': { color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30', icon: Building2, colSpan: 'md:col-span-3' },
  // TASK 5: 25 new courses (presentation-only — icon/color/span)
  'MSWord': { color: 'from-sky-500/20 via-sky-600/10 to-transparent border-sky-500/30', icon: FileText, colSpan: 'md:col-span-3' },
  'MSExcel': { color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30', icon: Table2, colSpan: 'md:col-span-3' },
  'MSPowerPoint': { color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30', icon: Presentation, colSpan: 'md:col-span-2' },
  'ComputerFundamentals': { color: 'from-indigo-500/20 via-indigo-600/10 to-transparent border-indigo-500/30', icon: Monitor, colSpan: 'md:col-span-3' },
  'Java': { color: 'from-red-500/20 via-red-600/10 to-transparent border-red-500/30', icon: Coffee, colSpan: 'md:col-span-3' },
  'JavaScript': { color: 'from-yellow-500/20 via-yellow-600/10 to-transparent border-yellow-500/30', icon: Braces, colSpan: 'md:col-span-2' },
  'DSA': { color: 'from-violet-500/20 via-violet-600/10 to-transparent border-violet-500/30', icon: InfinityIcon, colSpan: 'md:col-span-2' },
  'HTMLCSS': { color: 'from-rose-500/20 via-rose-600/10 to-transparent border-rose-500/30', icon: Code2, colSpan: 'md:col-span-3' },
  'React': { color: 'from-cyan-500/20 via-cyan-600/10 to-transparent border-cyan-500/30', icon: Atom, colSpan: 'md:col-span-2' },
  'NodeJS': { color: 'from-green-500/20 via-green-600/10 to-transparent border-green-500/30', icon: Server, colSpan: 'md:col-span-2' },
  'FullStackWeb': { color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30', icon: Layers, colSpan: 'md:col-span-4' },
  'Linux': { color: 'from-slate-500/20 via-slate-600/10 to-transparent border-slate-500/30', icon: TerminalSquare, colSpan: 'md:col-span-3' },
  'Networking': { color: 'from-cyan-500/20 via-cyan-600/10 to-transparent border-cyan-500/30', icon: Network, colSpan: 'md:col-span-2' },
  'Arduino': { color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30', icon: CircuitBoard, colSpan: 'md:col-span-3' },
  'ESP32': { color: 'from-sky-500/20 via-sky-600/10 to-transparent border-sky-500/30', icon: Radio, colSpan: 'md:col-span-2' },
  'EmbeddedC': { color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30', icon: Cpu, colSpan: 'md:col-span-3' },
  'Microcontrollers': { color: 'from-red-500/20 via-red-600/10 to-transparent border-red-500/30', icon: MemoryStick, colSpan: 'md:col-span-2' },
  'BasicElectronics': { color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30', icon: Lightbulb, colSpan: 'md:col-span-3' },
  'DigitalElectronics': { color: 'from-fuchsia-500/20 via-fuchsia-600/10 to-transparent border-fuchsia-500/30', icon: Binary, colSpan: 'md:col-span-2' },
  'PCBDesign': { color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30', icon: CircuitBoard, colSpan: 'md:col-span-2' },
  'AutoCAD2D': { color: 'from-red-500/20 via-red-600/10 to-transparent border-red-500/30', icon: PencilRuler, colSpan: 'md:col-span-3' },
  'ThreeDCAD': { color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30', icon: Boxes, colSpan: 'md:col-span-2' },
  'ITICOPA': { color: 'from-lime-500/20 via-lime-600/10 to-transparent border-lime-500/30', icon: Keyboard, colSpan: 'md:col-span-3' },
  'ITIElectrician': { color: 'from-yellow-500/20 via-yellow-600/10 to-transparent border-yellow-500/30', icon: Zap, colSpan: 'md:col-span-2' },
  'ITIFitter': { color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30', icon: Wrench, colSpan: 'md:col-span-3' },
};

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [activeWeekPreview, setActiveWeekPreview] = useState<number>(1);
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);
  // Home browses the whole catalog by category — the per-course filter lives on
  // /courses — so the catalog hook is always asked for the unfiltered list.
  const activeCategory = 'all';
  // TASK 7 — unfiltered catalog for the Featured row (stays global even when a
  // category chip is active). One lightweight fetch; the row hides if it fails.
  const [fullCatalog, setFullCatalog] = useState<any[]>([]);

  // TASK 7 — REAL site stats from GET /api/stats (no invented numbers).
  const [stats, setStats] = useState<{ students: number | null; courses: number | null; modules: number | null; quizzes: number | null }>({
    students: null, courses: null, modules: null, quizzes: null,
  });

  // TASK 7 — scroll to #learning-paths when arriving from the navbar anchor.
  // Behaviour comes from scrollToId so reduced-motion users get an instant jump
  // rather than a long animated scroll (master task §21).
  useEffect(() => {
    if (window.location.hash === '#learning-paths') {
      setTimeout(() => scrollToId('learning-paths'), 120);
    }
  }, []);

  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  // TASK 5 + TASK 7: catalog is fetched through the shared useCourses hook —
  // API-driven, no hardcoded fallback catalog. Chips drive the hook (the
  // original Task-5 server-side contract), and `fullCatalog` keeps the Featured
  // row global regardless of the active chip.
  const { data: courses, categories, loading: coursesLoading, error: coursesError, refetch: refetchCourses } = useCourses(activeCategory);

  // TASK 7 — full catalog for the Featured row (see state above).
  useEffect(() => {
    api.get('/courses')
      .then((res) => setFullCatalog(res.data))
      .catch(() => { /* never fake data — Featured row stays hidden */ });
  }, []);

  // TASK 7 — real DB stats for the trust strip
  useEffect(() => {
    api.get('/stats')
      .then((res) => setStats({
        students: res.data?.students ?? null,
        courses: res.data?.courses ?? null,
        modules: res.data?.modules ?? null,
        quizzes: res.data?.quizzes ?? null,
      }))
      .catch(() => { /* keep dash placeholders — never invent numbers */ });
  }, []);

  const mapCourse = (c: any) => {
    const meta = coursePresentation[c.id] || {
      color: 'from-slate-700/20 via-slate-800/10 to-transparent border-slate-750/30',
      icon: BookOpen,
      colSpan: 'md:col-span-2',
    };

    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      // Business data comes EXCLUSIVELY from the catalog API. NULL/empty fields
      // are simply not rendered (course authoring is the next task) — nothing is
      // invented client-side. Presentation config carries only icon/color/span.
      desc: c.description || 'Welcome to this specialized curriculum track.',
      difficulty: c.difficulty || null,
      duration: c.duration || null,
      categoryName: c.category?.name || null,
      categorySlug: c.category?.slug || null,
      moduleCount: c.moduleCount,
      certificateAvailable: c.certificateAvailable,
      featured: c.featured,
      price: c.price,
      banner: c.banner,
      comingSoon: c.comingSoon,
      tags: c.tags || [],
      color: meta.color,
      icon: meta.icon,
      colSpan: meta.colSpan,
      syllabus: (c.modules || []).map((m: any) => ({
        week: m.week,
        title: m.title,
        details: m.description || 'Curriculum details for this week.',
      }))
    };
  };

  const mappedCourses = courses.map(mapCourse);
  // TASK 7 — DB `featured` only, derived from the unfiltered `fullCatalog` so the
  // Featured row stays global regardless of any category browsing.
  const featuredCourses = fullCatalog.map(mapCourse).filter((c: any) => c.featured);

  // Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Public Leaderboard / Hall of Fame.
  // On failure we show NOTHING — the previous "fallback mock students" put five
  // invented names, scores and colleges on a public page where they read as
  // real learners. An unavailable leaderboard must say so, not fabricate one.
  useEffect(() => {
    api.get('/practice/leaderboard/public')
      .then(res => {
        setTopStudents(res.data.leaderboard || []);
      })
      .catch((err) => {
        console.error('Failed to load public leaderboard:', err);
        setTopStudents([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password } 
        : { email, password, name, fatherName, collegeName, branchName };
      
      const response = await api.post(endpoint, data);
      login(response.data.token, response.data.user);
      addToast(isLogin ? 'Successfully logged in!' : 'Successfully registered!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid credentials or connection error';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToEnroll = () => scrollToId('enrollment-section');

  return (
    <PageContainer maxWidth="max-w-7xl" className="space-y-16 py-12 relative">

      {/* Sleek Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-amber-500 z-50 origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Ambient gradient wash — deliberately STATIC. These were three motion.divs
          looping forever (25–30s each), i.e. permanent background movement and
          constant compositing work for a purely decorative effect. The colour and
          depth are the brand; the motion was not. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[45%] h-[45%] rounded-full bg-purple-600/8 blur-[110px]" />
      </div>

      {/* Desktop Optimization Notice Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 text-left backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
        <span className="text-xl">💻</span>
        <div className="text-xs sm:text-sm text-slate-300">
          <strong className="text-blue-400 block sm:inline mr-1">Desktop Recommended:</strong>
          For the best experience, including interactive code sandboxes and high-resolution certificate printing, we recommend using a Desktop or Laptop browser.
        </div>
      </div>
      
      {/* 1. Hero & Branding Introduction Block */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[65vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left space-y-6 z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
            <ShieldCheck size={14} className="animate-pulse" /> Live Verifiable Training Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
            Nexus Academic & <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
              Embedded Innovation
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Access specialized industrial training curriculums covering low-level C programming, object-oriented software design, IoT controller networks, and real-time RTOS microkernels.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
            {/* Telegram Group Button */}
            <a
              href="https://t.me/+tCapxtLwxNNlZjY1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/45 hover:border-[#229ED9]/70 text-[#29aae2] font-extrabold text-xs uppercase tracking-widest transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(34,158,217,0.2)] group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-200">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.09 14.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.726.186z"/>
              </svg>
              Join Telegram Group
            </a>
            <Button 
              variant="accent"
              onClick={scrollToEnroll}
            >
              Start Learning Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToId('catalog-section')}
            >
              Browse Curriculum
            </Button>
          </div>
        </motion.div>

        {/* Hero Decorative Illustration card with Mesh Gradient and Floating Items */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full max-w-md relative select-none hidden lg:block"
        >
          {/* Animated Mesh Gradient Wrapper */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-amber-500/5 to-purple-500/10 rounded-2xl blur-xl animate-pulse"></div>

          <Card className="p-8 text-center relative overflow-hidden border border-slate-800" variant="glass">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 relative group">
              <Sparkles size={28} className="absolute animate-spin-slow opacity-30 text-amber-300" />
              <GraduationCap size={32} className="relative z-10" />
            </div>
            
            <div className="space-y-1 mb-6">
              {/* h2: this card sits directly under the page <h1>, so an h3 here
                  was the first level skip in the document outline. */}
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Industrial Training Registry</h2>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Verified by Nexus Labs</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-[12px] text-slate-400 leading-relaxed font-mono uppercase tracking-tight space-y-2 text-left">
              <p className="text-amber-500 font-extrabold flex items-center gap-1.5"><CheckCircle2 size={13} /> 100% Verified Credentials</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Realtime Database Security</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Interactive Circuit Simulators</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Self-Paced Sandbox Arenas</p>
            </div>
          </Card>
        </motion.div>
      </div>

    {/* Animated Scroll Indicator */}
    <div className="flex justify-center pb-4">
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer flex flex-col items-center gap-1.5"
        onClick={() => scrollToId('catalog-section')}
      >
        <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">Explore Catalog</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-amber-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7" />
        </svg>
      </motion.div>
    </div>

      {/* 2. Why EduNexus — what the platform actually gives a learner, then a
          proof row of REAL DB counts (TASK 7: no invented numbers). */}
      <div id="why-edunexus" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Sparkles className="text-amber-500 fill-amber-500/20" size={24} />
            Why EduNexus
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Practical, project-oriented training built around what you can actually do at the end of it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_EDUNEXUS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-5 space-y-3 border border-slate-850 h-full" variant="glass">
                <div className={`p-2.5 rounded-xl border ${item.ring} w-fit bg-slate-950/50`}>
                  <Icon className={item.accent} size={20} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* Proof row — live counts straight from the database, never hardcoded. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            { value: stats.students, suffix: '+', label: 'Students Trained' },
            { value: stats.courses, suffix: '', label: 'Specialized Tracks' },
            { value: stats.modules, suffix: '+', label: 'Learning Modules' },
            { value: stats.quizzes, suffix: '+', label: 'Practice Quizzes' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-5 text-center space-y-1">
              {/* A count is not a document heading — these were <h2>, which put
                  four meaningless entries in the outline ahead of the first real
                  section. Both lines stay readable to assistive tech (the number
                  is NOT aria-hidden: hiding it would drop the figure entirely and
                  leave a screen-reader user with a bare label). */}
              <p className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">
                {s.value != null ? `${Number(s.value).toLocaleString('en-IN')}${s.suffix}` : (
                  <span className="text-slate-600 animate-pulse">—</span>
                )}
              </p>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Featured Courses — only the DB `featured` flag (TASK 7) */}
      {featuredCourses.length > 0 && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-2 max-w-xl">
              <h2 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2 justify-center sm:justify-start">
                <Sparkles className="text-amber-500 fill-amber-500/20" size={24} />
                Featured Courses
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                The most in-demand tracks on EduNexus Pro — a great place to start.
              </p>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[12px] font-black uppercase tracking-widest transition-colors"
            >
              View All Courses <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => {
              const conf = coursesConfig.find((x) => x.id === course.id);
              return (
                <CourseCard
                  key={course.id}
                  type="catalog"
                  id={course.id}
                  slug={course.slug}
                  title={course.title}
                  desc={course.desc}
                  icon={conf?.icon}
                  color={conf?.colorDark}
                  difficulty={course.difficulty || undefined}
                  categoryName={course.categoryName || undefined}
                  duration={course.duration || undefined}
                  moduleCount={course.moduleCount}
                  certificateAvailable={course.certificateAvailable}
                  featured={course.featured}
                  price={course.price}
                  banner={course.banner}
                  comingSoon={course.comingSoon}
                  tags={course.tags}
                  onAction={(key) => navigate(`/course/${key}`)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Browse by Category — compact entry into the full catalog.
          The 34-card grid that used to live here restated what the Featured row
          above already showed and what /courses exists for; nine real category
          tiles keep the "how much is here" signal without the density. */}
      <div id="catalog-section" className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-2 max-w-xl">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2 justify-center sm:justify-start">
              <LayoutGrid className="text-amber-500" size={24} />
              Browse by Category
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {mappedCourses.length > 0
                ? `${mappedCourses.length} specialized tracks across ${Math.max(categories.length - 1, 0)} categories.`
                : 'Explore specialized training tracks by category.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/courses')}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[12px] font-black uppercase tracking-widest transition-colors"
          >
            View All Courses <ArrowRight size={14} />
          </button>
        </div>

        {coursesError ? (
          <ErrorState
            title="Unable to load courses"
            message="Courses are temporarily unavailable. This is not an empty catalog — please try again."
            onRetry={() => refetchCourses()}
          />
        ) : coursesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-900/50 border border-slate-850 animate-pulse" />
            ))}
          </div>
        ) : categories.length > 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.filter((cat) => cat.slug !== 'all').map((cat) => {
              const count = mappedCourses.filter((c: any) => c.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/courses?category=${cat.slug}`)}
                  className="group p-4 rounded-2xl border border-slate-850 bg-slate-900/40 hover:border-amber-500/40 hover:bg-slate-900/70 transition-all duration-300 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                >
                  <span className="block text-xs font-black text-slate-200 group-hover:text-white uppercase tracking-wide leading-snug">
                    {cat.name}
                  </span>
                  <span className="block mt-1.5 text-[12px] font-bold text-slate-500 group-hover:text-amber-400 transition-colors">
                    {count} {count === 1 ? 'course' : 'courses'}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-2 max-w-lg mx-auto">
            <p className="text-slate-400 text-sm font-medium">
              No courses in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Learning Paths — TASK 7: curated beginner paths (real courses only) */}
      <div id="learning-paths" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <MapIcon className="text-amber-500" size={24} />
            Choose Your Learning Path
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Not sure where to start? Follow a curated path — each one builds real skills, step by step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEARNING_PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <Card
                key={path.id}
                className="p-6 relative overflow-hidden border-slate-850 hover:border-slate-700/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                variant="glass"
              >
                <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${path.color} rounded-full blur-2xl opacity-40 pointer-events-none`} />
                <div className="flex items-start justify-between gap-4">
                  <div className={`p-2.5 rounded-xl border ${path.border} ${path.iconClass} w-fit`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-widest text-slate-500 bg-slate-900/50 px-2 py-1 rounded-full border border-slate-800 shrink-0">
                    {path.start} · {path.courses.length} Courses
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black text-white tracking-tight">{path.title}</h3>
                <p className="mt-1.5 text-slate-400 text-xs leading-relaxed">{path.desc}</p>
                <ol className="mt-4 space-y-1.5">
                  {path.courses.map((course, i) => (
                    <li key={course} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[12px] font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {course}
                      {i < path.courses.length - 1 && <ChevronRight size={12} className="text-slate-600 shrink-0" />}
                    </li>
                  ))}
                </ol>
                <button
                  onClick={() => navigate(`/courses?category=${path.category}`)}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-amber-450 hover:text-amber-300 uppercase tracking-wider transition-colors"
                >
                  Explore Path <ArrowRight size={12} />
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Works — TASK 7 / Phase 3: the four real steps from catalog to
          a verifiable certificate. Static copy only; no data dependency. */}
      <div id="how-it-works" className="space-y-8 border-t border-slate-800/80 pt-16 scroll-mt-24">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500/20" size={24} />
            How It Works
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Four steps from your first click to a certificate anyone can verify.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <Card className="p-5 space-y-3 border border-slate-850 h-full" variant="glass">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[12px] font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <Icon className="text-amber-500" size={20} />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </Card>
                {/* Connector chevron — desktop only, hidden from assistive tech. */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight
                    aria-hidden="true"
                    size={16}
                    className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-700 z-10"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button variant="accent" onClick={() => navigate('/courses')}>
            Browse All Courses
          </Button>
        </div>
      </div>

      {/* 4. Student Hall of Fame Section (Issue #45)
          Rendered only when the API actually returns ranked students. An
          earlier revision drew an empty podium heading on failure, which read
          as a broken page; names arrive masked (surname initial) and without
          college, per the public-leaderboard privacy change. */}
      {topStudents.length > 0 && (
      <div className="space-y-8 border-t border-slate-800/80 pt-16">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            Student Hall of Fame
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Top-ranked learners on the EduNexus practice leaderboard, by XP earned.
          </p>
        </div>

        {/* Podium Layout */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-4 max-w-4xl mx-auto">
          {topStudents.length > 0 && (() => {
            const podiumStudents = [];
            if (topStudents[1]) podiumStudents.push({ ...topStudents[1], rank: 2, scale: 'scale-100', height: 'h-auto md:h-72', border: 'border-slate-350/40 shadow-slate-350/5', color: 'from-slate-400/5 via-slate-950 to-slate-950', badge: '🥈 Silver' });
            if (topStudents[0]) podiumStudents.push({ ...topStudents[0], rank: 1, scale: 'scale-100 md:scale-105', height: 'h-auto md:h-80 md:-translate-y-2', border: 'border-yellow-500/60 shadow-yellow-500/10', color: 'from-yellow-500/10 via-slate-950 to-slate-950', badge: '👑 Gold' });
            if (topStudents[2]) podiumStudents.push({ ...topStudents[2], rank: 3, scale: 'scale-100', height: 'h-auto md:h-64', border: 'border-amber-700/40 shadow-amber-700/5', color: 'from-amber-750/5 via-slate-950 to-slate-950', badge: '🥉 Bronze' });

            return podiumStudents.map((student) => {
              const orderClass = student.rank === 1 ? 'order-1 md:order-2' : student.rank === 2 ? 'order-2 md:order-1' : 'order-3 md:order-3';
              return (
                <motion.div
                  /* Keyed by rank, not by name. The public leaderboard shows a
                     masked display name, so two learners can legitimately render
                     the same string (two "Demo U." accounts today) — and even
                     unmasked, two students can share a name. Rank is unique
                     within the list by construction and is what the row means. */
                  key={student.rank}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`w-full md:w-1/3 ${orderClass} ${student.scale} flex`}
                >
                  <Card className={`w-full p-6 flex flex-col items-center text-center justify-between relative overflow-hidden border ${student.border} bg-gradient-to-b ${student.color} ${student.height}`} variant="glass">
                    <div className="absolute top-4 right-4">
                      <span className="text-[12px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-350">
                        {student.badge}
                      </span>
                    </div>

                    <div className="flex flex-col items-center mt-4">
                      <div className={`w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-base shadow-inner border mb-4 relative ${student.rank === 1 ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'border-slate-700'}`}>
                        {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        {student.rank === 1 && <span className="absolute -top-2 text-yellow-400 text-lg">👑</span>}
                      </div>

                      {/* Public leaderboard: the API returns a masked display
                          name (surname initial) and no college — the podium
                          shows only what the student consented to by ranking. */}
                      <h3 className="text-sm font-extrabold text-white">{student.name}</h3>
                    </div>

                    <div className="flex flex-col items-center w-full mt-4 gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 border border-slate-900 rounded-full">
                        <Zap className="text-amber-400 fill-amber-400" size={13} />
                        <span className="text-xs font-black text-white font-mono">{student.points} <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">XP</span></span>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center max-h-[48px] overflow-hidden">
                        {student.badges && student.badges.length > 0 ? (
                          student.badges.slice(0, 2).map((b: string) => (
                            <span key={b} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[12px] font-black uppercase text-slate-450 tracking-wider">
                              🏆 {b.replace(/_/g, ' ').replace('week 1 master', 'W1 Master').replace('bug hunter', 'Bug Hunter').replace('perfect score', 'Perfect')}
                            </span>
                          ))
                        ) : (
                          <span className="text-[12px] text-slate-650 italic">Consistent Learner</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            });
          })()}
        </div>

        {/* Collapsible View Top 10 Leaderboard Ranks */}
        {topStudents.length > 3 && (
          <div className="flex flex-col items-center pt-4">
            <button
              onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40 text-[12px] font-black uppercase tracking-widest text-slate-450 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              {showAllLeaderboard ? (
                <>Hide Ranks <ChevronUp size={12} /></>
              ) : (
                <>View Top 10 Ranks <ChevronDown size={12} /></>
              )}
            </button>

            <AnimatePresence>
              {showAllLeaderboard && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-2xl mt-4 overflow-hidden"
                >
                  <Card className="p-4 border border-slate-850" variant="glass">
                    <Table className="text-xs text-slate-400">
                      <TableHeader>
                        <TableRow className="border-b border-slate-900 text-slate-500 font-black uppercase tracking-wider text-[12px]">
                          <TableHead className="py-2.5 px-3">Rank</TableHead>
                          <TableHead className="py-2.5 px-3">Student Name</TableHead>
                          <TableHead className="py-2.5 px-3 text-right">XP Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-900/60">
                        {topStudents.slice(3, 10).map((student, idx) => {
                          // Same reasoning as the podium: the displayed rank is
                          // the row's identity on a leaderboard, and a display
                          // name is not unique. Computed once so the key and the
                          // visible rank can never drift apart.
                          const rank = idx + 4;
                          return (
                          <TableRow key={rank} className="hover:bg-slate-900/30 transition-colors">
                            <TableCell className="py-3 px-3 font-mono font-bold text-slate-350">#{rank}</TableCell>
                            <TableCell className="py-3 px-3 font-extrabold text-white">{student.name}</TableCell>
                            <TableCell className="py-3 px-3 text-right font-mono font-bold text-amber-500 flex items-center justify-end gap-1">
                              <Zap className="text-amber-500 fill-amber-500/20" size={12} />
                              {student.points} XP
                            </TableCell>
                          </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      )}

      {/* 5. Verification & Trust — how a certificate is actually checked. Kept
          distinct from "Why EduNexus" above: that section sells the learning
          experience, this one explains the credential mechanism and links to
          the public verifier. Google review CTA sits here because it is the
          natural end of the trust story (Phase 11). */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <ShieldCheck className="text-amber-500" size={24} />
            Verification &amp; Trust
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            A certificate is only worth what a third party can check. Every EduNexus credential is publicly verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Unique Credential ID', desc: 'Each certificate is issued with its own registry ID — no two credentials share one.' },
            { title: 'Public Verify Page', desc: 'Anyone can enter a credential ID and confirm the holder, course and issue date.' },
            { title: 'Scannable QR Code', desc: 'Every certificate carries a QR code that opens its verification page directly.' },
            { title: 'Registry Status', desc: 'Credential records are held in the platform database and served by the verification API.' },
          ].map((val, i) => (
            <Card key={i} className="p-5 space-y-2 border border-slate-850" variant="glass">
              <CheckCircle2 className="text-amber-500" size={24} />
              {/* h3: these cards sit directly under this section's <h2>, so an
                  h4 skipped a level in the outline. */}
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">{val.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{val.desc}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button variant="outline" onClick={() => navigate('/verify')}>
            Verify a Certificate
          </Button>
          <GoogleReviewCta variant="card" />
        </div>
      </div>

      {/* Final CTA — last push before the sign-in form, so a visitor who has
          read the whole page has one obvious next action. */}
      <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-900/40 p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Start learning today
        </h2>
        <p className="text-slate-400 text-sm font-medium max-w-xl mx-auto leading-relaxed">
          Create a free account, pick a track, and work through it at your own pace — your progress and certificate stay tied to your account.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Button variant="accent" onClick={scrollToEnroll}>
            Get Started
          </Button>
          <Button variant="outline" onClick={() => navigate('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>

      {/* 6. Enrollment Portal (Login/Register Form Section) */}
      <div id="enrollment-section" className="flex justify-center pt-8 border-t border-slate-800/80">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <Card className="p-8 relative overflow-hidden border border-slate-800" variant="glass">
            
            {/* Decorative glowing gradient sphere */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
              {isLogin ? 'Student Login' : 'Registration'}
            </h2>
            <p className="text-center text-slate-400 text-sm mb-6">
              {isLogin ? 'Sign in to access NEXUS training portal' : 'Enroll in smart electronics programs'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <FormField
                      label="Full Name"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      leftIcon={<User size={18} />}
                      required
                    />
                    <FormField
                      label="Father's Name"
                      placeholder="Father's Name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      leftIcon={<User size={18} />}
                      required
                    />
                    <FormField
                      label="College Name"
                      placeholder="College Name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      leftIcon={<GraduationCap size={18} />}
                      required
                    />
                    <FormField
                      label="Branch"
                      placeholder="Branch (e.g. ECE, EEE, CSE)"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      leftIcon={<GraduationCap size={18} />}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField
                label="Email Address"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              
              <FormField
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
                error={error}
              />
              
              <Button 
                type="submit"
                isLoading={isLoading}
                variant="accent"
                fullWidth
                className="mt-4"
                leftIcon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              >
                {isLogin ? 'Login' : 'Enroll Now'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-slate-400 text-sm">
              {isLogin ? "New to the portal?" : "Already enrolled?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="ml-2 text-amber-500 hover:underline font-semibold"
              >
                {isLogin ? 'Create Account' : 'Login Here'}
              </button>
            </div>
          </Card>

          {/* Prominent Technical Support Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center bg-slate-900/40 border border-slate-900/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md"
          >
            <p className="text-xs text-slate-400 font-medium">
              Having trouble? Need help with activation?
            </p>
            <div className="flex justify-center items-center gap-6 mt-3">
              <a 
                href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors"
              >
                <MessageSquare size={14} /> WhatsApp Help
              </a>
              <span className="text-slate-800">•</span>
              <a 
                href="https://t.me/+tCapxtLwxNNlZjY1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
              >
                <Send size={14} /> Telegram Help
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Syllabus Timelines Preview Modal */}
      <Dialog
        open={!!previewCourse}
        onClose={() => setPreviewCourse(null)}
        title={previewCourse?.title || 'Syllabus Preview'}
        size="xl"
        backdropClassName="bg-black/80 backdrop-blur-md"
        className="bg-slate-950 border-slate-800 rounded-3xl p-6 lg:p-8 my-8"
      >
        {previewCourse && (
        <>
        {/* Close Trigger */}
        <button
          onClick={() => setPreviewCourse(null)}
          aria-label="Close syllabus preview"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors"
        >
          ✕
        </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[12px] font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider">
                    Syllabus Overview
                  </span>
                  <h2 className="text-2xl font-black text-white mt-3 uppercase tracking-tight">{previewCourse.title}</h2>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{previewCourse.desc}</p>
                </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                <h4 className="text-[12px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2 mb-4">
                  {previewCourse.syllabus.length}-Week Training Roadmap
                </h4>
                
                <div className="space-y-3">
                  {previewCourse.syllabus.map((weekData: any) => {
                    const isOpen = activeWeekPreview === weekData.week;
                    return (
                      <div 
                        key={weekData.week} 
                        className={`relative border rounded-2xl p-4 transition-all duration-350 ${isOpen ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-slate-850 bg-slate-950/20 hover:border-slate-800'}`}
                      >
                        <button
                          onClick={() => setActiveWeekPreview(isOpen ? 0 : weekData.week)}
                          className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs transition-colors duration-300 ${isOpen ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                              0{weekData.week}
                            </div>
                            <div>
                              <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest block">Week {weekData.week} Module</span>
                              <h4 className="text-sm font-extrabold text-white tracking-tight">{weekData.title}</h4>
                            </div>
                          </div>
                          <div className={`text-slate-500 hover:text-white transition-transform duration-250 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <ChevronDown size={16} />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3.5 pl-11 border-t border-slate-900/60 pt-3.5">
                                <p className="text-slate-450 text-xs leading-relaxed font-medium">{weekData.details}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

                <div className="pt-4 border-t border-slate-850 flex justify-end">
                  <Button 
                    variant="accent"
                    onClick={() => {
                      setPreviewCourse(null);
                      scrollToEnroll();
                    }}
                  >
                    Start Training Now
                  </Button>
                </div>
              </div>
        </>
        )}
      </Dialog>

    </PageContainer>
  );
};

export default Home;
