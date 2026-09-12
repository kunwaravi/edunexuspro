import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import LoadingState from '../atoms/LoadingState';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import { Briefcase, Clock, MapPin, Tag, ArrowRight } from 'lucide-react';
import { humanizeCategory, type InternshipProgram } from '../../types/internship';

/**
 * "Available Internship Programs" — the public program list on /internship.
 *
 * Reads the open programs from `GET /internship/programs`. The endpoint exposes
 * no application counts, so nothing resembling a number is rendered here: the
 * only facts shown are the ones the API actually returned (title, description,
 * duration, mode, category).
 *
 * Each card is a real link to /internship/:slug so a program is shareable and
 * openable in a new tab.
 */
const InternshipPrograms = () => {
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<InternshipProgram[]>('/internship/programs');
      setPrograms(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'We could not reach the internship catalog. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return (
    <section id="programs" className="space-y-6" aria-labelledby="available-programs-heading">
      <div className="space-y-2">
        <h2
          id="available-programs-heading"
          className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3"
        >
          <Briefcase size={22} className="text-blue-400" aria-hidden="true" />
          Available Internship Programs
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Open programs you can apply to right now. Select one to read the full brief and submit an
          application.
        </p>
      </div>

      {loading && programs.length === 0 ? (
        <LoadingState label="Loading internship programs…" variant="skeleton" rows={3} />
      ) : error ? (
        <ErrorState
          title="Could not load internship programs"
          message={error}
          onRetry={fetchPrograms}
          retrying={loading}
        />
      ) : programs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No programs are open right now"
          description="Applications are currently closed for every internship program. New intakes are announced here, so check back soon."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {programs.map((program) => {
            const category = humanizeCategory(program.categorySlug);

            return (
              <Link
                key={program.id}
                to={`/internship/${program.slug}`}
                className="group flex flex-col p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 hover:border-blue-500/40 hover:bg-slate-900/70 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
                  {program.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-2 line-clamp-4">
                  {program.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 text-[12px] font-bold uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/40 border border-blue-900/40 text-blue-300">
                    <Clock size={12} aria-hidden="true" /> {program.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-slate-300">
                    <MapPin size={12} aria-hidden="true" /> {program.mode}
                  </span>
                  {category && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-slate-400">
                      <Tag size={12} aria-hidden="true" /> {category}
                    </span>
                  )}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 group-hover:text-blue-300 transition-colors">
                  View details &amp; apply
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default InternshipPrograms;
