export type DataType = 'numeric' | 'categorical' | 'date' | 'boolean';

export interface ColumnSummary {
  name: string;
  type: DataType;
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  uniqueValuesSample: (string | number)[];
  isIdOrConstant: boolean;
  
  // Numeric Stats
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  std?: number;
  q1?: number;
  q3?: number;
  iqr?: number;
  skewness?: number;
  outliersCount?: number;
  distributionBins?: { bin: string; count: number; start: number; end: number }[];

  // Categorical Stats
  topFrequencies?: { label: string; count: number; percentage: number }[];

  // Date Stats
  minDate?: string;
  maxDate?: string;
  dateRangeDays?: number;
}

export interface CorrelationPair {
  col1: string;
  col2: string;
  score: number;
  strength: 'Very Strong +' | 'Strong +' | 'Moderate +' | 'Weak' | 'Moderate -' | 'Strong -' | 'Very Strong -';
  description: string;
}

export interface OutlierItem {
  column: string;
  value: number;
  rowIdx: number;
  zScore: number;
  iqrDeviation: number;
  severity: 'high' | 'medium' | 'low';
  reason: string;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'outlier' | 'distribution' | 'correlation' | 'quality' | 'category' | 'growth' | 'actionable';
  severity: 'critical' | 'warning' | 'info' | 'positive';
  title: string;
  description: string;
  metric?: string;
  impact?: string;
  suggestion?: string;
  tags: string[];
}

export interface DatasetQuality {
  dataQualityScore: number; // 0 - 100
  qualityGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  totalCells: number;
  missingCells: number;
  missingRate: number;
  duplicateRows: number;
  duplicateRate: number;
  memoryEstimate: string;
  completenessScore: number;
  consistencyScore: number;
}

export interface DatasetAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  totalRows: number;
  totalCols: number;
  columnNames: string[];
  columns: ColumnSummary[];
  quality: DatasetQuality;
  correlations: CorrelationPair[];
  outliers: OutlierItem[];
  insights: AIInsight[];
  recommendations: string[];
  rawData: Record<string, any>[];
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'histogram' | 'scatter' | 'correlation';
export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none';

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  xAxis: string;
  yAxis: string;
  secondaryYAxis?: string;
  aggregation: AggregationType;
  colorScheme: string;
  sortOrder: 'asc' | 'desc' | 'none';
  limit: number;
  filterCol?: string;
  filterVal?: string;
  filterOperator?: 'equals' | 'contains' | 'gt' | 'lt';
}

export interface HistoryEntry {
  id: string;
  datasetName: string;
  uploadedAt: string;
  rowCount: number;
  colCount: number;
  qualityScore: number;
  qualityGrade: string;
  topInsight: string;
  keyMetrics: { label: string; value: string }[];
  rawDataSample: Record<string, any>[];
  columnNames: string[];
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'indigo' | 'emerald' | 'violet' | 'cyan' | 'amber';
  layoutDensity: 'comfortable' | 'compact';
  reduceAnimations: boolean;
  largerText: boolean;
  autoDetectDates: boolean;
  exportFormat: 'pdf' | 'csv' | 'json';
  notificationsEnabled: boolean;
}

export interface AskQueryResult {
  query: string;
  intent: 'summary' | 'top_bottom' | 'average' | 'correlation' | 'outliers' | 'missing' | 'trend' | 'distribution' | 'unsupported';
  title: string;
  answer: string;
  dataPoints?: { label: string; value: string | number }[];
  recommendedChart?: Partial<ChartConfig>;
  suggestions?: string[];
}

export type ActivePage = 'dashboard' | 'upload' | 'analysis' | 'visualizations' | 'reports' | 'history' | 'settings';
