import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import LoadingState from '../components/atoms/LoadingState';
import ErrorState from '../components/atoms/ErrorState';
import { ArrowLeft, Clock, MapPin, Tag, FileText, CheckCircle2 } from 'lucide-react';
import {
  humanizeCategory,
  type InternshipProgram,
} from '../types/internship';

/** What the student is asked to prepare, stated plainly — no invented steps. */
const APPLY_CHECKLIST = [
  'Your full name, email address and (optionally) a phone number.',
  'Your current education or qualification, and the skills relevant to this program.',
  'A short introduction, plus an optional link to your portfolio, GitHub or LinkedIn.',
];

/**
 * Public program detail — /internship/:slug
 *
 * A real route (not a dialog) so a program is linkable and openable in a new
 * tab. A closed program still renders — the API returns it with `isOpen:false`
 * so a bookmarked application keeps a page to land on — and the apply CTA is
 * disabled with the reason stated, rather than hidden.
 */
const InternshipProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<InternshipProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProgram = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const res = await api.get<InternshipProgram>(`/internship/programs/${encodeURIComponent(slug)}`);
      setProgram(res.data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setNotFound(true);
      } else {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'We could not load this internship program. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  const category = humanizeCategory(program?.categorySlug);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          to="/internship"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Internships
        </Link>

        {loading && !program ? (
          <LoadingState label="Loading program details…" variant="skeleton" rows={4} />
        ) : notFound ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-4">
            <FileText className="mx-auto text-slate-600" size={30} aria-hidden="true" />
            <h1 className="text-lg font-bold text-white">Program not found</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              No internship program matches “{slug}”. It may have been renamed or removed.
            </p>
            <Link
              to="/internship"
              className="inline-block px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest hover:border-slate-500 transition-colors"
            >
              View all programs
            </Link>
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load this program"
            message={error}
            onRetry={fetchProgram}
            retrying={loading}
          />
        ) : program ? (
          <>
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/40 border border-blue-900/40 text-blue-300">
                  <Clock size={12} aria-hidden="true" /> {program.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300">
                  <MapPin size={12} aria-hidden="true" /> {program.mode}
                </span>
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400">
                    <Tag size={12} aria-hidden="true" /> {category}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                    program.isOpen
                      ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  {program.isOpen ? 'Applications open' : 'Applications closed'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {program.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {program.description}
              </p>
            </header>

            <section
              aria-labelledby="apply-checklist-heading"
              className="rounded-3xl border border-slate-900/60 bg-slate-900/30 p-6 sm:p-8 space-y-4"
            >
              <h2 id="apply-checklist-heading" className="text-base font-bold text-white">
                What you will need to apply
              </h2>
              <ul className="space-y-2.5">
                {APPLY_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-400 text-xs sm:text-sm leading-relaxed">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-blue-900/40 bg-gradient-to-br from-blue-950/40 to-slate-900/40 p-6 sm:p-8 space-y-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {program.isOpen ? 'Ready to apply?' : 'Applications are currently closed'}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
                {program.isOpen
                  ? 'Sign in and submit your application for this program. You will get an application reference code and can track the outcome from your dashboard.'
                  : 'This program is not accepting new applications at the moment. Existing applications are unaffected and can still be tracked from your dashboard.'}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                {program.isOpen ? (
                  <Link
                    to={`/internship/${program.slug}/apply`}
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-800 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    Apply Now
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-6 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-500 text-sm font-black uppercase tracking-widest cursor-not-allowed"
                  >
                    Apply Now — Closed
                  </button>
                )}
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-black uppercase tracking-widest hover:border-slate-500 transition-colors"
                >
                  My Applications
                </Link>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InternshipProgramDetail;
