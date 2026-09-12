import React from 'react';
import { Hourglass, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import CourseBanner from './CourseBanner';
import CourseShareButton from './CourseShareButton';

interface SyllabusItem {
  week: number;
  title: string;
  details: string;
}

interface CourseCardProps {
  id: string;
  title: string;
  desc: string;
  icon?: LucideIcon;
  color?: string; // Gradient string for header
  barColor?: string; // Tailwind color class for progress bar
  progress?: number;
  weekCompleted?: number;
  totalWeeks?: number;
  completed?: boolean;
  // --- API-driven catalog fields (TASK 5/6): every value below comes from the
  // catalog endpoint — nothing here is hardcoded/derived client-side. ---
  slug?: string; // preferred navigation target (/course/:slug), falls back to id
  categoryName?: string;
  difficulty?: string;
  duration?: string;
  moduleCount?: number;
  certificateAvailable?: boolean;
  featured?: boolean;
  price?: number | null;
  thumbnail?: string;
  // TASK 6: course-specific banner (Course.banner from the API) + admin
  // "Coming Soon" state — both drive the new professional card layout.
  banner?: string | null;
  comingSoon?: boolean;
  tags?: string[];
  syllabus?: SyllabusItem[];
  type?: 'catalog' | 'dashboard';
  onAction?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  desc,
  icon: Icon,
  color = 'from-blue-500 to-blue-700',
  barColor = 'bg-blue-500',
  progress = 0,
  weekCompleted = 0,
  totalWeeks,
  completed = false,
  slug,
  categoryName,
  difficulty,
  duration,
  moduleCount,
  certificateAvailable,
  featured = false,
  price,
  thumbnail,
  banner,
  comingSoon = false,
  tags = [],
  type = 'dashboard',
  onAction,
}) => {
  if (type === 'catalog') {
    return (
      <Card className="h-full relative overflow-hidden border-slate-850 hover:border-slate-700/80 hover:-translate-y-1 hover:shadow-xl transition-all duration-300" variant="glass">
        {/* COURSE BANNER — course-specific visual from the API (lazy, graceful
            fallback to a category visual on missing/broken image) */}
        <div className="relative shrink-0">
          <CourseBanner
            banner={banner || thumbnail || null}
            alt={`${title} course banner`}
            fallbackColor={color}
            fallbackIcon={Icon}
          />
          {/* Featured / Coming Soon badges (never color-only) */}
          {(featured || comingSoon) && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {featured && <Badge variant="accent">Featured</Badge>}
              {comingSoon && (
                <Badge variant="warning" icon={<Hourglass size={12} />}>
                  Coming Soon
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2">
            {categoryName && (
              <span className="text-[12px] font-bold text-slate-450 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850/60 uppercase truncate">
                {categoryName}
              </span>
            )}
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wide shrink-0">
              {difficulty || 'All Levels'}
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <h3 className="text-lg font-black text-white tracking-tight leading-snug">{title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{desc}</p>
          </div>

          {(duration || moduleCount !== undefined || certificateAvailable || tags.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {duration && (
                <span className="text-[12px] font-bold text-slate-450 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850/60 uppercase">⏱ {duration}</span>
              )}
              {moduleCount !== undefined && (
                <span className="text-[12px] font-bold text-slate-450 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850/60 uppercase">{moduleCount} Modules</span>
              )}
              {certificateAvailable && (
                <span className="text-[12px] font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Certificate</span>
              )}
              {tags.map((tag) => (
                <span key={tag} className="text-[12px] font-bold text-slate-450 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850/60 uppercase">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price · Share · View Course */}
          <div className="pt-4 mt-auto border-t border-slate-850/60 flex items-center justify-between gap-3">
            {price !== undefined && price !== null ? (
              <span className="text-base font-black font-mono text-amber-400">₹{price}</span>
            ) : (
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Free</span>
            )}

            <div className="flex items-center gap-2">
              <CourseShareButton
                courseTitle={title}
                courseDescription={desc}
                slug={slug}
                id={id}
              />
              {comingSoon ? (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="This course is coming soon"
                  className="inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed"
                >
                  <Hourglass size={12} /> Coming Soon
                </button>
              ) : (
                <button
                  onClick={() => onAction?.(slug || id)}
                  className="text-xs font-extrabold uppercase text-amber-450 hover:text-amber-300 transition-colors flex items-center gap-1 min-h-[36px] px-2 rounded-lg hover:bg-amber-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                >
                  View Course <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Dashboard version
  return (
    <Card
      onClick={() => onAction?.(id)}
      hoverable
      className="group"
    >
      {/* Top Half: Gradient Header Block */}
      <div className={`h-32 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
        {Icon && <Icon size={48} className="text-white drop-shadow-md" />}

        {/* Dynamic Status Badge overlay */}
        <div className="absolute top-3 right-3">
          {completed ? (
            <Badge variant="success">Completed</Badge>
          ) : progress > 0 ? (
            <Badge variant="primary">
              {totalWeeks ? `Week ${weekCompleted}/${totalWeeks}` : `Week ${weekCompleted}`}
            </Badge>
          ) : (
            <Badge variant="neutral">Not Started</Badge>
          )}
        </div>
      </div>

      {/* Bottom Half: Detailed Course Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold group-hover:text-blue-400 transition tracking-tight text-white">
            {title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {desc}
          </p>
        </div>

        {/* Course Progress Section */}
        <div className="space-y-2 pt-2 border-t border-slate-700/60">
          <div className="flex justify-between items-center text-[12px] font-bold uppercase text-slate-400">
            <span>Progress</span>
            <span className="text-slate-200">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Callout */}
        <div className={`flex items-center font-bold text-xs pt-1 group-hover:translate-x-1 transition-transform ${completed ? 'text-emerald-400' : 'text-blue-400'}`}>
          {completed ? 'View Certificate' : progress > 0 ? 'Resume Training' : 'Start Training'} →
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
