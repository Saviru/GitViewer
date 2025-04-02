const fs = require('fs');

function generateTestSVG() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="350" height="120" viewBox="0 0 350 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="350" height="120" fill="#3498db"/>
  <text x="175" y="60" font-family="Arial" font-size="20" fill="white" text-anchor="middle">Test SVG - Profile Views: 1</text>
</svg>`;
  
  fs.writeFileSync('test-svg.svg', svg, 'utf8');
  console.log('Test SVG created successfully');
}

generateTestSVG();
