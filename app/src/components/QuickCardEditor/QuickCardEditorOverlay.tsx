import type { FunctionComponent, Ref, RefObject } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';

import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import {
  useBoardId,
  useCardId,
  useListId,
  useWorkspaceId,
} from '@trello/id-context';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import {
  ELEVATION_ATTR,
  getHighestVisibleElevation,
  useClickOutsideHandler,
} from '@trello/layer-manager';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { QuickCardEditorTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { CardFrontSource } from 'app/src/components/CardFront/CardFront';
import { QuickCardEditorButtons } from './QuickCardEditorButtons';
import { QuickCardEditorCardFront } from './QuickCardEditorCardFront';

import * as styles from './QuickCardEditorOverlay.module.less';

/**
 * Returns an element's DOMRect, if it has dimensions.
 */
const getRect = (element: HTMLElement | null): DOMRect | null => {
  const rect = element?.getBoundingClientRect();
  return rect?.width ? rect : null;
};

interface QuickCardEditorOverlayProps {
  cardFrontRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  cardFrontSource?: CardFrontSource;
  plannerEventCardId?: string;
}

export const QuickCardEditorOverlay: FunctionComponent<
  QuickCardEditorOverlayProps
> = ({ cardFrontRef, onClose, cardFrontSource, plannerEventCardId }) => {
  const boardId = useBoardId();
  const cardId = useCardId();
  const listId = useListId();
  const workspaceId = useWorkspaceId();

  const [skipClickOutside, setSkipClickOutside] = useState(true);

  const editableCardFrontRef = useRef<HTMLDivElement | null>(null);
  const setEditableCardFrontRef = useCallback(
    (node: HTMLDivElement | null, popperRef: Ref<HTMLDivElement>) => {
      editableCardFrontRef.current = node;
      if (typeof popperRef === 'function') {
        popperRef(node);
      }
      setSkipClickOutside(false);
    },
    [],
  );

  const closeOverlay = useCallback(() => {
    Analytics.sendClosedComponentEvent({
      componentName: 'quickCardEditorInlineDialog',
      componentType: 'inlineDialog',
      containers: formatContainers({
        idBoard: boardId,
        idList: listId,
        idCard: cardId,
        workspaceId,
      }),
      source: getScreenFromUrl(),
    });
    onClose();
  }, [boardId, cardId, listId, onClose, workspaceId]);

  const handleClickOutside = useCallback(() => {
    closeOverlay();
  }, [closeOverlay]);

  useClickOutsideHandler({
    element: editableCardFrontRef.current,
    handleClickOutside,
    skip: skipClickOutside,
  });

  // When opening the overlay from a planner card, we need to match the scope of the
  // parent component to ensure that the escape key does not close the event detail
  // popover when closing the overlay.
  useShortcut(closeOverlay, {
    key: Key.Escape,
    scope: cardFrontSource === 'Planner' ? Scope.Popover : Scope.Overlay,
  });

  const [cardFrontRect, setCardFrontRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    const updateRect = () => {
      const rect = getRect(cardFrontRef.current);
      if (rect) {
        setCardFrontRect(rect);
        return;
      }
    };

    updateRect();
    const resizeObserver = new ResizeObserver(() => {
      updateRect();
    });

    // If the rect is invalid, it's possible that it's because the element ref
    // flickered; e.g. if the quick card editor overlay was originally opened on
    // an optimistic card whose ID was subsequently resolved.
    requestAnimationFrame(() => {
      setCardFrontRect(getRect(cardFrontRef.current));
    });

    if (cardFrontRef.current) {
      resizeObserver.observe(cardFrontRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [cardFrontRef, cardId]);

  const nextElevation = useMemo(() => getHighestVisibleElevation() + 1, []);

  if (!cardFrontRef.current || !cardFrontRect) return null;

  const overlayContent = (
    <div
      className={styles.overlay}
      aria-hidden="true"
      data-testid={getTestId<QuickCardEditorTestIds>(
        'quick-card-editor-overlay',
      )}
    >
      <Popper
        offset={[0, 0 - cardFrontRect.height]}
        placement="bottom-start"
        referenceElement={cardFrontRef.current}
      >
        {({ ref, style }) => (
          <div
            ref={(node) => setEditableCardFrontRef(node, ref)}
            style={style}
            {...{ [ELEVATION_ATTR]: nextElevation }}
          >
            <QuickCardEditorCardFront
              width={cardFrontRect.width}
              onClose={onClose}
            />
            {editableCardFrontRef.current && (
              <QuickCardEditorButtons
                onClose={onClose}
                editableCardFrontRef={editableCardFrontRef}
                cardFrontSource={cardFrontSource}
                plannerEventCardId={plannerEventCardId}
              />
            )}
          </div>
        )}
      </Popper>
    </div>
  );

  // Set index to a low value to ensure we don't render on top of legacy popovers.
  return (
    <Portal zIndex={1}>
      <FocusLock returnFocus>{overlayContent}</FocusLock>
    </Portal>
  );
};
