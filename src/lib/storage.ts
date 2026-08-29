import { DatasetAnalysis, HistoryEntry, UserSettings } from '../types';

const STORAGE_KEYS = {
  CURRENT_ANALYSIS: 'insightai_current_analysis',
  HISTORY: 'insightai_history',
  SETTINGS: 'insightai_settings',
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: 'indigo',
  layoutDensity: 'comfortable',
  reduceAnimations: false,
  largerText: false,
  autoDetectDates: true,
  exportFormat: 'pdf',
  notificationsEnabled: true,
};

/**
 * Safe local storage setter with quota handling
 */
function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`LocalStorage quota exceeded for key ${key}, attempting cleanup...`, e);
    try {
      // Try to clear history items or sample data
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ANALYSIS);
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}

export function saveCurrentAnalysis(analysis: DatasetAnalysis): void {
  try {
    // If rawData is huge, slice sample rows for local storage cache while preserving stats
    const storableAnalysis = {
      ...analysis,
      rawData: analysis.rawData.length > 2000 ? analysis.rawData.slice(0, 2000) : analysis.rawData,
    };
    safeSetItem(STORAGE_KEYS.CURRENT_ANALYSIS, JSON.stringify(storableAnalysis));
    
    // Add to history
    addHistoryEntry(analysis);
  } catch (err) {
    console.error('Failed to save analysis to local storage:', err);
  }
}

export function loadCurrentAnalysis(): DatasetAnalysis | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ANALYSIS);
    if (!data) return null;
    return JSON.parse(data) as DatasetAnalysis;
  } catch (err) {
    console.error('Failed to load current analysis from local storage:', err);
    return null;
  }
}

export function clearCurrentAnalysis(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ANALYSIS);
  } catch (err) {
    console.error('Failed to clear current analysis:', err);
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!data) return [];
    return JSON.parse(data) as HistoryEntry[];
  } catch (err) {
    console.error('Failed to load history:', err);
    return [];
  }
}

export function addHistoryEntry(analysis: DatasetAnalysis): void {
  try {
    const existing = getHistory();
    // Avoid duplicate entry if same id or same file within 1 minute
    const filtered = existing.filter(h => h.id !== analysis.id && h.datasetName !== analysis.fileName);
    
    const numericCols = analysis.columns.filter(c => c.type === 'numeric');
    const keyMetrics = numericCols.slice(0, 3).map(c => ({
      label: c.name,
      value: c.mean !== undefined ? c.mean.toLocaleString() : 'N/A',
    }));

    const topInsight = analysis.insights[0]?.title || `Analyzed ${analysis.totalRows} rows`;

    const newEntry: HistoryEntry = {
      id: analysis.id,
      datasetName: analysis.fileName,
      uploadedAt: analysis.uploadedAt,
      rowCount: analysis.totalRows,
      colCount: analysis.totalCols,
      qualityScore: analysis.quality.dataQualityScore,
      qualityGrade: analysis.quality.qualityGrade,
      topInsight,
      keyMetrics,
      rawDataSample: analysis.rawData.slice(0, 50),
      columnNames: analysis.columnNames,
    };

    const updated = [newEntry, ...filtered].slice(0, 20); // Keep last 20 entries
    safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update history:', err);
  }
}

export function removeHistoryEntry(id: string): void {
  try {
    const existing = getHistory();
    const updated = existing.filter(h => h.id !== id);
    safeSetItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove history entry:', err);
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ANALYSIS);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    safeSetItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}
