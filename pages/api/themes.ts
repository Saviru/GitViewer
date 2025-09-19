import { NextApiRequest, NextApiResponse } from 'next';
import { predefinedThemes } from '../../themes';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ themes: predefinedThemes });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}