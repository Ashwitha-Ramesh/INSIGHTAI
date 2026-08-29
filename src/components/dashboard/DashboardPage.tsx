import React from 'react';
import { 
  Sparkles, 
  Upload, 
  ArrowRight, 
  Database, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  PieChart as PieIcon,
  CheckCircle2,
  FileText,
  Activity,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { DatasetAnalysis, HistoryEntry, ActivePage } from '../../types';
import { StatsCard } from '../common/StatsCard';
import { CreatorFooter } from '../layout/CreatorFooter';
import { SAMPLE_DATASETS } from '../../lib/sampleDatasets';
import { analyzeDataset } from '../../lib/dataEngine';

interface DashboardPageProps {
  currentDataset: DatasetAnalysis | null;
  history: HistoryEntry[];
  setActivePage: (page: ActivePage) => void;
  onLoadDataset: (analysis: DatasetAnalysis) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentDataset,
  history,
  setActivePage,
  onLoadDataset,
}) => {
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DATASETS.find(s => s.id === sampleId);
    if (!sample) return;
    const analysis = analyzeDataset(sample.data, sample.filename, sample.rowCount * 120);
    onLoadDataset(analysis);
  };

  // Prepare chart preview data from current dataset if available
  const numericCols = currentDataset?.columns.filter(c => c.type === 'numeric') || [];
  const primaryNumCol = numericCols[0];
  const catCols = currentDataset?.columns.filter(c => c.type === 'categorical' || c.type === 'boolean') || [];
  const primaryCatCol = catCols[0];

  // Quick distribution or time chart data
  const quickTrendData = currentDataset?.rawData.slice(0, 15).map((row, idx) => {
    const label = primaryCatCol ? String(row[primaryCatCol.name] || `#${idx + 1}`) : `Pt ${idx + 1}`;
    const value = primaryNumCol ? Number(row[primaryNumCol.name] || 0) : idx * 10;
    return { name: label, value: isNaN(value) ? 0 : value };
  }) || [];

  const pieData = primaryCatCol?.topFrequencies?.slice(0, 5).map(f => ({
    name: f.label,
    value: f.count,
  })) || [];

  return (
    <div id="dashboard-container" className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Hero / Landing Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/80 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Local AI Intelligence Engine • 100% Client-Side</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Turn your data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">decisions.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Instantly upload your CSV or Excel spreadsheets directly in your browser. Uncover automated statistical correlations, detect data anomalies, generate interactive charts, and extract actionable business insights without external cloud leaks.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="hero-upload-cta"
              onClick={() => setActivePage('upload')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV / Excel</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentDataset && (
              <button
                id="hero-explore-insights-cta"
                onClick={() => setActivePage('analysis')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-medium transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Explore AI Insights</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Presets when no dataset is loaded */}
        {!currentDataset && (
          <div className="mt-10 pt-8 border-t border-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Or test immediately with a ready sample dataset:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_DATASETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadSample(preset.id)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/90 transition-all text-left group"
                >
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {preset.rowCount} sample records • {preset.category}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. Active Dataset KPI Summary (if loaded) */}
      {currentDataset ? (
        <>
          {/* Executive KPI Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              id="kpi-total-records"
              title="Total Records"
              value={currentDataset.totalRows.toLocaleString()}
              subtitle={`${currentDataset.totalCols} Dimensions / Columns`}
              icon={Database}
              badge={{ text: 'Mounted', variant: 'success' }}
            />
            <StatsCard
              id="kpi-quality-score"
              title="Data Quality"
              value={`${currentDataset.quality.dataQualityScore}%`}
              subtitle={`Grade ${currentDataset.quality.qualityGrade} (${currentDataset.quality.missingRate}% missing)`}
              icon={ShieldCheck}
              badge={{ 
                text: currentDataset.quality.qualityGrade, 
                variant: currentDataset.quality.dataQualityScore >= 85 ? 'success' : 'warning' 
              }}
            />
            <StatsCard
              id="kpi-correlations-found"
              title="Metric Correlations"
              value={currentDataset.correlations.length}
              subtitle={currentDataset.correlations[0] ? `Top: r = ${currentDataset.correlations[0].score}` : 'No pairs'}
              icon={TrendingUp}
              badge={{ text: 'Pearson', variant: 'info' }}
            />
            <StatsCard
              id="kpi-anomalies-detected"
              title="Detected Anomalies"
              value={currentDataset.outliers.length}
              subtitle={`${currentDataset.insights.length} Automated AI Insights`}
              icon={AlertTriangle}
              badge={{ 
                text: currentDataset.outliers.length > 0 ? 'Outliers' : 'Clean', 
                variant: currentDataset.outliers.length > 0 ? 'warning' : 'success' 
              }}
            />
          </section>

          {/* Important AI Insights Spotlight & Data Health */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Insights Feed (2 cols) */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Automated AI Insights Spotlight</h3>
                    <p className="text-xs text-slate-400">Rule-based analytical patterns & anomalies</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePage('analysis')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>View All ({currentDataset.insights.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {currentDataset.insights.slice(0, 3).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          insight.severity === 'critical' ? 'bg-rose-500' :
                          insight.severity === 'warning' ? 'bg-amber-500' :
                          insight.severity === 'positive' ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`} />
                        {insight.title}
                      </h4>
                      {insight.metric && (
                        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {insight.metric}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {insight.description}
                    </p>
                    {insight.suggestion && (
                      <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/40 flex items-start gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong>Action:</strong> {insight.suggestion}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Data Quality & Hygiene Audit (1 col) */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Data Quality Score</h3>
                    <p className="text-xs text-slate-400">Integrity & Completeness Audit</p>
                  </div>
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-white">
                        {currentDataset.quality.dataQualityScore}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase">
                        Grade {currentDataset.quality.qualityGrade}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 mt-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Completeness</span>
                    <span className="font-semibold text-white">{currentDataset.quality.completenessScore}%</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Missing Values</span>
                    <span className="font-semibold text-amber-400">{currentDataset.quality.missingCells} ({currentDataset.quality.missingRate}%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Duplicate Rows</span>
                    <span className="font-semibold text-white">{currentDataset.quality.duplicateRows}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActivePage('reports')}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Executive Audit</span>
              </button>
            </div>

          </section>

          {/* Quick Visualization Preview */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Trend / Metric Preview */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {primaryNumCol ? `${primaryNumCol.name} Distribution Preview` : 'Primary Metric Profile'}
                  </h3>
                  <p className="text-xs text-slate-400">Sample distribution across first records</p>
                </div>
                <button
                  onClick={() => setActivePage('visualizations')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Chart Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={quickTrendData}>
                    <defs>
                      <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#dashboardAreaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Category Breakdown */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {primaryCatCol ? `${primaryCatCol.name} Segment Share` : 'Category Breakdown'}
                  </h3>
                  <p className="text-xs text-slate-400">Frequency proportion of top categories</p>
                </div>
                <button
                  onClick={() => setActivePage('visualizations')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-slate-400 text-xs">
                    No categorical dimensions detected in this dataset.
                  </div>
                )}
              </div>
            </div>

          </section>
        </>
      ) : (
        /* Empty State before upload */
        <section className="rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Dataset Currently Loaded</h3>
            <p className="text-sm text-slate-400 mt-2">
              Upload your CSV or Excel file to activate live multidimensional analytics, automatic correlation matrices, outlier checks, and report generators.
            </p>
            <button
              onClick={() => setActivePage('upload')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>Go to File Uploader</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Recent Analyses History Snapshot */}
      {history.length > 0 && (
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Analyses</h3>
              <p className="text-xs text-slate-400">Stored securely in browser local storage</p>
            </div>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Full History ({history.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                      {item.datasetName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Grade {item.qualityGrade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {item.topInsight}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.rowCount.toLocaleString()} rows</span>
                  <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Creator Footer Section */}
      <CreatorFooter />

    </div>
  );
};
