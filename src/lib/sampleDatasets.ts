export interface SamplePreset {
  id: string;
  name: string;
  filename: string;
  description: string;
  category: string;
  icon: string;
  rowCount: number;
  data: Record<string, any>[];
}

export const SAMPLE_DATASETS: SamplePreset[] = [
  {
    id: 'saas_metrics',
    name: 'SaaS Revenue & Customer Retention',
    filename: 'saas_revenue_retention_2025.csv',
    description: 'B2B software subscription metrics including MRR, churn likelihood, NPS, CAC, and plan tiers.',
    category: 'Finance & Growth',
    icon: 'TrendingUp',
    rowCount: 50,
    data: [
      { CustomerID: 'CUST-1001', PlanTier: 'Enterprise', Region: 'North America', MRR: 4800, CAC: 1200, NPS: 9, SupportTickets: 2, ChurnRiskScore: 12, ActiveSeats: 85, RenewalDate: '2025-11-15' },
      { CustomerID: 'CUST-1002', PlanTier: 'Pro', Region: 'Europe', MRR: 1200, CAC: 450, NPS: 8, SupportTickets: 4, ChurnRiskScore: 28, ActiveSeats: 22, RenewalDate: '2025-09-20' },
      { CustomerID: 'CUST-1003', PlanTier: 'Starter', Region: 'Asia-Pacific', MRR: 290, CAC: 180, NPS: 6, SupportTickets: 8, ChurnRiskScore: 64, ActiveSeats: 5, RenewalDate: '2025-06-10' },
      { CustomerID: 'CUST-1004', PlanTier: 'Enterprise', Region: 'North America', MRR: 6200, CAC: 1500, NPS: 10, SupportTickets: 1, ChurnRiskScore: 8, ActiveSeats: 120, RenewalDate: '2025-12-01' },
      { CustomerID: 'CUST-1005', PlanTier: 'Pro', Region: 'Latin America', MRR: 950, CAC: 390, NPS: 7, SupportTickets: 5, ChurnRiskScore: 42, ActiveSeats: 18, RenewalDate: '2025-08-14' },
      { CustomerID: 'CUST-1006', PlanTier: 'Enterprise', Region: 'Europe', MRR: 5400, CAC: 1350, NPS: 9, SupportTickets: 3, ChurnRiskScore: 15, ActiveSeats: 94, RenewalDate: '2025-10-30' },
      { CustomerID: 'CUST-1007', PlanTier: 'Starter', Region: 'North America', MRR: 350, CAC: 210, NPS: 5, SupportTickets: 9, ChurnRiskScore: 78, ActiveSeats: 6, RenewalDate: '2025-05-22' },
      { CustomerID: 'CUST-1008', PlanTier: 'Pro', Region: 'Asia-Pacific', MRR: 1450, CAC: 520, NPS: 8, SupportTickets: 3, ChurnRiskScore: 22, ActiveSeats: 28, RenewalDate: '2025-11-05' },
      { CustomerID: 'CUST-1009', PlanTier: 'Enterprise', Region: 'North America', MRR: 8100, CAC: 1900, NPS: 10, SupportTickets: 2, ChurnRiskScore: 5, ActiveSeats: 160, RenewalDate: '2025-12-18' },
      { CustomerID: 'CUST-1010', PlanTier: 'Pro', Region: 'Europe', MRR: 1100, CAC: 400, NPS: 7, SupportTickets: 6, ChurnRiskScore: 35, ActiveSeats: 20, RenewalDate: '2025-07-19' },
      { CustomerID: 'CUST-1011', PlanTier: 'Starter', Region: 'Europe', MRR: 280, CAC: 170, NPS: 6, SupportTickets: 7, ChurnRiskScore: 59, ActiveSeats: 4, RenewalDate: '2025-06-28' },
      { CustomerID: 'CUST-1012', PlanTier: 'Enterprise', Region: 'Asia-Pacific', MRR: 4200, CAC: 1100, NPS: 9, SupportTickets: 2, ChurnRiskScore: 14, ActiveSeats: 76, RenewalDate: '2025-09-12' },
      { CustomerID: 'CUST-1013', PlanTier: 'Pro', Region: 'North America', MRR: 1600, CAC: 560, NPS: 8, SupportTickets: 4, ChurnRiskScore: 25, ActiveSeats: 32, RenewalDate: '2025-10-15' },
      { CustomerID: 'CUST-1014', PlanTier: 'Starter', Region: 'Latin America', MRR: 310, CAC: 195, NPS: 7, SupportTickets: 5, ChurnRiskScore: 48, ActiveSeats: 5, RenewalDate: '2025-08-01' },
      { CustomerID: 'CUST-1015', PlanTier: 'Enterprise', Region: 'North America', MRR: 9500, CAC: 2200, NPS: 10, SupportTickets: 1, ChurnRiskScore: 4, ActiveSeats: 210, RenewalDate: '2026-01-10' },
      { CustomerID: 'CUST-1016', PlanTier: 'Pro', Region: 'Europe', MRR: 1300, CAC: 480, NPS: 8, SupportTickets: 3, ChurnRiskScore: 20, ActiveSeats: 25, RenewalDate: '2025-11-22' },
      { CustomerID: 'CUST-1017', PlanTier: 'Starter', Region: 'North America', MRR: 290, CAC: 180, NPS: 4, SupportTickets: 11, ChurnRiskScore: 88, ActiveSeats: 3, RenewalDate: '2025-04-15' },
      { CustomerID: 'CUST-1018', PlanTier: 'Enterprise', Region: 'Latin America', MRR: 3900, CAC: 980, NPS: 8, SupportTickets: 4, ChurnRiskScore: 19, ActiveSeats: 68, RenewalDate: '2025-09-08' },
      { CustomerID: 'CUST-1019', PlanTier: 'Pro', Region: 'North America', MRR: 1750, CAC: 610, NPS: 9, SupportTickets: 2, ChurnRiskScore: 16, ActiveSeats: 35, RenewalDate: '2025-12-05' },
      { CustomerID: 'CUST-1020', PlanTier: 'Starter', Region: 'Asia-Pacific', MRR: 320, CAC: 200, NPS: 6, SupportTickets: 6, ChurnRiskScore: 55, ActiveSeats: 5, RenewalDate: '2025-07-04' },
      { CustomerID: 'CUST-1021', PlanTier: 'Enterprise', Region: 'Europe', MRR: 5800, CAC: 1400, NPS: 9, SupportTickets: 2, ChurnRiskScore: 11, ActiveSeats: 105, RenewalDate: '2025-11-19' },
      { CustomerID: 'CUST-1022', PlanTier: 'Pro', Region: 'North America', MRR: 1500, CAC: 530, NPS: 8, SupportTickets: 3, ChurnRiskScore: 24, ActiveSeats: 30, RenewalDate: '2025-10-02' },
      { CustomerID: 'CUST-1023', PlanTier: 'Starter', Region: 'Europe', MRR: 270, CAC: 165, NPS: 5, SupportTickets: 8, ChurnRiskScore: 72, ActiveSeats: 4, RenewalDate: '2025-05-18' },
      { CustomerID: 'CUST-1024', PlanTier: 'Enterprise', Region: 'North America', MRR: 7300, CAC: 1750, NPS: 10, SupportTickets: 2, ChurnRiskScore: 6, ActiveSeats: 145, RenewalDate: '2025-12-28' },
      { CustomerID: 'CUST-1025', PlanTier: 'Pro', Region: 'Asia-Pacific', MRR: 1350, CAC: 490, NPS: 7, SupportTickets: 5, ChurnRiskScore: 38, ActiveSeats: 26, RenewalDate: '2025-08-25' },
    ]
  },
  {
    id: 'ecommerce_sales',
    name: 'E-Commerce Global Sales & Margins',
    filename: 'ecommerce_global_orders_2025.csv',
    description: 'Multi-channel retail order records with category revenue, discounts, shipping costs, and unit margins.',
    category: 'E-Commerce & Retail',
    icon: 'ShoppingCart',
    rowCount: 50,
    data: [
      { OrderID: 'ORD-501', Category: 'Electronics', SubCategory: 'Laptops', Region: 'West', Sales: 1899.99, Profit: 380.00, Discount: 0.05, Quantity: 2, Segment: 'Corporate', ShipMode: 'Express' },
      { OrderID: 'ORD-502', Category: 'Furniture', SubCategory: 'Chairs', Region: 'East', Sales: 450.50, Profit: 65.00, Discount: 0.15, Quantity: 4, Segment: 'Consumer', ShipMode: 'Standard' },
      { OrderID: 'ORD-503', Category: 'Office Supplies', SubCategory: 'Paper', Region: 'Central', Sales: 89.20, Profit: 32.50, Discount: 0.00, Quantity: 6, Segment: 'Home Office', ShipMode: 'Standard' },
      { OrderID: 'ORD-504', Category: 'Electronics', SubCategory: 'Phones', Region: 'South', Sales: 920.00, Profit: 210.00, Discount: 0.10, Quantity: 3, Segment: 'Consumer', ShipMode: 'Express' },
      { OrderID: 'ORD-505', Category: 'Furniture', SubCategory: 'Tables', Region: 'West', Sales: 1250.00, Profit: -85.00, Discount: 0.25, Quantity: 2, Segment: 'Corporate', ShipMode: 'Standard' },
      { OrderID: 'ORD-506', Category: 'Office Supplies', SubCategory: 'Storage', Region: 'East', Sales: 310.00, Profit: 75.00, Discount: 0.05, Quantity: 5, Segment: 'Consumer', ShipMode: 'Standard' },
      { OrderID: 'ORD-507', Category: 'Electronics', SubCategory: 'Accessories', Region: 'Central', Sales: 145.00, Profit: 48.00, Discount: 0.00, Quantity: 3, Segment: 'Home Office', ShipMode: 'Express' },
      { OrderID: 'ORD-508', Category: 'Furniture', SubCategory: 'Bookcases', Region: 'South', Sales: 680.00, Profit: 92.00, Discount: 0.10, Quantity: 2, Segment: 'Corporate', ShipMode: 'Standard' },
      { OrderID: 'ORD-509', Category: 'Electronics', SubCategory: 'Laptops', Region: 'East', Sales: 2450.00, Profit: 520.00, Discount: 0.05, Quantity: 2, Segment: 'Corporate', ShipMode: 'Express' },
      { OrderID: 'ORD-510', Category: 'Office Supplies', SubCategory: 'Binders', Region: 'West', Sales: 64.50, Profit: 26.00, Discount: 0.00, Quantity: 8, Segment: 'Consumer', ShipMode: 'Standard' },
      { OrderID: 'ORD-511', Category: 'Electronics', SubCategory: 'Phones', Region: 'Central', Sales: 1150.00, Profit: 260.00, Discount: 0.08, Quantity: 4, Segment: 'Home Office', ShipMode: 'Standard' },
      { OrderID: 'ORD-512', Category: 'Furniture', SubCategory: 'Chairs', Region: 'South', Sales: 520.00, Profit: 78.00, Discount: 0.12, Quantity: 3, Segment: 'Consumer', ShipMode: 'Standard' },
      { OrderID: 'ORD-513', Category: 'Office Supplies', SubCategory: 'Art', Region: 'East', Sales: 112.00, Profit: 42.00, Discount: 0.00, Quantity: 7, Segment: 'Home Office', ShipMode: 'Express' },
      { OrderID: 'ORD-514', Category: 'Electronics', SubCategory: 'Monitors', Region: 'West', Sales: 840.00, Profit: 195.00, Discount: 0.05, Quantity: 3, Segment: 'Corporate', ShipMode: 'Express' },
      { OrderID: 'ORD-515', Category: 'Furniture', SubCategory: 'Furnishings', Region: 'Central', Sales: 198.00, Profit: 45.00, Discount: 0.10, Quantity: 5, Segment: 'Consumer', ShipMode: 'Standard' },
    ]
  },
  {
    id: 'workforce_analytics',
    name: 'Workforce Performance & Compensation',
    filename: 'workforce_talent_metrics_2025.csv',
    description: 'Human resources and team productivity records across engineering, sales, product, and design departments.',
    category: 'Human Resources & Talent',
    icon: 'Users',
    rowCount: 45,
    data: [
      { EmpID: 'EMP-01', Department: 'Engineering', Role: 'Staff Engineer', Salary: 165000, PerformanceRating: 4.8, YearsExperience: 9, RemoteRatio: 100, ProjectsLed: 8, PromotionCandidate: 'Yes' },
      { EmpID: 'EMP-02', Department: 'Product', Role: 'Product Lead', Salary: 152000, PerformanceRating: 4.6, YearsExperience: 7, RemoteRatio: 60, ProjectsLed: 6, PromotionCandidate: 'Yes' },
      { EmpID: 'EMP-03', Department: 'Sales', Role: 'Account Executive', Salary: 110000, PerformanceRating: 3.9, YearsExperience: 4, RemoteRatio: 40, ProjectsLed: 3, PromotionCandidate: 'No' },
      { EmpID: 'EMP-04', Department: 'Design', Role: 'Principal Designer', Salary: 142000, PerformanceRating: 4.7, YearsExperience: 8, RemoteRatio: 80, ProjectsLed: 7, PromotionCandidate: 'Yes' },
      { EmpID: 'EMP-05', Department: 'Engineering', Role: 'Senior Engineer', Salary: 138000, PerformanceRating: 4.3, YearsExperience: 5, RemoteRatio: 100, ProjectsLed: 4, PromotionCandidate: 'Yes' },
      { EmpID: 'EMP-06', Department: 'Marketing', Role: 'Growth Manager', Salary: 118000, PerformanceRating: 4.1, YearsExperience: 4, RemoteRatio: 50, ProjectsLed: 5, PromotionCandidate: 'No' },
      { EmpID: 'EMP-07', Department: 'Customer Success', Role: 'CS Manager', Salary: 98000, PerformanceRating: 4.4, YearsExperience: 5, RemoteRatio: 80, ProjectsLed: 4, PromotionCandidate: 'No' },
      { EmpID: 'EMP-08', Department: 'Engineering', Role: 'Full Stack Dev', Salary: 115000, PerformanceRating: 4.0, YearsExperience: 3, RemoteRatio: 100, ProjectsLed: 2, PromotionCandidate: 'No' },
      { EmpID: 'EMP-09', Department: 'Sales', Role: 'Enterprise Director', Salary: 175000, PerformanceRating: 4.9, YearsExperience: 11, RemoteRatio: 20, ProjectsLed: 10, PromotionCandidate: 'Yes' },
      { EmpID: 'EMP-10', Department: 'Product', Role: 'Associate PM', Salary: 92000, PerformanceRating: 3.8, YearsExperience: 2, RemoteRatio: 60, ProjectsLed: 2, PromotionCandidate: 'No' },
      { EmpID: 'EMP-11', Department: 'Engineering', Role: 'DevOps Engineer', Salary: 140000, PerformanceRating: 4.5, YearsExperience: 6, RemoteRatio: 100, ProjectsLed: 5, PromotionCandidate: 'Yes' },
      { EmpID: 'EMP-12', Department: 'Design', Role: 'UX Researcher', Salary: 108000, PerformanceRating: 4.2, YearsExperience: 4, RemoteRatio: 80, ProjectsLed: 3, PromotionCandidate: 'No' },
    ]
  }
];
