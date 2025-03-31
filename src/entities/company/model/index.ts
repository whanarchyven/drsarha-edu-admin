export enum DashboardType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  TABLE = 'table',
}

export interface Scale {
  name: string;
  value: number;
  type: 'linear' | 'multiple';
}

export interface Stat {
  name: string;
  type: DashboardType;
  question_id: string;
  scaleAll: number;
  scales: Scale[];
}

export interface Dashboard {
  name: string;
  icon: string;
  stats: Stat[];
}

export interface Company {
  _id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  logo: string;
  description: string;
  dashboards: Dashboard[];
}
