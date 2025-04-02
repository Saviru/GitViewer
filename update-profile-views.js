const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { SVGBuilder } = require('svg-builder');

const USERNAME = process.env.USERNAME || 'Saviru';
const COUNTER_API_URL = `https://api.countapi.xyz/hit/${USERNAME}/profile-views`;
const SVG_OUTPUT_PATH = 'profile-views.svg';

async function getViewCount() {
  try {
    const response = await axios.get(COUNTER_API_URL);
    return response.data.value;
  } catch (error) {
    console.error('Error fetching view count:', error);
    return 0;
  }
}

function generateAnimatedSVG(count) {
  const svg = new SVGBuilder()
    .width(350)
    .height(120)
    .viewBox('0 0 350 120');
  
  // Background with gradient
  svg.element('defs')
    .element('linearGradient', { id: 'gradient', x1: '0%', y1: '0%', x2: '100%', y2: '0%' })
    .element('stop', { offset: '0%', 'stop-color': '#3498db' })
    .element('stop', { offset: '100%', 'stop-color': '#9b59b6' });
  
  // Background rectangle
  svg.element('rect', {
    x: 0,
    y: 0,
    width: 350,
    height: 120,
    rx: 10,
    ry: 10,
    fill: 'url(#gradient)'
  });
  
  // Title
  svg.element('text', {
    x: 175,
    y: 40,
    'font-family': 'Arial',
    'font-size': 22,
    'font-weight': 'bold',
    fill: 'white',
    'text-anchor': 'middle'
  }).text('Profile Views');
  
  // Counter with animation
  svg.element('text', {
    x: 175,
    y: 85,
    'font-family': 'Arial',
    'font-size': 35,
    'font-weight': 'bold',
    fill: 'white',
    'text-anchor': 'middle'
  }).text(count.toLocaleString());
  
  // Add pulse animation
  svg.element('circle', {
    cx: 175,
    cy: 85,
    r: 60,
    fill: 'white',
    opacity: 0,
    'stroke-width': 2,
    stroke: 'white'
  }).element('animate', {
    attributeName: 'r',
    from: 60,
    to: 75,
    dur: '1.5s',
    begin: '0s',
    repeatCount: 'indefinite'
  }).element('animate', {
    attributeName: 'opacity',
    from: 0.3,
    to: 0,
    dur: '1.5s',
    begin: '0s',
    repeatCount: 'indefinite'
  });
  
  return svg.render();
}

async function updateProfileViews() {
  try {
    const viewCount = await getViewCount();
    const svgContent = generateAnimatedSVG(viewCount);
    
    await fs.writeFile(SVG_OUTPUT_PATH, svgContent);
    console.log(`Successfully updated profile views counter: ${viewCount}`);
    
    // Update the README.md with the new counter if needed
    const readmePath = 'README.md';
    if (await fs.pathExists(readmePath)) {
      let readmeContent = await fs.readFile(readmePath, 'utf8');
      
      // Check if the views counter is already in the README
      if (!readmeContent.includes('profile-views.svg')) {
        // Add a suggestion to add the counter in the README
        console.log('Consider adding the following line to your README.md:');
        console.log('![Profile Views](./profile-views.svg)');
      }
    }
  } catch (error) {
    console.error('Error updating profile views:', error);
  }
}

updateProfileViews();
