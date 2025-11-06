import cx from 'classnames';
import type { FunctionComponent } from 'react';

import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { useCardCover } from 'app/src/components/CardCover';
import { CardStickers } from 'app/src/components/CardStickers';
import { CardFrontNameWithStatusControl } from './CardFrontNameWithStatusControl';
import { useCardAsDropTarget } from './useCardAsDropTarget';

import * as styles from './FullCoverCard.module.less';

const PREVIEW_HEIGHT_FULL_COVER_MULTIPLIER = 245;

interface FullCoverCardProps {
  name: string;
  url: string;
}

export const FullCoverCard: FunctionComponent<FullCoverCardProps> = ({
  name,
  url,
}) => {
  const {
    hasImageCover,
    colorCover,
    stickerCount,
    stickerLimit,
    imageCoverStyles,
    brightness,
    calculatedCoverHeight,
    colorCoverTextColor,
  } = useCardCover({
    previewHeightMultiplier: PREVIEW_HEIGHT_FULL_COVER_MULTIPLIER,
  });

  useCardAsDropTarget(stickerCount, stickerLimit);

  if (hasImageCover) {
    return (
      <>
        <div
          className={cx({
            [styles.fullCover]: true,
            [styles.cardFrontImageCover]: true,
            [styles.darkGradient]: brightness === 'dark',
          })}
          data-testid={getTestId<CardFrontTestIds>('card-front-cover')}
          style={imageCoverStyles}
        >
          <CardFrontNameWithStatusControl
            name={name}
            url={url}
            className={styles.name}
            doneStateContainerClassName={styles.doneState}
            doneStateChildrenClassName={styles.completeImageCoverChildrenName}
            buttonClassName={styles.imageCoverButton}
            uncheckedIconColor={'currentColor'}
          />
        </div>
        <CardStickers
          hasImageCover={true}
          isFullCoverCard={true}
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
            [styles.fullCover]: true,
            [styles.cardFrontColorCover]: true,
            [styles.hasStickers]: stickerCount > 0,
            [styles[colorCover || '']]: true,
            [`color-blind-pattern-${colorCover}`]: true,
          })}
          data-testid={getTestId<CardFrontTestIds>('card-front-cover')}
        >
          <CardFrontNameWithStatusControl
            name={name}
            url={url}
            className={styles.name}
            doneStateContainerClassName={styles.completeColorCoverContainerName}
            doneStateChildrenClassName={styles.completeColorCoverChildrenName}
            successIconColor={
              colorCoverTextColor ?? token('color.icon.subtle', '#626F86')
            }
            uncheckedIconColor={
              colorCoverTextColor ?? token('color.icon.subtle', '#626F86')
            }
          />
        </div>
        <CardStickers
          hasImageCover={true}
          isFullCoverCard={true}
          imageCoverHeight={calculatedCoverHeight}
        />
      </>
    );
  }

  return null;
};
