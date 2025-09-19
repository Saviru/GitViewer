import { createCanvas, registerFont } from 'canvas';
import { Theme } from '../themes';

export const generateCounterImage = (
  viewCount: number,
  lastVisit: string,
  theme: Theme,
  username: string
): Buffer => {
  const width = 400;
  const height = 120;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  if (theme.background.type === 'solid') {
    ctx.fillStyle = theme.background.color || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (theme.background.type === 'gradient' && theme.background.gradient) {
    const { rotation, color1, color2 } = theme.background.gradient;
    const angle = (rotation * Math.PI) / 180;
    
    const gradient = ctx.createLinearGradient(
      0, 0, 
      Math.cos(angle) * width, 
      Math.sin(angle) * height
    );
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Border radius effect (approximate with clipping)
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, theme.borderRadius || 8);
  ctx.clip();

  // Title
  ctx.fillStyle = theme.colors.viewCountColor;
  ctx.font = `bold 16px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(`${username}'s Profile Views`, width / 2, 25);

  // View count
  ctx.fillStyle = theme.colors.viewCountColor;
  ctx.font = `bold ${theme.fontSize?.viewCount || 24}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(`${viewCount.toLocaleString()} views`, width / 2, 65);

  // Last visit
  ctx.fillStyle = theme.colors.lastVisitColor;
  ctx.font = `${theme.fontSize?.lastVisit || 14}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(`Last visit: ${lastVisit}`, width / 2, 95);

  return canvas.toBuffer('image/png');
};