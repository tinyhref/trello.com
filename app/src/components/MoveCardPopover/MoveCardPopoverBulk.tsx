import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { client } from '@trello/graphql';
import type { BoardListsContextCardFragment } from '@trello/graphql/fragments';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { useSharedStateSelector } from '@trello/shared-state';

import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { BoardListPositionSelectBulk } from './BoardListPositionSelectBulk';
import { CopyMoveCardTabs } from './CopyMoveCardTabs';
import { InboxPositionSelectorBulk } from './InboxPositionSelectorBulk';
import { useBulkCardMove } from './useBulkCardMove';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './MoveCardPopover.module.less';

export interface MoveCardPopoverBulkProps {
  onClose: () => void;
  source?: SourceType;
  boardId: string;
}

export const MoveCardPopoverBulk: FunctionComponent<
  MoveCardPopoverBulkProps
> = ({ onClose, source, boardId }) => {
  const { idBoard: inboxBoardId, idList: inboxListId } = useMemberInboxIds();

  const moveCardInlineDialog = 'moveCardInlineDialog';
  const moveCardSource = source || moveCardInlineDialog;

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: moveCardInlineDialog,
      containers: formatContainers({ boardId }),
    });
  }, [boardId]);

  /**
   * This is so that the first suggestions button or the first select field
   * is focused when the popover is opened, otherwise it only focuses when
   * first opened, and not again until the page is refreshed.
   * This can probably be revisited when the popover mechanism is switched to the
   * modernized version.
   */
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const popoverElement = ref.current;
    if (popoverElement) {
      const focusableElements = popoverElement.querySelectorAll(
        'button, input, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      if (firstElement) {
        const timeoutId = setTimeout(
          () => (firstElement as HTMLElement).focus(),
          1,
        );
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  const { bulkMoveCards } = useBulkCardMove();

  const bulkActionSelectedCards = useSharedStateSelector(
    bulkActionSelectedCardsSharedState,
    useCallback(
      (state) => Object.keys(state.selectedCards[boardId] ?? {}),
      [boardId],
    ),
  );

  const onInboxMove = useCallback(
    async (index: number) => {
      onClose();
      try {
        if (bulkActionSelectedCards.length > 0) {
          Analytics.sendClickedButtonEvent({
            buttonName: 'bulkMoveToInbox',
            source: 'bulkActionIsland',
          });

          const firstCard = client.readFragment<BoardListsContextCardFragment>(
            {
              id: `Card:${bulkActionSelectedCards[0]}`,
              fragment: BoardListsContextCardFragmentDoc,
            },
            true,
          );

          await bulkMoveCards({
            cardIds: bulkActionSelectedCards,
            idBoard: boardId,
            listId: firstCard?.idList,
            posIndex: index,
            targetBoardId: inboxBoardId!,
            targetListId: inboxListId!,
            source,
          });
        }
      } catch (err) {
        showFlag({
          appearance: 'error',
          id: 'card-move-popover-move-submit',
          isAutoDismiss: true,
          title: intl.formatMessage({
            id: 'templates.popover_move_card.could-not-move-card',
            defaultMessage: 'Moving card failed',
            description: 'Moving card failed error flag message',
          }),
        });
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-web-eng',
            feature: 'Card Move Inbox Tab',
          },
        });
      }
    },
    [
      onClose,
      bulkMoveCards,
      boardId,
      inboxBoardId,
      inboxListId,
      source,
      bulkActionSelectedCards,
    ],
  );

  return (
    <div ref={ref}>
      <div className={styles.popoverSection}>
        <CopyMoveCardTabs
          generateInboxTab={() => (
            <InboxPositionSelectorBulk
              variation="move"
              onAction={onInboxMove}
            />
          )}
          generateBoardTab={() => (
            <>
              <h2 className={styles.header}>
                <FormattedMessage
                  id="templates.popover_move_card.select-destination"
                  defaultMessage="Select destination"
                  description="Select destination header on move card popover"
                />
              </h2>
              <BoardListPositionSelectBulk
                isMove={true}
                onClose={onClose}
                source={moveCardSource}
                boardId={boardId}
              />
            </>
          )}
        />
      </div>
    </div>
  );
};
