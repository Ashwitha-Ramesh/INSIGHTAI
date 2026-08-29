import React from 'react';
import { 
  History as HistoryIcon, 
  Trash2, 
  RotateCcw, 
  Database, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import { HistoryEntry, ActivePage, DatasetAnalysis } from '../../types';
import { analyzeDataset } from '../../lib/dataEngine';

interface HistoryPageProps {
  history: HistoryEntry[];
  onRestoreSession: (entry: HistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  setActivePage: (page: ActivePage) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onRestoreSession,
  onDeleteEntry,
  onClearAll,
  setActivePage,
  onShowToast,
}) => {
  const handleRestore = (entry: HistoryEntry) => {
    if (entry.rawDataSample && entry.rawDataSample.length > 0) {
      const reAnalysis = analyzeDataset(entry.rawDataSample, entry.datasetName);
      onRestoreSession(entry);
      onShowToast('Session Restored', `Mounted dataset '${entry.datasetName}'.`, 'success');
      setActivePage('dashboard');
    } else {
      onShowToast('Cannot Restore', 'Full raw data was not preserved for this snapshot.', 'info');
    }
  };

  return (
    <div id="history-page" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Analysis History</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Local browser archive of previous datasets, quality audits, and metric extractions.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all analysis history?')) {
                onClearAll();
                onShowToast('History Cleared', 'All local dataset snapshots removed.', 'info');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900 text-xs font-semibold transition-all self-start"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Database className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-white">{item.datasetName}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Grade {item.qualityGrade} ({item.qualityScore}%)
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  <strong className="text-white">Key Finding:</strong> {item.topInsight}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.uploadedAt).toLocaleString()}
                  </span>
                  <span className="font-mono text-slate-300 font-semibold">
                    {item.rowCount.toLocaleString()} rows • {item.colCount} columns
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleRestore(item)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Session</span>
                </button>

                <button
                  onClick={() => onDeleteEntry(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <HistoryIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Analysis History Yet</h3>
            <p className="text-sm text-slate-400 mt-2">
              Uploaded datasets and statistical summaries are automatically recorded here for instant recall across browser sessions.
            </p>
            <button
              onClick={() => setActivePage('upload')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              <span>Upload Your First Dataset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
