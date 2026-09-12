import React from 'react';
import { Save, Settings } from 'lucide-react';
import ErrorState from '../../atoms/ErrorState';

export interface ContactSettingsForm {
  COMPANY_NAME: string;
  WEBSITE_URL: string;
  CONTACT_EMAIL: string;
  CONTACT_PHONE: string;
  CONTACT_HOURS: string;
}

interface AdminContactSettingsProps {
  settings: ContactSettingsForm;
  onSettingsChange: React.Dispatch<React.SetStateAction<ContactSettingsForm>>;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  /** Set when GET /contact/settings failed — the form would show blanks. */
  error: string | null;
  onRetry: () => void;
}

/**
 * Phase 16: the Contact Settings tab body, lifted out of AdminDashboard
 * verbatim. A failed load is surfaced rather than rendering every field empty,
 * which would look like the company details had been wiped.
 */
const AdminContactSettings: React.FC<AdminContactSettingsProps> = ({
  settings,
  onSettingsChange,
  saving,
  onSubmit,
  error,
  onRetry,
}) => (
  <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
    <div className="pb-2 border-b border-slate-800/80">
      <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
        <Settings size={18} className="text-cyan-400" /> Contact Support Settings
      </h3>
      <p className="text-slate-400 text-xs mt-1">Configure company support metadata and contact desk parameters shown across the public portal.</p>
    </div>

    {error && <ErrorState title="Couldn't load contact settings" message={error} onRetry={onRetry} />}

    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-1">
        <label className="text-[12px] font-black uppercase tracking-wider text-slate-450">Company Name</label>
        <input
          type="text"
          required
          value={settings.COMPANY_NAME}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, COMPANY_NAME: e.target.value }))}
          placeholder="e.g. EduNexus Pro"
          className="w-full bg-slate-950 border border-slate-850 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[12px] font-black uppercase tracking-wider text-slate-450">Website URL</label>
        <input
          type="url"
          required
          value={settings.WEBSITE_URL}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, WEBSITE_URL: e.target.value }))}
          placeholder="https://..."
          className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[12px] font-black uppercase tracking-wider text-slate-450">Support Email</label>
        <input
          type="email"
          required
          value={settings.CONTACT_EMAIL}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, CONTACT_EMAIL: e.target.value }))}
          placeholder="support@..."
          className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[12px] font-black uppercase tracking-wider text-slate-450">Contact Mobile Number</label>
        <input
          type="text"
          required
          value={settings.CONTACT_PHONE}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, CONTACT_PHONE: e.target.value }))}
          placeholder="+91..."
          className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[12px] font-black uppercase tracking-wider text-slate-450">Business Hours</label>
        <input
          type="text"
          required
          value={settings.CONTACT_HOURS}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, CONTACT_HOURS: e.target.value }))}
          placeholder="Monday to Saturday | 10:00 AM - 6:00 PM (IST)"
          className="w-full bg-slate-950 border border-slate-855 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 transition outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-750 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow active:scale-95 disabled:opacity-50"
      >
        <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  </div>
);

export default AdminContactSettings;
