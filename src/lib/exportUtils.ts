import { DatasetAnalysis } from '../types';
import html2canvas from 'html2canvas';

/**
 * Exports data rows to CSV download
 */
export function exportToCSV(rows: Record<string, any>[], filename: string = 'insightai_export.csv'): void {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  
  const csvContent = [
    headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports full dataset analysis as JSON
 */
export function exportToJSON(analysis: DatasetAnalysis): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(analysis, null, 2)
  )}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `${analysis.fileName.replace(/\.[^/.]+$/, '')}_analysis.json`;
  link.click();
}

/**
 * Exports full Markdown analytical report
 */
export function exportToMarkdownReport(analysis: DatasetAnalysis): void {
  const md = `# InsightAI Executive Analytics Report
**Dataset:** ${analysis.fileName}  
**Analyzed on:** ${new Date(analysis.uploadedAt).toLocaleString()}  
**Data Quality Score:** ${analysis.quality.dataQualityScore}/100 (Grade ${analysis.quality.qualityGrade})  

---

## 1. Executive Summary
- **Total Records Analyzed:** ${analysis.totalRows.toLocaleString()}
- **Total Variables/Columns:** ${analysis.totalCols}
- **Data Completeness:** ${(100 - analysis.quality.missingRate).toFixed(1)}% (${analysis.quality.missingCells.toLocaleString()} missing values)
- **Duplicate Rows:** ${analysis.quality.duplicateRows} (${analysis.quality.duplicateRate}%)

---

## 2. Statistical Findings & Automated AI Insights
${analysis.insights.map((ins, i) => `### ${i + 1}. ${ins.title} [${ins.severity.toUpperCase()}]
- **Observation:** ${ins.description}
${ins.metric ? `- **Key Metric:** ${ins.metric}` : ''}
${ins.impact ? `- **Impact Analysis:** ${ins.impact}` : ''}
${ins.suggestion ? `- **Actionable Guidance:** ${ins.suggestion}` : ''}
`).join('\n')}

---

## 3. Correlation Matrix (Pearson r)
| Variable 1 | Variable 2 | Correlation (r) | Relationship |
| :--- | :--- | :--- | :--- |
${analysis.correlations.slice(0, 10).map(c => `| ${c.col1} | ${c.col2} | ${c.score > 0 ? '+' : ''}${c.score} | ${c.strength} |`).join('\n')}

---

## 4. Key Recommendations
${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

---
*Generated entirely client-side by InsightAI Platform. No external LLMs or third-party cloud trackers invoked.*
`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${analysis.fileName.replace(/\.[^/.]+$/, '')}_report.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capture an element ID and download as PNG
 */
export async function exportElementAsPNG(elementId: string, filename: string = 'chart_export.png'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#090d16',
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    link.click();
  } catch (err) {
    console.error('Failed to export element as image:', err);
  }
}
