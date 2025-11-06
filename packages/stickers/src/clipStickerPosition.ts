import { STICKER_MARGIN } from './stickers.constants';

const minValue = 0 - STICKER_MARGIN;
const maxValue = 100 - STICKER_MARGIN;

// Used to ensure that a sticker is inside the editable area
export const clipStickerPosition = (value: number) => {
  if (value < minValue) {
    return minValue;
  } else if (value > maxValue) {
    return maxValue;
  } else {
    return value;
  }
};
