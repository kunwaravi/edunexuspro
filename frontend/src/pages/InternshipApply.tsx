import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/molecules/FormField';
import LoadingState from '../components/atoms/LoadingState';
import ErrorState from '../components/atoms/ErrorState';
import { ArrowLeft, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import {
  formatInternshipDate,
  type InternshipApplyPayload,
  type InternshipApplyResponse,
  type InternshipApplication,
  type InternshipProgram,
} from '../types/internship';

type FieldName =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'qualification'
  | 'skills'
  | 'introduction'
  | 'portfolioUrl'
  | 'message';

type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

/** Order matters: the first invalid field in this list receives focus. */
const FIELD_ORDER: FieldName[] = [
  'fullName',
  'email',
  'phone',
  'qualification',
  'skills',
  'introduction',
  'portfolioUrl',
  'message',
];

const EMPTY_FORM: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  qualification: '',
  skills: '',
  introduction: '',
  portfolioUrl: '',
  message: '',
};

const fieldId = (name: FieldName) => `apply-${name}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/\S+$/i;

/**
 * Client-side mirror of the server's `internshipApplySchema`
 * (backend/src/middleware/validation.ts) so the same rule is reported inline
 * instead of surfacing as a raw 400 string. The server remains the authority —
 * this only makes the common case faster to correct.
 */
const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const qualification = values.qualification.trim();
  const skills = values.skills.trim();
  const introduction = values.introduction.trim();
  const portfolioUrl = values.portfolioUrl.trim();
  const message = values.message.trim();

  if (fullName.length < 2) errors.fullName = 'Please enter your full name (at least 2 characters).';
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';
  if (phone && (phone.length < 10 || phone.length > 15)) {
    errors.phone = 'Phone must be 10 to 15 characters, or left blank.';
  }
  if (qualification.length < 2) errors.qualification = 'Please enter your education or qualification.';
  if (skills.length < 2) errors.skills = 'Please list the skills relevant to this program.';
  if (introduction.length < 20) {
    errors.introduction = `Please write at least 20 characters (currently ${introduction.length}).`;
  }
  if (portfolioUrl && !URL_PATTERN.test(portfolioUrl)) {
    errors.portfolioUrl = 'Enter a full URL starting with http:// or https://, or leave it blank.';
  }
  if (message.length > 2000) errors.message = `Message must be 2000 characters or fewer (currently ${message.length}).`;
  return errors;
};

/**
 * Internship application form — /internship/:slug/apply (auth required).
 *
 * Deliberately minimal and non-sensitive: no documents, no government ids, no
 * payment details. The program comes from the route, so the applicant can only
 * ever apply to the program they are looking at (programId is taken from the
 * fetched program, never from free input).
 *
 * The success state appears only after a resolved 2xx that actually carried an
 * application code — a failed request never renders as submitted.
 */
const InternshipApply = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [program, setProgram] = useState<InternshipProgram | null>(null);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [programError, setProgramError] = useState<string | null>(null);
  const [programNotFound, setProgramNotFound] = useState(false);

  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<InternshipApplication | null>(null);

  const fetchProgram = useCallback(async () => {
    if (!slug) return;
    setLoadingProgram(true);
    setProgramError(null);
    setProgramNotFound(false);
    try {
      const res = await api.get<InternshipProgram>(`/internship/programs/${encodeURIComponent(slug)}`);
      setProgram(res.data);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) setProgramNotFound(true);
      else {
        setProgramError(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'We could not load this internship program. Please try again.'
        );
      }
    } finally {
      setLoadingProgram(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  // Prefill identity fields from the signed-in account, but never overwrite
  // something the applicant has already typed.
  useEffect(() => {
    if (!user) return;
    setValues((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  const setField = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the field's error as soon as the applicant edits it — the error is
    // re-derived on the next submit, so it can never go stale.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const introductionLength = values.introduction.trim().length;
  const messageLength = values.message.trim().length;
  const canSubmit = useMemo(() => !!program && !submitting, [program, submitting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!program || submitting) return;

    setFormError(null);
    setConflict(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    const payload: InternshipApplyPayload = {
      programId: program.id,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      qualification: values.qualification.trim(),
      skills: values.skills.trim(),
      introduction: values.introduction.trim(),
    };
    const phone = values.phone.trim();
    const portfolioUrl = values.portfolioUrl.trim();
    const message = values.message.trim();
    if (phone) payload.phone = phone;
    if (portfolioUrl) payload.portfolioUrl = portfolioUrl;
    if (message) payload.message = message;

    setSubmitting(true);
    try {
      const res = await api.post<InternshipApplyResponse>('/internship/apply', payload);
      const application = res.data?.data;

      if (!application?.applicationCode) {
        // A 2xx without a reference is not something to celebrate — the
        // applicant needs to check before resubmitting.
        setFormError(
          'The server accepted the request but did not return an application reference. ' +
            'Please check “My Internship Applications” on your dashboard before submitting again.'
        );
        return;
      }
      setSubmitted(application);
    } catch (err: unknown) {
      const response = (err as {
        response?: { status?: number; data?: { message?: string } };
      })?.response;
      const serverMessage = response?.data?.message;

      if (response?.status === 409) {
        // 409 covers both "already applied" and "program closed" — both are
        // written for the applicant to read, so show the server's own wording.
        setConflict(serverMessage || 'You already have an active application for this program.');
      } else if (response?.status === 401) {
        setFormError('Your session has expired. Please sign in again and resubmit your application.');
      } else {
        setFormError(
          serverMessage ||
            'We could not submit your application. Nothing has been saved — please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const programClosed = program ? !program.isOpen : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link
          to={slug ? `/internship/${slug}` : '/internship'}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to program
        </Link>

        {loadingProgram && !program ? (
          <LoadingState label="Loading application form…" variant="skeleton" rows={5} />
        ) : programNotFound ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-4">
            <h1 className="text-lg font-bold text-white">Program not found</h1>
            <p className="text-slate-400 text-sm">
              No internship program matches “{slug}”, so there is nothing to apply to.
            </p>
            <Link
              to="/internship"
              className="inline-block px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest hover:border-slate-500 transition-colors"
            >
              View all programs
            </Link>
          </div>
        ) : programError ? (
          <ErrorState
            title="Could not load this program"
            message={programError}
            onRetry={fetchProgram}
            retrying={loadingProgram}
          />
        ) : submitted ? (
          /* ── Confirmation — only ever rendered after a real 2xx ───────── */
          <div className="rounded-3xl border border-emerald-900/50 bg-emerald-950/20 p-6 sm:p-10 space-y-6 text-center">
            <CheckCircle2 className="mx-auto text-emerald-400" size={40} aria-hidden="true" />
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">Application submitted</h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your application for <strong className="text-white">{submitted.program?.title || program?.title}</strong> has
                been received and is now marked <strong className="text-white">Pending</strong> review.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-1">
              <p className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                Your application code
              </p>
              <p className="font-mono text-xl font-bold text-emerald-300 break-all">
                {submitted.applicationCode}
              </p>
              <p className="text-[12px] text-slate-500">Keep this code for any follow-up.</p>
            </div>

            <dl className="grid sm:grid-cols-2 gap-4 text-left text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <dt className="text-slate-500 font-bold uppercase tracking-wider text-[12px]">Submitted on</dt>
                <dd className="text-slate-200 mt-1">{formatInternshipDate(submitted.createdAt)}</dd>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <dt className="text-slate-500 font-bold uppercase tracking-wider text-[12px]">Contact email</dt>
                <dd className="text-slate-200 mt-1 break-all">{submitted.email}</dd>
              </div>
            </dl>

            <p className="text-slate-400 text-xs leading-relaxed">
              Track the status and any admin response under <strong className="text-slate-200">My Internship Applications</strong> on
              your dashboard.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-800 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all"
              >
                Go to My Applications
              </Link>
              <Link
                to="/internship"
                className="inline-block px-6 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-black uppercase tracking-widest hover:border-slate-500 transition-colors"
              >
                Browse more programs
              </Link>
            </div>
          </div>
        ) : programClosed ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-4">
            <AlertTriangle className="mx-auto text-amber-400" size={32} aria-hidden="true" />
            <h1 className="text-lg font-bold text-white">Applications are closed</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              “{program?.title}” is not accepting new applications at the moment. Any application you
              already submitted is unaffected and still appears on your dashboard.
            </p>
            <Link
              to="/internship"
              className="inline-block px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest hover:border-slate-500 transition-colors"
            >
              View open programs
            </Link>
          </div>
        ) : (
          <>
            <header className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Apply for this internship
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fields marked <span aria-hidden="true">*</span> are required. Your application is tied
                to your EduNexus Pro account — there is nothing to upload and no payment involved.
              </p>
            </header>

            {conflict && (
              <div
                role="alert"
                className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2"
              >
                <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Info size={16} aria-hidden="true" />
                  {/closed/i.test(conflict)
                    ? 'This program is not accepting applications'
                    : 'You already have an active application'}
                </p>
                <p className="text-slate-300 text-xs leading-relaxed">{conflict}</p>
                <Link
                  to="/dashboard"
                  className="inline-block text-xs font-black uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors"
                >
                  View my applications →
                </Link>
              </div>
            )}

            {formError && (
              <div
                role="alert"
                className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 flex items-start gap-3"
              >
                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-300">Application not submitted</p>
                  <p className="text-slate-300 text-xs leading-relaxed">{formError}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-slate-900/60 bg-slate-900/30 p-6 sm:p-8 space-y-5"
            >
              <FormField
                id={fieldId('fullName')}
                label="Full Name *"
                autoComplete="name"
                value={values.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                error={errors.fullName}
                placeholder="e.g. Avinash Kunwar"
              />

              <FormField
                id={fieldId('email')}
                label="Email *"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
              />

              <div>
                <FormField
                  id={fieldId('phone')}
                  label="Phone (optional)"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="10–15 digits"
                />
                <p className="text-[12px] text-slate-500 pl-1 pt-1">
                  Optional. Used only to contact you about this application.
                </p>
              </div>

              <div>
                <FormField
                  id="apply-program"
                  label="Internship Program"
                  value={program?.title || ''}
                  readOnly
                  aria-readonly="true"
                  className="cursor-not-allowed opacity-80"
                />
                <p className="text-[12px] text-slate-500 pl-1 pt-1">
                  Taken from the program you opened
                  {program ? ` · ${program.duration} · ${program.mode}` : ''}. To change it, go back and
                  pick a different program.
                </p>
              </div>

              <FormField
                id={fieldId('qualification')}
                label="Education / Qualification *"
                value={values.qualification}
                onChange={(e) => setField('qualification', e.target.value)}
                error={errors.qualification}
                placeholder="e.g. Diploma in Electronics Engineering, 2nd year"
              />

              <FormField
                id={fieldId('skills')}
                label="Relevant Skills *"
                value={values.skills}
                onChange={(e) => setField('skills', e.target.value)}
                error={errors.skills}
                placeholder="e.g. C programming, basic electronics, Git"
              />

              <div className="space-y-1.5">
                <label
                  htmlFor={fieldId('introduction')}
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1"
                >
                  Short Introduction *
                </label>
                <textarea
                  id={fieldId('introduction')}
                  rows={5}
                  value={values.introduction}
                  onChange={(e) => setField('introduction', e.target.value)}
                  aria-invalid={errors.introduction ? true : undefined}
                  aria-describedby={errors.introduction ? 'apply-introduction-error' : 'apply-introduction-hint'}
                  placeholder="What do you want to learn or build during this internship, and what have you already worked on?"
                  className={`w-full bg-slate-800/80 rounded-xl border text-white placeholder-slate-450 text-sm py-2.5 px-4 transition-all focus:outline-none leading-relaxed ${
                    errors.introduction
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-700/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                {errors.introduction ? (
                  <p
                    id="apply-introduction-error"
                    role="alert"
                    className="text-red-400 text-[12px] font-semibold pl-1 uppercase tracking-tight"
                  >
                    ⚠ {errors.introduction}
                  </p>
                ) : (
                  <p id="apply-introduction-hint" className="text-[12px] text-slate-500 pl-1">
                    {introductionLength}/20 characters minimum.
                  </p>
                )}
              </div>

              <div>
                <FormField
                  id={fieldId('portfolioUrl')}
                  label="Portfolio / GitHub / LinkedIn (optional)"
                  type="url"
                  value={values.portfolioUrl}
                  onChange={(e) => setField('portfolioUrl', e.target.value)}
                  error={errors.portfolioUrl}
                  placeholder="https://github.com/your-handle"
                />
                <p className="text-[12px] text-slate-500 pl-1 pt-1">
                  Optional. Must start with http:// or https://.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor={fieldId('message')}
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1"
                >
                  Message (optional)
                </label>
                <textarea
                  id={fieldId('message')}
                  rows={4}
                  value={values.message}
                  onChange={(e) => setField('message', e.target.value)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'apply-message-error' : 'apply-message-hint'}
                  placeholder="Anything else you want the review team to know? (availability, preferred start date, questions)"
                  className={`w-full bg-slate-800/80 rounded-xl border text-white placeholder-slate-450 text-sm py-2.5 px-4 transition-all focus:outline-none leading-relaxed ${
                    errors.message
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-700/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                />
                {errors.message ? (
                  <p
                    id="apply-message-error"
                    role="alert"
                    className="text-red-400 text-[12px] font-semibold pl-1 uppercase tracking-tight"
                  >
                    ⚠ {errors.message}
                  </p>
                ) : (
                  <p id="apply-message-hint" className="text-[12px] text-slate-500 pl-1">
                    Up to 2000 characters. {messageLength} used.
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between border-t border-slate-900">
                <p className="text-[12px] text-slate-500 leading-relaxed order-2 sm:order-1">
                  Submitting sends only the details above. You can apply once per program while an
                  application is open.
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="order-1 sm:order-2 shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-800 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipApply;
