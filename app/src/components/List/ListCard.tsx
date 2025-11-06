import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { memo, useCallback, useRef } from 'react';

import { useBoardId, useListId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { useIsDragToMergeEnabled } from 'app/src/components/BulkAction/useIsDragToMergeEnabled';
import { CardFront } from 'app/src/components/CardFront';
import { useCardDropExternalWithCardData } from 'app/src/components/CardFront/useCardDropExternalWithCardData';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { ListCardDropPreview } from './ListCardDropPreview';
import { useCardDragAndDrop } from './useCardDragAndDrop';
import { useShouldRenderIncrementalItem } from './useIncrementalIdleItemRenderer';
import { useListsAndCardsViewportObserver } from './useListsAndCardsViewportObserver';

import * as styles from './ListCard.module.less';

interface ListCardProps {
  cardId: string;
  position: number;
  filtered: boolean;
}

export const ListCard: FunctionComponent<ListCardProps> = ({
  cardId,
  position,
  filtered,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const dropPreviewTopRef = useRef<HTMLDivElement>(null);
  const dropPreviewBottomRef = useRef<HTMLDivElement>(null);

  const boardId = useBoardId();
  const listId = useListId();

  const isReadyToRender = useShouldRenderIncrementalItem(listId, position);

  const isCardSelectedForBulkAction = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback(
      (state) => {
        return state.selectedCards[boardId]?.[cardId] || false;
      },
      [boardId, cardId],
    ),
  );

  const hasBeenInViewport = useListsAndCardsViewportObserver(
    cardId,
    cardFrontRef,
  );

  const isInboxBoard = useIsInboxBoard();

  const sourceType = isInboxBoard ? 'inboxScreen' : undefined;

  const { showDropPreview, moveState } = useCardDragAndDrop({
    ref,
    cardFrontRef,
    dropPreviewTopRef,
    dropPreviewBottomRef,
    cardId,
    listId,
    position,
    sourceType,
  });

  const isDragToMergeEnabled = useIsDragToMergeEnabled();
  const isHidden =
    !filtered || (!isDragToMergeEnabled && moveState === 'moving');

  useCardDropExternalWithCardData({ cardFrontRef, listId, cardId });

  return (
    <li
      ref={ref}
      className={cx({
        [styles.listCard]: true,
        [styles.isDragging]: moveState !== 'idle',
      })}
      hidden={isHidden}
      data-testid={getTestId<ListTestIds>('list-card')}
      data-planner-draggable
    >
      {showDropPreview === 'top' && (
        <ListCardDropPreview ref={dropPreviewTopRef} />
      )}
      <div
        className={cx({
          [styles.cardWrapper]: true,
          [styles.selected]: isCardSelectedForBulkAction,
        })}
        data-testid={getTestId<ListTestIds>('list-card-wrapper')}
      >
        <CardFront
          cardId={cardId}
          isMinimal={!hasBeenInViewport || !isReadyToRender}
          ref={cardFrontRef}
          selectedForBulkAction={isCardSelectedForBulkAction}
        />
      </div>
      {showDropPreview === 'bottom' && (
        <ListCardDropPreview ref={dropPreviewBottomRef} />
      )}
    </li>
  );
};

export const MemoizedListCard = memo(ListCard);
