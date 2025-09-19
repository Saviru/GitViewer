import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ThemeCustomizer from '../components/ThemeCustomizer';
import Counter from '../components/Counter';
import { Theme } from '../types';
import { predefinedThemes } from '../themes';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isValidUsername, setIsValidUsername] = useState<boolean | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(predefinedThemes[0]);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateUsername = async (user: string) => {
    if (!user.trim()) {
      setIsValidUsername(null);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch('/api/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user }),
      });
      
      const data = await response.json();
      setIsValidUsername(data.valid);
    } catch (error) {
      console.error('Error validating username:', error);
      setIsValidUsername(false);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        validateUsername(username);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  useEffect(() => {
    if (username && isValidUsername) {
      const themeParam = encodeURIComponent(JSON.stringify(selectedTheme));
      const url = `${window.location.origin}/api/views/${username}?theme=${themeParam}`;
      setGeneratedUrl(url);
    } else {
      setGeneratedUrl('');
    }
  }, [username, selectedTheme, isValidUsername]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getMarkdownCode = () => {
    return `![Profile Views](${generatedUrl})`;
  };

  const getHtmlCode = () => {
    return `<img src="${generatedUrl}" alt="Profile Views" />`;
  };

  return (
    <>
      <Head>
        <title>GitViewer</title>
        <meta name="description" content="Generate custom profile view counters for your GitHub README" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <header>
          <h1>GitViewer - GitHub Profile Views Counter (Beta)</h1>
          <p>Create a custom profile views counter for your GitHub README</p>
        </header>

        <main>
          <div className="input-section">
            <h2>Step 1: Enter Your GitHub Username</h2>
            <div className="username-input">
              <input
                type="text"
                placeholder="GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`username-field ${
                  isValidUsername === false ? 'invalid' : 
                  isValidUsername === true ? 'valid' : ''
                }`}
              />
              {isValidating && <span className="status">Validating...</span>}
              {isValidUsername === false && <span className="status error">User not found</span>}
              {isValidUsername === true && <span className="status success">Valid user ✓</span>}
            </div>
          </div>

          <div className="theme-section">
            <h2>Step 2: Customize Your Theme</h2>
            <ThemeCustomizer
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
            />
          </div>

          <div className="preview-section">
            <h2>Step 3: Preview</h2>
            {username && isValidUsername && (
              <div className="preview">
                <Counter
                  username={username}
                  theme={selectedTheme}
                  count={42}
                  lastVisit={new Date().toISOString()}
                />
              </div>
            )}
          </div>

          {generatedUrl && (
            <div className="output-section">
              <h2>Step 4: Add to Your README</h2>
              
              <div className="code-block">
                <h3>Markdown (for README.md)</h3>
                <pre>
                  <code>{getMarkdownCode()}</code>
                </pre>
                <button onClick={() => copyToClipboard(getMarkdownCode())}>
                  Copy Markdown
                </button>
              </div>

              <div className="code-block">
                <h3>HTML</h3>
                <pre>
                  <code>{getHtmlCode()}</code>
                </pre>
                <button onClick={() => copyToClipboard(getHtmlCode())}>
                  Copy HTML
                </button>
              </div>

              <div className="code-block">
                <h3>Direct URL</h3>
                <pre>
                  <code>{generatedUrl}</code>
                </pre>
                <button onClick={() => copyToClipboard(generatedUrl)}>
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
