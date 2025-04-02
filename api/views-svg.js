const { put, get } = require('@vercel/blob');

module.exports = async (req, res) => {
  try {
    // Use fixed values provided
    const username = "Saviru";
    const formattedDateTime = "2025-04-02 17:08:45";
    
    // IMPORTANT: Use a fully qualified, fixed pathname
    const BLOB_PATH = 'counters/profile-views.txt';
    
    // Get current counter value or initialize to 0
    let viewCounter = 0;
    try {
      // Use proper error handling around the get operation
      const blob = await get(BLOB_PATH);
      if (blob) {
        const text = await blob.text();
        const parsed = parseInt(text, 10);
        // Only update if the parsed value is a valid number
        if (!isNaN(parsed)) {
          viewCounter = parsed;
        }
      }
    } catch (error) {
      console.log("Counter not found, initializing to 0");
      // Continue with default 0
    }
    
    // Increment counter
    viewCounter++;
    
    // Save counter back to the SAME pathname
    try {
      await put(
        BLOB_PATH,
        Buffer.from(viewCounter.toString()),
        {
          pathname: BLOB_PATH,
          contentType: 'text/plain',
          access: 'public'
        }
      );
    } catch (error) {
      console.error("Failed to update counter:", error);
    }
    
    // Generate SVG with entry animation
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
    
    // Set aggressive anti-caching headers
    const timestamp = Date.now();
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
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