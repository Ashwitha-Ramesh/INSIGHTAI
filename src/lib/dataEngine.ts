import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  ColumnSummary,
  CorrelationPair,
  OutlierItem,
  AIInsight,
  DatasetQuality,
  DatasetAnalysis,
  AskQueryResult,
  DataType,
  ChartConfig
} from '../types';

/**
 * Parses a File object (CSV or Excel) into JSON rows
 */
export async function parseFile(file: File): Promise<{ rows: Record<string, any>[]; columnNames: string[] }> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv' || extension === 'txt') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            reject(new Error(`CSV Parsing error: ${results.errors[0].message}`));
            return;
          }
          const rawRows = results.data as Record<string, any>[];
          if (!rawRows || rawRows.length === 0) {
            reject(new Error('The uploaded CSV file is empty.'));
            return;
          }
          const columns = Object.keys(rawRows[0] || {}).map(c => c.trim()).filter(Boolean);
          const cleanedRows = rawRows.map(row => {
            const cleaned: Record<string, any> = {};
            for (const col of columns) {
              cleaned[col] = row[col] !== undefined && row[col] !== null ? String(row[col]).trim() : '';
            }
            return cleaned;
          });
          resolve({ rows: cleanedRows, columnNames: columns });
        },
        error: (err) => reject(err),
      });
    });
  } else if (extension === 'xlsx' || extension === 'xls') {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('No sheets found in Excel file');
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
    if (!rawRows || rawRows.length === 0) {
      throw new Error('The uploaded Excel sheet contains no data.');
    }
    const columns = Object.keys(rawRows[0] || {}).map(c => c.trim()).filter(Boolean);
    const cleanedRows = rawRows.map(row => {
      const cleaned: Record<string, any> = {};
      for (const col of columns) {
        cleaned[col] = row[col] !== undefined && row[col] !== null ? String(row[col]).trim() : '';
      }
      return cleaned;
    });
    return { rows: cleanedRows, columnNames: columns };
  } else {
    throw new Error('Unsupported file format. Please upload a .csv or .xlsx / .xls file.');
  }
}

/**
 * Checks if a string looks like a standard number or formatted currency/percent
 */
function tryParseNumber(val: any): { isNum: boolean; numVal: number } {
  if (val === null || val === undefined || val === '') {
    return { isNum: false, numVal: NaN };
  }
  if (typeof val === 'number') {
    return { isNum: !isNaN(val), numVal: val };
  }
  let str = String(val).trim();
  // Remove currency signs, commas, and percentage
  str = str.replace(/[$€£¥₹]/g, '').replace(/,/g, '');
  if (str.endsWith('%')) {
    const pVal = parseFloat(str.slice(0, -1));
    return { isNum: !isNaN(pVal), numVal: pVal / 100 };
  }
  const n = Number(str);
  return { isNum: !isNaN(n) && str.length > 0, numVal: n };
}

/**
 * Checks if a string looks like a date
 */
function tryParseDate(val: any): { isDate: boolean; dateObj: Date | null } {
  if (!val || typeof val !== 'string') return { isDate: false, dateObj: null };
  const str = val.trim();
  if (str.length < 4 || /^\d+$/.test(str) && str.length !== 8) {
    return { isDate: false, dateObj: null };
  }
  // Check common date formats
  const date = new Date(str);
  const isValid = !isNaN(date.getTime()) && date.getFullYear() > 1950 && date.getFullYear() < 2100;
  return { isDate: isValid, dateObj: isValid ? date : null };
}

/**
 * Primary client-side statistical and algorithmic analysis engine
 */
export function analyzeDataset(rows: Record<string, any>[], fileName: string, fileSize: number = 0): DatasetAnalysis {
  const id = `ds_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const totalRows = rows.length;
  const columnNames = totalRows > 0 ? Object.keys(rows[0]) : [];
  const totalCols = columnNames.length;
  const totalCells = totalRows * totalCols;

  // 1. Detect column types & collect raw values
  const colSummaries: ColumnSummary[] = [];
  const parsedRows: Record<string, any>[] = [];

  // Parse type for each column
  for (const col of columnNames) {
    let missingCount = 0;
    const values: any[] = [];
    const numericVals: number[] = [];
    const dateVals: Date[] = [];
    const freqMap: Record<string, number> = {};

    let numCount = 0;
    let dateCount = 0;
    let boolCount = 0;
    let nonNullCount = 0;

    for (let r = 0; r < totalRows; r++) {
      const raw = rows[r][col];
      const isMissing = raw === undefined || raw === null || String(raw).trim() === '' || String(raw).toLowerCase() === 'nan' || String(raw).toLowerCase() === 'null' || String(raw).toLowerCase() === 'n/a';
      
      if (isMissing) {
        missingCount++;
        values.push(null);
      } else {
        nonNullCount++;
        const sVal = String(raw).trim();
        values.push(sVal);
        freqMap[sVal] = (freqMap[sVal] || 0) + 1;

        if (sVal.toLowerCase() === 'true' || sVal.toLowerCase() === 'false' || sVal.toLowerCase() === 'yes' || sVal.toLowerCase() === 'no') {
          boolCount++;
        }

        const numRes = tryParseNumber(sVal);
        if (numRes.isNum) {
          numCount++;
          numericVals.push(numRes.numVal);
        }

        const dateRes = tryParseDate(sVal);
        if (dateRes.isDate && dateRes.dateObj) {
          dateCount++;
          dateVals.push(dateRes.dateObj);
        }
      }
    }

    // Determine type
    let colType: DataType = 'categorical';
    if (nonNullCount > 0) {
      if (numCount / nonNullCount > 0.75) {
        colType = 'numeric';
      } else if (dateCount / nonNullCount > 0.75) {
        colType = 'date';
      } else if (boolCount / nonNullCount > 0.85) {
        colType = 'boolean';
      }
    }

    const uniqueKeys = Object.keys(freqMap);
    const uniqueCount = uniqueKeys.length;
    const missingPercentage = totalRows > 0 ? (missingCount / totalRows) * 100 : 0;
    const isIdOrConstant = uniqueCount === totalRows || uniqueCount <= 1;

    const summary: ColumnSummary = {
      name: col,
      type: colType,
      missingCount,
      missingPercentage: parseFloat(missingPercentage.toFixed(2)),
      uniqueCount,
      uniqueValuesSample: uniqueKeys.slice(0, 10),
      isIdOrConstant,
    };

    // Calculate Numeric Statistics
    if (colType === 'numeric' && numericVals.length > 0) {
      numericVals.sort((a, b) => a - b);
      const n = numericVals.length;
      const min = numericVals[0];
      const max = numericVals[n - 1];
      const sum = numericVals.reduce((acc, val) => acc + val, 0);
      const mean = sum / n;
      
      // Median
      const mid = Math.floor(n / 2);
      const median = n % 2 !== 0 ? numericVals[mid] : (numericVals[mid - 1] + numericVals[mid]) / 2;

      // Q1, Q3, IQR
      const q1Idx = Math.floor(n * 0.25);
      const q3Idx = Math.floor(n * 0.75);
      const q1 = numericVals[q1Idx];
      const q3 = numericVals[q3Idx];
      const iqr = q3 - q1;

      // Standard Deviation
      const variance = numericVals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n > 1 ? n - 1 : 1);
      const std = Math.sqrt(variance);

      // Skewness (Fisher-Pearson)
      let skewness = 0;
      if (std > 0 && n > 2) {
        const m3 = numericVals.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
        skewness = m3 / Math.pow(std, 3);
      }

      // Count outliers via IQR (1.5 IQR rule)
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      const outliers = numericVals.filter(v => v < lowerBound || v > upperBound);

      // Distribution Bins (10 bins)
      const numBins = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(n))));
      const binWidth = (max - min) / (numBins || 1);
      const bins: { bin: string; count: number; start: number; end: number }[] = [];

      if (binWidth > 0) {
        for (let b = 0; b < numBins; b++) {
          const bStart = min + b * binWidth;
          const bEnd = b === numBins - 1 ? max : min + (b + 1) * binWidth;
          const count = numericVals.filter(v => v >= bStart && (b === numBins - 1 ? v <= bEnd : v < bEnd)).length;
          bins.push({
            bin: `${formatShortNumber(bStart)} - ${formatShortNumber(bEnd)}`,
            count,
            start: bStart,
            end: bEnd,
          });
        }
      } else {
        bins.push({ bin: formatShortNumber(min), count: n, start: min, end: max });
      }

      summary.min = parseFloat(min.toFixed(4));
      summary.max = parseFloat(max.toFixed(4));
      summary.mean = parseFloat(mean.toFixed(4));
      summary.median = parseFloat(median.toFixed(4));
      summary.std = parseFloat(std.toFixed(4));
      summary.q1 = parseFloat(q1.toFixed(4));
      summary.q3 = parseFloat(q3.toFixed(4));
      summary.iqr = parseFloat(iqr.toFixed(4));
      summary.skewness = parseFloat(skewness.toFixed(3));
      summary.outliersCount = outliers.length;
      summary.distributionBins = bins;
    }

    // Categorical frequencies
    if (colType === 'categorical' || colType === 'boolean') {
      const topFrequencies = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, count]) => ({
          label,
          count,
          percentage: totalRows > 0 ? parseFloat(((count / totalRows) * 100).toFixed(1)) : 0,
        }));
      summary.topFrequencies = topFrequencies;
    }

    // Date stats
    if (colType === 'date' && dateVals.length > 0) {
      dateVals.sort((a, b) => a.getTime() - b.getTime());
      const minD = dateVals[0];
      const maxD = dateVals[dateVals.length - 1];
      const diffTime = Math.abs(maxD.getTime() - minD.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      summary.minDate = minD.toISOString().split('T')[0];
      summary.maxDate = maxD.toISOString().split('T')[0];
      summary.dateRangeDays = diffDays;
    }

    colSummaries.push(summary);
  }

  // 2. Prepare structured cleaned rawData rows with parsed numeric and date types for charting
  for (let r = 0; r < totalRows; r++) {
    const cleanRow: Record<string, any> = {};
    for (const col of colSummaries) {
      const rawVal = rows[r][col.name];
      if (rawVal === undefined || rawVal === null || rawVal === '') {
        cleanRow[col.name] = null;
      } else if (col.type === 'numeric') {
        const p = tryParseNumber(rawVal);
        cleanRow[col.name] = p.isNum ? p.numVal : null;
      } else {
        cleanRow[col.name] = String(rawVal).trim();
      }
    }
    parsedRows.push(cleanRow);
  }

  // 3. Duplicate Rows Detection
  const rowHashTracker = new Set<string>();
  let duplicateRows = 0;
  for (const row of parsedRows) {
    const hash = JSON.stringify(row);
    if (rowHashTracker.has(hash)) {
      duplicateRows++;
    } else {
      rowHashTracker.add(hash);
    }
  }

  const missingCells = colSummaries.reduce((acc, c) => acc + c.missingCount, 0);
  const missingRate = totalCells > 0 ? (missingCells / totalCells) * 100 : 0;
  const duplicateRate = totalRows > 0 ? (duplicateRows / totalRows) * 100 : 0;

  // Data Quality Score formula
  const completeness = Math.max(0, 100 - missingRate * 2.5);
  const deduplication = Math.max(0, 100 - duplicateRate * 3.0);
  const qualityScore = Math.round(completeness * 0.6 + deduplication * 0.4);

  let qualityGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A+';
  if (qualityScore >= 95) qualityGrade = 'A+';
  else if (qualityScore >= 85) qualityGrade = 'A';
  else if (qualityScore >= 70) qualityGrade = 'B';
  else if (qualityScore >= 50) qualityGrade = 'C';
  else qualityGrade = 'D';

  const quality: DatasetQuality = {
    dataQualityScore: qualityScore,
    qualityGrade,
    totalCells,
    missingCells,
    missingRate: parseFloat(missingRate.toFixed(2)),
    duplicateRows,
    duplicateRate: parseFloat(duplicateRate.toFixed(2)),
    memoryEstimate: `${(totalCells * 8 / 1024).toFixed(1)} KB`,
    completenessScore: Math.round(completeness),
    consistencyScore: Math.round(deduplication),
  };

  // 4. Pearson Correlation Matrix for numeric columns
  const numericCols = colSummaries.filter(c => c.type === 'numeric' && c.uniqueCount > 1);
  const correlations: CorrelationPair[] = [];

  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i].name;
      const col2 = numericCols[j].name;
      
      const pairs: [number, number][] = [];
      for (const row of parsedRows) {
        if (typeof row[col1] === 'number' && typeof row[col2] === 'number') {
          pairs.push([row[col1], row[col2]]);
        }
      }

      if (pairs.length > 5) {
        const n = pairs.length;
        const mean1 = pairs.reduce((acc, p) => acc + p[0], 0) / n;
        const mean2 = pairs.reduce((acc, p) => acc + p[1], 0) / n;

        let num = 0;
        let den1 = 0;
        let den2 = 0;

        for (const [x, y] of pairs) {
          const dx = x - mean1;
          const dy = y - mean2;
          num += dx * dy;
          den1 += dx * dx;
          den2 += dy * dy;
        }

        const r = den1 > 0 && den2 > 0 ? num / Math.sqrt(den1 * den2) : 0;
        const absR = Math.abs(r);

        let strength: CorrelationPair['strength'] = 'Weak';
        if (absR >= 0.8) strength = r > 0 ? 'Very Strong +' : 'Very Strong -';
        else if (absR >= 0.6) strength = r > 0 ? 'Strong +' : 'Strong -';
        else if (absR >= 0.35) strength = r > 0 ? 'Moderate +' : 'Moderate -';

        let description = `Neutral relationship between ${col1} and ${col2}.`;
        if (absR >= 0.6) {
          description = r > 0 
            ? `Higher values in ${col1} strongly coincide with increased ${col2}.`
            : `Increases in ${col1} correspond with a steep drop in ${col2}.`;
        }

        correlations.push({
          col1,
          col2,
          score: parseFloat(r.toFixed(3)),
          strength,
          description,
        });
      }
    }
  }

  correlations.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  // 5. Outlier Detection
  const outliers: OutlierItem[] = [];
  for (const col of numericCols) {
    if (col.mean !== undefined && col.std !== undefined && col.std > 0) {
      for (let r = 0; r < parsedRows.length; r++) {
        const val = parsedRows[r][col.name];
        if (typeof val === 'number') {
          const zScore = (val - col.mean) / col.std;
          const absZ = Math.abs(zScore);
          if (absZ >= 2.5) {
            const severity = absZ >= 4 ? 'high' : absZ >= 3 ? 'medium' : 'low';
            outliers.push({
              column: col.name,
              value: val,
              rowIdx: r + 1,
              zScore: parseFloat(zScore.toFixed(2)),
              iqrDeviation: col.iqr && col.iqr > 0 ? parseFloat((Math.abs(val - (col.median ?? col.mean)) / col.iqr).toFixed(2)) : 0,
              severity,
              reason: `Value ${formatShortNumber(val)} is ${absZ.toFixed(1)} standard deviations from the mean (${formatShortNumber(col.mean)}).`,
            });
          }
        }
      }
    }
  }

  outliers.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));

  // 6. Generate Rule-Based AI Insights & Recommendations
  const insights: AIInsight[] = [];
  const recommendations: string[] = [];

  // A. Quality & Missing Data Insight
  if (missingRate > 0) {
    const worstCols = [...colSummaries].sort((a, b) => b.missingPercentage - a.missingPercentage).filter(c => c.missingCount > 0);
    insights.push({
      id: 'ins_missing_1',
      type: 'quality',
      severity: missingRate > 15 ? 'warning' : 'info',
      title: `${missingRate.toFixed(1)}% Missing Data Detected`,
      description: `Found ${missingCells.toLocaleString()} missing cell values across ${worstCols.length} columns. Most affected: ${worstCols.slice(0, 3).map(c => `${c.name} (${c.missingPercentage}%)`).join(', ')}.`,
      metric: `${missingRate.toFixed(1)}% empty`,
      impact: 'Missing fields can distort statistical aggregations and lead to biased averages.',
      suggestion: 'Apply mean/median imputation for numeric columns, or filter incomplete rows before running critical models.',
      tags: ['Data Hygiene', 'Completeness'],
    });
    recommendations.push(`Audit missing data in '${worstCols[0]?.name}' to ensure reporting accuracy.`);
  } else {
    insights.push({
      id: 'ins_missing_clean',
      type: 'quality',
      severity: 'positive',
      title: 'Pristine Data Completeness (100%)',
      description: 'Zero missing values detected across all columns. The dataset is fully populated and ready for immediate statistical processing.',
      metric: '100% Complete',
      tags: ['High Quality', 'Verified'],
    });
  }

  // B. Duplicates Insight
  if (duplicateRows > 0) {
    insights.push({
      id: 'ins_dup_1',
      type: 'quality',
      severity: duplicateRate > 5 ? 'warning' : 'info',
      title: `${duplicateRows} Duplicate Rows Identified`,
      description: `${duplicateRate.toFixed(1)}% of rows are exact carbon copies. This may skew counts and weighted totals.`,
      metric: `${duplicateRows} duplicates`,
      suggestion: 'Consider de-duplicating the dataset prior to final KPI reporting.',
      tags: ['Deduplication', 'Integrity'],
    });
    recommendations.push(`Remove ${duplicateRows} redundant duplicate rows to normalize variance.`);
  }

  // C. Correlation Insights
  const topStrongPos = correlations.find(c => c.score >= 0.7);
  if (topStrongPos) {
    insights.push({
      id: 'ins_corr_pos',
      type: 'correlation',
      severity: 'positive',
      title: `Strong Positive Link: ${topStrongPos.col1} ↔ ${topStrongPos.col2}`,
      description: `A Pearson correlation of +${topStrongPos.score.toFixed(2)} reveals that increases in ${topStrongPos.col1} strongly track growth in ${topStrongPos.col2}.`,
      metric: `r = +${topStrongPos.score}`,
      impact: 'High co-movement indicates potential driver or direct causal relationship.',
      suggestion: `Use ${topStrongPos.col1} as a predictive leading indicator for ${topStrongPos.col2}.`,
      tags: ['Correlation', 'Synergy'],
    });
    recommendations.push(`Leverage ${topStrongPos.col1} and ${topStrongPos.col2} co-dependence in forecasting workflows.`);
  }

  const topStrongNeg = correlations.find(c => c.score <= -0.6);
  if (topStrongNeg) {
    insights.push({
      id: 'ins_corr_neg',
      type: 'correlation',
      severity: 'warning',
      title: `Inverse Trade-off: ${topStrongNeg.col1} ↔ ${topStrongNeg.col2}`,
      description: `A significant negative correlation of ${topStrongNeg.score.toFixed(2)} indicates that higher ${topStrongNeg.col1} systematically suppresses ${topStrongNeg.col2}.`,
      metric: `r = ${topStrongNeg.score}`,
      impact: 'Balancing these two variables requires trade-off optimization.',
      suggestion: `Investigate operational friction or negative externalities between ${topStrongNeg.col1} and ${topStrongNeg.col2}.`,
      tags: ['Trade-off', 'Optimization'],
    });
  }

  // D. Outliers Insight
  if (outliers.length > 0) {
    const highOutliers = outliers.filter(o => o.severity === 'high');
    const targetOutlier = highOutliers[0] || outliers[0];
    insights.push({
      id: 'ins_outliers',
      type: 'outlier',
      severity: highOutliers.length > 0 ? 'critical' : 'warning',
      title: `${outliers.length} Statistical Anomalies Detected`,
      description: `Extreme values found in column '${targetOutlier.column}'. For instance, row #${targetOutlier.rowIdx} features a value of ${formatShortNumber(targetOutlier.value)} (${targetOutlier.zScore > 0 ? '+' : ''}${targetOutlier.zScore}σ from mean).`,
      metric: `${outliers.length} anomalies`,
      impact: 'Extreme outliers can heavily distort standard averages and linear projections.',
      suggestion: 'Inspect whether these represent genuine black-swan events or data entry anomalies.',
      tags: ['Anomalies', 'Outlier Analysis'],
    });
    recommendations.push(`Investigate row #${targetOutlier.rowIdx} in '${targetOutlier.column}' for possible measurement anomaly.`);
  }

  // E. Dominant Category Distribution (Pareto Principle)
  const catCols = colSummaries.filter(c => (c.type === 'categorical' || c.type === 'boolean') && c.uniqueCount >= 2 && c.uniqueCount <= 50);
  if (catCols.length > 0 && catCols[0].topFrequencies && catCols[0].topFrequencies.length > 0) {
    const primaryCat = catCols[0];
    const topFreq = primaryCat.topFrequencies[0];
    if (topFreq.percentage >= 40) {
      insights.push({
        id: 'ins_cat_dominant',
        type: 'category',
        severity: 'info',
        title: `Concentrated Segment: ${topFreq.label} (${topFreq.percentage}%)`,
        description: `In '${primaryCat.name}', the segment '${topFreq.label}' accounts for ${topFreq.count.toLocaleString()} out of ${totalRows.toLocaleString()} total records (${topFreq.percentage}% share).`,
        metric: `${topFreq.percentage}% dominance`,
        impact: 'High concentration presents both a core operational stronghold and a dependency risk.',
        suggestion: `Segment your strategy to cater specifically to '${topFreq.label}' while fostering growth in smaller segments.`,
        tags: ['Segmentation', 'Category Breakdown'],
      });
    }
  }

  // F. Skewness and Distribution Insight
  const highlySkewed = numericCols.find(c => c.skewness !== undefined && Math.abs(c.skewness) > 1.5);
  if (highlySkewed) {
    const dir = (highlySkewed.skewness || 0) > 0 ? 'right (positive)' : 'left (negative)';
    insights.push({
      id: 'ins_skew',
      type: 'distribution',
      severity: 'info',
      title: `Asymmetric Distribution in '${highlySkewed.name}'`,
      description: `The metric '${highlySkewed.name}' exhibits heavy ${dir} skewness (skew = ${highlySkewed.skewness}). The mean (${formatShortNumber(highlySkewed.mean || 0)}) diverges markedly from the median (${formatShortNumber(highlySkewed.median || 0)}).`,
      metric: `Skew ${highlySkewed.skewness}`,
      impact: 'Using arithmetic mean will give a misleading picture for skewed populations.',
      suggestion: `Prefer median and percentile brackets (P25/P75) over simple mean when evaluating '${highlySkewed.name}'.`,
      tags: ['Statistics', 'Distribution'],
    });
    recommendations.push(`Use median instead of mean for '${highlySkewed.name}' due to significant skewness.`);
  }

  // G. Time Trend / Velocity Insight (if date column exists)
  const dateCol = colSummaries.find(c => c.type === 'date');
  if (dateCol && dateCol.dateRangeDays) {
    insights.push({
      id: 'ins_time_trend',
      type: 'trend',
      severity: 'positive',
      title: `Temporal Span: ${dateCol.dateRangeDays} Days Captured`,
      description: `Data chronologically extends from ${dateCol.minDate} to ${dateCol.maxDate} in column '${dateCol.name}'. Enables reliable timeline trend visualization and moving averages.`,
      metric: `${dateCol.dateRangeDays}d range`,
      tags: ['Time Series', 'Trend Analysis'],
    });
  }

  // Fallback insights if few
  if (insights.length < 3) {
    insights.push({
      id: 'ins_baseline_1',
      type: 'actionable',
      severity: 'info',
      title: `Dataset Topology: ${totalRows.toLocaleString()} Rows × ${totalCols} Columns`,
      description: `Successfully cataloged ${numericCols.length} numeric variables and ${catCols.length} categorical dimensions.`,
      metric: `${totalRows} records`,
      tags: ['Overview', 'Structure'],
    });
  }

  return {
    id,
    fileName,
    fileSize,
    fileType: fileName.split('.').pop()?.toUpperCase() || 'DATA',
    uploadedAt: new Date().toISOString(),
    totalRows,
    totalCols,
    columnNames,
    columns: colSummaries,
    quality,
    correlations,
    outliers,
    insights,
    recommendations,
    rawData: parsedRows,
  };
}

/**
 * Formats large/small numbers with clean compact SI units (e.g. 1.2M, 45.3K)
 */
export function formatShortNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (abs >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (abs >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  if (abs < 0.01 && abs > 0) return num.toExponential(2);
  return Number.isInteger(num) ? num.toLocaleString() : num.toFixed(2);
}

/**
 * Local Natural Language "Ask Your Data" Query Interpreter
 */
export function queryDataEngine(rawQuery: string, analysis: DatasetAnalysis): AskQueryResult {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return {
      query: rawQuery,
      intent: 'unsupported',
      title: 'Empty Query',
      answer: 'Please type a question about your dataset, such as "What is the average sales?", "Show top categories", or "Are there any outliers?".',
      suggestions: [
        'What is the highest value in the data?',
        'Which category appears most often?',
        'Are there any correlations?',
        'Show data quality and missing values',
      ],
    };
  }

  const numericCols = analysis.columns.filter(c => c.type === 'numeric');
  const catCols = analysis.columns.filter(c => c.type === 'categorical' || c.type === 'boolean');
  const dateCols = analysis.columns.filter(c => c.type === 'date');

  // Match column names mentioned in query
  const matchedNumericCol = numericCols.find(c => query.includes(c.name.toLowerCase()));
  const matchedCatCol = catCols.find(c => query.includes(c.name.toLowerCase()));
  const matchedAnyCol = analysis.columns.find(c => query.includes(c.name.toLowerCase()));

  // 1. Missing / Quality Query
  if (query.includes('missing') || query.includes('null') || query.includes('quality') || query.includes('duplicate') || query.includes('clean')) {
    const missingCols = analysis.columns.filter(c => c.missingCount > 0);
    const answer = missingCols.length === 0
      ? `The dataset is 100% complete! There are no missing values across all ${analysis.totalCols} columns and ${analysis.totalRows.toLocaleString()} rows. Quality score is ${analysis.quality.dataQualityScore}/100 (Grade ${analysis.quality.qualityGrade}).`
      : `Found ${analysis.quality.missingCells.toLocaleString()} missing cells (${analysis.quality.missingRate}% overall). The columns with highest missing data are: ${missingCols.map(c => `${c.name} (${c.missingPercentage}%)`).join(', ')}. Found ${analysis.quality.duplicateRows} duplicate rows.`;

    return {
      query: rawQuery,
      intent: 'missing',
      title: 'Data Quality & Missing Values Summary',
      answer,
      dataPoints: [
        { label: 'Quality Score', value: `${analysis.quality.dataQualityScore}/100` },
        { label: 'Missing Rate', value: `${analysis.quality.missingRate}%` },
        { label: 'Duplicate Rows', value: analysis.quality.duplicateRows },
        { label: 'Total Cells', value: analysis.quality.totalCells.toLocaleString() },
      ],
      suggestions: ['Show outliers in data', 'What is the summary of numeric columns?', 'Show top categories'],
    };
  }

  // 2. Correlation Query
  if (query.includes('correlat') || query.includes('relationship') || query.includes('co-movement') || query.includes('related')) {
    if (analysis.correlations.length === 0) {
      return {
        query: rawQuery,
        intent: 'correlation',
        title: 'Correlation Analysis',
        answer: 'There are fewer than 2 numeric columns in this dataset to compute correlation coefficients.',
        suggestions: ['Show column distributions', 'Show categorical frequencies'],
      };
    }

    const topCorr = analysis.correlations[0];
    const top3 = analysis.correlations.slice(0, 3);
    return {
      query: rawQuery,
      intent: 'correlation',
      title: 'Top Metric Correlations',
      answer: `The strongest correlation is between "${topCorr.col1}" and "${topCorr.col2}" with a Pearson coefficient of ${topCorr.score > 0 ? '+' : ''}${topCorr.score.toFixed(3)} (${topCorr.strength}). ${topCorr.description}`,
      dataPoints: top3.map(c => ({
        label: `${c.col1} ↔ ${c.col2}`,
        value: `r = ${c.score > 0 ? '+' : ''}${c.score.toFixed(2)} (${c.strength})`,
      })),
      recommendedChart: {
        type: 'scatter',
        xAxis: topCorr.col1,
        yAxis: topCorr.col2,
        title: `${topCorr.col1} vs ${topCorr.col2} Scatter Correlation`,
      },
      suggestions: ['Are there any outliers in these metrics?', 'Show trend over time'],
    };
  }

  // 3. Outlier / Anomaly Query
  if (query.includes('outlier') || query.includes('anomal') || query.includes('unusual') || query.includes('extreme') || query.includes('spike')) {
    if (analysis.outliers.length === 0) {
      return {
        query: rawQuery,
        intent: 'outliers',
        title: 'Outlier & Anomaly Analysis',
        answer: 'No extreme statistical outliers (Z-Score > 2.5σ) were found across your numeric columns. Values reside within expected variance boundaries.',
        suggestions: ['What is the average of each column?', 'Show distributions'],
      };
    }

    const target = matchedNumericCol ? analysis.outliers.filter(o => o.column === matchedNumericCol.name) : analysis.outliers;
    return {
      query: rawQuery,
      intent: 'outliers',
      title: `Outlier Report (${target.length} detected)`,
      answer: `Identified ${target.length} statistically anomalous data points exceeding standard deviation thresholds. The most prominent outlier is in column "${target[0].column}" at row #${target[0].rowIdx} with value ${formatShortNumber(target[0].value)} (${target[0].zScore > 0 ? '+' : ''}${target[0].zScore}σ).`,
      dataPoints: target.slice(0, 4).map(o => ({
        label: `Row #${o.rowIdx} (${o.column})`,
        value: `${formatShortNumber(o.value)} (Z: ${o.zScore > 0 ? '+' : ''}${o.zScore})`,
      })),
      suggestions: ['How to handle these outliers?', 'Show distribution histogram for this column'],
    };
  }

  // 4. Average / Mean / Stats for a specific or all numeric columns
  if (query.includes('average') || query.includes('mean') || query.includes('median') || query.includes('std') || query.includes('summary')) {
    const col = matchedNumericCol || numericCols[0];
    if (col && col.mean !== undefined) {
      return {
        query: rawQuery,
        intent: 'average',
        title: `Statistical Profile: ${col.name}`,
        answer: `For "${col.name}", the average (mean) is ${formatShortNumber(col.mean)}, with a median of ${formatShortNumber(col.median || 0)}. The values range from a minimum of ${formatShortNumber(col.min || 0)} to a maximum of ${formatShortNumber(col.max || 0)} with a standard deviation of ${formatShortNumber(col.std || 0)}.`,
        dataPoints: [
          { label: 'Mean', value: formatShortNumber(col.mean) },
          { label: 'Median', value: formatShortNumber(col.median || 0) },
          { label: 'Min - Max', value: `${formatShortNumber(col.min || 0)} to ${formatShortNumber(col.max || 0)}` },
          { label: 'Std Dev', value: formatShortNumber(col.std || 0) },
        ],
        recommendedChart: {
          type: 'histogram',
          xAxis: col.name,
          title: `Distribution of ${col.name}`,
        },
        suggestions: [`Show outliers in ${col.name}`, `What is the highest value in ${col.name}?`],
      };
    }
  }

  // 5. Highest / Maximum / Lowest / Minimum Query
  if (query.includes('highest') || query.includes('top') || query.includes('max') || query.includes('best') || query.includes('lowest') || query.includes('min') || query.includes('worst')) {
    const isMin = query.includes('lowest') || query.includes('min') || query.includes('worst');
    
    // If categorical column specified or requested top categories
    const catTarget = matchedCatCol || catCols[0];
    const numTarget = matchedNumericCol || numericCols[0];

    if (catTarget && catTarget.topFrequencies && catTarget.topFrequencies.length > 0) {
      const sortedFreq = isMin ? [...catTarget.topFrequencies].reverse() : catTarget.topFrequencies;
      const topOne = sortedFreq[0];
      return {
        query: rawQuery,
        intent: 'top_bottom',
        title: `${isMin ? 'Lowest' : 'Highest'} Frequency in "${catTarget.name}"`,
        answer: `The ${isMin ? 'least common' : 'most frequent'} category in "${catTarget.name}" is "${topOne.label}" with ${topOne.count.toLocaleString()} occurrences (${topOne.percentage}% of dataset).`,
        dataPoints: sortedFreq.slice(0, 5).map(f => ({
          label: f.label,
          value: `${f.count.toLocaleString()} (${f.percentage}%)`,
        })),
        recommendedChart: {
          type: 'bar',
          xAxis: catTarget.name,
          yAxis: numTarget?.name || catTarget.name,
          aggregation: numTarget ? 'sum' : 'count',
          title: `${catTarget.name} Breakdown`,
        },
        suggestions: [`Compare with other columns`, `Show percentage pie chart`],
      };
    }

    if (numTarget && numTarget.max !== undefined) {
      return {
        query: rawQuery,
        intent: 'top_bottom',
        title: `Extremes for "${numTarget.name}"`,
        answer: isMin 
          ? `The minimum value recorded for "${numTarget.name}" is ${formatShortNumber(numTarget.min || 0)}.`
          : `The maximum value recorded for "${numTarget.name}" is ${formatShortNumber(numTarget.max || 0)}.`,
        dataPoints: [
          { label: 'Minimum', value: formatShortNumber(numTarget.min || 0) },
          { label: 'Median', value: formatShortNumber(numTarget.median || 0) },
          { label: 'Maximum', value: formatShortNumber(numTarget.max || 0) },
        ],
        suggestions: [`What is the average ${numTarget.name}?`, `Are there correlations with ${numTarget.name}?`],
      };
    }
  }

  // 6. Trend / Date Query
  if (query.includes('trend') || query.includes('time') || query.includes('growth') || query.includes('over time') || query.includes('date')) {
    const dateCol = dateCols[0];
    const numCol = matchedNumericCol || numericCols[0];
    if (dateCol && numCol) {
      return {
        query: rawQuery,
        intent: 'trend',
        title: `Timeline Analysis: ${numCol.name} over ${dateCol.name}`,
        answer: `Your dataset contains date records in "${dateCol.name}" spanning ${dateCol.dateRangeDays} days from ${dateCol.minDate} to ${dateCol.maxDate}. You can plot ${numCol.name} over time to track velocity and momentum.`,
        recommendedChart: {
          type: 'line',
          xAxis: dateCol.name,
          yAxis: numCol.name,
          aggregation: 'sum',
          title: `${numCol.name} Trend over Time`,
        },
        suggestions: ['Show average growth', 'Detect seasonality'],
      };
    }
  }

  // 7. General Dataset Summary Fallback
  return {
    query: rawQuery,
    intent: 'summary',
    title: `Dataset Overview: ${analysis.fileName}`,
    answer: `InsightAI analyzed ${analysis.totalRows.toLocaleString()} rows and ${analysis.totalCols} columns. It found ${numericCols.length} numeric columns (${numericCols.map(c => c.name).join(', ')}) and ${catCols.length} categorical columns (${catCols.map(c => c.name).join(', ')}). Data quality is ${analysis.quality.dataQualityScore}/100.`,
    dataPoints: [
      { label: 'Total Rows', value: analysis.totalRows.toLocaleString() },
      { label: 'Total Columns', value: analysis.totalCols },
      { label: 'Quality Grade', value: analysis.quality.qualityGrade },
      { label: 'Missing Rate', value: `${analysis.quality.missingRate}%` },
    ],
    suggestions: [
      `What is the average ${numericCols[0]?.name || 'value'}?`,
      `Show top categories in ${catCols[0]?.name || 'dataset'}`,
      'Are there any strong correlations?',
      'Check for data outliers',
    ],
  };
}

/**
 * Aggregates dataset rows for interactive Chart rendering
 */
export function aggregateChartData(
  rows: Record<string, any>[],
  config: ChartConfig
): { chartData: any[]; totalPoints: number } {
  if (!rows || rows.length === 0 || !config.xAxis) {
    return { chartData: [], totalPoints: 0 };
  }

  // 1. Apply filtering if defined
  let filtered = rows;
  if (config.filterCol && config.filterVal !== undefined && config.filterVal !== '') {
    filtered = rows.filter(r => {
      const val = String(r[config.filterCol!] ?? '').toLowerCase();
      const target = String(config.filterVal).toLowerCase();
      if (config.filterOperator === 'equals') return val === target;
      if (config.filterOperator === 'gt') return Number(val) > Number(target);
      if (config.filterOperator === 'lt') return Number(val) < Number(target);
      return val.includes(target); // default 'contains'
    });
  }

  // 2. Aggregations
  if (config.type === 'histogram') {
    // Histogram binning
    const numVals: number[] = [];
    for (const r of filtered) {
      const v = Number(r[config.xAxis]);
      if (!isNaN(v) && r[config.xAxis] !== null) numVals.push(v);
    }
    if (numVals.length === 0) return { chartData: [], totalPoints: 0 };
    numVals.sort((a, b) => a - b);
    const min = numVals[0];
    const max = numVals[numVals.length - 1];
    const binCount = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(numVals.length))));
    const binWidth = (max - min) / (binCount || 1);
    
    const bins: any[] = [];
    if (binWidth > 0) {
      for (let b = 0; b < binCount; b++) {
        const bStart = min + b * binWidth;
        const bEnd = b === binCount - 1 ? max : min + (b + 1) * binWidth;
        const count = numVals.filter(v => v >= bStart && (b === binCount - 1 ? v <= bEnd : v < bEnd)).length;
        bins.push({
          bin: `${formatShortNumber(bStart)} - ${formatShortNumber(bEnd)}`,
          count,
        });
      }
    } else {
      bins.push({ bin: formatShortNumber(min), count: numVals.length });
    }
    return { chartData: bins, totalPoints: bins.length };
  }

  if (config.type === 'scatter') {
    const scatterData = filtered
      .map(r => ({
        x: Number(r[config.xAxis]),
        y: Number(r[config.yAxis]),
        tooltip: `${config.xAxis}: ${r[config.xAxis]}, ${config.yAxis}: ${r[config.yAxis]}`,
      }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y))
      .slice(0, 300); // Limit scatter points for smooth rendering
    return { chartData: scatterData, totalPoints: scatterData.length };
  }

  // Group by X-Axis
  const groupMap = new Map<string, { sum: number; count: number; min: number; max: number }>();

  for (const r of filtered) {
    const xKey = r[config.xAxis] !== null && r[config.xAxis] !== undefined && String(r[config.xAxis]).trim() !== ''
      ? String(r[config.xAxis]).trim()
      : '(Empty)';
    
    const yVal = Number(r[config.yAxis]);
    const numY = !isNaN(yVal) && r[config.yAxis] !== null ? yVal : 1;

    const existing = groupMap.get(xKey) || { sum: 0, count: 0, min: numY, max: numY };
    existing.sum += numY;
    existing.count += 1;
    existing.min = Math.min(existing.min, numY);
    existing.max = Math.max(existing.max, numY);
    groupMap.set(xKey, existing);
  }

  let result: any[] = [];
  groupMap.forEach((stats, key) => {
    let finalValue = stats.count;
    if (config.aggregation === 'sum') finalValue = stats.sum;
    else if (config.aggregation === 'avg') finalValue = stats.count > 0 ? stats.sum / stats.count : 0;
    else if (config.aggregation === 'min') finalValue = stats.min;
    else if (config.aggregation === 'max') finalValue = stats.max;
    else if (config.aggregation === 'count') finalValue = stats.count;

    result.push({
      [config.xAxis]: key,
      [config.yAxis || 'value']: parseFloat(finalValue.toFixed(2)),
      name: key,
      value: parseFloat(finalValue.toFixed(2)),
      count: stats.count,
    });
  });

  // Sort
  if (config.sortOrder === 'asc') {
    result.sort((a, b) => a.value - b.value);
  } else if (config.sortOrder === 'desc') {
    result.sort((a, b) => b.value - a.value);
  }

  // Limit items for clarity
  if (config.limit && config.limit > 0) {
    result = result.slice(0, config.limit);
  }

  return { chartData: result, totalPoints: result.length };
}
