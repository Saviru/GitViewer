import React from 'react';
import { Theme } from '../types';
import { getBackgroundStyle } from '../themes';

interface Props {
  username: string;
  theme: Theme;
  count?: number;
  lastVisit?: string;
}

const Counter: React.FC<Props> = ({ username, theme, count = 0, lastVisit }) => {
  const backgroundStyle = getBackgroundStyle(theme);
  const lastVisitDate = lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Never';
  const lastVisitTime = lastVisit ? new Date(lastVisit).toLocaleTimeString() : '';

  const style: React.CSSProperties = {
    width: '300px',
    height: '120px',
    background: backgroundStyle,
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    color: theme.countColor
  };

  return (
    <div style={style}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
        Profile Views
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
        {count}
      </div>
      <div style={{ fontSize: '10px', color: theme.lastVisitColor }}>
        Last visit:
      </div>
      <div style={{ fontSize: '10px', color: theme.lastVisitColor }}>
        {lastVisitDate}
      </div>
      {lastVisitTime && (
        <div style={{ fontSize: '10px', color: theme.lastVisitColor }}>
          {lastVisitTime}
        </div>
      )}
    </div>
  );
};

export default Counter;