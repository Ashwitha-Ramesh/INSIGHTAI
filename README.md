# InsightAI — Intelligent Client-Side SaaS Data Analytics Platform

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**InsightAI** is a high-performance, client-side SaaS data analytics and automated intelligence platform. It transforms raw tabular datasets (CSV, Excel, JSON) into executive dashboards, automated statistical profiles, interactive multidimensional charts, anomaly detection reports, and downloadable PDF presentations — all executed securely in the browser with zero server-side data storage.

### 🚀 Live Demo

**[https://insightai-2o.netlify.app/](https://insightai-2o.netlify.app/)**

---

## 🌟 Key Features

### 1. 📁 Instant Multi-Format Dataset Ingestion
- Upload `.csv`, `.xlsx`, `.xls`, or `.json` files via drag-and-drop or file picker.
- Automatic column type detection.
- Supports Numeric, Categorical, Datetime, Boolean, and Identifier fields.
- Built-in sample datasets for instant exploration.

### 2. 🔬 Automated Statistical Engine & Profiling
- Mean, Median, Mode, Standard Deviation, Variance, Min/Max, Quartiles, and IQR.
- Data quality scoring.
- Missing-value and duplicate detection.
- Skewness and cardinality analysis.
- Z-Score and IQR-based outlier detection.
- Dynamic Pearson correlation analysis.

### 3. 📈 Interactive Visualization Studio
- Line, Bar, Stacked Bar, Area, Scatter, Pie, Donut, Radar, and Composed charts.
- Group-by dimensions and metric selection.
- Sum, Average, Count, Min, and Max aggregations.
- Interactive filters and sorting.
- Animated chart transitions.
- Customizable legends, grids, tooltips, and chart styling.

### 4. 🧠 Automated Intelligence
- Automatic executive summaries.
- Key data takeaways.
- Trend and distribution analysis.
- Outlier and anomaly identification.
- Correlation-based observations.
- Actionable data-driven recommendations.

### 5. 📄 Executive Reports & Exports
- One-click PDF report generation.
- Executive summaries and KPI sections.
- Correlation and outlier analysis.
- Export processed datasets as CSV or JSON.
- Customizable report sections.

### 6. 🎨 Premium UI & Customization
- Modern SaaS dashboard interface.
- Dark, Light, and System themes.
- Multiple accent palettes.
- Responsive desktop and mobile layouts.
- Smooth animations and loading states.
- Compact/density controls.
- Accessibility preferences.
- Persistent user settings using local storage.

### 7. 🔒 Client-Side Privacy
- Dataset processing happens directly inside the browser.
- No server-side dataset storage.
- Statistical calculations execute locally.
- Charts and reports are generated locally.
- Analysis history is persisted locally in the user's browser.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Data Visualization** | Recharts |
| **CSV Parsing** | PapaParse |
| **Excel Parsing** | SheetJS / XLSX |
| **Report Generation** | jsPDF + html2canvas |
| **Animations** | Motion |
| **Icons** | Lucide React |
| **Deployment** | Netlify |

---

## 📂 Project Architecture

```
├── .env.example                # Sample environment configuration
├── index.html                  # HTML entry point with metadata tags
├── metadata.json               # Application metadata & configuration
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite 6 + Tailwind CSS plugin config
└── src/
    ├── App.tsx                 # Root application shell, state management & routing
    ├── main.tsx                # React DOM entry point
    ├── index.css               # Global Tailwind CSS & Light/Dark Theme Engine
    ├── types.ts                # TypeScript interfaces for datasets, metrics & charts
    ├── lib/
    │   ├── dataEngine.ts       # Statistical computations, auto-typing, IQR & correlations
    │   ├── exportUtils.ts      # PDF report generation, CSV/JSON exporters
    │   ├── sampleDatasets.ts   # Pre-loaded benchmark datasets
    │   └── storage.ts          # LocalStorage persistence manager for history & settings
    └── components/
        ├── layout/             # Navbar, Sidebar, Footer, Mobile Drawer
        ├── common/             # StatsCards, Badge, Toast notifications, Modal dialogs
        ├── upload/             # Drag-and-drop ingestion & sample dataset loader
        ├── dashboard/          # Executive KPI summary, charts preview & quick insights
        ├── analysis/           # Deep-dive statistical profiling & correlation matrix
        ├── visualizations/     # Interactive multi-chart builder studio
        ├── reports/            # Custom report designer & PDF generation suite
        ├── history/            # Dataset version history & quick switcher
        └── settings/           # Theme, palette, density & system preferences
```

---

## 🔒 Data Security & Privacy

InsightAI operates under a **Zero-Knowledge Architecture**:
- Your uploaded datasets **never leave your device**.
- No analytical telemetry or sensitive data is uploaded to remote servers.
- All calculations (standard deviations, quartiles, correlations, chart transformations) execute locally in memory.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
