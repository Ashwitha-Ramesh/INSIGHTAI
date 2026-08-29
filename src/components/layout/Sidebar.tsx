import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Sparkles, 
  BarChart3, 
  FileText, 
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ActivePage, DatasetAnalysis } from '../../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  currentDataset: DatasetAnalysis | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  currentDataset,
}) => {
  const navItems: { id: ActivePage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Dataset', icon: UploadCloud, badge: currentDataset ? `${currentDataset.totalRows}r` : undefined },
    { id: 'analysis', label: 'AI Analysis', icon: Sparkles, badge: currentDataset ? `${currentDataset.insights.length}` : undefined },
    { id: 'visualizations', label: 'Visualizations', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`
          fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between
          bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-2xl transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header / Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-white tracking-tight">Insight<span className="text-indigo-400">AI</span></span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">PRO</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Enterprise Analytics</span>
                </div>
              )}
            </div>

            {/* Collapse toggle (Desktop only) */}
            <button
              id="sidebar-collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90'}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
                  
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span className={`
                      text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold
                      ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-300 border border-slate-700'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & active dataset card */}
        <div className="p-3 border-t border-slate-850 bg-slate-950/40">
          {!collapsed ? (
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  Dataset Status
                </span>
                {currentDataset ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <AlertCircle className="w-3 h-3" /> Idle
                  </span>
                )}
              </div>

              {currentDataset ? (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white truncate" title={currentDataset.fileName}>
                    {currentDataset.fileName}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{currentDataset.totalRows.toLocaleString()} rows</span>
                    <span className="font-mono text-emerald-400 font-semibold">{currentDataset.quality.qualityGrade} ({currentDataset.quality.dataQualityScore}%)</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  No dataset mounted. Upload or select sample data.
                </p>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                className={`w-3 h-3 rounded-full ${currentDataset ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}
                title={currentDataset ? `Active: ${currentDataset.fileName}` : 'No dataset'}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
