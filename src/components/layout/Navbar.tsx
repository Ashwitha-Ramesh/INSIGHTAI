import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  Upload, 
  Database, 
  ChevronRight, 
  Menu, 
  FileText, 
  Sparkles,
  HelpCircle,
  Palette,
  Check,
  Laptop,
  X
} from 'lucide-react';
import { ActivePage, DatasetAnalysis, UserSettings } from '../../types';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentDataset: DatasetAnalysis | null;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenUpload: () => void;
  onToggleSidebar: () => void;
  onSearchSelect?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  currentDataset,
  settings,
  onUpdateSettings,
  onOpenUpload,
  onToggleSidebar,
}) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const accents: { id: UserSettings['accentColor']; name: string; hex: string }[] = [
    { id: 'indigo', name: 'Indigo Cyber', hex: '#6366f1' },
    { id: 'emerald', name: 'Emerald Forest', hex: '#10b981' },
    { id: 'violet', name: 'Violet Nebula', hex: '#8b5cf6' },
    { id: 'cyan', name: 'Cyan Neon', hex: '#06b6d4' },
    { id: 'amber', name: 'Amber Sunset', hex: '#f59e0b' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

  const pageTitles: Record<ActivePage, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Real-time Executive Analytics & Insights' },
    upload: { title: 'Upload Dataset', subtitle: 'CSV & Excel Browser Parsing & Hygiene' },
    analysis: { title: 'AI Analysis', subtitle: 'Automated Statistical & Rule-Based Reasoning' },
    visualizations: { title: 'Visualizations', subtitle: 'Interactive Multidimensional Chart Studio' },
    reports: { title: 'Reports', subtitle: 'Comprehensive Audit & Export Generator' },
    history: { title: 'History', subtitle: 'Local Analysis Archive & Snapshots' },
    settings: { title: 'Settings', subtitle: 'System Preferences & Appearance' },
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  return (
    <>
      <header id="main-navbar" className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between transition-colors">
        
        {/* Left Side: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 font-medium text-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              InsightAI
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />
            <span className="font-semibold text-slate-100 capitalize">
              {pageTitles[activePage]?.title}
            </span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center max-w-md w-full mx-4">
          <button
            id="global-search-trigger"
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Search columns, metrics, or insights...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Current Dataset Indicator */}
          {currentDataset ? (
            <div 
              id="active-dataset-badge"
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 max-w-[200px]"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{currentDataset.fileName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-200">
                {currentDataset.totalRows}r
              </span>
            </div>
          ) : (
            <button
              id="nav-quick-upload-btn"
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Load Data</span>
            </button>
          )}

          {/* Help Button */}
          <button
            id="nav-help-btn"
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title="Help & Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick Theme & Palette Dropdown */}
          <div className="relative" ref={themeMenuRef}>
            <button
              id="nav-theme-palette-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`p-2 rounded-lg transition-colors border ${
                showThemeMenu 
                  ? 'bg-slate-800 text-white border-slate-700' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent hover:border-slate-800'
              }`}
              title="Theme & Accent Palette"
            >
              <Palette className="w-4 h-4 text-indigo-400" />
            </button>

            {showThemeMenu && (
              <div 
                id="theme-dropdown-menu"
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3"
              >
                {/* Theme Mode Selector */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                    Appearance Mode
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'system', label: 'Auto', icon: Laptop },
                    ].map(mode => {
                      const Icon = mode.icon;
                      const isSelected = settings.theme === mode.id;
                      return (
                        <button
                          key={mode.id}
                          id={`nav-theme-mode-${mode.id}`}
                          onClick={() => {
                            onUpdateSettings({ theme: mode.id as any });
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                            isSelected 
                              ? 'bg-indigo-600 text-white shadow-sm font-semibold' 
                              : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Color Selector */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                    Accent Color
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {accents.map(acc => {
                      const isSelected = settings.accentColor === acc.id;
                      return (
                        <button
                          key={acc.id}
                          id={`nav-accent-${acc.id}`}
                          onClick={() => {
                            onUpdateSettings({ accentColor: acc.id });
                          }}
                          className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                            isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: acc.hex }}
                          title={acc.name}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Quick Toggle (Light / Dark) */}
          <button
            id="theme-toggle-btn"
            onClick={handleToggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

        </div>
      </header>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Search className="w-5 h-5 text-indigo-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across columns, insights, and visualizations..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto space-y-1 text-xs">
              {currentDataset ? (
                <>
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400">
                    Dataset Columns ({currentDataset.columnNames.length})
                  </div>
                  {currentDataset.columnNames
                    .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 8)
                    .map(col => (
                      <button
                        key={col}
                        onClick={() => {
                          setActivePage('analysis');
                          setShowSearchModal(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-300 hover:text-white"
                      >
                        <span className="font-medium">{col}</span>
                        <span className="text-[10px] text-indigo-400 uppercase font-mono">
                          {currentDataset.columns.find(c => c.name === col)?.type}
                        </span>
                      </button>
                    ))}
                </>
              ) : (
                <div className="py-6 text-center text-slate-400">
                  No dataset loaded yet. Upload a CSV or Excel file to search its variables.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <Sparkles className="w-5 h-5" />
                <span>InsightAI Platform Architecture</span>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">100% Client-Side Analytics:</strong> Your files never leave your device. All parsing, correlation calculations, outlier checks, and rule-based insights happen directly in your browser using optimized JavaScript algorithms.
              </p>
              <p>
                <strong className="text-white">Supported Formats:</strong> CSV (.csv), Excel (.xlsx, .xls), Plain Text tabular data.
              </p>
              <p>
                <strong className="text-white">Local AI Reasoning:</strong> The heuristic engine applies statistical formulas (Pearson correlation, Z-Score, Tukey IQR, skewness, Pareto 80/20) to extract actionable business patterns.
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
            >
              Got it, Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
