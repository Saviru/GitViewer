import { Theme } from './types';

export const predefinedThemes: Theme[] = [
  {
    name: 'Default',
    background: {
      type: 'solid',
      color: '#1a1a1a'
    },
    countColor: '#ffffff',
    lastVisitColor: '#888888'
  },
  {
    name: 'WatchDog',
    background: {
      type: 'gradient',
      gradient: {
        rotation: 35,
        color1: '#021D4A',
        color2: '#520806'
      }
    },
    countColor: '#EBD208',
    lastVisitColor: '#B6EBE0'
  },
  {
    name: 'Ocean',
    background: {
      type: 'gradient',
      gradient: {
        rotation: 45,
        color1: '#667eea',
        color2: '#764ba2'
      }
    },
    countColor: '#ffffff',
    lastVisitColor: '#e0e0e0'
  },
  {
    name: 'Sunset',
    background: {
      type: 'gradient',
      gradient: {
        rotation: 90,
        color1: '#ff9a9e',
        color2: '#fecfef'
      }
    },
    countColor: '#333333',
    lastVisitColor: '#666666'
  },
  {
    name: 'Forest',
    background: {
      type: 'gradient',
      gradient: {
        rotation: 135,
        color1: '#134e5e',
        color2: '#71b280'
      }
    },
    countColor: '#ffffff',
    lastVisitColor: '#cccccc'
  },
  {
    name: 'Neon',
    background: {
      type: 'solid',
      color: '#0a0a0a'
    },
    countColor: '#00ff41',
    lastVisitColor: '#ff0080'
  }
];

export const createCustomTheme = (
  name: string,
  backgroundType: 'solid' | 'gradient',
  backgroundData: any,
  countColor: string,
  lastVisitColor: string
): Theme => {
  return {
    name,
    background: {
      type: backgroundType,
      ...(backgroundType === 'solid' 
        ? { color: backgroundData } 
        : { gradient: backgroundData }
      )
    },
    countColor,
    lastVisitColor
  };
};

export const getBackgroundStyle = (theme: Theme): string => {
  if (theme.background.type === 'solid') {
    return theme.background.color || '#1a1a1a';
  } else {
    const { rotation, color1, color2 } = theme.background.gradient!;
    return `linear-gradient(${rotation}deg, ${color1}, ${color2})`;
  }
};