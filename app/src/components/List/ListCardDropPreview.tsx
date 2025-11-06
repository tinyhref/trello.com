import cx from 'classnames';
import { forwardRef, useCallback } from 'react';

import { useForwardRef } from '@trello/dom-hooks';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { cardDragAndDropState } from './cardDragAndDropState';
import { useMultiCardDragAndDrop } from './useMultiCardDragAndDrop';

import * as styles from './ListCardDropPreview.module.less';

type ListCardDropPreviewProps = {
  className?: string;
};

export const ListCardDropPreview = forwardRef<
  HTMLDivElement,
  ListCardDropPreviewProps
>(({ className }, ref) => {
  const forwardedRef = useForwardRef(ref);
  const previewHeight = useSharedStateSelector(
    cardDragAndDropState,
    useCallback((state) => state.previewHeight, []),
  );

  const { selectedCardIds, isMultiDragActive } = useMultiCardDragAndDrop();

  if (isMultiDragActive) {
    return (
      <div
        ref={forwardedRef}
        className={cx(styles.dropPreviewStack, className)}
      >
        {selectedCardIds.map((id) => (
          <div
            key={id}
            className={cx(styles.dropPreview, styles.isMultiDragActive)}
            data-testid={getTestId<ListTestIds>('list-card-drop-preview')}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={forwardedRef}
      className={cx(styles.dropPreview, className)}
      style={{ height: previewHeight }}
      data-testid={getTestId<ListTestIds>('list-card-drop-preview')}
    />
  );
});
