import cx from 'classnames';
import type { FunctionComponent } from 'react';

import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCardCover } from 'app/src/components/CardCover';
import { CardStickers } from 'app/src/components/CardStickers';

import * as styles from './CardFrontCover.module.less';

interface CardFrontCoverProps {
  cardFrontDetailsRef?: React.RefObject<HTMLDivElement>;
}

export const CardFrontCover: FunctionComponent<CardFrontCoverProps> = ({
  cardFrontDetailsRef = null,
}) => {
  const {
    hasVisibleCover,
    hasImageCover,
    colorCover,
    stickerCount,
    imageCoverStyles,
    calculatedCoverHeight,
  } = useCardCover();

  if (!hasVisibleCover && stickerCount > 0) {
    return (
      <>
        <div
          className={styles.emptyCover}
          data-testid={getTestId<CardFrontTestIds>('card-front-cover')}
        ></div>
        <CardStickers cardFrontDetailsRef={cardFrontDetailsRef} />
      </>
    );
  }

  if (hasVisibleCover && hasImageCover) {
    return (
      <>
        <div
          className={cx({
            [styles.cardFrontImageCover]: true,
          })}
          data-testid={getTestId<CardFrontTestIds>('card-front-cover')}
          data-card-front-section="cover"
          style={imageCoverStyles}
        ></div>
        <CardStickers
          hasImageCover={true}
          cardFrontDetailsRef={cardFrontDetailsRef}
          imageCoverHeight={calculatedCoverHeight}
        />
      </>
    );
  }

  if (colorCover) {
    return (
      <>
        <div
          className={cx({
            [styles.cardFrontCover]: true,
            [styles.hasStickers]: stickerCount > 0,
            [styles[colorCover || '']]: true,
            [`color-blind-pattern-${colorCover}`]: true,
          })}
          data-testid={getTestId<CardFrontTestIds>('card-front-cover')}
          data-card-front-section="cover"
        ></div>
        <CardStickers cardFrontDetailsRef={cardFrontDetailsRef} />
      </>
    );
  }

  return null;
};
