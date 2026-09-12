import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, Search, SearchX, X, SlidersHorizontal } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import CourseCard from '../components/molecules/CourseCard';
import Skeleton from '../components/atoms/Skeleton';
import EmptyState from '../components/atoms/EmptyState';
import ErrorState from '../components/atoms/ErrorState';
import { useCourses } from '../hooks/useCourses';
import { coursesConfig } from '../config/courses';

/**
 * CoursesPage — TASK 7: full public catalog with search + filters.
 * The whole catalog is fetched once (`GET /api/courses`) and all filtering
 * (category · search · level · price · certificate) happens client-side so
 * results update instantly with no page reload. Category syncs to the URL
 * (`?category=<slug>`) so navbar dropdowns + back/forward work.
 */
const LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price' },
  { value: 'lt600', label: 'Under ₹600' },
  { value: '600-800', label: '₹600 – ₹800' },
  { value: 'gt800', label: '₹800+' },
];

const CoursesPage = () => {
  // Always fetch the full catalog — filtering is client-side for live results.
  const { data: courses, categories, loading, error, refetch } = useCourses('all');
  const navigate = useNavigate();

  // ── Category state lives in the URL (deep-linkable from navbar dropdowns) ──
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const setCategory = (slug: string) => {
    if (slug === 'all') setSearchParams({});
    else setSearchParams({ category: slug });
  };

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [certOnly, setCertOnly] = useState(false);

  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    const list = courses || [];
    return list.filter((c: any) => {
      if (activeCategory !== 'all' && c.category?.slug !== activeCategory) return false;
      if (level !== 'all' && (c.difficulty || '').toLowerCase() !== level) return false;
      if (priceRange !== 'all') {
        const p = c.price ?? 0;
        if (priceRange === 'lt600' && !(p < 600)) return false;
        if (priceRange === '600-800' && !(p >= 600 && p <= 800)) return false;
        if (priceRange === 'gt800' && !(p > 800)) return false;
      }
      if (certOnly && !c.certificateAvailable) return false;
      if (q) {
        const hay = [c.title, c.description, c.shortDescription, c.category?.name, c.difficulty, c.duration, ...(c.tags || [])]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [courses, activeCategory, level, priceRange, certOnly, q]);

  const hasActiveFilters = q !== '' || activeCategory !== 'all' || level !== 'all' || priceRange !== 'all' || certOnly;

  const clearAll = () => {
    setSearch('');
    setLevel('all');
    setPriceRange('all');
    setCertOnly(false);
    setSearchParams({});
  };

  const chipClass = (active: boolean) =>
    `shrink-0 px-4 py-2 rounded-full border text-[12px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
      active
        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
        : 'border-slate-800 bg-slate-950/40 text-slate-450 hover:border-slate-700 hover:text-white'
    }`;

  const smallChipClass = (active: boolean) =>
    `shrink-0 px-3 py-1.5 rounded-full border text-[12px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
      active
        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
        : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-700 hover:text-white'
    }`;

  return (
    <PageContainer maxWidth="max-w-7xl" className="space-y-7 py-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
          <GraduationCap className="text-amber-500" size={26} />
          All Courses
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          Search, filter and compare tracks — then start learning in minutes.
        </p>
      </div>

      {/* Search bar — prominent, live results */}
      <div className="max-w-2xl mx-auto">
        <label htmlFor="course-search" className="sr-only">Search courses</label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="course-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses… e.g. Excel, Python, Embedded"
            autoComplete="off"
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
          />
          {q && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips — horizontal scroll on mobile, wrap on desktop */}
      {categories.length > 1 && (
        <div className="flex lg:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:justify-center">
          {categories.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={chipClass(activeCategory === cat.slug)}
              aria-pressed={activeCategory === cat.slug}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Secondary filters — level · price · certificate (scroll on mobile) */}
      <div className="flex lg:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:justify-center">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest text-slate-500 shrink-0">
          <SlidersHorizontal size={13} /> Filters
        </span>
        {LEVELS.map((l) => (
          <button key={l.value} onClick={() => setLevel(l.value)} className={smallChipClass(level === l.value)} aria-pressed={level === l.value}>
            {l.label}
          </button>
        ))}
        <span className="w-px h-5 bg-slate-800 shrink-0" aria-hidden="true" />
        {PRICE_RANGES.map((p) => (
          <button key={p.value} onClick={() => setPriceRange(p.value)} className={smallChipClass(priceRange === p.value)} aria-pressed={priceRange === p.value}>
            {p.label}
          </button>
        ))}
        <span className="w-px h-5 bg-slate-800 shrink-0" aria-hidden="true" />
        <button onClick={() => setCertOnly((v) => !v)} className={smallChipClass(certOnly)} aria-pressed={certOnly}>
          {certOnly ? '✓ ' : ''}Certificate
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
          Showing <span className="text-amber-400">{filtered.length}</span> of {courses?.length || 0} courses
        </p>
      )}

      {/* States: loading skeletons → error fallback → empty state → grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-850 bg-slate-900/40 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 ml-auto" />
                </div>
              </div>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Unable to load courses"
          message="Courses are temporarily unavailable. This is not an empty catalog — please try again."
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No courses found"
          description={
            q
              ? `Nothing matches "${search}". Try a different keyword or clear your filters.`
              : 'No courses in this category yet. Nothing matches these filters — try clearing them.'
          }
          action={{ label: 'Clear Search & Filters', onClick: clearAll }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CourseCard renders each title as an <h3>. Without a level-2
              heading between the page <h1> and those cards the outline jumped
              h1 → h3, which is the skip a screen-reader user hears as a
              missing section. This labels the results region for them without
              adding visual chrome. */}
          <h2 className="sr-only">Course catalog results</h2>
          {filtered.map((c: any) => {
            const conf = coursesConfig.find((x) => x.id === c.id);
            return (
              <CourseCard
                key={c.id}
                type="catalog"
                id={c.id}
                slug={c.slug}
                title={c.title}
                desc={c.description || c.shortDescription || 'Welcome to this specialized curriculum track.'}
                icon={conf?.icon}
                color={conf?.colorDark}
                difficulty={c.difficulty}
                categoryName={c.category?.name}
                duration={c.duration}
                moduleCount={c.moduleCount}
                certificateAvailable={c.certificateAvailable}
                featured={c.featured}
                price={c.price}
                banner={c.banner}
                comingSoon={c.comingSoon}
                tags={c.tags}
                syllabus={(c.modules || []).map((m: any) => ({
                  week: m.week,
                  title: m.title,
                  details: m.description || 'Curriculum details for this week.',
                }))}
                onAction={(key) => navigate(`/course/${key}`)}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default CoursesPage;
