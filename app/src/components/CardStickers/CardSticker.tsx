import cx from 'classnames';
import type { FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { supportsFancyPeel } from '@trello/browser';
import { intl } from '@trello/i18n';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import { smallestPreviewBiggerThan } from '@trello/image-previews';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import { clipStickerPosition } from '@trello/stickers';
import type {
  CardBackTestIds,
  CardFrontTestIds,
  QuickCardEditorTestIds,
} from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import type { CardStickersFragment } from './CardStickersFragment.generated';
import { CardStickersFragmentDoc } from './CardStickersFragment.generated';
import { useRemoveStickerFromCardMutation } from './RemoveStickerFromCardMutation.generated';

import * as styles from './CardSticker.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import residuePng from 'resources/images/stickers/residue.png';

export type Sticker = NonNullable<CardStickersFragment>['stickers'][number];
interface CardStickersProp {
  sticker: Sticker;
  isCardBack?: boolean;
}

const HOVER_WAIT_MS = 350;
const REMOVE_WAIT_MS = 200;
const STICKER_SIZE = 64;

export const CardSticker: FunctionComponent<CardStickersProp> = ({
  sticker,
  isCardBack = false,
}) => {
  const cardId = useCardId();
  const boardId = useBoardId();
  const listId = useListId();
  const { id: stickerId, left, top, rotate, imageUrl, imageScaled } = sticker;

  const [showSticker, setShowSticker] = useState(true);
  const [isStickerPeeled, setIsStickerPeeled] = useState(false);
  const [isStickerHovered, setIsStickerHovered] = useState(false);

  const [removeSticker] = useRemoveStickerFromCardMutation();

  const canEditBoard = useCanEditBoard();

  const hoverTimeoutIdRef = useRef<number>();
  const removeTimeoutRef = useRef<number>();
  const stickerRef = useRef<HTMLDivElement | null>(null);

  const togglePeel = useCallback(() => {
    setIsStickerPeeled(!isStickerPeeled);
  }, [isStickerPeeled]);

  const clearTimeouts = useCallback(() => {
    clearTimeout(hoverTimeoutIdRef.current);
    hoverTimeoutIdRef.current = undefined;
    clearTimeout(removeTimeoutRef.current);
    removeTimeoutRef.current = undefined;
  }, []);

  const handleStickerMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (isStickerHovered) {
        clearTimeouts();
      } else if (hoverTimeoutIdRef.current === undefined) {
        hoverTimeoutIdRef.current = window.setTimeout(() => {
          setIsStickerHovered(true);
        }, HOVER_WAIT_MS);
      }
    },
    [clearTimeouts, isStickerHovered],
  );

  const handleStickerMouseLeave = useCallback(() => {
    clearTimeouts();
    removeTimeoutRef.current = window.setTimeout(() => {
      setIsStickerHovered(false);
    }, REMOVE_WAIT_MS);
  }, [clearTimeouts]);

  const handleRemoveOnClick = useCallback(
    async (event: ReactMouseEvent) => {
      // Prevent opening up the card back after clicking on remove button
      event.stopPropagation();
      const taskName = 'edit-card/stickers';
      const source = 'stickerHoverView';

      const traceId = Analytics.startTask({
        taskName,
        source,
        attributes: {
          action: 'removed',
        },
      });

      try {
        await removeSticker({
          variables: {
            idCard: cardId,
            idSticker: stickerId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            removeStickerFromCard: {
              __typename: 'Card',
              id: stickerId,
            },
          },
          update(cache, result) {
            if (!result.data?.removeStickerFromCard) {
              return;
            }

            const data = cache.readFragment<CardStickersFragment>({
              fragment: CardStickersFragmentDoc,
              id: `Card:${cardId}`,
            });

            if (!data) {
              return;
            }

            cache.writeFragment({
              fragment: CardStickersFragmentDoc,
              id: `Card:${cardId}`,
              data: {
                ...data,
                stickers: data.stickers.filter(({ id }) => id !== stickerId),
              },
            });
          },
        });
        Analytics.taskSucceeded({
          taskName,
          source,
          traceId,
        });

        Analytics.sendUpdatedCardFieldEvent({
          field: 'stickers',
          source: 'stickerHoverView',
          attributes: {
            taskId: traceId,
            action: 'removed',
          },
          containers: formatContainers({ cardId, boardId, listId }),
        });
        setShowSticker(false);
      } catch (err) {
        Analytics.taskFailed({
          taskName,
          source,
          traceId,
          error: err,
        });
      }
    },
    [boardId, cardId, listId, removeSticker, stickerId],
  );

  const renderSticker = () => {
    const url =
      smallestPreviewBiggerThan(imageScaled, STICKER_SIZE)?.url ?? imageUrl;

    if (!supportsFancyPeel()) {
      return <img src={url} alt={sticker.image} className={styles.fixed} />;
    }

    return (
      <div
        data-testid={getTestId<CardFrontTestIds>('sticker-fancy-peel')}
        ref={stickerRef}
      >
        <img
          src={residuePng}
          alt={sticker.image}
          className={styles.residue}
          style={{
            maskImage: `url(${url})`,
            WebkitMaskImage: `url(${url})`,
          }}
        />
        <img src={url} alt={sticker.image} className={styles.shadow} />
        <img
          src={url}
          alt={sticker.image}
          className={styles.fixed}
          draggable={false}
        />
        <img src={url} alt={sticker.image} className={styles.peel} />
      </div>
    );
  };

  if (!showSticker) {
    return null;
  }

  return (
    <div
      className={cx(
        styles.sticker,
        isStickerPeeled ? styles.stickerPeeling : '',
        isCardBack ? styles.cardBackSticker : '',
      )}
      style={{
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- (spacing) This usage is computed at runtime
        left: `${clipStickerPosition(left)}%`,
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- (spacing) This usage is computed at runtime
        top: `${clipStickerPosition(top)}%`,
      }}
      onMouseMove={handleStickerMouseMove}
      onMouseLeave={handleStickerMouseLeave}
      data-testid={
        isCardBack
          ? getTestId<CardBackTestIds>('card-back-sticker')
          : getTestId<CardFrontTestIds>('sticker')
      }
      role="button"
    >
      <div
        className={styles.stickerRemoving}
        style={{
          transform: `rotate(${rotate}deg)`,
        }}
      >
        <div className={styles.highlight}></div>
        {renderSticker()}
      </div>
      {canEditBoard && (
        <Button
          className={styles.removeStickerButton}
          iconBefore={<CloseIcon size="small" />}
          onClick={handleRemoveOnClick}
          onMouseEnter={togglePeel}
          onMouseLeave={togglePeel}
          aria-label={intl.formatMessage({
            id: 'templates.card_front.remove',
            defaultMessage: 'Remove',
            description: 'Remove',
          })}
          testId={getTestId<QuickCardEditorTestIds>('sticker-remove-button')}
          tabIndex={-1}
        />
      )}
    </div>
  );
};
