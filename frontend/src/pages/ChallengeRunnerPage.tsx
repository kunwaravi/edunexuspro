import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Play, RotateCcw, Terminal, CheckCircle2, XCircle, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/atoms/Card';
import Spinner from '../components/atoms/Spinner';

// --- Backend shapes ---
interface ChallengeModule {
  id: number;
  week: number;
  title: string;
}

interface Challenge {
  id: number;
  courseId: string;
  moduleId: number;
  title: string;
  dashedName: string;
  challengeType: 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'SQL';
  description: string;
  instructions: string;
  seedCode: string;
  order: number;
  isPublished: boolean;
  module: ChallengeModule;
}

interface ChallengeTestResult {
  name: string;
  pass: boolean;
  message?: string;
}

interface RunTestOutcome {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  tests: ChallengeTestResult[];
  stdout: string;
}

const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  HTML: { label: 'HTML', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  CSS: { label: 'CSS', cls: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  JavaScript: { label: 'JavaScript', cls: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  Python: { label: 'Python', cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  SQL: { label: 'SQL', cls: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' }
};

// For SQL challenges the seedCode is the DB bootstrap the runner applies before
// the student query — it must NOT be dumped into the editor as starter code.
const SQL = 'SQL';

const ChallengeRunnerPage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { addToast } = useUI();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [result, setResult] = useState<RunTestOutcome | null>(null);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    api
      .get(`/challenges/${challengeId}`)
      .then((res) => {
        if (cancelled) return;
        const c: Challenge = res.data;
        setChallenge(c);
        // HTML/CSS/JS/Python start from the seed; SQL starts blank (query authored by the student).
        setCode(c.challengeType === SQL ? '' : c.seedCode);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setLoadError(err.response?.data?.message || 'Failed to load challenge. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [challengeId]);

  const handleRun = async () => {
    if (!challenge) return;
    setIsRunning(true);
    setRunError(null);
    setResult(null);
    try {
      const res = await api.post(`/challenges/${challenge.id}/run-test`, { code });
      const outcome: RunTestOutcome = res.data;
      setResult(outcome);
      if (outcome.passed) {
        // The backend records completion + XP + progress server-side on all-pass;
        // pull the fresh user (points / progresses) into context + localStorage.
        await refreshUser();
        addToast('All tests passed! Challenge completed.', 'success');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 429 ? 'Too many runs — please wait a minute.' : 'Failed to run tests. Please try again.');
      setRunError(msg);
      addToast(msg, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (!challenge) return;
    setCode(challenge.challengeType === SQL ? '' : challenge.seedCode);
    setResult(null);
    setRunError(null);
    editorRef.current?.focus();
  };

  if (loading) {
    return (
      <PageContainer maxWidth="max-w-4xl" className="py-6">
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </PageContainer>
    );
  }

  if (loadError || !challenge) {
    return (
      <PageContainer maxWidth="max-w-4xl" className="py-6">
        <Card className="p-6 border-red-500/30 bg-red-500/5">
          <p className="text-sm text-red-400 font-bold">{loadError || 'Challenge not found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-3 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[12px] font-black uppercase tracking-widest transition"
          >
            Go Back
          </button>
        </Card>
      </PageContainer>
    );
  }

  const badge = TYPE_BADGE[challenge.challengeType] || { label: challenge.challengeType, cls: 'bg-slate-500/10 border-slate-500/30 text-slate-400' };
  const allPassed = result?.passed === true;

  return (
    <PageContainer maxWidth="max-w-4xl" className="py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-slate-500">
        <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <ChevronRight size={10} className="text-slate-800 shrink-0" />
        <Link to={`/course/${challenge.courseId}`} className="hover:text-blue-400 transition-colors truncate max-w-[160px]">
          {challenge.courseId}
        </Link>
        <ChevronRight size={10} className="text-slate-800 shrink-0" />
        <Link to={`/course/${challenge.courseId}/challenges`} className="hover:text-blue-400 transition-colors">
          Challenges
        </Link>
        <ChevronRight size={10} className="text-slate-800 shrink-0" />
        <span className="text-amber-400 truncate max-w-[220px]">{challenge.title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-[12px] font-black uppercase tracking-widest px-2 py-1 rounded-md border shrink-0 ${badge.cls}`}>
            {badge.label}
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-white leading-tight truncate">{challenge.title}</h1>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">
              Chapter {challenge.module.week} · {challenge.module.title}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/course/${challenge.courseId}/challenges`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-[12px] font-black uppercase tracking-widest bg-slate-900/50 hover:bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <ChevronLeft size={14} className="text-blue-500" /> All Challenges
        </button>
      </div>

      {/* Description + Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-[12px] font-black uppercase tracking-widest text-blue-400 mb-2">Description</h2>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-nowrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{challenge.description}</ReactMarkdown>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-[12px] font-black uppercase tracking-widest text-emerald-400 mb-2">Your Task</h2>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-nowrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{challenge.instructions}</ReactMarkdown>
          </div>
        </Card>
      </div>

      {/* Editor */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-blue-400" />
            <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
              {challenge.challengeType} Solution
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              title="Reset Code"
              aria-label="Reset code"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white rounded-lg text-[12px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              {isRunning ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} fill="currentColor" />
              )}
              Run Tests
            </button>
          </div>
        </div>

        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder={challenge.challengeType === SQL ? '-- Write your SQL query here…' : undefined}
          className="w-full h-56 bg-transparent text-cyan-400 font-mono text-xs focus:outline-none resize-y leading-relaxed p-4"
        />

        <div className="bg-slate-900/40 px-4 py-2 text-[12px] text-slate-500 border-t border-slate-900 flex justify-between">
          <span>Sandboxed auto-grader · assertion tests · 3s timeout</span>
          <span>Pass all tests to complete (+10 XP)</span>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {runError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3"
          >
            <AlertTriangle size={16} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300 font-bold">{runError}</p>
          </motion.div>
        )}

        {result && !runError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl border overflow-hidden shadow-2xl ${
              allPassed ? 'border-emerald-500/40 bg-emerald-500/[0.04]' : 'border-slate-800 bg-slate-950'
            }`}
          >
            {/* Overall verdict */}
            <div className={`px-5 py-4 flex items-center justify-between gap-3 border-b ${
              allPassed ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/60'
            }`}>
              <div className="flex items-center gap-3">
                {allPassed ? (
                  <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-black uppercase tracking-widest">All Tests Passed</span>
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-2 text-amber-400">
                    <XCircle size={20} />
                    <span className="text-sm font-black uppercase tracking-widest">Some Tests Failed</span>
                  </span>
                )}
              </div>
              <span className="text-xs font-black text-slate-300">
                {result.passedCount} / {result.totalCount} passed
              </span>
            </div>

            {/* Per-test results */}
            <div className="p-4 space-y-2">
              {result.tests.map((test, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${
                    test.pass ? 'border-emerald-500/15 bg-emerald-500/[0.04]' : 'border-red-500/15 bg-red-500/[0.04]'
                  }`}
                >
                  {test.pass ? (
                    <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`font-mono text-[12px] leading-relaxed break-words ${test.pass ? 'text-slate-400' : 'text-red-300'}`}>
                      {test.name}
                    </p>
                    {!test.pass && test.message && (
                      <p className="text-[12px] text-red-400/80 font-bold mt-0.5 break-words">{test.message}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {result.stdout && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[12px] font-black uppercase tracking-widest text-slate-600">Console Output</span>
                  <pre className="mt-1.5 bg-slate-900/70 border border-slate-800 rounded-lg p-3 text-cyan-300/90 font-mono text-[12px] leading-relaxed whitespace-pre-wrap break-words overflow-x-auto max-h-48 overflow-y-auto">
                    {result.stdout}
                  </pre>
                </div>
              )}
            </div>

            {allPassed && (
              <div className="px-5 py-3.5 bg-emerald-500/10 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Challenge complete — progress & XP updated
                </span>
                <button
                  onClick={() => navigate(`/course/${challenge.courseId}/challenges`)}
                  className="flex items-center gap-2 text-emerald-300 hover:text-white transition text-[12px] font-black uppercase tracking-widest bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Next Challenge <ChevronRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ChallengeRunnerPage;
