export interface ViewData {
  count: number;
  lastVisit: string;
  username: string;
}

export interface CounterParams {
  username: string;
  theme?: string;
  customTheme?: string; // JSON encoded custom theme
}