const { put, list, get } = require('@vercel/blob');

module.exports = async (req, res) => {
  try {
    // Use the provided timestamp and username
    const formattedDateTime = "2025-04-02 17:58:04";
    const username = "Saviru";
    
    // Fixed counter key
    const COUNTER_KEY = "saviru-profile-counter";
    
    // Step 1: Find the current counter value
    let viewCounter = 0;
    let counterFound = false;
    
    try {
      // List all existing blobs to find our counter file
      const { blobs } = await list({ prefix: COUNTER_KEY });
      
      // Sort by upload date - most recent first
      const sortedBlobs = blobs.sort((a, b) => 
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      
      if (sortedBlobs.length > 0) {
        // Get the most recent counter file
        const latestBlob = sortedBlobs[0];
        
        // Fetch the content directly
        const response = await fetch(latestBlob.url);
        const text = await response.text();
        
        // Parse the counter value
        const parsed = parseInt(text.trim(), 10);
        if (!isNaN(parsed)) {
          viewCounter = parsed;
          counterFound = true;
        }
      }
    } catch (error) {
      console.error("Error reading counter:", error);
      // Continue with default 0
    }
    
    // Step 2: Increment the counter
    viewCounter++;
    
    // Step 3: Create a new counter file with timestamp to make it unique
    // This prevents collisions but still lets us track the counter
    const timestamp = Date.now();
    const newCounterPath = `${COUNTER_KEY}-${timestamp}.txt`;
    
    try {
      await put(
        newCounterPath,
        Buffer.from(viewCounter.toString()),
        {
          access: 'public',
          contentType: 'text/plain',
          addRandomSuffix: false
        }
      );
    } catch (error) {
      console.error("Error updating counter:", error);
    }
    
    // Generate SVG with debugging info
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="70" viewBox="0 0 180 70" xmlns="http://www.w3.org/2000/svg">
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
      
      .debug-text {
        font-family: Arial;
        font-size: 6px;
        fill: rgba(255,255,255,0.5);
        text-anchor: middle;
      }
    </style>
  </defs>
  
  <g class="container">
    <rect x="0" y="0" width="180" height="70" rx="6" ry="6" fill="url(#gradient)"/>
    <text class="regular-text" x="90" y="18" font-size="11" font-weight="bold">${username}'s Profile Views</text>
    <text class="counter-text" x="90" y="38">${viewCounter}</text>
    <text class="regular-text" x="90" y="54" font-size="8">Updated: ${formattedDateTime} UTC</text>
    <text class="debug-text" x="90" y="66">Saviru Kashmira Atapattu</text>
  </g>
</svg>`;
    
    // Set extremely aggressive anti-caching headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('ETag', `"${timestamp}"`);
    res.setHeader('Vary', '*');
    
    // Return the SVG with debug info
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="180" height="60" rx="6" ry="6" fill="#ff5555"/>
  <text x="90" y="35" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Error: ${error.message}</text>
</svg>`);
  }
};