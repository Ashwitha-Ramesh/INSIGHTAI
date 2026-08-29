import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  BarChart2, 
  Layers, 
  ArrowRight, 
  Flame, 
  Compass, 
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { DatasetAnalysis, AIInsight, AskQueryResult, ActivePage, ChartConfig } from '../../types';
import { queryDataEngine, formatShortNumber } from '../../lib/dataEngine';

interface AIAnalysisPageProps {
  currentDataset: DatasetAnalysis | null;
  setActivePage: (page: ActivePage) => void;
  onSelectChartConfig?: (config: Partial<ChartConfig>) => void;
}

export const AIAnalysisPage: React.FC<AIAnalysisPageProps> = ({
  currentDataset,
  setActivePage,
  onSelectChartConfig,
}) => {
  const [askQuery, setAskQuery] = useState('');
  const [queryResult, setQueryResult] = useState<AskQueryResult | null>(null);
  const [insightFilter, setInsightFilter] = useState<'all' | 'critical' | 'correlation' | 'outlier' | 'trend'>('all');
  const [selectedColumnName, setSelectedColumnName] = useState<string>(
    currentDataset?.columnNames[0] || ''
  );

  if (!currentDataset) {
    return (
      <div className="rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Dataset Available for Analysis</h3>
          <p className="text-sm text-slate-400 mt-2">
            Please upload a dataset first to enable automated statistical deduction, anomaly detection, and natural language querying.
          </p>
          <button
            onClick={() => setActivePage('upload')}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
          >
            <span>Upload Dataset</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    const res = queryDataEngine(askQuery, currentDataset);
    setQueryResult(res);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setAskQuery(prompt);
    const res = queryDataEngine(prompt, currentDataset);
    setQueryResult(res);
  };

  const filteredInsights = currentDataset.insights.filter(ins => {
    if (insightFilter === 'all') return true;
    if (insightFilter === 'critical') return ins.severity === 'critical' || ins.severity === 'warning';
    if (insightFilter === 'correlation') return ins.type === 'correlation';
    if (insightFilter === 'outlier') return ins.type === 'outlier';
    if (insightFilter === 'trend') return ins.type === 'trend' || ins.type === 'growth';
    return true;
  });

  const selectedCol = currentDataset.columns.find(c => c.name === selectedColumnName) || currentDataset.columns[0];

  return (
    <div id="ai-analysis-page" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Local AI Reasoning Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Automated Insights & Analytical Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyzing {currentDataset.totalRows.toLocaleString()} rows from <strong className="text-slate-200">{currentDataset.fileName}</strong> via client-side statistical heuristics.
          </p>
        </div>

        <button
          onClick={() => setActivePage('visualizations')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all self-start"
        >
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          <span>Chart Studio</span>
        </button>
      </div>

      {/* 1. "Ask Your Data" Natural Language Query Box */}
      <section className="rounded-3xl bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Ask Your Data (Natural Language Query)</h3>
          </div>
          <p className="text-xs text-slate-300 mb-5">
            Type analytical questions in plain English. The local engine extracts statistical intent and computes instant answers.
          </p>

          <form onSubmit={handleAskSubmit} className="relative flex items-center">
            <input
              type="text"
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              placeholder="e.g. What is the average value? Are there any outliers? Show top categories..."
              className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </form>

          {/* Quick Suggestions Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
            {[
              'Are there any strong correlations?',
              'Show missing values and data quality',
              `What is the average of ${currentDataset.columns.find(c => c.type === 'numeric')?.name || 'metrics'}?`,
              `Show top categories in ${currentDataset.columns.find(c => c.type === 'categorical')?.name || 'dataset'}`,
              'Detect extreme outliers and spikes',
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestedPrompt(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-300 transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Query Result Card (if asked) */}
        {queryResult && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{queryResult.title}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                Local Analysis Complete
              </span>
            </div>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {queryResult.answer}
            </p>

            {queryResult.dataPoints && queryResult.dataPoints.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {queryResult.dataPoints.map((dp, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">{dp.label}</div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">{dp.value}</div>
                  </div>
                ))}
              </div>
            )}

            {queryResult.suggestions && queryResult.suggestions.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400">Related inquiries:</span>
                {queryResult.suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(s)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. Automated AI Insights Feed */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Statistical Findings & Heuristic Insights</h3>
            <p className="text-xs text-slate-400">Categorized by severity and business significance</p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['all', 'critical', 'correlation', 'outlier', 'trend'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setInsightFilter(tab)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  insightFilter === tab 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map((ins) => (
            <div
              key={ins.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      ins.severity === 'critical' ? 'bg-rose-500' :
                      ins.severity === 'warning' ? 'bg-amber-500' :
                      ins.severity === 'positive' ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`} />
                    <h4 className="text-sm font-bold text-white">{ins.title}</h4>
                  </div>

                  {ins.metric && (
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {ins.metric}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {ins.description}
                </p>

                {ins.impact && (
                  <p className="text-[11px] text-slate-400 mt-2">
                    <strong className="text-slate-300">Impact:</strong> {ins.impact}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                {ins.suggestion && (
                  <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-900/40 flex items-start gap-2 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Action Plan:</strong> {ins.suggestion}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 flex-wrap">
                  {ins.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Deep Statistical Column Inspector */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Variable Statistical Inspector</h3>
            <p className="text-xs text-slate-400">Detailed distributions, quartiles, and dispersion metrics</p>
          </div>

          {/* Select Column */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Select Variable:</span>
            <select
              value={selectedColumnName}
              onChange={(e) => setSelectedColumnName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {currentDataset.columns.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCol && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase text-slate-400 font-mono">Data Type</div>
                <div className="text-xs font-bold text-indigo-400 uppercase mt-1">{selectedCol.type}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase text-slate-400 font-mono">Missing Values</div>
                <div className="text-xs font-bold text-white mt-1">
                  {selectedCol.missingCount} ({selectedCol.missingPercentage}%)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] uppercase text-slate-400 font-mono">Distinct Values</div>
                <div className="text-xs font-bold text-white mt-1">{selectedCol.uniqueCount.toLocaleString()}</div>
              </div>

              {selectedCol.type === 'numeric' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-mono">Mean (Avg)</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">{formatShortNumber(selectedCol.mean || 0)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-mono">Median</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">{formatShortNumber(selectedCol.median || 0)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-mono">Std Deviation</div>
                    <div className="text-xs font-bold text-amber-400 mt-1">{formatShortNumber(selectedCol.std || 0)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-mono">Min / Max</div>
                    <div className="text-xs font-bold text-white mt-1">
                      {formatShortNumber(selectedCol.min || 0)} / {formatShortNumber(selectedCol.max || 0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-mono">IQR (Q1 - Q3)</div>
                    <div className="text-xs font-bold text-white mt-1">
                      {formatShortNumber(selectedCol.q1 || 0)} - {formatShortNumber(selectedCol.q3 || 0)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-mono">Skewness</div>
                    <div className="text-xs font-bold text-white mt-1">{selectedCol.skewness}</div>
                  </div>
                </>
              )}
            </div>

            {/* Categorical breakdown table if categorical */}
            {selectedCol.topFrequencies && selectedCol.topFrequencies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs font-semibold text-white mb-2">Frequency Distribution:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                  {selectedCol.topFrequencies.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <span className="truncate font-medium text-slate-200" title={f.label}>{f.label}</span>
                      <span className="font-mono text-indigo-400 font-semibold">{f.count} ({f.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Pearson Correlation Matrix */}
      {currentDataset.correlations.length > 0 && (
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Pearson Correlation Matrix</h3>
              <p className="text-xs text-slate-400">Pairwise dependency coefficients between numeric dimensions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentDataset.correlations.slice(0, 6).map((pair, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{pair.col1}</span>
                    <span className="text-slate-500">↔</span>
                    <span className="text-xs font-bold text-white">{pair.col2}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pair.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-base font-bold font-mono ${
                    pair.score > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {pair.score > 0 ? `+${pair.score}` : pair.score}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {pair.strength}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
