const { get } = require('@vercel/blob');

module.exports = async (req, res) => {
  try {
    const counterKey = `Saviru-view-counter.txt`;
    const blob = await get(counterKey);
    const count = await blob.text();
    
    res.status(200).json({ 
      count: parseInt(count, 10),
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve count' });
  }
};