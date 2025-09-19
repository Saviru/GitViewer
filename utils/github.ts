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
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  return ip || 'unknown';
};