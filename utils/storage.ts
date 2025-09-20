import { ViewData } from '../types';

// In-memory storage (will persist during function lifetime)
// Note: This resets on cold starts, but works for serverless environments
// Using globalThis to ensure persistence across multiple calls

declare global {
  var memoryStorage: Record<string, ViewData> | undefined;
  var ipCooldowns: Record<string, Record<string, number>> | undefined;
}

if (!globalThis.memoryStorage) {
  globalThis.memoryStorage = {};
}
if (!globalThis.ipCooldowns) {
  globalThis.ipCooldowns = {};
}

const memoryStorage: Record<string, ViewData> = globalThis.memoryStorage;
const ipCooldowns: Record<string, Record<string, number>> = globalThis.ipCooldowns;

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

// Get current view data for a user (always returns latest count)
export const getCurrentUserViews = (username: string): ViewData => {
  const allData = getViewData();
  return allData[username] || {
    username,
    count: 0,
    lastVisit: new Date().toISOString(),
    ips: []
  };
};

export const updateUserViews = (username: string, clientIP: string): ViewData => {
  // Always work directly with the global storage to ensure we have the latest data
  if (!memoryStorage[username]) {
    memoryStorage[username] = {
      username,
      count: 0,
      lastVisit: new Date().toISOString(),
      ips: []
    };
  }
  
  // Get the current data (always the most up-to-date)
  const userData = memoryStorage[username];

  // Use cooldown-based approach instead of storing all IPs
  const shouldIncrement = !isIPInCooldown(username, clientIP);
  
  console.log(`IP ${clientIP} for ${username}: shouldIncrement=${shouldIncrement}, currentCount=${userData.count}`);
  
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
    
    console.log(`Incremented count for ${username} to ${userData.count}`);
  }
  
  // Always update last visit time
  userData.lastVisit = new Date().toISOString();

  // The data is already updated in memoryStorage, no need to reassign
  
  // Return the current state (which includes the latest count)
  return userData;
};