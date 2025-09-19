import { ViewData } from '../types';

// In-memory storage (will persist during function lifetime)
// Note: This resets on cold starts, but works for serverless environments
const memoryStorage: Record<string, ViewData> = {};
const ipCooldowns: Record<string, Record<string, number>> = {}; // username -> ip -> timestamp

// Cooldown period in milliseconds (e.g., 1 hour = 3600000ms)
const IP_COOLDOWN_MS = 1 * 60 * 60 * 1000; // 1 hour

export const getViewData = (): Record<string, ViewData> => {
  return memoryStorage;
};

export const saveViewData = (data: Record<string, ViewData>): void => {
  // Update in-memory storage
  Object.assign(memoryStorage, data);
};

// Check if IP is in cooldown period
const isIPInCooldown = (username: string, clientIP: string): boolean => {
  if (!ipCooldowns[username] || !ipCooldowns[username][clientIP]) {
    return false;
  }
  
  const lastVisit = ipCooldowns[username][clientIP];
  const now = Date.now();
  
  return (now - lastVisit) < IP_COOLDOWN_MS;
};

// Update IP cooldown
const updateIPCooldown = (username: string, clientIP: string): void => {
  if (!ipCooldowns[username]) {
    ipCooldowns[username] = {};
  }
  ipCooldowns[username][clientIP] = Date.now();
  
  // Clean up old entries (older than 24 hours)
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  Object.keys(ipCooldowns[username]).forEach(ip => {
    if (ipCooldowns[username][ip] < oneDayAgo) {
      delete ipCooldowns[username][ip];
    }
  });
};

export const updateUserViews = (username: string, clientIP: string): ViewData => {
  const allData = getViewData();
  const userData = allData[username] || {
    username,
    count: 0,
    lastVisit: new Date().toISOString(),
    ips: [] // Keep for backward compatibility, but use cooldown system
  };

  // Use cooldown-based approach instead of storing all IPs
  const shouldIncrement = !isIPInCooldown(username, clientIP);
  
  if (shouldIncrement) {
    userData.count += 1;
    updateIPCooldown(username, clientIP);
    
    // Update IPs array for display purposes (keep last 10 for reference)
    if (!userData.ips.includes(clientIP)) {
      userData.ips.push(clientIP);
      if (userData.ips.length > 10) {
        userData.ips = userData.ips.slice(-10);
      }
    }
  }
  
  // Always update last visit time
  userData.lastVisit = new Date().toISOString();

  allData[username] = userData;
  saveViewData(allData);
  
  return userData;
};