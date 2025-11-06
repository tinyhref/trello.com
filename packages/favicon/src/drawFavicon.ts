import { roundRect } from './roundRect';

const SIZE = 64;
const RADIUS = 19;

const RED = '#C9372C';
const WHITE = '#FFFFFF';
const BLUE = '#0055CC';

interface DrawFaviconOptions {
  color?: string;
  bottomColor?: string;
  topColor?: string;
  hasNotifications?: boolean;
  tiled?: boolean;
}

export const drawFavicon = (
  img: HTMLImageElement | undefined,
  options: DrawFaviconOptions,
) => {
  const canvas = document.createElement('canvas');
  canvas.height = SIZE;
  canvas.width = SIZE;

  const ctx =
    typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;

  if (ctx === null) {
    throw Error("Can't render to the canvas!");
  }

  ctx.save();

  if (img) {
    roundRect(ctx, 0, 0, SIZE, SIZE, RADIUS, false, false, null);
    ctx.clip();

    if (options.tiled) {
      ctx.drawImage(img, 0, 0);
    } else {
      const { width, height } = img;
      if (width > height) {
        ctx.drawImage(img, 0, 0, (SIZE * width) / height, SIZE);
      } else {
        ctx.drawImage(img, 0, 0, SIZE, (SIZE * height) / width);
      }
    }
  } else if (options.topColor && options.bottomColor) {
    const gradientFill = ctx.createLinearGradient(0, 0, 51, 74);
    gradientFill.addColorStop(0, options.topColor);
    gradientFill.addColorStop(1, options.bottomColor);
    roundRect(ctx, 0, 0, SIZE, SIZE, RADIUS, true, false, gradientFill);
  } else {
    const colorFill = options.color ? options.color : BLUE;
    roundRect(ctx, 0, 0, SIZE, SIZE, RADIUS, true, false, colorFill);
  }

  roundRect(ctx, 12, 12, 16, 37, 4, true, false, WHITE);
  roundRect(ctx, 36, 12, 16, 23, 4, true, false, WHITE);

  ctx.restore();

  if (options.hasNotifications) {
    ctx.beginPath();
    ctx.arc(SIZE - 14, 14, 14, 0, 2 * Math.PI, false);
    ctx.fillStyle = RED;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = WHITE;
    ctx.stroke();
    ctx.closePath();
  }

  return canvas.toDataURL('image/png');
};
