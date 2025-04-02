const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const USERNAME = process.env.USERNAME || 'Saviru';
const COUNTER_API_URL = `https://api.countapi.xyz/hit/${USERNAME}/profile-views`;
const SVG_OUTPUT_PATH = path.join(process.cwd(), 'profile-views.svg');

async function getViewCount() {
  try {
    const response = await axios.get(COUNTER_API_URL);
    console.log('API Response:', response.data);
    return response.data.value;
  } catch (error) {
    console.error('Error fetching view count:', error.message);
    // Default to a starting count of 1 if the API fails
    return 1;
  }
}

function generateAnimatedSVG(count) {
  // Create SVG content manually since svg-builder might have issues
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="350" height="120" viewBox="0 0 350 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3498db"/>
      <stop offset="100%" stop-color="#9b59b6"/>
    </linearGradient>
  </defs>
  
  <rect x="0" y="0" width="350" height="120" rx="10" ry="10" fill="url(#gradient)"/>
  
  <text x="175" y="40" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">Profile Views</text>
  
  <text x="175" y="85" font-family="Arial" font-size="35" font-weight="bold" fill="white" text-anchor="middle">${count.toLocaleString()}</text>
  
  <circle cx="175" cy="85" r="60" fill="white" opacity="0" stroke-width="2" stroke="white">
    <animate attributeName="r" from="60" to="75" dur="1.5s" begin="0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
  </circle>
</svg>`;
}

async function updateProfileViews() {
  try {
    console.log('Starting profile views update process...');
    console.log('Current working directory:', process.cwd());
    
    const viewCount = await getViewCount();
    console.log(`View count: ${viewCount}`);
    
    const svgContent = generateAnimatedSVG(viewCount);
    console.log('Generated SVG content successfully');
    console.log(`Saving SVG to: ${SVG_OUTPUT_PATH}`);
    
    // Make sure we can write to the file
    await fs.writeFile(SVG_OUTPUT_PATH, svgContent, 'utf8');
    console.log(`Successfully saved SVG file at: ${SVG_OUTPUT_PATH}`);
    
    // Check if SVG was created successfully
    const fileExists = await fs.pathExists(SVG_OUTPUT_PATH);
    console.log(`SVG file exists: ${fileExists}`);
    
    // Update the README.md with the new counter if needed
    const readmePath = path.join(process.cwd(), 'README.md');
    if (await fs.pathExists(readmePath)) {
      console.log('README.md found, checking for counter reference');
      let readmeContent = await fs.readFile(readmePath, 'utf8');
      
      // Check if the views counter is already in the README
      if (!readmeContent.includes('profile-views.svg')) {
        console.log('No counter reference found in README');
        console.log('Consider adding the following line to your README.md:');
        console.log('![Profile Views](./profile-views.svg)');
      } else {
        console.log('Counter reference found in README');
      }
    }
  } catch (error) {
    console.error('Error in updateProfileViews function:', error);
    // Create a fallback SVG in case of errors
    const fallbackSvg = generateAnimatedSVG(1);
    try {
      await fs.writeFile(SVG_OUTPUT_PATH, fallbackSvg, 'utf8');
      console.log('Created fallback SVG due to error');
    } catch (fallbackError) {
      console.error('Even fallback SVG creation failed:', fallbackError);
    }
  }
}

// Execute the function and log any uncaught errors
updateProfileViews().catch(error => {
  console.error('Uncaught error in script execution:', error);
  process.exit(1);
});
