import { kv } from '@vercel/kv';

export const getViewData = async (username: string) => {
  try {
    const data = await kv.get(`views:${username}`);
    return data as { count: number; lastVisit: string } | null;
  } catch (error) {
    console.error('Error getting view data:', error);
    return null;
  }
};

export const incrementViews = async (username: string) => {
  try {
    const existing = await getViewData(username);
    const newCount = (existing?.count || 0) + 1;
    const now = new Date().toISOString();
    
    await kv.set(`views:${username}`, {
      count: newCount,
      lastVisit: now
    });
    
    return { count: newCount, lastVisit: now };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { count: 1, lastVisit: new Date().toISOString() };
  }
};