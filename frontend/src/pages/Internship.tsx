import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Award, ShieldCheck, Target, Zap, FileCode2, Users } from 'lucide-react';
import InternshipPrograms from '../components/organisms/InternshipPrograms';

/**
 * TASK 7 — Public "Internship & Industrial Training" page.
 * Honest description of what EduNexus Pro actually offers (industrial training
 * curriculums, hands-on projects, verifiable completion certificates). No fake
 * numbers, no accreditation claims — just the real training model.
 */
const Internship = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-500/20 selection:text-blue-300">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Navigation */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="text-[12px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/30 border border-blue-900/40 px-2.5 py-0.5 rounded-full">
            Internship
          </span>
        </div>

        {/* Header Hero */}
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-none">
            Industrial Training
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              &amp; Internship Experience
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Hands-on, project-based industrial training designed for engineering students —
            from programming and embedded systems to office productivity and ITI trade skills.
          </p>
        </div>

        {/* Available Internship Programs — real, open programs from the API */}
        <InternshipPrograms />

        {/* What you actually get */}
        <div className="bg-slate-900/30 border border-slate-900/60 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl" />
          <div className="absolute -left-16 -bottom-16 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl" />

          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Target size={22} className="text-blue-400" />
              What the Training Includes
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every EduNexus Pro training track is a structured industrial curriculum: guided modules,
              hands-on labs and sandboxes, topic quizzes, and a final project submission. Complete the
              track and pay the one-time credential fee to unlock your verifiable course-completion certificate.
            </p>
          </div>

          <hr className="border-slate-900" />

          <div className="grid gap-6 sm:grid-cols-2">

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-blue-950/40 border border-blue-900/30 text-blue-400 rounded-xl w-fit">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Guided Curriculum</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Step-by-step modules with industry-relevant topics, ordered so you build one skill on top of the next.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 rounded-xl w-fit">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Verifiable Certificate</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Course-completion certificate with a unique credential ID and QR code — anyone can verify it on the public verification page.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 rounded-xl w-fit">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Hands-On Labs &amp; Sandboxes</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Interactive circuit simulators, code sandboxes, and project submissions on embedded, IoT, and programming tracks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3 hover:border-slate-800 hover:bg-slate-900/60 transition-all duration-300">
              <div className="p-2.5 bg-amber-950/40 border border-amber-900/30 text-amber-400 rounded-xl w-fit">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-white text-base">Secure Verification</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Every credential carries a unique code that is checked against the registry before it displays as verified.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-900/30 text-blue-400 rounded-xl w-fit"><Users size={20} /></div>
            <h3 className="font-bold text-white text-sm">1 · Pick a Track</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Browse the catalog and choose the training path that fits your goal.</p>
            <Link to="/courses" className="inline-block text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors">
              Explore Courses →
            </Link>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3">
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 rounded-xl w-fit"><FileCode2 size={20} /></div>
            <h3 className="font-bold text-white text-sm">2 · Learn &amp; Build</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Work through modules, pass quizzes, and submit your final project.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/65 space-y-3">
            <div className="p-2.5 bg-amber-950/40 border border-amber-900/30 text-amber-400 rounded-xl w-fit"><Award size={20} /></div>
            <h3 className="font-bold text-white text-sm">3 · Unlock &amp; Verify</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Unlock your certificate, then let anyone verify it with its credential ID or QR.</p>
            <Link to="/verify" className="inline-block text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors">
              Verify a Certificate →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-blue-900/40 bg-gradient-to-br from-blue-950/40 to-slate-900/40 p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Ready to start your industrial training?</h2>
          <p className="text-slate-400 text-sm">Create a free account and begin your first track today.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register">
              <span className="inline-block px-6 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-800 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all">
                Get Started — Free
              </span>
            </Link>
            <Link to="/courses">
              <span className="inline-block px-6 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-black uppercase tracking-widest hover:border-slate-500 transition-colors">
                Browse Courses
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internship;
