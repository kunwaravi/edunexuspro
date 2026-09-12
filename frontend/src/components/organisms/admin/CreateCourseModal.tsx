import React from 'react';
import { BookOpen } from 'lucide-react';
import Dialog from '../../atoms/Dialog';

interface CreateCourseModalProps {
  open: boolean;
  courseId: string;
  onCourseIdChange: (value: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  price: number;
  onPriceChange: (value: number) => void;
  banner: string;
  onBannerChange: (value: string) => void;
  comingSoon: boolean;
  onComingSoonChange: (value: boolean) => void;
  /** Closes the dialog and resets every field to its blank default. */
  onDiscard: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/** Phase 16: the create-course modal, lifted out of AdminDashboard verbatim. */
const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  open,
  courseId,
  onCourseIdChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  price,
  onPriceChange,
  banner,
  onBannerChange,
  comingSoon,
  onComingSoonChange,
  onDiscard,
  onSubmit,
}) => (
  <Dialog
    open={open}
    onClose={onDiscard}
    closeOnBackdrop={false}
    title="Create New Course Track"
    size="md"
    backdropClassName="bg-black/90 backdrop-blur-md"
    className="bg-slate-950 border-slate-800 rounded-2xl p-6 text-left space-y-5"
  >
    <div className="flex items-center gap-2 text-cyan-400 pb-2 border-b border-slate-900">
      <BookOpen size={18} />
      <h3 className="text-sm font-black uppercase tracking-wider">
        Create New Course Track
      </h3>
    </div>

    <form onSubmit={onSubmit} className="space-y-4">

            {/* Course ID */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Course Identifier (ID)</label>
              <input
                type="text"
                required
                data-dialog-autofocus
                placeholder="e.g. CADDED_Mech"
                value={courseId}
                onChange={(e) => onCourseIdChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition font-bold"
              />
              <p className="text-[12px] text-slate-500 leading-normal">This should be unique, alphanumeric and without spaces (e.g. `IoT`, `WebDesign`).</p>
            </div>

            {/* Course Title */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. CADDED Software (Mechanical)"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Course Description */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Course Description</label>
              <textarea
                required
                placeholder="Provide a comprehensive description of the curriculum learning outcomes..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition resize-none leading-relaxed"
              />
            </div>

            {/* Course Price */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Course Registration Price (INR)</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition font-bold"
              />
            </div>

            {/* Course Banner / Thumbnail URL (optional) */}
            <div className="space-y-1">
              <label className="text-[12px] uppercase font-bold text-slate-400">Course Banner / Thumbnail URL (optional)</label>
              <input
                type="url"
                value={banner}
                onChange={(e) => onBannerChange(e.target.value)}
                placeholder="/static/course-banners/my-course.svg  or  https://…"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition font-bold"
              />
              <p className="text-[12px] text-slate-500 leading-normal">Leave empty to use a clean category-based fallback visual on course cards.</p>
            </div>

            {/* Coming Soon toggle */}
            <label className="flex items-center gap-2 text-[12px] uppercase font-bold text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={comingSoon}
                onChange={(e) => onComingSoonChange(e.target.checked)}
                className="accent-orange-500 h-4 w-4"
              />
              Coming Soon — keep the course visible but not open for enrollment
            </label>

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
                Create Track
              </button>
            </div>

          </form>
  </Dialog>
);

export default CreateCourseModal;
