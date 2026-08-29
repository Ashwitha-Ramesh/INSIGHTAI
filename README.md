# InsightAI — Intelligent Client-Side SaaS Data Analytics Platform

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**InsightAI** is a high-performance, client-side SaaS data analytics and automated intelligence platform. It transforms raw tabular datasets (CSV, Excel, JSON) into executive dashboards, automated statistical profiles, interactive multidimensional charts, anomaly detection reports, and downloadable PDF presentations — all executed securely in the browser with zero server data storage.

---

## 🌟 Key Features

### 1. 📁 Instant Multi-Format Dataset Ingestion
- **Flexible File Support**: Upload `.csv`, `.xlsx`, `.xls`, or `.json` files via drag-and-drop or file picker.
- **Smart Parsing & Auto-Typing**: Automatically classifies columns into Numeric, Categorical, Datetime, Boolean, or Identifier fields.
- **Sample Datasets Included**: Pre-loaded benchmark datasets (E-Commerce Sales, SaaS Recurring Revenue & Churn, Employee Performance, Healthcare Analytics) for instant exploration.

### 2. 🔬 Automated Statistical Engine & Profiling
- **Summary Metrics**: Mean, Median, Mode, Standard Deviation, Variance, Min/Max, Quartiles (Q1, Q3), and IQR.
- **Data Quality Scoring**: Detection of missing values, null rates, duplicate rows, skewness, and cardinality.
- **Outlier & Anomaly Detection**: Statistical Z-Score and Interquartile Range (IQR) flags with interactive outlier inspection.
- **Correlation Matrix**: Dynamic Pearson correlation heatmaps between numeric features.

### 3. 📈 Interactive Multi-Chart Visualization Studio
- **Rich Chart Library**: Built on Recharts — Line, Bar, Stacked Bar, Area, Scatter, Pie, Donut, Radar, and Composed charts.
- **Interactive Controls**: Group by dimensions, aggregate metrics (Sum, Average, Count, Min, Max), apply filters, sort, and slice date ranges.
- **Customizable Aesthetics**: Live color palettes, legends, grid lines, tooltips, and animated render transitions.

### 4. 🧠 Automated Intelligence & Rule-Based Insights
- **Key Takeaways Generation**: Instant executive summaries summarizing volume, top performers, peak anomalies, and correlations.
- **Distribution Health**: Automated skewness warnings and data distribution shape descriptions.
- **Actionable Recommendations**: Algorithmic business advice tailored to detected trends.

### 5. 📄 Executive Reports & Multi-Format Exports
- **One-Click PDF Reports**: Generates multi-page executive dossiers complete with KPIs, visual snapshots, and summary tables.
- **Data Exporting**: Export cleaned and processed datasets to CSV or structured JSON.
- **Report Customization**: Toggle individual sections (Executive Summary, Correlation Matrix, Charts, Outlier Audit) before exporting.

### 6. 🎨 Appearance & Customization Engine
- **Dark, Light & System Themes**: High-contrast, WCAG AA-compliant visual layouts for both dark and light modes.
- **5 Vibrant Accent Palettes**: Indigo Cyber, Emerald Forest, Violet Nebula, Cyan Neon, and Amber Sunset.
- **Accessibility & Density**: Compact view option, reduced motion modes, and persistent user preferences in `localStorage`.

### 7. 🔒 100% Client-Side Privacy Guarantee
- **Zero Server Uploads**: All data parsing, mathematical computations, chart rendering, and PDF generations occur strictly in your browser's V8 engine.
- **Persistent Local History**: Fast dataset switching and report restoration using encrypted client-side local caching.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Custom Properties |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Data Parsing** | [PapaParse](https://www.papaparse.com/) (CSV) + [SheetJS / XLSX](https://sheetjs.com/) (Excel) |
| **Report Generation** | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) |
| **Motion & FX** | [Motion](https://motion.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/insight-ai.git
   cd insight-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Run type-checking and linter**:
   ```bash
   npm run lint
   ```

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
