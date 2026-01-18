export interface Sector {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  description?: string;
  scrollClaims?: number;
  treatyBrands?: number;
}

export interface SectorDetails extends Sector {
  metrics: {
    users: number;
    revenue: number;
    growth: number;
  };
  features: string[];
}
