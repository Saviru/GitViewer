import { ViewData } from '../types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'views.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

export const getViewData = (): Record<string, ViewData> => {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return {};
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading view data:', error);
    return {};
  }
};

export const saveViewData = (data: Record<string, ViewData>): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving view data:', error);
  }
};

export const updateUserViews = (username: string, clientIP: string): ViewData => {
  const allData = getViewData();
  const userData = allData[username] || {
    username,
    count: 0,
    lastVisit: new Date().toISOString(),
    ips: []
  };

  // Check if IP already exists (prevent same IP from incrementing multiple times)
  if (!userData.ips.includes(clientIP)) {
    userData.count += 1;
    userData.ips.push(clientIP);
    userData.lastVisit = new Date().toISOString();
    
    // Keep only last 1000 IPs to prevent unlimited growth
    if (userData.ips.length > 1000) {
      userData.ips = userData.ips.slice(-1000);
    }
  } else {
    // Update last visit time even if not incrementing count
    userData.lastVisit = new Date().toISOString();
  }

  allData[username] = userData;
  saveViewData(allData);
  
  return userData;
};