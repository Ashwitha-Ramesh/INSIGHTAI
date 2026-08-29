import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  ScatterChart as ScatterIcon, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Layers, 
  Filter, 
  Palette, 
  ArrowRight,
  Maximize2,
  PlusCircle,
  Trash2,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { DatasetAnalysis, ChartConfig, ChartType, AggregationType, ActivePage } from '../../types';
import { aggregateChartData, formatShortNumber } from '../../lib/dataEngine';
import { exportToCSV, exportElementAsPNG } from '../../lib/exportUtils';

interface VisualizationsPageProps {
  currentDataset: DatasetAnalysis | null;
  setActivePage: (page: ActivePage) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

const COLOR_PALETTES = {
  indigo: ['#6366f1', '#818cf8', '#a5b4fc', '#4f46e5', '#3730a3', '#c7d2fe'],
  emerald: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#a7f3d0'],
  violet: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#ddd6fe'],
  sunset: ['#f59e0b', '#ec4899', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981'],
  cyan: ['#06b6d4', '#22d3ee', '#67e8f9', '#0891b2', '#0e7490', '#a5f3fc'],
};

export const VisualizationsPage: React.FC<VisualizationsPageProps> = ({
  currentDataset,
  setActivePage,
  onShowToast,
}) => {
  const numericCols = useMemo(() => currentDataset?.columns.filter(c => c.type === 'numeric') || [], [currentDataset]);
  const catCols = useMemo(() => currentDataset?.columns.filter(c => c.type === 'categorical' || c.type === 'boolean') || [], [currentDataset]);

  const defaultX = catCols[0]?.name || currentDataset?.columnNames[0] || '';
  const defaultY = numericCols[0]?.name || currentDataset?.columnNames[1] || '';

  const [config, setConfig] = useState<ChartConfig>({
    id: 'active_chart',
    title: `${defaultX} vs ${defaultY}`,
    type: 'bar',
    xAxis: defaultX,
    yAxis: defaultY,
    aggregation: 'sum',
    colorScheme: 'indigo',
    sortOrder: 'desc',
    limit: 10,
    filterCol: '',
    filterVal: '',
    filterOperator: 'contains',
  });

  const [pinnedCharts, setPinnedCharts] = useState<ChartConfig[]>([]);

  if (!currentDataset) {
    return (
      <div className="rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Dataset Loaded</h3>
          <p className="text-sm text-slate-400 mt-2">
            Upload your CSV or Excel spreadsheet to generate and customize interactive charts.
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

  // Aggregate data for current chart
  const { chartData } = aggregateChartData(currentDataset.rawData, config);
  const palette = COLOR_PALETTES[config.colorScheme as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.indigo;

  const handleReset = () => {
    setConfig({
      id: 'active_chart',
      title: `${defaultX} vs ${defaultY}`,
      type: 'bar',
      xAxis: defaultX,
      yAxis: defaultY,
      aggregation: 'sum',
      colorScheme: 'indigo',
      sortOrder: 'desc',
      limit: 10,
      filterCol: '',
      filterVal: '',
      filterOperator: 'contains',
    });
    onShowToast('Chart Reset', 'Restored default visualization configuration.', 'info');
  };

  const handleExportPNG = async () => {
    onShowToast('Rendering Chart Image', 'Generating high-resolution PNG snapshot...', 'info');
    await exportElementAsPNG('main-chart-canvas', `${config.title.replace(/\s+/g, '_')}.png`);
    onShowToast('Chart Exported', 'PNG image downloaded successfully.', 'success');
  };

  const handleExportCSV = () => {
    exportToCSV(chartData, `${config.title.replace(/\s+/g, '_')}_data.csv`);
    onShowToast('Export Complete', 'Aggregated chart dataset saved to CSV.', 'success');
  };

  const handlePinChart = () => {
    setPinnedCharts(prev => [{ ...config, id: `pinned_${Date.now()}` }, ...prev]);
    onShowToast('Chart Pinned', 'Saved this chart to your multidimensional canvas below.', 'success');
  };

  return (
    <div id="visualizations-studio" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interactive Chart Studio</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build custom multidimensional data visualizations with dynamic aggregations and filtering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePinChart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Pin to Canvas</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Controls (1 col) + Live Chart Canvas (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Sidebar (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Chart Configuration
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Reset Controls"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Chart Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'bar', label: 'Bar', icon: BarChart3 },
                { type: 'line', label: 'Line', icon: LineChartIcon },
                { type: 'area', label: 'Area', icon: AreaChart },
                { type: 'pie', label: 'Pie', icon: PieChartIcon },
                { type: 'donut', label: 'Donut', icon: PieChartIcon },
                { type: 'histogram', label: 'Histogram', icon: BarChart3 },
                { type: 'scatter', label: 'Scatter', icon: ScatterIcon },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setConfig(prev => ({ ...prev, type: item.type as ChartType }))}
                  className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                    config.type === item.type 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="capitalize">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* X Axis Dimension */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">X-Axis Dimension / Category</label>
            <select
              value={config.xAxis}
              onChange={(e) => setConfig(prev => ({ ...prev, xAxis: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {currentDataset.columnNames.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Y Axis Metric (Disabled for Histogram) */}
          {config.type !== 'histogram' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Y-Axis Metric / Value</label>
              <select
                value={config.yAxis}
                onChange={(e) => setConfig(prev => ({ ...prev, yAxis: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {currentDataset.columnNames.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Aggregation Function */}
          {config.type !== 'scatter' && config.type !== 'histogram' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Aggregation Method</label>
              <select
                value={config.aggregation}
                onChange={(e) => setConfig(prev => ({ ...prev, aggregation: e.target.value as AggregationType }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="sum">Sum (Total)</option>
                <option value="avg">Average (Mean)</option>
                <option value="count">Count Records</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
              </select>
            </div>
          )}

          {/* Color Scheme */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Color Palette</label>
            <div className="flex items-center gap-2">
              {Object.keys(COLOR_PALETTES).map((pal) => (
                <button
                  key={pal}
                  onClick={() => setConfig(prev => ({ ...prev, colorScheme: pal }))}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    config.colorScheme === pal ? 'border-white scale-110' : 'border-slate-800'
                  }`}
                  style={{ backgroundColor: COLOR_PALETTES[pal as keyof typeof COLOR_PALETTES][0] }}
                />
              ))}
            </div>
          </div>

          {/* Sorting & Limit */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Sort Order</label>
              <select
                value={config.sortOrder}
                onChange={(e) => setConfig(prev => ({ ...prev, sortOrder: e.target.value as any }))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="desc">Highest First</option>
                <option value="asc">Lowest First</option>
                <option value="none">Original Order</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Max Categories</label>
              <select
                value={config.limit}
                onChange={(e) => setConfig(prev => ({ ...prev, limit: Number(e.target.value) }))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
              </select>
            </div>
          </div>

        </div>

        {/* Live Chart Display (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div
            id="main-chart-canvas"
            className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl relative min-h-[460px] flex flex-col justify-between"
          >
            {/* Chart Title Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {config.type.toUpperCase()}: {config.xAxis} {config.type !== 'histogram' ? `by ${config.yAxis}` : 'Distribution'}
                </h3>
                <p className="text-xs text-slate-400">
                  {chartData.length} data points aggregated via {config.aggregation.toUpperCase()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  Data CSV
                </button>
              </div>
            </div>

            {/* Chart Render Area */}
            <div className="h-80 sm:h-96 w-full">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  No data matching current filters or selected dimensions.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {renderSelectedChart(config, chartData, palette)}
                </ResponsiveContainer>
              )}
            </div>

            {/* Footer Summary Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>X: {config.xAxis}</span>
              <span>Aggregation: {config.aggregation}</span>
              <span>Dataset: {currentDataset.fileName}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pinned Charts Grid */}
      {pinnedCharts.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Pinned Chart Canvas ({pinnedCharts.length})</h3>
            <button
              onClick={() => setPinnedCharts([])}
              className="text-xs text-rose-400 hover:underline"
            >
              Clear Canvas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedCharts.map((pinned) => {
              const { chartData: pData } = aggregateChartData(currentDataset.rawData, pinned);
              const pPalette = COLOR_PALETTES[pinned.colorScheme as keyof typeof COLOR_PALETTES] || COLOR_PALETTES.indigo;

              return (
                <div
                  key={pinned.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">
                      {pinned.xAxis} ↔ {pinned.yAxis} ({pinned.type.toUpperCase()})
                    </h4>
                    <button
                      onClick={() => setPinnedCharts(prev => prev.filter(c => c.id !== pinned.id))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderSelectedChart(pinned, pData, pPalette)}
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
};

function renderSelectedChart(config: ChartConfig, data: any[], palette: string[]) {
  const tooltipStyle = { 
    backgroundColor: '#0f172a', 
    borderColor: '#334155', 
    borderRadius: '10px', 
    color: '#fff',
    fontSize: '12px'
  };

  switch (config.type) {
    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill={palette[0]} radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={`bar-${i}`} fill={palette[i % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      );

    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke={palette[0]} strokeWidth={3} dot={{ r: 4, fill: palette[0] }} />
        </LineChart>
      );

    case 'area':
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaStudioGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={palette[0]} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={palette[0]} stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke={palette[0]} strokeWidth={2.5} fillOpacity={1} fill="url(#areaStudioGrad)" />
        </AreaChart>
      );

    case 'pie':
    case 'donut':
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={config.type === 'donut' ? 65 : 0}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
        </PieChart>
      );

    case 'histogram':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="bin" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" fill={palette[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      );

    case 'scatter':
      return (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis type="number" dataKey="x" name={config.xAxis} stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis type="number" dataKey="y" name={config.yAxis} stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} />
          <Scatter name="Data Points" data={data} fill={palette[0]} />
        </ScatterChart>
      );

    default:
      return <div>Unsupported chart format</div>;
  }
}
