// Simplified counter that will work without database setup
module.exports = async (req, res) => {
    try {
      // Static counter (this doesn't persist between deployments)
      const count = 1;
      
      // Generate SVG
      const svg = generateAnimatedSVG(count);
      
      // Set correct headers
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      // Return the SVG
      res.status(200).send(svg);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(generateErrorSVG());
    }
  };
  
  function generateAnimatedSVG(count) {
    // Current date
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
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
  </svg>`;
  }
  
  function generateErrorSVG() {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="150" height="60" viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="150" height="60" rx="6" ry="6" fill="#ff5555"/>
    <text x="75" y="35" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Error loading view counter</text>
  </svg>`;
  }