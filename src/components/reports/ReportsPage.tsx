import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Database,
  ArrowRight,
  Share2
} from 'lucide-react';
import { DatasetAnalysis, ActivePage } from '../../types';
import { exportToMarkdownReport, exportToJSON, exportToCSV } from '../../lib/exportUtils';
import { formatShortNumber } from '../../lib/dataEngine';

interface ReportsPageProps {
  currentDataset: DatasetAnalysis | null;
  setActivePage: (page: ActivePage) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  currentDataset,
  setActivePage,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!currentDataset) {
    return (
      <div className="rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Dataset Available for Reporting</h3>
          <p className="text-sm text-slate-400 mt-2">
            Upload your spreadsheet to generate a comprehensive, executive-ready analytical report.
          </p>
          <button
            onClick={() => setActivePage('upload')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            <span>Upload Dataset</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    exportToMarkdownReport(currentDataset);
    onShowToast('Markdown Downloaded', 'Executive report saved as .md file.', 'success');
  };

  const handleDownloadJSON = () => {
    exportToJSON(currentDataset);
    onShowToast('JSON Exported', 'Full analytical schema saved to .json.', 'success');
  };

  const handleDownloadCSV = () => {
    exportToCSV(currentDataset.rawData, `${currentDataset.fileName.replace(/\.[^/.]+$/, '')}_clean.csv`);
    onShowToast('CSV Downloaded', 'Cleaned records exported.', 'success');
  };

  const handleCopySummary = () => {
    const summaryText = `InsightAI Executive Report: ${currentDataset.fileName}\nTotal Rows: ${currentDataset.totalRows.toLocaleString()}\nQuality Score: ${currentDataset.quality.dataQualityScore}/100\nTop Insight: ${currentDataset.insights[0]?.title || 'N/A'}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onShowToast('Copied to Clipboard', 'Executive summary text copied.', 'info');
  };

  return (
    <div id="reports-generator" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Export Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Executive Analytics & Audit Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish, print, or export an authoritative, verified analytical audit of <strong className="text-slate-200">{currentDataset.fileName}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Brief'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Markdown (.md)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Styled Printable Report Document Container */}
      <div 
        id="printable-report-doc"
        className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-10"
      >
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>InsightAI Verified Analytics Report</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {currentDataset.fileName.replace(/\.[^/.]+$/, '')} Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Generated on {new Date(currentDataset.uploadedAt).toLocaleString()} • Client-Side Heuristic Engine
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-semibold">Quality Index</div>
              <div className="text-2xl font-bold text-emerald-400">
                {currentDataset.quality.dataQualityScore}/100
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              {currentDataset.quality.qualityGrade}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary & Topology */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            1. Executive Topology & Dimensions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Total Records</span>
              <div className="text-xl font-bold text-white mt-1">{currentDataset.totalRows.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Columns / Features</span>
              <div className="text-xl font-bold text-white mt-1">{currentDataset.totalCols}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Data Completeness</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{(100 - currentDataset.quality.missingRate).toFixed(1)}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Duplicate Records</span>
              <div className="text-xl font-bold text-white mt-1">{currentDataset.quality.duplicateRows}</div>
            </div>
          </div>
        </section>

        {/* Section 2: Automated AI Insights Breakdown */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            2. Statistical Observations & AI Insights
          </h3>

          <div className="space-y-3">
            {currentDataset.insights.map((ins, idx) => (
              <div
                key={ins.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-400 font-mono">#{idx + 1}</span>
                    {ins.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                    ins.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' :
                    ins.severity === 'warning' ? 'bg-amber-500/20 text-amber-300' :
                    ins.severity === 'positive' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {ins.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
                
                {ins.suggestion && (
                  <div className="text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/30">
                    <strong>Recommended Action:</strong> {ins.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Pearson Correlation Matrix Table */}
        {currentDataset.correlations.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              3. Correlation Dependency Matrix (Pearson r)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono">
                  <tr>
                    <th className="px-4 py-3">Variable 1</th>
                    <th className="px-4 py-3">Variable 2</th>
                    <th className="px-4 py-3">Coefficient (r)</th>
                    <th className="px-4 py-3">Strength & Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {currentDataset.correlations.slice(0, 8).map((pair, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="px-4 py-2.5 font-semibold text-white">{pair.col1}</td>
                      <td className="px-4 py-2.5 font-semibold text-white">{pair.col2}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">
                        {pair.score > 0 ? `+${pair.score}` : pair.score}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">{pair.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section 4: Actionable Recommendations Checklist */}
        {currentDataset.recommendations.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              4. Key Strategic Recommendations
            </h3>

            <div className="space-y-2">
              {currentDataset.recommendations.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-200">{rec}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Document Footer Verification */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <span>InsightAI Automated Client-Side Analytics System</span>
          <span>Verified & Safe • No External Cloud Transmission</span>
        </div>

      </div>

    </div>
  );
};
