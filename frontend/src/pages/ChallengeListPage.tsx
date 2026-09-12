import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Lock, CheckCircle2, Circle, Code2, Trophy, Terminal } from 'lucide-react';
import api from '../api';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/atoms/Card';
import Spinner from '../components/atoms/Spinner';

// --- Shape of GET /api/challenges/course/:courseId (backend challengeService) ---
interface ChallengeListItem {
  id: number;
  title: string;
  dashedName: string;
  order: number;
  challengeType: 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'SQL';
  completed: boolean;
}

interface ChallengeBlock {
  moduleId: number;
  week: number;
  title: string;
  challenges: ChallengeListItem[];
}

interface ChallengeListResponse {
  course: { id: string; title: string };
  blocks: ChallengeBlock[];
}

// Challenge-type badge label + accent colour (matches the seed inventory).
const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  HTML: { label: 'HTML', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  CSS: { label: 'CSS', cls: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  JavaScript: { label: 'JS', cls: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  Python: { label: 'Python', cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  SQL: { label: 'SQL', cls: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' }
};

const ChallengeListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ChallengeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get(`/challenges/course/${id}`)
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load challenges. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const totalChallenges = data?.blocks.reduce((acc, b) => acc + b.challenges.length, 0) ?? 0;
  const completedCount = data?.blocks.reduce(
    (acc, b) => acc + b.challenges.filter((c) => c.completed).length,
    0
  ) ?? 0;

  return (
    <PageContainer maxWidth="max-w-4xl" className="py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-slate-500">
        <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <ChevronRight size={10} className="text-slate-800 shrink-0" />
        <Link to={`/course/${id}`} className="hover:text-blue-400 transition-colors truncate max-w-[200px]">
          {data?.course.title || id}
        </Link>
        <ChevronRight size={10} className="text-slate-800 shrink-0" />
        <span className="text-cyan-400">Interactive Challenges</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0F1629] to-[#101D33] p-6 flex flex-col md:flex-row justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-cyan-400" />
            <span className="text-[12px] font-black uppercase tracking-widest text-cyan-400">Code Challenges</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Interactive Challenges</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-lg leading-relaxed">
            Write real code and run it in a sandboxed grader. Pass every test to complete the challenge and earn <span className="text-emerald-400 font-bold">+10 XP</span>.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-center">
          <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-2xl font-black text-cyan-400">{completedCount}<span className="text-slate-600 text-base">/{totalChallenges}</span></span>
            <span className="text-[12px] font-black uppercase tracking-widest text-slate-500 mt-0.5">Completed</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <Spinner />
        </div>
      )}

      {error && !loading && (
        <Card className="p-6 border-red-500/30 bg-red-500/5">
          <p className="text-sm text-red-400 font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[12px] font-black uppercase tracking-widest transition"
          >
            Retry
          </button>
        </Card>
      )}

      {!loading && !error && data && data.blocks.length === 0 && (
        <Card className="p-10 text-center">
          <Code2 size={32} className="text-slate-700 mx-auto" />
          <h2 className="text-lg font-black text-white mt-3">No interactive challenges yet</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            This course doesn't have hands-on code challenges yet. Challenge content for the remaining courses is on the roadmap.
          </p>
          <button
            onClick={() => navigate(`/course/${id}`)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase tracking-widest transition cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Course
          </button>
        </Card>
      )}

      {!loading && !error && data && data.blocks.length > 0 && (
        <div className="space-y-6">
          {data.blocks.map((block) => (
            <Card key={block.moduleId} className="overflow-hidden">
              {/* Block header */}
              <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[12px] font-black">
                    {block.week}
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-white">Chapter {block.week}</h2>
                    <p className="text-[12px] text-slate-400 font-bold">{block.title}</p>
                  </div>
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                  {block.challenges.filter((c) => c.completed).length}/{block.challenges.length} done
                </span>
              </div>

              {/* Challenge rows */}
              <div className="divide-y divide-slate-800/70">
                {block.challenges.map((challenge, index) => {
                  // Backend sequential gate: challenge N unlocks when N-1 is completed.
                  const isUnlocked = index === 0 || block.challenges[index - 1].completed;
                  const badge = TYPE_BADGE[challenge.challengeType] || { label: challenge.challengeType, cls: 'bg-slate-500/10 border-slate-500/30 text-slate-400' };

                  return (
                    <button
                      key={challenge.id}
                      disabled={!isUnlocked}
                      onClick={() => navigate(`/challenges/${challenge.id}`)}
                      className={`w-full text-left px-5 py-4 flex items-center gap-4 transition-colors ${
                        challenge.completed
                          ? 'bg-emerald-500/[0.03]'
                          : isUnlocked
                            ? 'hover:bg-slate-800/50 cursor-pointer'
                            : 'opacity-45 cursor-not-allowed'
                      }`}
                    >
                      <span className={`shrink-0 ${challenge.completed ? 'text-emerald-400' : isUnlocked ? 'text-slate-600' : 'text-slate-700'}`}>
                        {challenge.completed ? (
                          <CheckCircle2 size={18} />
                        ) : isUnlocked ? (
                          <Circle size={18} />
                        ) : (
                          <Lock size={18} />
                        )}
                      </span>

                      <span className={`text-[12px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${badge.cls} shrink-0`}>
                        {badge.label}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm font-bold leading-snug truncate ${challenge.completed ? 'text-emerald-300/80' : 'text-slate-200'}`}>
                          {index + 1}. {challenge.title}
                        </span>
                        {!isUnlocked && (
                          <span className="block text-[12px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            Complete the previous challenge first
                          </span>
                        )}
                      </span>

                      {isUnlocked && !challenge.completed && (
                        <span className="shrink-0 flex items-center gap-1 text-cyan-400 text-[12px] font-black uppercase tracking-widest">
                          <Terminal size={13} /> Solve
                        </span>
                      )}
                      {isUnlocked && <ChevronRight size={16} className="shrink-0 text-slate-600" />}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}

          {/* XP footer note */}
          <div className="flex items-center gap-2 text-[12px] text-slate-500 font-bold uppercase tracking-widest px-1">
            <Trophy size={14} className="text-amber-500/70" />
            Complete challenges to advance module progress and build course completion.
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default ChallengeListPage;
