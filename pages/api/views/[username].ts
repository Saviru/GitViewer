import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserViews } from '../../../utils/storage';
import { validateGitHubUsername, getClientIP } from '../../../utils/github';
import { getBackgroundStyle, getThemeByName } from '../../../themes';
import { Theme } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, theme } = req.query;
  
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Validate GitHub username
    const isValidUser = await validateGitHubUsername(username);
    if (!isValidUser) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }

    // Get client IP and update views
    const clientIP = getClientIP(req);
    console.log(`Visit from IP ${clientIP} for user ${username}`);
    
    const viewData = updateUserViews(username, clientIP);
    console.log(`Current count for ${username}: ${viewData.count}`);

    // Parse theme if provided
    let selectedTheme: Theme = {
      name: 'Default',
      background: { type: 'solid', color: '#1a1a1a' },
      countColor: '#ffffff',
      lastVisitColor: '#888888'
    };

    if (theme && typeof theme === 'string') {
      // First try to find it as a predefined theme name
      const predefinedTheme = getThemeByName(decodeURIComponent(theme));
      
      if (predefinedTheme) {
        selectedTheme = predefinedTheme;
        console.log(`Using predefined theme: ${selectedTheme.name}`);
      } else {
        // If not found as a theme name, try to parse as JSON (custom theme)
        try {
          selectedTheme = JSON.parse(decodeURIComponent(theme));
          console.log(`Using custom theme: ${selectedTheme.name}`);
        } catch (e) {
          console.error('Error parsing theme:', e);
          console.log('Falling back to default theme');
        }
      }
    }

    // Generate SVG
    const backgroundStyle = getBackgroundStyle(selectedTheme);
    const lastVisitDate = new Date(viewData.lastVisit).toLocaleDateString();
    const lastVisitTime = new Date(viewData.lastVisit).toLocaleTimeString();

    const svg = `
      <svg width="300" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${selectedTheme.background.type === 'gradient' ? `
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${selectedTheme.background.gradient?.rotation || 0})">
              <stop offset="0%" style="stop-color:${selectedTheme.background.gradient?.color1};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${selectedTheme.background.gradient?.color2};stop-opacity:1" />
            </linearGradient>
          ` : ''}
        </defs>
        
        <rect width="300" height="120" rx="10" ry="10" 
              fill="${selectedTheme.background.type === 'gradient' ? 'url(#bg)' : selectedTheme.background.color}" />
        
        <text x="150" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
              fill="${selectedTheme.countColor}">Profile Views</text>
        
        <text x="150" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              fill="${selectedTheme.countColor}">${viewData.count}</text>
        
        <text x="150" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" 
              fill="${selectedTheme.lastVisitColor}">Last visit:</text>
        
        <text x="150" y="95" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" 
              fill="${selectedTheme.lastVisitColor}">${lastVisitDate}</text>
        
        <text x="150" y="108" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" 
              fill="${selectedTheme.lastVisitColor}">${lastVisitTime}</text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error in views API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}