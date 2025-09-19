import { useState, useEffect } from 'react';
import { Theme, predefinedThemes, createCustomTheme } from '../themes';

export default function Home() {
  const [username, setUsername] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(predefinedThemes[0]);
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [markdownCode, setMarkdownCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState(false);

  // Custom theme state
  const [customBgType, setCustomBgType] = useState<'solid' | 'gradient'>('solid');
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [customGradientRotation, setCustomGradientRotation] = useState(45);
  const [customGradientColor1, setCustomGradientColor1] = useState('#667eea');
  const [customGradientColor2, setCustomGradientColor2] = useState('#764ba2');
  const [customViewCountColor, setCustomViewCountColor] = useState('#333333');
  const [customLastVisitColor, setCustomLastVisitColor] = useState('#666666');

  useEffect(() => {
    if (username && isValidUsername) {
      updatePreview();
    }
  }, [username, selectedTheme, customTheme, isValidUsername]);

  const validateUsername = async (user: string) => {
    if (!user.trim()) {
      setIsValidUsername(false);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch(`/api/validate-username?username=${user}`);
      const data = await response.json();
      setIsValidUsername(data.valid);
    } catch (error) {
      setIsValidUsername(false);
    }
    setIsValidating(false);
  };

  const updatePreview = () => {
    if (!username || !isValidUsername) return;

    const baseUrl = window.location.origin;
    let url = `${baseUrl}/api/views/${username}`;
    
    if (isCustomMode && customTheme) {
      const encodedTheme = encodeURIComponent(JSON.stringify(customTheme));
      url += `?customTheme=${encodedTheme}`;
    } else {
      url += `?theme=${selectedTheme.name}`;
    }

    setPreviewUrl(url);
    setMarkdownCode(`![Profile Views](${url})`);
  };

  const createCustomThemeFromInputs = () => {
    const theme = createCustomTheme(
      'Custom',
      {
        type: customBgType,
        color: customBgType === 'solid' ? customBgColor : undefined,
        gradient: customBgType === 'gradient' ? {
          rotation: customGradientRotation,
          color1: customGradientColor1,
          color2: customGradientColor2
        } : undefined
      },
      {
        viewCountColor: customViewCountColor,
        lastVisitColor: customLastVisitColor
      }
    );
    
    setCustomTheme(theme);
  };

  useEffect(() => {
    if (isCustomMode) {
      createCustomThemeFromInputs();
    }
  }, [
    isCustomMode,
    customBgType,
    customBgColor,
    customGradientRotation,
    customGradientColor1,
    customGradientColor2,
    customViewCountColor,
    customLastVisitColor
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Profile Views Counter
          </h1>
          <p className="text-lg text-gray-600">
            Create a customizable views counter for your GitHub profile README
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => validateUsername(username)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your GitHub username"
              />
              <button
                onClick={() => validateUsername(username)}
                disabled={isValidating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
            {username && !isValidating && (
              <p className={`mt-2 text-sm ${isValidUsername ? 'text-green-600' : 'text-red-600'}`}>
                {isValidUsername ? '✓ Valid GitHub username' : '✗ Invalid GitHub username'}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`px-4 py-2 rounded-md ${!isCustomMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Predefined Themes
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-4 py-2 rounded-md ${isCustomMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Custom Theme
              </button>
            </div>

            {!isCustomMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Theme
                </label>
                <select
                  value={selectedTheme.name}
                  onChange={(e) => {
                    const theme = predefinedThemes.find(t => t.name === e.target.value);
                    if (theme) setSelectedTheme(theme);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {predefinedThemes.map((theme) => (
                    <option key={theme.name} value={theme.name}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Type
                  </label>
                  <select
                    value={customBgType}
                    onChange={(e) => setCustomBgType(e.target.value as 'solid' | 'gradient')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>

                {customBgType === 'solid' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      className="w-20 h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation (degrees)
                      </label>
                      <input
                        type="number"
                        value={customGradientRotation}
                        onChange={(e) => setCustomGradientRotation(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="0"
                        max="360"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color 1
                      </label>
                      <input
                        type="color"
                        value={customGradientColor1}
                        onChange={(e) => setCustomGradientColor1(e.target.value)}
                        className="w-20 h-10 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color 2
                      </label>
                      <input
                        type="color"
                        value={customGradientColor2}
                        onChange={(e) => setCustomGradientColor2(e.target.value)}
                        className="w-20 h-10 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      View Count Color
                    </label>
                    <input
                      type="color"
                      value={customViewCountColor}
                      onChange={(e) => setCustomViewCountColor(e.target.value)}
                      className="w-20 h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Visit Color
                    </label>
                    <input
                      type="color"
                      value={customLastVisitColor}
                      onChange={(e) => setCustomLastVisitColor(e.target.value)}
                      className="w-20 h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {previewUrl && isValidUsername && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <img src={previewUrl} alt="Profile Views Counter" className="mx-auto" />
              </div>
            </div>
          )}

          {markdownCode && isValidUsername && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Markdown Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={markdownCode}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(markdownCode)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {previewUrl && isValidUsername && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direct URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={previewUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  onClick={() => copyToClipboard(previewUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Enter your GitHub username and validate it</li>
            <li>Choose a predefined theme or create a custom one</li>
            <li>Copy the generated markdown code</li>
            <li>Paste it into your GitHub profile README.md file</li>
            <li>Commit the changes and your view counter will appear!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}