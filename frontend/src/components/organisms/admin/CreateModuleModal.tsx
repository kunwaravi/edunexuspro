import React from 'react';
import { BookOpen } from 'lucide-react';
import Dialog from '../../atoms/Dialog';

interface CreateModuleModalProps {
  open: boolean;
  week: number;
  onWeekChange: (value: number) => void;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  /** Closes the dialog and resets every field to its blank default. */
  onDiscard: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/** Phase 16: the create-module (week) modal, lifted out of AdminDashboard verbatim. */
const CreateModuleModal: React.FC<CreateModuleModalProps> = ({
  open,
  week,
  onWeekChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  onDiscard,
  onSubmit,
}) => (
  <Dialog
    open={open}
    onClose={onDiscard}
    closeOnBackdrop={false}
    title={`Create Week ${week} Module`}
    size="md"
    backdropClassName="bg-black/90 backdrop-blur-md"
    className="bg-slate-950 border-slate-800 rounded-2xl p-6 text-left space-y-5"
  >
    <div className="flex items-center gap-2 text-cyan-400 pb-2 border-b border-slate-900">
      <BookOpen size={18} />
      <h3 className="text-sm font-black uppercase tracking-wider">
        Create Week {week} Module
      </h3>
    </div>

    <form onSubmit={onSubmit} className="space-y-4">

            {/* Module Week Number */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Week Number</label>
              <input
                type="number"
                required
                min={1}
                data-dialog-autofocus
                value={week}
                onChange={(e) => onWeekChange(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition font-bold"
              />
            </div>

            {/* Module Title */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Module Title</label>
              <input
                type="text"
                required
                placeholder="e.g. AutoCAD 2D Drafting & Interface"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Module Description */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Module Description</label>
              <textarea
                required
                placeholder="Brief description of the topics covered in this week..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
              <button
                type="button"
                onClick={onDiscard}
                className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
              >
                Create Module
              </button>
            </div>

          </form>
  </Dialog>
);

export default CreateModuleModal;
