import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { RovoIcon } from '@atlaskit/logo';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Button } from '@trello/nachos/button';
import { useSharedStateSelector } from '@trello/shared-state';

import { cardDragAndDropState } from 'app/src/components/List/cardDragAndDropState';

import * as styles from './RovoButtonDropTarget.module.less';

export const RovoButtonDropTarget: FunctionComponent = () => {
  const selectedCardId = useSharedStateSelector(
    cardDragAndDropState,
    useCallback((state) => state.cardId, []),
  );
  const dropTargetRef = useRef<HTMLDivElement>(null);
  const [isDraggingOverRovoButton, setIsDraggingOverRovoButton] =
    useState(false);

  useEffect(() => {
    const element = dropTargetRef.current;
    if (!element) {
      return;
    }

    return dropTargetForElements({
      element,
      onDrop: () => {
        // TODO: publish event to add cards to Rovo context
      },
      onDragEnter: () => {
        setIsDraggingOverRovoButton(true);
      },
      onDragLeave: () => {
        setIsDraggingOverRovoButton(false);
      },
    });
  }, []);

  // Only need to check selectedCardId since useMultiCardDragAndDrop
  // relies on cardDragAndDropState to determine if any card(s) are selected
  if (!selectedCardId) {
    return null;
  }

  return (
    <div
      ref={dropTargetRef}
      className={cx(styles.rovoButtonDropTargetWrapper, {
        [styles.isDraggingOverRovoButtonWrapper]: isDraggingOverRovoButton,
      })}
    >
      <Button
        className={cx(styles.rovoButtonDropTarget, {
          [styles.isDraggingOverRovoButton]: isDraggingOverRovoButton,
        })}
        aria-label="Drop cards here for Rovo AI" // TODO: i18n
        iconAfter={<RovoIcon label="Rovo" appearance="inverse" size="small" />}
      >
        Drop cards here for Rovo AI
      </Button>
    </div>
  );
};
