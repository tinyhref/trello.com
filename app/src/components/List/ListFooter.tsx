import classNames from 'classnames';
import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useRef } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useBoardId, useListId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  cardComposerState,
  openCardComposer,
} from 'app/src/components/CardComposer';
import { activeCardSharedState } from 'app/src/components/CardFront/activeCardSharedState';
import { CardTemplatesButton } from 'app/src/components/CardTemplatesPopover';
import { ListAddCardButton } from './ListAddCardButton';
import { readListVisibleCardsFromCache } from './readListVisibleCardsFromCache';
import {
  useIsListCollapsed,
  useShouldRenderListContent,
} from './useListContext';

import * as styles from './ListFooter.module.less';

export const ListFooter: FunctionComponent = () => {
  const boardId = useBoardId();
  const listId = useListId();

  const ref = useRef<HTMLDivElement>(null);

  const canEditBoard = useCanEditBoard();
  const isCardComposerOpenInList = useSharedStateSelector(
    cardComposerState,
    useCallback((state) => state.listId === listId, [listId]),
  );

  const onCardCreatedFromTemplate = useCallback((card: { id: string }) => {
    activeCardSharedState.setValue({ idActiveCard: card.id });
  }, []);

  const onDoubleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.target === ref.current) {
        const cards = readListVisibleCardsFromCache({ boardId, listId });
        const lastCard = cards.pop();
        openCardComposer({ listId, position: lastCard?.pos ?? 0 });
        Analytics.sendUIEvent({
          action: 'opened',
          actionSubject: 'cardComposer',
          source: 'boardScreen',
          attributes: {
            method: 'doubleClick',
          },
        });
      }
    },
    [boardId, listId],
  );

  const shouldRenderContent = useShouldRenderListContent();
  const isCollapsed = useIsListCollapsed();

  if (!canEditBoard || isCardComposerOpenInList) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classNames(styles.listFooter)}
      data-testid={getTestId<ListTestIds>('list-footer')}
      hidden={isCollapsed}
      onDoubleClick={onDoubleClick}
      ref={ref}
    >
      <ListAddCardButton />
      {shouldRenderContent && (
        <CardTemplatesButton
          idList={listId}
          onCardCreated={onCardCreatedFromTemplate}
        />
      )}
    </div>
  );
};
