// eslint-disable-next-line @trello/enforce-variable-case
const getRGBValuesFromRGBString = (rgbColor: string): number[] | null => {
  const matches = rgbColor.match(/\d{1,3},\s*\d{1,3},\s*\d{1,3}/gi);
  if (matches?.length) {
    return matches[0].split(/[,\s]+/).map((x) => parseInt(x, 10));
  }

  return null;
};

// https://stackoverflow.com/a/5624139
// eslint-disable-next-line @trello/enforce-variable-case
const getRGBValuesFromHexString = (hexColor: string): number[] | null => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = hexColor.replace(
    shorthandRegex,
    (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`,
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result?.length
    ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
      ]
    : null;
};

export const makeRGB = (color: string): number[] | null => {
  if (color[0] === '#') {
    return getRGBValuesFromHexString(color);
  } else if (color.indexOf('rgb') === 0) {
    return getRGBValuesFromRGBString(color);
  } else if (color.indexOf('var(') === 0) {
    return null;
  } else {
    throw new Error('Must provide a hex, RGB, or RGBA color');
  }
};

export const makeRGBA = (color: string, alpha: number) => {
  if (color.indexOf('rgba') === 0) {
    return color;
  }
  const rgbValues = makeRGB(color);
  if (!rgbValues) {
    return color;
  }

  const [r, g, b] = rgbValues;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const toPercent = (n: number) => `${+(clamp(n ?? 0) * 100).toFixed(1)}%`;

export const makeHSL = (
  hue: number,
  saturation: number,
  lightness: number,
  alpha?: number,
) => {
  const [s, l] = [saturation, lightness].map(toPercent);
  if (typeof alpha === 'number') {
    return `hsla(${hue},${s},${l},${alpha})` as const;
  }
  return `hsl(${hue},${s},${l})` as const;
};

export const getHSLNumbersFromHSLString = (hsl: string) => {
  const sep = hsl.indexOf(',') > -1 ? ',' : ' ';
  const hslParsed = hsl.substr(4).split(')')[0].split(sep);
  if (hslParsed.indexOf('/') > -1) {
    hslParsed.splice(3, 1);
  }
  const h = Number(hslParsed[0]);
  const s = parseFloat(hslParsed[1].substr(0, hslParsed[1].length - 1)) / 100;
  const l = parseFloat(hslParsed[2].substr(0, hslParsed[2].length - 1)) / 100;
  return [h, s, l];
};

export const getHSLFunctionArgs = (hsl: string) => {
  const [h, s, l] = getHSLNumbersFromHSLString(hsl);
  return `${h},${toPercent(s)},${toPercent(l)}`;
};

// https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
export const hexToHSL = (hexColor: string, alpha?: number) => {
  // Convert hex to RGB first. This gives us the base 10s we need to convert to HSL.
  const rgbValues = makeRGB(hexColor);
  if (!rgbValues) {
    throw new Error('Error converting hex to RGB.');
  }
  let [red, green, blue] = rgbValues;

  // Then to HSL

  // Make red, green, and blue fractions of 1
  red /= 255;
  green /= 255;
  blue /= 255;

  // Find greatest and smallest channel values
  const channelMin = Math.min(red, green, blue);
  const channelMax = Math.max(red, green, blue);
  const delta = channelMax - channelMin;
  let hue = 0;
  let saturation = 0;
  let lightness = 0;

  // Calculate hue
  if (delta === 0) {
    // no difference
    hue = 0;
  } else if (channelMax === red) {
    // Red is max
    hue = ((green - blue) / delta) % 6;
  } else if (channelMax === green) {
    // Green is max
    hue = (blue - red) / delta + 2;
  } else {
    // Blue is max
    hue = (red - green) / delta + 4;
  }

  hue = Math.round(hue * 60);

  // Make negative hues positive behind 360°
  if (hue < 0) {
    hue += 360;
  }

  // Calculate lightness
  lightness = (channelMax + channelMin) / 2;

  // Calculate saturation
  saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return makeHSL(hue, saturation, lightness, alpha);
};

// based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
// https://css-tricks.com/converting-color-spaces-in-javascript/#hsl-to-rgb
export function HSLToRGB(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  let huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  huePrime = Math.floor(huePrime);

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime === 0) {
    red = chroma;
    green = x;
    blue = 0;
  } else if (huePrime === 1) {
    red = x;
    green = chroma;
    blue = 0;
  } else if (huePrime === 2) {
    red = 0;
    green = chroma;
    blue = x;
  } else if (huePrime === 3) {
    red = 0;
    green = x;
    blue = chroma;
  } else if (huePrime === 4) {
    red = x;
    green = 0;
    blue = chroma;
  } else if (huePrime === 5) {
    red = chroma;
    green = 0;
    blue = x;
  }

  const lightnessAdjustment = lightness - chroma / 2;
  red += lightnessAdjustment;
  green += lightnessAdjustment;
  blue += lightnessAdjustment;

  return [
    Math.abs(Math.round(red * 255)),
    Math.abs(Math.round(green * 255)),
    Math.abs(Math.round(blue * 255)),
  ];
}

// https://css-tricks.com/converting-color-spaces-in-javascript/#hsl-to-hex
export function HSLToHex(hue: number, saturation: number, lightness: number) {
  const rgbValues = HSLToRGB(hue, saturation, lightness);
  if (!rgbValues) {
    throw new Error('Error converting HSL to Hex.');
  }
  const [r, g, b] = rgbValues;

  let red = r.toString(16);
  let green = g.toString(16);
  let blue = b.toString(16);

  // Prepend 0s, if necessary
  if (red.length === 1) {
    red = '0' + red;
  }
  if (green.length === 1) {
    green = '0' + green;
  }
  if (blue.length === 1) {
    blue = '0' + blue;
  }

  return `#${red}${green}${blue}`;
}

export function darkenHSL(color: string, amount: number) {
  const [h, s, l] = getHSLNumbersFromHSLString(color);
  return makeHSL(h, s, l - amount);
}

export function lightenHSL(color: string, amount: number) {
  const [h, s, l] = getHSLNumbersFromHSLString(color);
  return makeHSL(h, s, l + amount);
}
