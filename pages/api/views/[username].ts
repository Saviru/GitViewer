import { NextApiRequest, NextApiResponse } from 'next';
import { incrementViews } from '../../../utils/storage';
import { generateCounterImage } from '../../../utils/canvas';
import { getThemeByName, predefinedThemes, Theme } from '../../../themes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, theme = 'Default', customTheme } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Increment view count
    const viewData = await incrementViews(username);
    
    // Parse theme
    let selectedTheme: Theme;
    
    if (customTheme && typeof customTheme === 'string') {
      try {
        selectedTheme = JSON.parse(decodeURIComponent(customTheme));
      } catch (error) {
        selectedTheme = getThemeByName('Default') || predefinedThemes[0];
      }
    } else {
      selectedTheme = getThemeByName(theme as string) || predefinedThemes[0];
    }

    // Format last visit date
    const lastVisitDate = new Date(viewData.lastVisit).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Generate image
    const imageBuffer = generateCounterImage(
      viewData.count,
      lastVisitDate,
      selectedTheme,
      username
    );

    // Set headers for image response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating counter:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}