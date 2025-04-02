const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const USERNAME = process.env.USERNAME || 'Saviru';
const COUNTER_API_URL = `https://api.countapi.xyz/hit/${USERNAME}/profile-views`;
const SVG_OUTPUT_PATH = path.join(process.cwd(), 'profile-views.svg');

async function getViewCount() {
  try {
    const response = await axios.get(COUNTER_API_URL);
    return response.data.value;
  } catch (error) {
    console.error('Error fetching view count:', error.message);
    // Try to get the current count without incrementing
    try {
      const getResponse = await axios.get(`https://api.countapi.xyz/get/${USERNAME}/profile-views`);
      return getResponse.data.value || 1;
    } catch {
      return 1;
    }
  }
}

function generateAnimatedSVG(count) {
  // Format current date
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="150" height="60" viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3498db"/>
      <stop offset="100%" stop-color="#9b59b6"/>
    </linearGradient>
  </defs>
  
  <rect x="0" y="0" width="150" height="60" rx="6" ry="6" fill="url(#gradient)"/>
  
  <text x="75" y="18" font-family="Arial" font-size="11" font-weight="bold" fill="white" text-anchor="middle">Profile Views</text>
  
  <text x="75" y="38" font-family="Arial" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${count.toLocaleString()}</text>
  
  <text x="75" y="54" font-family="Arial" font-size="8" fill="white" text-anchor="middle">Updated: ${formattedDate}</text>
  
  <circle cx="75" cy="38" r="22" fill="white" opacity="0" stroke-width="1" stroke="white">
    <animate attributeName="r" from="22" to="30" dur="1.5s" begin="0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
  </circle>
</svg>`;
}

async function updateProfileViews() {
  try {
    const viewCount = await getViewCount();
    console.log(`View count: ${viewCount}`);
    
    const svgContent = generateAnimatedSVG(viewCount);
    await fs.writeFile(SVG_OUTPUT_PATH, svgContent, 'utf8');
    console.log(`Successfully saved SVG file with count: ${viewCount}`);
  } catch (error) {
    console.error('Error updating profile views:', error);
    // Create a fallback SVG in case of errors
    try {
      const fallbackSvg = generateAnimatedSVG(1);
      await fs.writeFile(SVG_OUTPUT_PATH, fallbackSvg, 'utf8');
      console.log('Created fallback SVG due to error');
    } catch (fallbackError) {
      console.error('Even fallback SVG creation failed:', fallbackError);
    }
  }
}

updateProfileViews().catch(error => {
  console.error('Uncaught error in script execution:', error);
  process.exit(1);
});
