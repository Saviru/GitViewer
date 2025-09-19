import React, { useState } from 'react';
import { Theme } from '../types';
import { predefinedThemes, createCustomTheme } from '../themes';

interface Props {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeCustomizer: React.FC<Props> = ({ selectedTheme, onThemeChange }) => {
  const [customMode, setCustomMode] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient'>('solid');
  const [solidColor, setSolidColor] = useState('#1a1a1a');
  const [rotation, setRotation] = useState(45);
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [countColor, setCountColor] = useState('#ffffff');
  const [lastVisitColor, setLastVisitColor] = useState('#888888');

  const handlePredefinedTheme = (theme: Theme) => {
    setCustomMode(false);
    onThemeChange(theme);
  };

  const handleCustomTheme = () => {
    const backgroundData = backgroundType === 'solid' 
      ? solidColor 
      : { rotation, color1, color2 };
    
    const customTheme = createCustomTheme(
      'Custom',
      backgroundType,
      backgroundData,
      countColor,
      lastVisitColor
    );
    
    onThemeChange(customTheme);
  };

  React.useEffect(() => {
    if (customMode) {
      handleCustomTheme();
    }
  }, [customMode, backgroundType, solidColor, rotation, color1, color2, countColor, lastVisitColor]);

  return (
    <div className="theme-customizer">
      <h3>Theme Selection</h3>
      
      <div className="predefined-themes">
        <h4>Predefined Themes</h4>
        <div className="theme-grid">
          {predefinedThemes.map((theme) => (
            <button
              key={theme.name}
              className={`theme-button ${selectedTheme.name === theme.name ? 'active' : ''}`}
              onClick={() => handlePredefinedTheme(theme)}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="custom-theme">
        <h4>Custom Theme</h4>
        <label>
          <input
            type="checkbox"
            checked={customMode}
            onChange={(e) => setCustomMode(e.target.checked)}
          />
          Enable Custom Theme
        </label>

        {customMode && (
          <div className="custom-controls">
            <div className="control-group">
              <label>Background Type:</label>
              <select
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value as 'solid' | 'gradient')}
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>

            {backgroundType === 'solid' ? (
              <div className="control-group">
                <label>Background Color:</label>
                <input
                  type="color"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                />
              </div>
            ) : (
              <div className="gradient-controls">
                <div className="control-group">
                  <label>Rotation (degrees):</label>
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                  />
                </div>
                <div className="control-group">
                  <label>Color 1:</label>
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                  />
                </div>
                <div className="control-group">
                  <label>Color 2:</label>
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="control-group">
              <label>Count Text Color:</label>
              <input
                type="color"
                value={countColor}
                onChange={(e) => setCountColor(e.target.value)}
              />
            </div>

            <div className="control-group">
              <label>Last Visit Text Color:</label>
              <input
                type="color"
                value={lastVisitColor}
                onChange={(e) => setLastVisitColor(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeCustomizer;