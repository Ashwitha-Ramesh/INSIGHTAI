import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Search, 
  Filter, 
  Layers, 
  ArrowRight, 
  Zap,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseFile, analyzeDataset } from '../../lib/dataEngine';
import { SAMPLE_DATASETS } from '../../lib/sampleDatasets';
import { DatasetAnalysis, ActivePage } from '../../types';

interface UploadPageProps {
  currentDataset: DatasetAnalysis | null;
  onDatasetLoaded: (analysis: DatasetAnalysis) => void;
  setActivePage: (page: ActivePage) => void;
  onShowToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  currentDataset,
  onDatasetLoaded,
  setActivePage,
  onShowToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [previewSearch, setPreviewSearch] = useState('');
  const [selectedColumnFilter, setSelectedColumnFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setParseProgress(20);

      const timer = setInterval(() => {
        setParseProgress(prev => (prev < 85 ? prev + 15 : prev));
      }, 80);

      const parsed = await parseFile(file);
      clearInterval(timer);
      setParseProgress(95);

      const analysis = analyzeDataset(parsed.rows, file.name, file.size);
      setParseProgress(100);

      setTimeout(() => {
        setIsProcessing(false);
        setParseProgress(0);
        onDatasetLoaded(analysis);
        onShowToast('Dataset Loaded Successfully', `Parsed ${analysis.totalRows.toLocaleString()} rows and ${analysis.totalCols} columns.`, 'success');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }, 300);

    } catch (err: any) {
      setIsProcessing(false);
      setParseProgress(0);
      onShowToast('File Parsing Error', err?.message || 'Failed to read spreadsheet.', 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_DATASETS.find(s => s.id === sampleId);
    if (!sample) return;
    setIsProcessing(true);
    setTimeout(() => {
      const analysis = analyzeDataset(sample.data, sample.filename, sample.rowCount * 120);
      setIsProcessing(false);
      onDatasetLoaded(analysis);
      onShowToast('Sample Dataset Loaded', `Loaded '${sample.name}' with ${analysis.totalRows} records.`, 'success');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }, 250);
  };

  // Filter preview rows
  const filteredRows = (currentDataset?.rawData || []).filter(row => {
    if (!previewSearch) return true;
    return Object.values(row).some(v => 
      String(v ?? '').toLowerCase().includes(previewSearch.toLowerCase())
    );
  });

  return (
    <div id="upload-page-container" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dataset Uploader & Inspector</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Import CSV or Excel sheets. Data is parsed and analyzed 100% locally in your browser memory.
          </p>
        </div>

        {currentDataset && (
          <button
            onClick={() => setActivePage('analysis')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all self-start"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Dropzone */}
      <div
        id="file-dropzone"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {isDragging ? 'Drop file here to upload' : 'Click to browse or drag and drop spreadsheet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">
            Supports CSV, Excel (.xlsx, .xls), and TSV files up to 50MB
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-indigo-400 bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-900/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero server upload • Processed directly in browser Web Worker</span>
          </div>

          {/* Progress bar if processing */}
          {isProcessing && (
            <div className="w-full mt-6">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                <span>Analyzing schema & statistical variance...</span>
                <span>{parseProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
                  style={{ width: `${parseProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset Ready-to-use Sample Datasets */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-white">Or test instantly with preloaded sample datasets:</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_DATASETS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample.id)}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {sample.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {sample.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono">{sample.rowCount} records</span>
                <span className="text-indigo-400 group-hover:underline font-medium">Load Preset →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Preview & Schema Inspector (If loaded) */}
      {currentDataset && (
        <div className="space-y-6">
          
          {/* Column Summary Cards */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Detected Schema & Variables</h3>
                <p className="text-xs text-slate-400">{currentDataset.columns.length} columns cataloged</p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {currentDataset.totalRows.toLocaleString()} total rows
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {currentDataset.columns.map((col) => (
                <div
                  key={col.name}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold ${
                      col.type === 'numeric' ? 'bg-indigo-500/20 text-indigo-300' :
                      col.type === 'date' ? 'bg-amber-500/20 text-amber-300' :
                      col.type === 'boolean' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {col.type}
                    </span>
                    {col.missingCount > 0 && (
                      <span className="text-[9px] text-amber-400 font-mono" title={`${col.missingCount} missing`}>
                        {col.missingPercentage}% null
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white truncate" title={col.name}>
                    {col.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {col.type === 'numeric' && col.mean !== undefined ? (
                      <span>Avg: {col.mean.toLocaleString()}</span>
                    ) : (
                      <span>{col.uniqueCount} distinct</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Data Table Preview */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Live Data Table Preview</h3>
                <p className="text-xs text-slate-400">Showing first {Math.min(100, filteredRows.length)} rows of {currentDataset.totalRows.toLocaleString()}</p>
              </div>

              {/* Table Search */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={previewSearch}
                  onChange={(e) => setPreviewSearch(e.target.value)}
                  placeholder="Filter preview rows..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-slate-400">#</th>
                    {currentDataset.columnNames.map((colName) => (
                      <th key={colName} className="px-4 py-3 whitespace-nowrap">
                        {colName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredRows.slice(0, 100).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-2.5 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      {currentDataset.columnNames.map((colName) => {
                        const cellVal = row[colName];
                        const isNull = cellVal === null || cellVal === undefined || cellVal === '';

                        return (
                          <td key={colName} className="px-4 py-2.5 whitespace-nowrap">
                            {isNull ? (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                                null
                              </span>
                            ) : (
                              <span>{String(cellVal)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
