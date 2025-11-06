import { useCallback } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { getMemberId } from '@trello/authentication';
import { getMembershipTypeFromOrganization } from '@trello/business-logic/organization';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { checkId, idCache } from '@trello/id-cache';
import { useBoardId, useEnterpriseId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';

import { useAddCardAttachmentMutation } from './AddCardAttachmentMutation.generated';
import type {
  CanPasteCardFromClipboardBoardQuery,
  CanPasteCardFromClipboardBoardQueryVariables,
} from './CanPasteCardFromClipboardBoardQuery.generated';
import { CanPasteCardFromClipboardBoardDocument } from './CanPasteCardFromClipboardBoardQuery.generated';
import type {
  CanPasteCardFromClipboardCardQuery,
  CanPasteCardFromClipboardCardQueryVariables,
} from './CanPasteCardFromClipboardCardQuery.generated';
import { CanPasteCardFromClipboardCardDocument } from './CanPasteCardFromClipboardCardQuery.generated';
import {
  CanPasteCardFromClipboardEnterpriseDocument,
  type CanPasteCardFromClipboardEnterpriseQuery,
  type CanPasteCardFromClipboardEnterpriseQueryVariables,
} from './CanPasteCardFromClipboardEnterpriseQuery.generated';
import type {
  CanPasteCardFromClipboardMemberQuery,
  CanPasteCardFromClipboardMemberQueryVariables,
} from './CanPasteCardFromClipboardMemberQuery.generated';
import { CanPasteCardFromClipboardMemberDocument } from './CanPasteCardFromClipboardMemberQuery.generated';
import type {
  CardClipboardQuery,
  CardClipboardQueryVariables,
} from './CardClipboardQuery.generated';
import { CardClipboardDocument } from './CardClipboardQuery.generated';
import {
  CopyCardDocument,
  useCopyCardMutation,
} from './CopyCardMutation.generated';
import { useCardMove } from './useCardMove';

export const useCopyPasteCard = () => {
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();
  const idBoard = useBoardId();
  const idEnterprise = useEnterpriseId();
  const { moveCard } = useCardMove();
  const [copyCardMutation] = useCopyCardMutation();
  const [addCardAttachmentMutation] = useAddCardAttachmentMutation();

  const canPasteCardBetweenBoards = useCallback(
    async (idCard: string, eventType: 'copy' | 'cut'): Promise<boolean> => {
      const { data: cardData } = await client.query<
        CanPasteCardFromClipboardCardQuery,
        CanPasteCardFromClipboardCardQueryVariables
      >({
        query: CanPasteCardFromClipboardCardDocument,
        variables: {
          idCard,
        },
      });
      if (!cardData.card?.idBoard || cardData.card?.idBoard === idBoard) {
        return true;
      }
      const { data: boardData } = await client.query<
        CanPasteCardFromClipboardBoardQuery,
        CanPasteCardFromClipboardBoardQueryVariables
      >({
        query: CanPasteCardFromClipboardBoardDocument,
        variables: {
          idBoard: cardData.card?.idBoard || '',
        },
      });
      const { data: memberData } = await client.query<
        CanPasteCardFromClipboardMemberQuery,
        CanPasteCardFromClipboardMemberQueryVariables
      >({
        query: CanPasteCardFromClipboardMemberDocument,
        variables: {
          idMember: getMemberId() || 'me',
        },
      });

      if (!boardData.board?.enterpriseOwned || !boardData.board.organization) {
        return true;
      }

      const { data: entData } = await client.query<
        CanPasteCardFromClipboardEnterpriseQuery,
        CanPasteCardFromClipboardEnterpriseQueryVariables
      >({
        query: CanPasteCardFromClipboardEnterpriseDocument,
        variables: {
          idEnterprise: boardData.board?.idEnterprise || '',
        },
      });

      if (!memberData.member) {
        return false;
      }
      const isGuest =
        getMembershipTypeFromOrganization(
          memberData.member,
          boardData.board.organization,
        ) === 'guest';
      if (isGuest) {
        if (eventType === 'cut') {
          showFlag({
            id: 'can-only-move-within-board',
            title: intl.formatMessage(
              {
                id: 'templates.clipboard.can-only-move-within-board',
                defaultMessage:
                  'This card can only be moved to lists within {boardName}.',
                description:
                  'An error message displayed indicating this card can only be moved to lists within a board',
              },
              {
                boardName: boardData?.board?.name,
              },
            ),
            appearance: 'error',
            msTimeout: 5000,
          });
        } else {
          showFlag({
            id: 'can-only-copy-within-board',
            title: intl.formatMessage(
              {
                id: 'templates.clipboard.can-only-copy-within-board',
                defaultMessage:
                  'This card can only be copied to lists within {boardName}.',
                description:
                  'An error message displayed indicating this card can only be copied to lists within a board',
              },
              {
                boardName: boardData.board?.name,
              },
            ),
            appearance: 'error',
            msTimeout: 5000,
          });
          throw new Error('can only copy within board');
        }
        return false;
      } else if (idEnterprise !== boardData.board?.idEnterprise) {
        if (eventType === 'cut') {
          showFlag({
            id: 'can-only-copy-within-enterprise',
            title: intl.formatMessage(
              {
                id: 'templates.clipboard.can-only-move-within-enterprise',
                defaultMessage:
                  'This card can only be moved to Workspaces within {enterpriseName}.',
                description:
                  'An error message displayed indicating this card can only be moved to workspaces within an enterprise',
              },
              {
                enterpriseName: entData?.enterprise?.name,
              },
            ),
            appearance: 'error',
            msTimeout: 5000,
          });
        } else {
          showFlag({
            id: 'can-only-copy-within-enterprise',
            title: intl.formatMessage(
              {
                id: 'templates.clipboard.can-only-copy-within-enterprise',
                defaultMessage:
                  'This card can only be copied to Workspaces within {enterpriseName}.',
                description:
                  'An error message displayed indicating this card can only be moved to workspaces within an enterprise',
              },
              {
                enterpriseName: entData.enterprise?.name,
              },
            ),
            appearance: 'error',
            msTimeout: 5000,
          });
          throw new Error('can only copy within enterprise');
        }
        return false;
      }
      return true;
    },
    [idBoard, idEnterprise],
  );
  const moveCutCard = useCallback(
    async (idCard: string, list: string, pos: number) => {
      if (!(await canPasteCardBetweenBoards(idCard, 'cut'))) {
        return;
      }
      await moveCard({ cardId: idCard, listId: list, index: pos });
      dismissOneTimeMessage(`pasteAlert-moveCard`);
    },
    [canPasteCardBetweenBoards, dismissOneTimeMessage, moveCard],
  );

  const copyCard = useCallback(
    async (idCard: string, idList: string, pos: number) => {
      const traceId = Analytics.startTask({
        taskName: 'create-card/paste-url',
        source: 'powerUpCardFromTrelloUrl',
      });
      try {
        await canPasteCardBetweenBoards(idCard, 'copy');
      } catch (err) {
        Analytics.taskFailed({
          taskName: 'create-card/paste-url',
          traceId,
          error: err,
          source: 'powerUpCardFromTrelloUrl',
        });
        return;
      }

      try {
        const { data: copyCardData } = await copyCardMutation({
          mutation: CopyCardDocument,
          variables: {
            idCardSource: idCard,
            idList,
            pos,
            keepFromSource: [
              'attachments',
              'checklists',
              'customFields',
              'comments',
              'due',
              'start',
              'labels',
              'members',
              'start',
              'stickers',
            ],
            traceId,
          },
        });

        await dismissOneTimeMessage(`pasteAlert-copyCard`);
        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source: 'powerUpCardFromTrelloUrl',
          containers: formatContainers({
            idBoard,
            idList,
            idCard: copyCardData?.copyCard?.id,
          }),
          attributes: {
            taskId: traceId,
          },
        });
        Analytics.taskSucceeded({
          taskName: 'create-card/paste-url',
          traceId,
          source: 'powerUpCardFromTrelloUrl',
        });
      } catch (err) {
        Analytics.taskFailed({
          taskName: 'create-card/paste-url',
          traceId,
          source: 'powerUpCardFromTrelloUrl',
          error: err,
        });
      }
    },
    [
      canPasteCardBetweenBoards,
      copyCardMutation,
      dismissOneTimeMessage,
      idBoard,
    ],
  );

  const pasteCardUrlOnCard = useCallback(
    async (url: string, idCard: string) => {
      addCardAttachmentMutation({
        variables: { idCard, url },
      });
    },
    [addCardAttachmentMutation],
  );

  const pasteCardUrlOnList = useCallback(
    async (shortLink: string, idList: string, pos: number, isCut: boolean) => {
      let sourceCardId = checkId(shortLink)
        ? shortLink
        : idCache.getCardId(shortLink);
      if (!sourceCardId) {
        const { data } = await client.query<
          CardClipboardQuery,
          CardClipboardQueryVariables
        >({
          query: CardClipboardDocument,
          variables: {
            idCard: shortLink,
          },
        });
        sourceCardId = data?.card?.id;
      }
      if (idList && sourceCardId) {
        if (isCut) {
          return moveCutCard(sourceCardId, idList, pos);
        } else {
          return copyCard(sourceCardId, idList, pos);
        }
      }
    },
    [copyCard, moveCutCard],
  );

  return { pasteCardUrlOnCard, pasteCardUrlOnList };
};
