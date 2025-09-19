export interface ThemeColors {
  viewCountColor: string;
  lastVisitColor: string;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient';
  color?: string;
  gradient?: {
    rotation: number;
    color1: string;
    color2: string;
  };
}

export interface Theme {
  name: string;
  background: BackgroundConfig;
  colors: ThemeColors;
  borderRadius?: number;
  padding?: number;
  fontSize?: {
    viewCount: number;
    lastVisit: number;
  };
}

export const predefinedThemes: Theme[] = [
  {
    name: 'Default',
    background: {
      type: 'solid',
      color: '#ffffff'
    },
    colors: {
      viewCountColor: '#333333',
      lastVisitColor: '#666666'
    },
    borderRadius: 8,
    padding: 20,
    fontSize: {
      viewCount: 24,
      lastVisit: 14
    }
  },
  {
    name: 'Dark',
    background: {
      type: 'solid',
      color: '#1a1a1a'
    },
    colors: {
      viewCountColor: '#ffffff',
      lastVisitColor: '#cccccc'
    },
    borderRadius: 8,
    padding: 20,
    fontSize: {
      viewCount: 24,
      lastVisit: 14
    }
  },
  {
    name: 'Ocean Gradient',
    background: {
      type: 'gradient',
      gradient: {
        rotation: 45,
        color1: '#667eea',
        color2: '#764ba2'
      }
    },
    colors: {
      viewCountColor: '#ffffff',
      lastVisitColor: '#f0f0f0'
    },
    borderRadius: 12,
    padding: 25,
    fontSize: {
      viewCount: 26,
      lastVisit: 15
    }
  },
  {
    name: 'Sunset Gradient',
    background: {
      type: 'gradient',
      gradient: {
        rotation: 90,
        color1: '#ff9a9e',
        color2: '#fecfef'
      }
    },
    colors: {
      viewCountColor: '#333333',
      lastVisitColor: '#555555'
    },
    borderRadius: 15,
    padding: 22,
    fontSize: {
      viewCount: 25,
      lastVisit: 14
    }
  },
  {
    name: 'Neon',
    background: {
      type: 'solid',
      color: '#0a0a0a'
    },
    colors: {
      viewCountColor: '#00ff88',
      lastVisitColor: '#88ffff'
    },
    borderRadius: 6,
    padding: 18,
    fontSize: {
      viewCount: 22,
      lastVisit: 13
    }
  }
];

export const createCustomTheme = (
  name: string,
  background: BackgroundConfig,
  colors: ThemeColors,
  options?: {
    borderRadius?: number;
    padding?: number;
    fontSize?: { viewCount: number; lastVisit: number };
  }
): Theme => {
  return {
    name,
    background,
    colors,
    borderRadius: options?.borderRadius || 8,
    padding: options?.padding || 20,
    fontSize: options?.fontSize || { viewCount: 24, lastVisit: 14 }
  };
};

export const getThemeByName = (name: string): Theme | undefined => {
  return predefinedThemes.find(theme => theme.name === name);
};