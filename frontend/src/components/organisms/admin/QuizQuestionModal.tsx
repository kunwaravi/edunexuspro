import React from 'react';
import { Award } from 'lucide-react';
import Dialog from '../../atoms/Dialog';

export interface QuizQuestion {
  id?: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuizQuestionModalProps {
  /** Non-null while the editor is open; the dialog is closed when null. */
  quiz: QuizQuestion | null;
  isNew: boolean;
  onClose: () => void;
  /** Receives the whole next question — the editor never mutates in place. */
  onChange: (quiz: QuizQuestion) => void;
  onSave: () => void;
}

/** Phase 16: the quiz question CRUD modal, lifted out of AdminDashboard verbatim. */
const QuizQuestionModal: React.FC<QuizQuestionModalProps> = ({
  quiz,
  isNew,
  onClose,
  onChange,
  onSave,
}) => (
  <Dialog
    open={!!quiz}
    onClose={onClose}
    closeOnBackdrop={false}
    title={isNew ? 'Create Quiz Question' : 'Modify Quiz Question'}
    size="lg"
    backdropClassName="bg-black/90 backdrop-blur-md"
    className="bg-slate-950 border-slate-800 rounded-2xl p-6 text-left space-y-5"
  >
    {quiz && (
    <>
    <div className="flex items-center gap-2 text-yellow-400 pb-2 border-b border-slate-900">
      <Award size={18} />
      <h3 className="text-sm font-black uppercase tracking-wider">
        {isNew ? 'Create Quiz Question' : 'Modify Quiz Question'}
      </h3>
    </div>

          <div className="space-y-4">

            {/* Question Text */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Question Statement</label>
              <input
                type="text"
                required
                data-dialog-autofocus
                placeholder="e.g. Which keyword stops switch fall-through in C?"
                value={quiz.text}
                onChange={(e) => onChange({ ...quiz, text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Multiple choice Options */}
            <div className="space-y-2">
              <label className="text-[12px] uppercase font-bold text-slate-400 block mb-1">Answer Options</label>
              {quiz.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex gap-2 items-center">
                  <span className="text-[12px] font-black text-slate-600 w-4 font-mono">[{String.fromCharCode(65 + oIdx)}]</span>
                  <input
                    type="text"
                    required
                    placeholder={`Option ${String.fromCharCode(65 + oIdx)} text`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...quiz.options];
                      newOpts[oIdx] = e.target.value;
                      onChange({ ...quiz, options: newOpts });
                    }}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Correct Answer (Must match correct Option string exactly)</label>
              <input
                type="text"
                required
                placeholder="e.g. break"
                value={quiz.correctAnswer}
                onChange={(e) => onChange({ ...quiz, correctAnswer: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 placeholder-slate-650 focus:outline-none focus:border-emerald-500 transition font-mono font-bold"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
            >
              Discard
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
            >
              Commit Question
            </button>
          </div>
    </>
    )}
  </Dialog>
);

export default QuizQuestionModal;
