import React from 'react';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Palette, 
  Maximize2, 
  ShieldCheck, 
  Trash2, 
  Bell, 
  Download, 
  Sparkles,
  Check,
  Eye
} from 'lucide-react';
import { UserSettings } from '../../types';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearAllData: () => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onClearAllData,
  onShowToast,
}) => {
  const accents: { id: UserSettings['accentColor']; name: string; hex: string }[] = [
    { id: 'indigo', name: 'Indigo Cyber', hex: '#6366f1' },
    { id: 'emerald', name: 'Emerald Forest', hex: '#10b981' },
    { id: 'violet', name: 'Violet Nebula', hex: '#8b5cf6' },
    { id: 'cyan', name: 'Cyan Neon', hex: '#06b6d4' },
    { id: 'amber', name: 'Amber Sunset', hex: '#f59e0b' },
  ];

  const handleClear = () => {
    if (window.confirm('Clear all local datasets, history, and cache from your browser storage?')) {
      onClearAllData();
      onShowToast('Data Cleared', 'Local storage was reset successfully.', 'info');
    }
  };

  return (
    <div id="settings-page" className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System & User Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure interface appearance, layout density, and client-side storage preferences.
        </p>
      </div>

      {/* 1. Appearance & Theme */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 shadow-lg">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Sun className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Appearance & Theme</h3>
            <p className="text-xs text-slate-400">Select your preferred color scheme mode</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark Mode', icon: Moon },
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'system', label: 'System Default', icon: Eye },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = settings.theme === mode.id;

            return (
              <button
                key={mode.id}
                id={`theme-mode-btn-${mode.id}`}
                onClick={() => {
                  onUpdateSettings({ theme: mode.id as any });
                  onShowToast('Theme Updated', `Switched theme to ${mode.label}.`, 'info');
                }}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 font-bold shadow-md ring-1 ring-indigo-500/30' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{mode.label}</span>
                {isSelected && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Accent Color Picker */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-300 block mb-2.5">
            Accent Highlight Palette
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {accents.map((acc) => {
              const isSelected = settings.accentColor === acc.id;
              return (
                <button
                  key={acc.id}
                  id={`accent-picker-btn-${acc.id}`}
                  onClick={() => {
                    onUpdateSettings({ accentColor: acc.id });
                    onShowToast('Accent Color', `Selected ${acc.name}.`, 'info');
                  }}
                  className={`px-3.5 py-2 rounded-xl border-2 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-600/15 text-white font-bold shadow-md ring-1 ring-indigo-500/30' 
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full ring-1 ring-white/30 shrink-0" style={{ backgroundColor: acc.hex }} />
                  <span>{acc.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 font-bold" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Layout & Accessibility */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Maximize2 className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Layout & Accessibility</h3>
            <p className="text-xs text-slate-400">Tailor readability, animations, and spacing density</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Layout Density */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <div className="text-xs font-bold text-white">Compact Data Density</div>
              <p className="text-[11px] text-slate-400">Reduce table row height and card margins for maximum information per screen</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ layoutDensity: settings.layoutDensity === 'compact' ? 'comfortable' : 'compact' })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.layoutDensity === 'compact' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.layoutDensity === 'compact' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Reduce Animations */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <div className="text-xs font-bold text-white">Reduce Motion / Animations</div>
              <p className="text-[11px] text-slate-400">Disable UI transitions and celebratory effects</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ reduceAnimations: !settings.reduceAnimations })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.reduceAnimations ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.reduceAnimations ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Larger Text */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <div className="text-xs font-bold text-white">Enhanced Typography Sizing</div>
              <p className="text-[11px] text-slate-400">Increase baseline font size across table cells and analytical charts</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ largerText: !settings.largerText })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.largerText ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.largerText ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Export & Notification Defaults */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Download className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Export & Report Defaults</h3>
            <p className="text-xs text-slate-400">Default download format preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Default Report Format</label>
            <select
              value={settings.exportFormat}
              onChange={(e) => onUpdateSettings({ exportFormat: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="pdf">PDF Executive Document</option>
              <option value="csv">Raw Cleaned CSV</option>
              <option value="json">Full JSON Analysis</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Toast Notifications</label>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-300">Show success toasts</span>
              <button
                onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  settings.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Local Storage & Privacy Management */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Browser Storage & Privacy</h3>
              <p className="text-xs text-slate-400">All data remains strictly within your local browser sandbox</p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Data</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
          <p className="text-slate-300 font-semibold">About InsightAI Platform Architecture:</p>
          <p>
            InsightAI runs 100% in-browser on modern Web Standards. It parses CSV and Excel datasets client-side and applies rigorous statistical heuristics for automated AI reasoning. No external AI APIs, LLM endpoints, or cloud telemetry are utilized.
          </p>
        </div>
      </section>

    </div>
  );
};
