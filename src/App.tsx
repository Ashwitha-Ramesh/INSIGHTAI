import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { UploadPage } from './components/upload/UploadPage';
import { AIAnalysisPage } from './components/analysis/AIAnalysisPage';
import { VisualizationsPage } from './components/visualizations/VisualizationsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { HistoryPage } from './components/history/HistoryPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ToastContainer, ToastMessage } from './components/common/Toast';

import { ActivePage, DatasetAnalysis, HistoryEntry, UserSettings, ChartConfig } from './types';
import { 
  loadCurrentAnalysis, 
  saveCurrentAnalysis, 
  getHistory, 
  removeHistoryEntry, 
  clearAllHistory, 
  loadSettings, 
  saveSettings 
} from './lib/storage';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [currentDataset, setCurrentDataset] = useState<DatasetAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load initial dataset & history on startup
  useEffect(() => {
    const savedAnalysis = loadCurrentAnalysis();
    if (savedAnalysis) {
      setCurrentDataset(savedAnalysis);
    }
    setHistory(getHistory());
  }, []);

  // Sync theme with document class and attributes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    let effectiveTheme = settings.theme;
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      body.classList.remove('light');
      body.classList.add('dark');
    }

    root.setAttribute('data-theme', effectiveTheme);
    root.setAttribute('data-accent', settings.accentColor || 'indigo');
    
    // Accessibility flags
    if (settings.reduceAnimations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (settings.layoutDensity === 'compact') {
      root.classList.add('density-compact');
    } else {
      root.classList.remove('density-compact');
    }
  }, [settings.theme, settings.accentColor, settings.reduceAnimations, settings.layoutDensity]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (!settings.notificationsEnabled && type === 'info') return;
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random()}`,
      title,
      message,
      type,
    };
    setToasts(prev => [...prev.slice(-3), newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleDatasetLoaded = (analysis: DatasetAnalysis) => {
    setCurrentDataset(analysis);
    saveCurrentAnalysis(analysis);
    setHistory(getHistory());
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleClearAllData = () => {
    clearAllHistory();
    setCurrentDataset(null);
    setHistory([]);
  };

  const handleDeleteHistoryEntry = (id: string) => {
    removeHistoryEntry(id);
    setHistory(getHistory());
    showToast('Entry Removed', 'Item removed from analysis history.', 'info');
  };

  const handleRestoreSession = (entry: HistoryEntry) => {
    // History page already handles recreation
    setHistory(getHistory());
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${settings.largerText ? 'text-base' : 'text-sm'}`}>
      
      {/* Left Collapsible Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        currentDataset={currentDataset}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        
        {/* Top Navbar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          currentDataset={currentDataset}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenUpload={() => setActivePage('upload')}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              currentDataset={currentDataset}
              history={history}
              setActivePage={setActivePage}
              onLoadDataset={handleDatasetLoaded}
            />
          )}

          {activePage === 'upload' && (
            <UploadPage
              currentDataset={currentDataset}
              onDatasetLoaded={handleDatasetLoaded}
              setActivePage={setActivePage}
              onShowToast={showToast}
            />
          )}

          {activePage === 'analysis' && (
            <AIAnalysisPage
              currentDataset={currentDataset}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'visualizations' && (
            <VisualizationsPage
              currentDataset={currentDataset}
              setActivePage={setActivePage}
              onShowToast={showToast}
            />
          )}

          {activePage === 'reports' && (
            <ReportsPage
              currentDataset={currentDataset}
              setActivePage={setActivePage}
              onShowToast={showToast}
            />
          )}

          {activePage === 'history' && (
            <HistoryPage
              history={history}
              onRestoreSession={handleRestoreSession}
              onDeleteEntry={handleDeleteHistoryEntry}
              onClearAll={handleClearAllData}
              setActivePage={setActivePage}
              onShowToast={showToast}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearAllData={handleClearAllData}
              onShowToast={showToast}
            />
          )}
        </main>

      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
