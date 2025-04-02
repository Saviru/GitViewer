// SVG view counter endpoint
const { createClient } = require('@vercel/kv');

// Initialize KV storage client
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async (req, res) => {
  try {
    const username = req.query.username || 'Saviru';
    const key = `profile-views-${username}`;
    
    // Get current count (increment if ?count=true is in the URL)
    let count = await kv.get(key) || 0;
    if (req.query.count === 'true') {
      count++;
      await kv.set(key, count);
    }
    
    // Generate SVG with animation
    const svg = generateAnimatedSVG(count);
    
    // Set SVG headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=10');
    
    // Return the SVG
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(generateErrorSVG());
  }
};

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

function generateErrorSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="150" height="60" viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="150" height="60" rx="6" ry="6" fill="#ff5555"/>
  <text x="75" y="35" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Error loading view counter</text>
</svg>`;
}