export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'percentage' | 'number';
  category: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'recommendation';
  severity: 'low' | 'medium' | 'high';
  data?: any;
  createdAt: Date;
  isRead: boolean;
}

export interface ChartData {
  date: string;
  value: number;
  category?: string;
}

export interface CSVData {
  headers: string[];
  rows: Record<string, any>[];
}

export interface DataTableColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'percentage';
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableProps {
  data: Record<string, any>[];
  columns: DataTableColumn[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface UserPreference {
  key: string;
  value: string;
  updatedAt: Date;
} 