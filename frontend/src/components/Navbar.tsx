import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import {
  LogOut, LayoutDashboard, ShieldCheck, Menu, X, Sun, Moon, ChevronDown, Zap, BookOpen,
  Monitor, Code2, Globe, Wifi, CircuitBoard, Compass, Server, Cpu, Wrench,
  BadgeCheck, BookMarked, Home as HomeIcon, Map as MapIcon,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './atoms/Button';

// ── TASK 7: curated navigation (mirrors the 9 non-empty catalog categories) ──
const NAV_CATEGORIES = [
  { slug: 'computer-office', label: 'Computer & Office', icon: Monitor },
  { slug: 'programming', label: 'Programming', icon: Code2 },
  { slug: 'web-development', label: 'Web Development', icon: Globe },
  { slug: 'iot', label: 'IoT', icon: Wifi },
  { slug: 'embedded-systems', label: 'Embedded Systems', icon: CircuitBoard },
  { slug: 'cad-design', label: 'CAD & Design', icon: Compass },
  { slug: 'systems-technology', label: 'Systems & Technology', icon: Server },
  { slug: 'electronics', label: 'Electronics', icon: Cpu },
  { slug: 'iti-trade-training', label: 'ITI & Trade Training', icon: Wrench },
];

// Programs = curated career learning paths (each maps to a real catalog category)
const PROGRAMS = [
  { label: 'Office Professional', to: '/courses?category=computer-office', icon: BookOpen, desc: 'Word · Excel · PowerPoint' },
  { label: 'Web Developer', to: '/courses?category=web-development', icon: Globe, desc: 'HTML · CSS · JS · React' },
  { label: 'Embedded Engineer', to: '/courses?category=embedded-systems', icon: CircuitBoard, desc: 'C · Embedded · IoT' },
  { label: 'CAD Designer', to: '/courses?category=cad-design', icon: Compass, desc: 'AutoCAD · Civil · Mechanical' },
];

// ── Accessible dropdown (TASK 7) ───────────────────────────────────────────
interface DropdownProps {
  label: string;
  active?: boolean;
  align?: 'left' | 'right';
  widthClass?: string;
  children: ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, active, align = 'left', widthClass = 'w-72', children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // close on route change so the menu never survives navigation
  useEffect(() => { setOpen(false); }, [pathname]);
  // close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors px-1.5 py-1 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
          active || open
            ? 'text-indigo-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        {label}
        <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-3 z-50 ${widthClass} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden`}
            style={{ left: align === 'left' ? 0 : 'auto', right: align === 'right' ? 0 : 'auto' }}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useUI();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // #88 — subtle bg/opacity shift on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // #88 — close drawers on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // #88 — close profile dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    logout();
    addToast('Successfully signed out.', 'info');
    navigate('/login');
  };

  // Check if user has completed at least one training track
  const hasCompletedAny = user?.progresses?.some((p: any) => p.completed) || false;

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EN';

  // #88 — contextual workspace links (visible when signed in)
  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
        { to: '/practice/arena', label: 'Practice', icon: <Zap size={14} /> },
        ...(user.role === 'ADMIN'
          ? [{ to: '/admin', label: 'Admin Portal', icon: <ShieldCheck size={14} className="text-indigo-500 dark:text-blue-500" /> }]
          : []),
      ]
    : [];

  const mainLinkClass = (to: string) =>
    `flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-md px-1.5 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
      pathname === to
        ? 'text-indigo-600 dark:text-blue-400'
        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
    }`;

  const dropdownItemClass =
    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50';

  const onCoursesPage = pathname.startsWith('/courses');
  const onCertPage = pathname === '/certificate' || pathname === '/verify';

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b py-3.5 no-print transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-950/95 border-slate-200 dark:border-slate-900/60 shadow-sm'
        : 'bg-white/80 dark:bg-slate-950/80 border-slate-200/80 dark:border-slate-900/50'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center gap-3">

        {/* Brand logo - EDUNEXUS */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="group flex items-center gap-3 select-none shrink-0"
        >
          <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-blue-800 dark:from-blue-600 dark:to-blue-800 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <img src="/logo.png" alt="Edunexus Logo" className="h-6 w-auto dark:brightness-0 dark:invert" />
          </div>
          <span className="font-black uppercase tracking-tighter text-slate-900 dark:text-white text-lg sm:text-xl">
            EDUNE<span className="text-indigo-600 dark:text-blue-500">X</span>US
            <span className="text-slate-400 dark:text-slate-500 font-bold ml-1.5 text-sm">PRO</span>
          </span>
        </Link>

        {/* Desktop Navigation (lg+) — TASK 7 structure */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          <Link to="/" className={mainLinkClass('/')}>Home</Link>

          <Dropdown label="Courses" active={onCoursesPage}>
            <div className="p-2 grid grid-cols-2 gap-1">
              {NAV_CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.slug}
                    to={`/courses?category=${c.slug}`}
                    role="menuitem"
                    className={dropdownItemClass}
                  >
                    <Icon size={15} className="text-indigo-500 dark:text-blue-500 shrink-0" />
                    {c.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 p-2">
              <Link to="/courses" role="menuitem" className={dropdownItemClass}>
                <BookOpen size={15} className="text-amber-500 shrink-0" />
                View All Courses
              </Link>
            </div>
          </Dropdown>

          <Dropdown label="Programs" widthClass="w-80">
            <div className="p-2">
              <p className="px-3 pt-2 pb-1 text-[12px] font-black uppercase tracking-widest text-slate-400">
                Career Learning Paths
              </p>
              {PROGRAMS.map((p) => {
                const Icon = p.icon;
                return (
                  <Link key={p.label} to={p.to} role="menuitem" className={dropdownItemClass}>
                    <Icon size={15} className="text-indigo-500 dark:text-blue-500 shrink-0" />
                    <span className="min-w-0">
                      <span className="block leading-tight">{p.label}</span>
                      <span className="block text-[12px] font-semibold text-slate-400 leading-tight">{p.desc}</span>
                    </span>
                  </Link>
                );
              })}
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <Link to="/#learning-paths" role="menuitem" className={dropdownItemClass}>
                  <BookMarked size={15} className="text-amber-500 shrink-0" />
                  Explore All Learning Paths
                </Link>
              </div>
            </div>
          </Dropdown>

          <Link to="/internship" className={mainLinkClass('/internship')}>Internship</Link>

          <Dropdown label="Certificates" active={onCertPage} align="right" widthClass="w-64">
            <div className="p-1.5 grid gap-0.5">
              <Link to="/certificate" role="menuitem" className={dropdownItemClass}>
                <BadgeCheck size={15} className="text-emerald-500 shrink-0" />
                My Certificates
              </Link>
              <Link to="/verify" role="menuitem" className={dropdownItemClass}>
                <ShieldCheck size={15} className="text-indigo-500 dark:text-blue-500 shrink-0" />
                Verify Certificate
              </Link>
            </div>
          </Dropdown>

          <Link to="/about" className={mainLinkClass('/about')}>About</Link>
          <Link to="/contact" className={mainLinkClass('/contact')}>Contact</Link>

          {/* Signed-in workspace shortcuts (xl+ so the bar never overflows) */}
          {user && (
            <div className="hidden xl:flex items-center gap-1.5 pl-1 border-l border-slate-200 dark:border-slate-800">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={mainLinkClass(link.to)}>
                  {link.icon}
                  <span className="hidden 2xl:inline">{link.label}</span>
                </Link>
              ))}
              {hasCompletedAny && (
                <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-full text-[12px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">
                  ★ Certified
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all active:scale-95"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            /* ── Profile dropdown (desktop) ─────────────────────────── */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((v) => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors cursor-pointer group ${isProfileOpen ? 'ring-2 ring-indigo-500/20 dark:ring-blue-500/20' : ''}`}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-700 text-white font-black text-[12px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  {initials}
                </div>
                <div className="flex flex-col text-left hidden lg:block">
                  <span className="text-slate-900 dark:text-slate-200 text-[12px] font-black uppercase tracking-wider leading-none">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-slate-500 text-[12px] font-bold uppercase mt-0.5">
                    {user.role === 'ADMIN' ? 'Staff' : 'Student'}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5 grid gap-0.5">
                      <Link
                        to="/certificate"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <BadgeCheck size={14} className="text-emerald-500" />
                        My Certificates
                      </Link>
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { toggleTheme(); setIsProfileOpen(false); }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left"
                      >
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="px-4">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="accent" size="sm" className="px-5 font-black uppercase tracking-widest shadow-blue-600/20">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Animated Mobile Drawer (below lg) ─────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Panel */}
            <motion.div
              initial={{ y: -24 }}
              animate={{ y: 0 }}
              exit={{ y: -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute top-0 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 shadow-2xl px-4 py-5 max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            >
              {user ? (
                <>
                  <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-900">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-700 text-white font-black text-sm flex items-center justify-center shadow-xl">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{user.name}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.role} Account</p>
                    </div>
                  </div>
                  <div className="grid gap-2 mt-5">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    >
                      <HomeIcon size={18} /> Home
                    </Link>
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
                          pathname === link.to
                            ? 'bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-blue-400'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      to="/courses"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    >
                      <BookOpen size={18} /> Courses
                    </Link>
                    <Link
                      to="/#learning-paths"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    >
                      <MapIcon size={18} /> Learning Paths
                    </Link>
                    <Link
                      to="/internship"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    >
                      <Zap size={18} /> Internship
                    </Link>
                    <Link
                      to="/verify"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                    >
                      <ShieldCheck size={18} /> Verify Certificate
                    </Link>
                    <button
                      onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 text-left"
                    >
                      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/5 rounded-xl text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-400 text-left"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    {[
                      { to: '/', label: 'Home', icon: <HomeIcon size={18} /> },
                      { to: '/courses', label: 'Courses', icon: <BookOpen size={18} /> },
                      { to: '/#learning-paths', label: 'Learning Paths', icon: <BookMarked size={18} /> },
                      { to: '/internship', label: 'Internship', icon: <Zap size={18} /> },
                      { to: '/certificate', label: 'My Certificates', icon: <BadgeCheck size={18} /> },
                      { to: '/verify', label: 'Verify Certificate', icon: <ShieldCheck size={18} /> },
                      { to: '/about', label: 'About', icon: <Compass size={18} /> },
                      { to: '/contact', label: 'Contact', icon: <Monitor size={18} /> },
                    ].map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
                          pathname === link.to
                            ? 'bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-blue-400'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="grid gap-3 mt-5">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="accent" className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
