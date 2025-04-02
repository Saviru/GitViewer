const { put, list, get } = require('@vercel/blob');

module.exports = async (req, res) => {
  try {
    // IMPORTANT: Fixed static pathname - prevents random hash generation
    const COUNTER_PATH = "counter/saviru-views.txt";
    const username = "Saviru";
    
    // Get current counter value or initialize
    let viewCounter = 0;
    try {
      // Use pathname instead of variable key
      const blob = await get(COUNTER_PATH, { type: 'text' });
      if (blob) {
        viewCounter = parseInt(blob, 10) || 0;
        console.log(`Retrieved existing count: ${viewCounter}`);
      } else {
        console.log("No existing counter found, starting at 0");
      }
    } catch (error) {
      console.log("First-time counter initialization");
    }
    
    // Increment counter
    viewCounter++;
    
    // Save updated counter with explicit pathname
    await put(COUNTER_PATH, Buffer.from(viewCounter.toString()), {
      access: 'public',
      contentType: 'text/plain',
      pathname: COUNTER_PATH // This ensures the same path is used
    });
    
    // Use the provided timestamp
    const formattedDateTime = "2025-04-02 17:05:11";
    
    // Generate SVG with animations
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021D4A"/>
      <stop offset="100%" stop-color="#520806"/>
    </linearGradient>
    <style>
      /* Entry animation for whole content */
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      .container {
        animation: fadeIn 0.8s ease-out forwards;
      }
      
      .counter-text {
        font-family: Arial;
        font-size: 16px;
        font-weight: bold;
        fill: #FE428E;
        text-anchor: middle;
      }
      
      .regular-text {
        font-family: Arial;
        fill: #F8D847;
        text-anchor: middle;
      }
    </style>
  </defs>
  
  <g class="container">
    <rect x="0" y="0" width="180" height="60" rx="6" ry="6" fill="url(#gradient)"/>
    <text class="regular-text" x="90" y="18" font-size="11" font-weight="bold">${username}'s Profile Views</text>
    <text class="counter-text" x="90" y="38">${viewCounter}</text>
    <text class="regular-text" x="90" y="54" font-size="8">Updated: ${formattedDateTime} UTC</text>
  </g>
</svg>`;
    
    // Set cache busting headers
    const timestamp = Date.now();
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('ETag', `W/"${timestamp}"`);
    
    // Return the SVG
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="180" height="60" rx="6" ry="6" fill="#ff5555"/>
  <text x="90" y="35" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Error loading view counter</text>
</svg>`);
  }
};