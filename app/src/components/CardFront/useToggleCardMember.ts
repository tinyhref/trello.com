import { useCallback } from 'react';

import { ActionHistory } from '@trello/action-history';
import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { client, optimisticIdManager } from '@trello/graphql';
import { intl } from '@trello/i18n';
import type { Card } from '@trello/model-types';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';

import { useAddMemberToBoardShortcutMutation } from './AddMemberToBoardShortcutMutation.generated';
import { useAddMemberToCardShortcutMutation } from './AddMemberToCardShortcutMutation.generated';
import {
  type BoardToggleMemberPrefsFragment,
  useBoardToggleMemberPrefsFragment,
} from './BoardToggleMemberPrefsFragment.generated';
import { useCardFrontMembersFragment } from './CardFrontMembersFragment.generated';
import { useRemoveMemberFromCardShortcutMutation } from './RemoveMemberFromCardShortcutMutation.generated';

type Board = NonNullable<BoardToggleMemberPrefsFragment>;
type Membership = Board['memberships'][number];
type BoardPrefs = Board['prefs'];

// This function exists on the board model and explicitly checks if a member is not on a board but lives
// in the org, and whether the board allows self joins. This is necessary to check if we need to try
// adding a member to a board before adding them to a card on line 89.
const isEditableByTeamMemberAndIsNotABoardMember = (
  membership: Membership,
  boardPrefs: BoardPrefs,
): boolean => {
  if (!boardPrefs) {
    return false;
  }

  const isEditableByTeamMember =
    (membership.orgMemberType && membership.orgMemberType === 'admin') ||
    (boardPrefs.selfJoin && membership.orgMemberType === 'normal');

  return isEditableByTeamMember && !membership.memberType;
};

const isMemberToggleAllowed = (
  membership: Membership,
  boardPrefs: BoardPrefs,
): boolean => {
  if (boardPrefs?.isTemplate) {
    return false;
  }

  if (membership.memberType) {
    return true;
  }

  return isEditableByTeamMemberAndIsNotABoardMember(membership, boardPrefs);
};

function modifyCardMembersInCache(
  cardId: string,
  memberId: string,
  isOnCard: boolean,
) {
  client.cache.modify<Card>({
    id: client.cache.identify({ id: cardId, __typename: 'Card' }),
    fields: {
      idMembers(currentIdMembers = []) {
        if (!Array.isArray(currentIdMembers)) {
          return currentIdMembers;
        }
        return isOnCard
          ? currentIdMembers.filter((id) => id !== memberId)
          : [...currentIdMembers, memberId];
      },
    },
    optimistic: true,
  });
}

export function useToggleCardMember({
  boardId,
  cardId,
  source,
}: {
  boardId: string;
  cardId: string;
  source: SourceType;
}) {
  const currentUserId = useMemberId();

  const { data } = useCardFrontMembersFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const { data: boardData } = useBoardToggleMemberPrefsFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const [addMemberCardMutation] = useAddMemberToCardShortcutMutation();
  const [addMemberBoardMutation] = useAddMemberToBoardShortcutMutation();
  const [removeMemberMutation] = useRemoveMemberFromCardShortcutMutation();

  const boardPrefs = boardData?.prefs;
  const currentUserMembership = boardData?.memberships?.[0];
  const listId = data?.idList || '';

  const isOnCard = useCallback(
    (memberId: string) => (data?.idMembers || []).includes(memberId),
    [data?.idMembers],
  );

  const toggleMember = useCallback(
    async (idMember: string) => {
      const isUserOnCard = isOnCard(idMember);
      const isToggleForCurrentUser = idMember === currentUserId;

      if (
        !currentUserMembership ||
        !isMemberToggleAllowed(currentUserMembership, boardPrefs)
      ) {
        return;
      }
      if (
        isEditableByTeamMemberAndIsNotABoardMember(
          currentUserMembership,
          boardPrefs,
        )
      ) {
        try {
          await addMemberBoardMutation({
            variables: {
              boardId,
              member: { id: idMember },
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addMemberToBoard: {
                success: true,
                __typename: 'InviteMember_Response',
              },
            },
          });
        } catch (e) {
          const error = e as Error;
          showFlag({
            id: 'addMemberToCardError',
            title: intl.formatMessage({
              id: 'templates.member_on_card.we-couldnt-add-a-member',
              defaultMessage: "We couldn't add a member to the card",
              description:
                'Error message shown when Trello fails to add a member to a card',
            }),
            description: error.message,
            appearance: 'error',
            isAutoDismiss: true,
          });
          throw error;
        }
      }

      const traceId = Analytics.startTask({
        taskName: 'edit-card/idMembers',
        source,
      });

      dismissFlag({ id: 'addMemberToCardError' });
      dismissFlag({ id: 'removeMemberFromCardError' });

      try {
        let resolvedCardId = cardId;
        if (optimisticIdManager.isOptimisticId(cardId)) {
          modifyCardMembersInCache(resolvedCardId, idMember, isUserOnCard);
          resolvedCardId = await optimisticIdManager.waitForId(cardId);
        }

        ActionHistory.append(
          {
            type: isUserOnCard ? 'remove-member' : 'add-member',
            idMember,
          },
          {
            idCard: resolvedCardId,
            idBoard: boardId ?? '',
            idList: listId,
            idLabels: [],
            idMembers: [], // isn't actually used, so don't bother hydrating.
          },
        );

        if (isUserOnCard) {
          await removeMemberMutation({
            variables: {
              cardId: resolvedCardId,
              idMember,
              traceId,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              removeMemberFromCard: {
                success: true,
                __typename: 'Card_Member_DeleteResponse',
              },
            },
            update() {
              modifyCardMembersInCache(resolvedCardId, idMember, true);
            },
          });
        } else {
          await addMemberCardMutation({
            variables: {
              cardId: resolvedCardId,
              idMember,
              traceId,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              addMemberToCard: {
                success: true,
                __typename: 'Card_Member_AddResponse',
              },
            },
            update() {
              modifyCardMembersInCache(resolvedCardId, idMember, false);
            },
          });
        }

        Analytics.taskSucceeded({
          taskName: 'edit-card/idMembers',
          traceId,
          source,
        });

        let changeType;
        if (isUserOnCard) {
          changeType = 'remove member';
        } else if (isToggleForCurrentUser) {
          changeType = 'join';
        } else {
          changeType = 'add member';
        }

        Analytics.sendUpdatedCardFieldEvent({
          field: 'idMembers',
          source,
          containers: formatContainers({
            idCard: resolvedCardId,
            idBoard: boardId,
          }),
          attributes: {
            taskId: traceId,
            changeType,
          },
        });
      } catch (err) {
        let title: string;

        if (isUserOnCard) {
          if (isToggleForCurrentUser) {
            title = intl.formatMessage({
              id: 'templates.member_on_card.we-couldnt-remove-you',
              defaultMessage: "We couldn't remove you from the card",
              description:
                'Error message shown when Trello fails to remove you from a card',
            });
          } else {
            title = intl.formatMessage({
              id: 'templates.member_on_card.we-couldnt-remove-a-member',
              defaultMessage: "We couldn't remove a member from the card",
              description:
                'Error message shown when Trello fails to remove a member from a card',
            });
          }
        } else {
          if (isToggleForCurrentUser) {
            title = intl.formatMessage({
              id: 'templates.member_on_card.we-couldnt-add-you',
              defaultMessage: "We couldn't add you to the card",
              description:
                'Error message shown when Trello fails to add you to a card',
            });
          } else {
            title = intl.formatMessage({
              id: 'templates.member_on_card.we-couldnt-add-a-member',
              defaultMessage: "We couldn't add a member to the card",
              description:
                'Error message shown when Trello fails to add a member to a card',
            });
          }
        }

        showFlag({
          id: isUserOnCard
            ? 'removeMemberFromCardError'
            : 'addMemberToCardError',
          appearance: 'error',
          title,
          description: intl.formatMessage({
            id: 'templates.member_on_card.wait-a-moment-then-try-it-again',
            defaultMessage: 'Wait a moment then try it again.',
            description:
              'Error message directing the user to wait a moment and try their operation again',
          }),
          isAutoDismiss: true,
        });

        Analytics.taskFailed({
          taskName: 'edit-card/idMembers',
          traceId,
          source,
          error: err,
        });
      }
    },
    [
      cardId,
      boardId,
      listId,
      currentUserMembership,
      boardPrefs,
      addMemberCardMutation,
      addMemberBoardMutation,
      removeMemberMutation,
      isOnCard,
      source,
      currentUserId,
    ],
  );

  return { toggleMember, isOnCard };
}
