export interface DataRow {
  [key: string]: string | number | null;
}

export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'date';
  values: (string | number)[];
}

export interface DatasetInfo {
  id?: string;
  name: string;
  rows: number;
  columns: number;
  size: number;
  uploadDate: string | Date;
  userId?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AnalyticsData {
  totalRows: number;
  totalColumns: number;
  numericColumns: string[];
  stringColumns: string[];
  summary: {
    [column: string]: {
      mean?: number;
      median?: number;
      mode?: string | number;
      min?: number;
      max?: number;
      stdDev?: number;
      uniqueValues?: number;
    };
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  xAxis: string;
  yAxis: string;
  title: string;
  colors: string[];
}

export interface AnalysisHistory {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: Date;
  chartType: string;
  xAxis: string;
  yAxis: string;
  datasetId: string;
}

export interface AdminStats {
  totalUsers: number;
  totalUploads: number;
  activeUsers: number;
  mostUsedChartType: string;
  storageUsed: number;
  recentActivity: AnalysisHistory[];
}