export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface SharePrice {
  current: number;
  change: number;
  percentChange: number;
  lastUpdate: string;
}

export interface SeedwaveData {
  treatedBrands: number;
  activeBrands: number;
  growth: number;
  lastUpdate: string;
}

export interface EcosystemStatus {
  repositories: number;
  activeWorkflows: number;
  pulseInterval: string;
  status: 'operational' | 'degraded' | 'down';
}

export interface PulseMetrics {
  requestsPerSecond: number;
  activeConnections: number;
  uptime: number;
}

export interface PulseData {
  timestamp: string;
  pulse: string;
  status: 'active' | 'inactive';
  metrics: PulseMetrics;
}

export interface Sector {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}
