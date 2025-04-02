const { put, get } = require('@vercel/blob');

module.exports = async (req, res) => {
  try {
    // Username
    const username = "Saviru";
    const counterKey = `${username}-view-counter.txt`;
    
    // Get current counter value or initialize
    let viewCounter = 0;
    try {
      // Try to get existing counter value
      const blob = await get(counterKey);
      if (blob) {
        const text = await blob.text();
        viewCounter = parseInt(text, 10) || 0;
      }
    } catch (error) {
      console.log('First-time counter initialization');
    }
    
    // Increment counter
    viewCounter++;
    
    // Save updated counter
    await put(counterKey, new Blob([viewCounter.toString()]), {
      access: 'public',
    });
    
    // Get current date and time in UTC
    const now = new Date();
    const formattedDateTime = now.toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '');
    
    // Generate SVG with counting and entry animations
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
      
      /* Counting animation setup */
      @keyframes countUp {
        0% { content: "0"; }
        20% { content: "${Math.ceil(viewCounter * 0.2).toString()}"; }
        40% { content: "${Math.ceil(viewCounter * 0.4).toString()}"; }
        60% { content: "${Math.ceil(viewCounter * 0.6).toString()}"; }
        80% { content: "${Math.ceil(viewCounter * 0.8).toString()}"; }
        100% { content: "${viewCounter.toString()}"; }
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
      
      .counter-text::after {
        content: "${viewCounter}";
        animation: countUp 1.5s forwards;
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
    
    // Generate a unique query parameter based on time to defeat caching
    const noCacheParam = Date.now();
    
    // Set EXTREMELY aggressive cache prevention headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Vary', '*');
    res.setHeader('ETag', `W/"${noCacheParam}"`);
    
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