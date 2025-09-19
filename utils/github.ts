export const validateGitHubUsername = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    return response.status === 200;
  } catch (error) {
    console.error('Error validating GitHub username:', error);
    return false;
  }
};

export const getClientIP = (req: any): string => {
  // Try multiple headers that Vercel and other proxies use
  const xRealIP = req.headers['x-real-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];
  const cfConnectingIP = req.headers['cf-connecting-ip']; // Cloudflare
  const xClientIP = req.headers['x-client-ip'];
  
  // Priority order for different hosting environments
  let ip = xRealIP || cfConnectingIP || xClientIP || xForwardedFor;
  
  if (ip && typeof ip === 'string') {
    // Take the first IP if it's a comma-separated list
    ip = ip.split(',')[0].trim();
  }
  
  // Fallback to connection IP or generate a unique identifier
  if (!ip || ip === 'unknown') {
    // Use request headers to create a semi-unique identifier
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    // Create a hash-like identifier from headers
    const identifier = Buffer.from(userAgent + acceptLanguage + acceptEncoding)
      .toString('base64')
      .slice(0, 16);
    
    return `fallback-${identifier}`;
  }
  
  return ip;
};