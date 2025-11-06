import cx from 'classnames';
import { useMemo, type FunctionComponent } from 'react';

import type { CardTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import {
  CARD_BACK_MAX_HEIGHT,
  useCardCover,
} from 'app/src/components/CardCover';
import { CardSticker } from './CardSticker';
import { useCardStickers } from './useCardStickers';

import * as styles from './CardStickers.module.less';

interface CardStickersProps {
  isFullCoverCard?: boolean;
  hasImageCover?: boolean;
  imageCoverHeight?: number;
  cardFrontDetailsRef?: React.RefObject<HTMLDivElement> | null;
  isCardBack?: boolean;
}
const CARD_FRONT_STICKERS_CONTAINER_HEIGHT = 64;
const CARD_BACK_STICKERS_MIN_CONTAINER_HEIGHT = 46;
const CARD_BACK_DETAILS_HEIGHT = 70;
const DETAILS_DEFAULT_HEIGHT = 36;

export const CardStickers: FunctionComponent<CardStickersProps> = ({
  isFullCoverCard = false,
  hasImageCover = false,
  imageCoverHeight = 260,
  cardFrontDetailsRef = null,
  isCardBack = false,
}) => {
  const { calculatedCoverHeight } = useCardCover();
  const { stickers } = useCardStickers();

  const containerHeight = useMemo(() => {
    const cardDetailsHeight =
      cardFrontDetailsRef?.current?.getBoundingClientRect().height ??
      DETAILS_DEFAULT_HEIGHT;

    if (!hasImageCover) {
      return isCardBack
        ? CARD_BACK_STICKERS_MIN_CONTAINER_HEIGHT
        : CARD_FRONT_STICKERS_CONTAINER_HEIGHT;
    }
    if (isFullCoverCard) {
      return imageCoverHeight - cardDetailsHeight;
    }
    if (isCardBack) {
      //If we're on the card back, we want the larger of these two values:
      // 1. The calculatedCoverHeight or CARD_BACK_MAX_HEIGHT, whichever is smaller, minus the card back "details" height
      //    (to ensure stickers don't overflow the card back's card name, etc.)
      // 2. CARD_BACK_STICKERS_MIN_CONTAINER_HEIGHT
      return Math.max(
        Math.min(calculatedCoverHeight ?? 0, CARD_BACK_MAX_HEIGHT) -
          CARD_BACK_DETAILS_HEIGHT,
        CARD_BACK_STICKERS_MIN_CONTAINER_HEIGHT,
      );
    } else {
      return imageCoverHeight;
    }
  }, [
    cardFrontDetailsRef,
    hasImageCover,
    imageCoverHeight,
    isFullCoverCard,
    isCardBack,
    calculatedCoverHeight,
  ]);

  if (!stickers?.length) {
    return null;
  }

  return (
    <div
      className={cx({
        [styles.stickersWrapper]: true,
        [styles.cardBackStickersWrapper]: isCardBack,
      })}
    >
      <div
        className={cx({
          [styles.stickers]: true,
          [styles.cardBackStickers]: isCardBack,
        })}
        style={{
          height: `${containerHeight}px`,
        }}
        data-testid={getTestId<CardTestIds>('stickers-container')}
      >
        {stickers.map((sticker) => (
          <div key={sticker.id}>
            <CardSticker sticker={sticker} isCardBack={isCardBack} />
          </div>
        ))}
      </div>
    </div>
  );
};
