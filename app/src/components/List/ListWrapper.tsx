import type { FunctionComponent, MouseEvent } from 'react';
import { memo, useCallback, useRef, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { ListIdProvider, useBoardId } from '@trello/id-context';
import { MIN_SPACING } from '@trello/position';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  clearPeekedCollapsedList,
  collapsedListsState,
  peekedCollapsedListIdState,
  useIsCollapsibleListsEnabled,
} from 'app/src/components/CollapsedListsState';
import { openListComposer } from 'app/src/components/ListComposer';
import {
  LazySpotlightManager,
  LazySpotlightTarget,
  LazySpotlightTransition,
} from 'app/src/components/Onboarding';
import {
  ONBOARDING_LIST_SPOTLIGHT,
  usePersonalProductivitySpotlightTour,
} from 'app/src/components/PersonalProductivityOnboarding';
import { LazySmartList } from 'app/src/components/SmartList/LazySmartList';
import { useIsSmartList } from 'app/src/components/SmartList/useIsSmartList';
import { cardDragAndDropState } from './cardDragAndDropState';
import { List } from './List';
import { LIST_ID_ATTRIBUTE } from './List.constants';
import { ListContextProvider } from './ListContextProvider';
import { ListDropPreview } from './ListDropPreview';
import { useShouldRenderIncrementalItem } from './useIncrementalIdleItemRenderer';
import { useListAsDropTarget } from './useListAsDropTarget';
import { useListsAndCardsViewportObserver } from './useListsAndCardsViewportObserver';
import { useSetActiveListOnHover } from './useSetActiveListOnHover';

import * as styles from './ListWrapper.module.less';

interface ListProps {
  listId: string;
  position: number;
}

export const ListWrapper: FunctionComponent<ListProps> = ({
  listId,
  position,
}) => {
  const boardId = useBoardId();
  const listWrapperRef = useRef<HTMLLIElement>(null);
  const isReadyToRender = useShouldRenderIncrementalItem(boardId, position);
  const hasBeenInViewport = useListsAndCardsViewportObserver(
    listId,
    listWrapperRef,
  );
  const shouldRenderContent = isReadyToRender || hasBeenInViewport;

  const isCollapsible = useIsCollapsibleListsEnabled(boardId);
  const isCollapsedListInPeekMode = useSharedStateSelector(
    peekedCollapsedListIdState,
    useCallback((value) => value === listId, [listId]),
  );
  const dismissCollapsedListPreview = useCallback(() => {
    if (isCollapsedListInPeekMode) {
      clearPeekedCollapsedList();
    }
  }, [isCollapsedListInPeekMode]);
  const isListCollapsed = useSharedStateSelector(
    collapsedListsState,
    useCallback(
      (collapsedListIds) =>
        isCollapsible && Boolean(collapsedListIds[boardId]?.[listId]),
      [isCollapsible, boardId, listId],
    ),
  );
  const isCollapsed = isListCollapsed && !isCollapsedListInPeekMode;

  const isActiveDropTarget = useSharedStateSelector(
    cardDragAndDropState,
    useCallback(({ currentListId }) => currentListId === listId, [listId]),
  );

  const isSmartList = useIsSmartList(listId);

  const { moveState, showDropPreview } = useListAsDropTarget({
    listWrapperRef,
    listId,
    position,
    isSmartList,
  });

  const canEditBoard = useCanEditBoard();

  const onDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (!e.target || e.target !== listWrapperRef.current || !canEditBoard) {
        return;
      }
      // Try to determine whether to open the list composer to the left or
      // right of the list by comparing the click event to the list element.
      const rect = listWrapperRef.current.getBoundingClientRect();
      const midpoint = rect.x + (rect.right - rect.left) / 2;
      const wasClickOnRightSide = e.clientX >= midpoint;

      Analytics.sendUIEvent({
        action: 'opened',
        actionSubject: 'listComposer',
        source: 'boardScreen',
        attributes: { method: 'doubleClick' },
      });
      openListComposer({
        position: wasClickOnRightSide
          ? position
          : Math.max(position - MIN_SPACING, 0),
      });
    },
    [canEditBoard, listWrapperRef, position],
  );

  const [
    isPersonalProductivitySpotlightDismissCalled,
    setIsPersonalProductivitySpotlightDismissCalled,
  ] = useState(false);

  useSetActiveListOnHover({ ref: listWrapperRef, idList: listId });
  const { renderActiveSpotlight, showListSpotlight } =
    usePersonalProductivitySpotlightTour({
      source: 'list',
      listId,
      boardId,
      onDismissSpotlight: () => {
        setIsPersonalProductivitySpotlightDismissCalled(true);
      },
    });

  let renderedList = (
    <List
      listId={listId}
      position={position}
      isActiveDropTarget={isActiveDropTarget}
      moveState={moveState}
    />
  );

  // Wrap list with Spotlight components if eligible for Personal Productivity Spotlight and user hasn't dismissed it.
  // Also wrap list if the Spotlight was just dismissed, in order to keep the component tree unchanged
  // and to prevent list re-rendering.
  if (showListSpotlight() || isPersonalProductivitySpotlightDismissCalled) {
    renderedList = (
      <LazySpotlightManager blanketIsTinted={true}>
        <LazySpotlightTarget name={ONBOARDING_LIST_SPOTLIGHT}>
          {renderedList}
        </LazySpotlightTarget>
        {showListSpotlight() && (
          <LazySpotlightTransition>
            {renderActiveSpotlight()}
          </LazySpotlightTransition>
        )}
      </LazySpotlightManager>
    );
  }

  return (
    <ListIdProvider key={listId} value={listId}>
      <ListContextProvider
        shouldRenderContent={shouldRenderContent}
        isCollapsed={isCollapsed}
      >
        {showDropPreview === 'left' && <ListDropPreview />}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <li
          className={styles.listWrapper}
          hidden={moveState === 'moving'}
          onDoubleClick={onDoubleClick}
          onMouseLeave={dismissCollapsedListPreview}
          ref={listWrapperRef}
          data-testid={getTestId<ListTestIds>('list-wrapper')}
          {...{ [LIST_ID_ATTRIBUTE]: listId }}
        >
          {isSmartList ? (
            <LazySmartList
              listId={listId}
              position={position}
              isActiveDropTarget={isActiveDropTarget}
              moveState={moveState}
            />
          ) : (
            renderedList
          )}
        </li>
        {showDropPreview === 'right' && <ListDropPreview />}
      </ListContextProvider>
    </ListIdProvider>
  );
};

export const MemoizedList = memo(ListWrapper);
