import { clipStickerPosition } from '@trello/stickers';

import type { CardStickersFragment } from 'app/src/components/CardStickers/CardStickersFragment.generated';
import { type DraggableStickerData } from 'app/src/components/StickerPicker/Sticker';

const BORDER_WIDTH = 1;
const STICKERS_CONTAINER_HEIGHT = 64;

export const getDroppableStickerPosition = (
  cardFrontRef: React.RefObject<HTMLElement>,
  source: DraggableStickerData,
  stickerOffset: { top: number; left: number },
  getStickerContainerHeight: () => number,
  stickerCount: number,
) => {
  const { image, url: imageUrl, scaled, rotate } = source;

  // type image scaled
  type ImageScaled = NonNullable<
    CardStickersFragment['stickers']
  >[number]['imageScaled'];
  const imageScaled: ImageScaled = scaled.map(
    (scaledImage: Partial<ImageScaled[number]>) => ({
      __typename: 'Sticker_ImageScaled',
      id: scaledImage.id ?? null,
      width: scaledImage.width ?? 0,
      height: scaledImage.height ?? 0,
      url: scaledImage.url ?? '',
      scaled: scaledImage.scaled ?? null,
    }),
  );
  const zIndex = stickerCount + 1;

  if (!cardFrontRef.current) {
    return {
      image,
      imageUrl,
      imageScaled,
      rotate,
      top: 0, // default the top value to 0 when the cardFrontRef is undefined
      left: 0, // default the left value to 0 when the cardFrontRef is undefined
      zIndex,
    };
  }

  // Get sticker position
  // Figure out where the sticker area would be, if the card had a
  // sticker area
  const targetOffset = cardFrontRef.current?.getBoundingClientRect();
  const targetWidth = targetOffset?.width - 2 * BORDER_WIDTH;
  const offsetLeft =
    stickerOffset.left - targetOffset.left - STICKERS_CONTAINER_HEIGHT / 2;
  const offsetTop =
    stickerOffset.top - targetOffset.top - STICKERS_CONTAINER_HEIGHT / 2;
  const left = clipStickerPosition((offsetLeft / targetWidth) * 100);
  const stickersContainerHeight = getStickerContainerHeight();
  const stickerAreaHeight = stickersContainerHeight - BORDER_WIDTH * 2;

  let top: number;
  if (stickerCount > 0) {
    top = (offsetTop / stickerAreaHeight) * 100;
  } else {
    // This card doesn't have anything on it yet; it's unlikely that
    // you're trying to place it at an exact vertical position, and
    // putting it right where you drop it will put part of the sticker
    // off of the card
    top = 0;
  }

  // if the user tries to put the sticker below the valid area, move
  // it as far down as possible
  if (stickerAreaHeight && top > stickerAreaHeight) {
    top = stickerAreaHeight;
  }

  return {
    image,
    imageUrl,
    imageScaled,
    rotate,
    top,
    left,
    zIndex,
  };
};
