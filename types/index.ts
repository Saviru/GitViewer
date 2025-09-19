export interface Theme {
  name: string;
  background: {
    type: 'solid' | 'gradient';
    color?: string;
    gradient?: {
      rotation: number;
      color1: string;
      color2: string;
    };
  };
  countColor: string;
  lastVisitColor: string;
}

export interface ViewData {
  username: string;
  count: number;
  lastVisit: string;
  ips: string[];
}

export interface CounterConfig {
  username: string;
  theme: Theme;
}