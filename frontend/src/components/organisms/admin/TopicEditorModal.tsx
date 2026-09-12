import React from 'react';
import { Edit3, Eye, Image, Save } from 'lucide-react';
import Dialog from '../../atoms/Dialog';

export interface Topic {
  id?: number;
  title: string;
  text: string;
  code?: string;
  note?: string;
  order: number;
}

interface TopicEditorModalProps {
  /** Non-null while the editor is open; the dialog is closed when null. */
  topic: Topic | null;
  isNew: boolean;
  onClose: () => void;
  /** Receives the whole next topic — the editor never mutates in place. */
  onChange: (topic: Topic) => void;
  showLivePreview: boolean;
  onTogglePreview: () => void;
  assetUrl: string;
  onAssetUrlChange: (value: string) => void;
  /** Appends the pasted image link to the topic body. No upload takes place. */
  onInsertAsset: () => void;
  onSave: () => void;
}

/**
 * Phase 16: the side-by-side topic WYSIWYG modal, lifted out of AdminDashboard
 * verbatim. State (including which topic is open) stays with the dashboard, so
 * this is pure presentation plus the two callbacks the footer needs.
 *
 * Phase 17: the "asset upload" panel is an image-LINK field — there is no
 * upload endpoint behind it, so it no longer claims to mount anything.
 */
const TopicEditorModal: React.FC<TopicEditorModalProps> = ({
  topic,
  isNew,
  onClose,
  onChange,
  showLivePreview,
  onTogglePreview,
  assetUrl,
  onAssetUrlChange,
  onInsertAsset,
  onSave,
}) => (
  <Dialog
    open={!!topic}
    onClose={onClose}
    closeOnBackdrop={false}
    title={isNew ? 'Create Dynamic Topic Block' : 'Modify Topic Block'}
    size="full"
    backdropClassName="bg-black/90 backdrop-blur-md"
    className="bg-slate-950 border-slate-800 rounded-2xl h-[85vh]"
  >
    {topic && (
    <>
          {/* Modal Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-cyan-400">
              <Edit3 size={18} />
              <h3 className="text-sm font-black uppercase tracking-wider">
                {isNew ? 'Create Dynamic Topic Block' : 'Modify Topic Block'}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePreview}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase transition flex items-center gap-1.5 ${
                  showLivePreview
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                <Eye size={12} /> {showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}
              </button>
              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-white px-2 py-1"
              >
                Cancel ✕
              </button>
            </div>
          </div>

          {/* WYSIWYG Workspace: Left (Editor), Right (Live Visual Blueprint Preview) */}
          <div className="flex-1 flex overflow-hidden">

            {/* Editor Form Panel */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-4 border-r border-slate-850 text-left">

              {/* Topic Title */}
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-bold text-slate-400">Topic Title</label>
                <input
                  type="text"
                  required
                  data-dialog-autofocus
                  placeholder="e.g. Memory Layout & Static Variables"
                  value={topic.title}
                  onChange={(e) => onChange({ ...topic, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              {/* Topic Main Content text */}
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-bold text-slate-400">Topic Content Body (Rich Markdown Support)</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Enter detailed technical explanations for students..."
                  value={topic.text}
                  onChange={(e) => onChange({ ...topic, text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition font-sans leading-relaxed"
                />
              </div>

              {/* Inline Code Snippet */}
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-bold text-slate-400">Compiler Code Snippet (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="#include <stdio.h>\n..."
                  value={topic.code || ''}
                  onChange={(e) => onChange({ ...topic, code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-cyan-400 placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition font-mono"
                />
              </div>

              {/* Takeaway / note */}
              <div className="space-y-1">
                <label className="text-[12px] uppercase font-bold text-slate-400">Highlight Takeaway / Core Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Highlight standard errors, caveats, or dynamic memory leaks..."
                  value={topic.note || ''}
                  onChange={(e) => onChange({ ...topic, note: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              {/* Asset Diagram Link Helper (Issue #8) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5 mt-2">
                <div className="flex items-center gap-1.5 text-slate-300 text-[12px] font-black uppercase">
                  <Image size={14} className="text-cyan-400" /> Embedded Infographic Link
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste an image URL (e.g. /blueprints/stages.svg)"
                    value={assetUrl}
                    onChange={(e) => onAssetUrlChange(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <button
                    type="button"
                    disabled={!assetUrl.trim()}
                    onClick={onInsertAsset}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-cyan-400 hover:text-white rounded-lg text-[12px] font-bold uppercase transition"
                  >
                    Insert Link
                  </button>
                </div>
                <p className="text-[12px] text-slate-500 leading-snug">
                  Appends a markdown image link to the topic body. Nothing is uploaded from here —
                  host the image first, then paste its URL.
                </p>
              </div>

            </div>

            {/* WYSIWYG Side-by-Side Premium Live Preview Pane (Issue #8) */}
            {showLivePreview && (
              <div className="hidden md:block w-1/2 p-6 bg-slate-950/40 overflow-y-auto space-y-4 text-left">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <Eye size={14} className="text-cyan-400" />
                  <span className="text-[12px] font-black uppercase tracking-widest text-slate-450">
                    Student Learning Pane Real-Time Preview
                  </span>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-lg font-black text-white">{topic.title || 'Untitled Topic'}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{topic.text || 'Study material description placeholder.'}</p>

                  {topic.code && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-cyan-400 overflow-x-auto shadow-inner leading-relaxed select-none">
                      <pre><code>{topic.code}</code></pre>
                    </div>
                  )}

                  {topic.note && (
                    <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed flex items-start gap-3">
                      <span className="text-lg select-none">💡</span>
                      <div>
                        <strong className="text-teal-200 block mb-0.5">Core Takeaway</strong>
                        {topic.note}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase transition"
            >
              Discard
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-cyan-500/10 flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Save size={14} /> Commit &amp; Publish Block
            </button>
          </div>
    </>
    )}
  </Dialog>
);

export default TopicEditorModal;
