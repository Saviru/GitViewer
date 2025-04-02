// Profile view counter API endpoint
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
    
    // Get current count and increment
    let count = await kv.get(key) || 0;
    count++;
    
    // Update the count
    await kv.set(key, count);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Return the count as JSON
    res.status(200).json({ username, count });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update view count' });
  }
};