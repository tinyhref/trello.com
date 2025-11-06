import { useCallback, type FunctionComponent } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useMemberInboxIds } from '@trello/personal-workspace';

import { bulkActionSelectedCardsSharedState } from 'app/src/components/BulkAction/bulkActionSelectedCardsSharedState';
import { InboxPositionSelectorBulk } from './InboxPositionSelectorBulk';
import { useBulkCardCopy } from './useBulkCardCopy';

export interface CopyCardTabInboxBulkProps {
  onClose: () => void;
  source?: SourceType;
}

export const CopyCardTabInboxBulk: FunctionComponent<
  CopyCardTabInboxBulkProps
> = ({ onClose }) => {
  const boardId = useBoardId();

  const { bulkCopyCards } = useBulkCardCopy();
  const { idBoard: inboxId, idList: inboxListId } = useMemberInboxIds();

  const onCopy = useCallback(
    async (index: number) => {
      const keepOptions = {
        checklists: true,
        attachments: true,
        comments: true,
        labels: false,
        customFields: false,
        members: false,
        stickers: false,
      };

      const bulkActionSelectedCards = Object.keys(
        bulkActionSelectedCardsSharedState.value.selectedCards[boardId] ?? {},
      );
      onClose();
      if (bulkActionSelectedCards?.length > 0) {
        try {
          Analytics.sendClickedButtonEvent({
            buttonName: 'bulkCopyToInbox',
            source: 'inboxBulkModal',
            attributes: {
              numSelectedCards: bulkActionSelectedCards.length,
            },
          });
          bulkActionSelectedCardsSharedState.setValue((prevState) => ({
            ...prevState,
            isLoading: true,
          }));
          await bulkCopyCards({
            cardIds: bulkActionSelectedCards,
            idBoard: boardId,
            posIndex: index,
            targetBoardId: inboxId!,
            targetListId: inboxListId!,
            source: 'copyCardInlineInboxDialog',
            keepOptions,
          });
          // This need to be an updater function because of how shared state for objects is handled
          bulkActionSelectedCardsSharedState.setValue(() => ({
            selectedCards: {},
            isLoading: false,
          }));
        } catch (error) {
          showFlag({
            id: 'card-copy-popover-copy-submit',
            title: String(
              intl.formatMessage({
                id: 'templates.card_copy.copy-card-error',
                defaultMessage: 'Unable to copy card',
                description: 'Copying card failed error flag message',
              }),
            ),
            appearance: 'error',
            isAutoDismiss: true,
          });
          bulkActionSelectedCardsSharedState.setValue((prevState) => ({
            ...prevState,
            isLoading: false,
          }));
        }
      }
    },
    [boardId, onClose, bulkCopyCards, inboxId, inboxListId],
  );

  return <InboxPositionSelectorBulk variation="copy" onAction={onCopy} />;
};
