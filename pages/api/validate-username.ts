import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (response.ok) {
      const userData = await response.json();
      return res.status(200).json({ 
        valid: true, 
        user: {
          login: userData.login,
          name: userData.name,
          avatar_url: userData.avatar_url
        }
      });
    } else {
      return res.status(200).json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating username:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}