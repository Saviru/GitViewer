import { NextApiRequest, NextApiResponse } from 'next';
import { validateGitHubUsername } from '../../utils/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const isValid = await validateGitHubUsername(username);
    res.status(200).json({ valid: isValid });
  } catch (error) {
    console.error('Error validating username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}