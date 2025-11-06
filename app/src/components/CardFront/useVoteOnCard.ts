import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { client, optimisticIdManager } from '@trello/graphql';
import {
  useBoardId,
  useCardId,
  useEnterpriseId,
  useListId,
} from '@trello/id-context';
import type { Card } from '@trello/model-types';

import { useAddMemberVotedMutation } from './AddMemberVotedMutation.generated';
import { useCardFrontFragment } from './CardFrontFragment.generated';
import { useCardVotesFragment } from './CardVotesFragment.generated';
import { useDeleteMemberVotedMutation } from './DeleteMemberVotedMutation.generated';

function modifyCardVotesInCache(
  cardId: string,
  idMember: string,
  hasVoted: boolean,
) {
  client.cache.modify<Card>({
    id: client.cache.identify({
      id: cardId,
      __typename: 'Card',
    }),
    fields: {
      idMembersVoted(currentIdMembersVoted = []) {
        // This doesn't have a typename property so we just make sure that it's an array.
        if (!Array.isArray(currentIdMembersVoted)) {
          return currentIdMembersVoted;
        }
        if (hasVoted) {
          return currentIdMembersVoted.filter((id: string) => id !== idMember);
        } else {
          return [...currentIdMembersVoted, idMember];
        }
      },
      membersVoted(currentMembersVoted = [], { readField, toReference }) {
        if (!Array.isArray(currentMembersVoted)) {
          return currentMembersVoted;
        }
        if (hasVoted) {
          return currentMembersVoted.filter(
            (memberRef) => readField('id', memberRef) !== idMember,
          );
        }
        const member = client.cache.identify({
          id: idMember,
          __typename: 'Member',
        });
        if (member) {
          return [...currentMembersVoted, toReference(member)];
        } else {
          return currentMembersVoted;
        }
      },
      badges(currentBadges) {
        // Type guard to handle an unrealistic case where `badges` is wrong.
        if (!('__typename' in currentBadges)) {
          return currentBadges;
        }
        if (hasVoted) {
          return {
            ...currentBadges,
            votes: Math.max(currentBadges.votes - 1, 0),
            viewingMemberVoted: false,
          };
        } else {
          return {
            ...currentBadges,
            votes: currentBadges.votes + 1,
            viewingMemberVoted: true,
          };
        }
      },
    },
    optimistic: true,
  });
}

export function useVoteOnCard({
  source = 'cardView',
}: {
  source?: SourceType;
} = {}) {
  const boardId = useBoardId();
  const cardId = useCardId();

  const { data: cardData } = useCardFrontFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const { data: cardVotesData } = useCardVotesFragment({
    from: { id: cardData?.mirrorSourceId || cardId },
    optimistic: true,
  });

  const [deleteMemberVotedMutation] = useDeleteMemberVotedMutation();
  const [addMemberVotedMutation] = useAddMemberVotedMutation();

  const hasVoted = cardVotesData?.badges?.viewingMemberVoted ?? false;

  const idEnterprise = useEnterpriseId();
  const idList = useListId();
  const idMember = useMemberId();

  const toggleVote = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'edit-card/membersVoted',
      source,
    });

    try {
      let resolvedCardId = cardData?.mirrorSourceId || cardId;
      if (optimisticIdManager.isOptimisticId(cardId)) {
        modifyCardVotesInCache(cardId, idMember, hasVoted);
        resolvedCardId = await optimisticIdManager.waitForId(cardId);
      }

      if (hasVoted) {
        await deleteMemberVotedMutation({
          variables: {
            cardId: resolvedCardId,
            idMember,
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteMemberVoted: {
              id: resolvedCardId,
              __typename: 'Card',
            },
          },
          update() {
            modifyCardVotesInCache(resolvedCardId, idMember, true);
          },
        });
      } else {
        await addMemberVotedMutation({
          variables: {
            cardId: resolvedCardId,
            idMember,
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addMemberVoted: {
              id: resolvedCardId,
              __typename: 'Card',
            },
          },
          update() {
            modifyCardVotesInCache(resolvedCardId, idMember, false);
          },
        });
      }

      Analytics.taskSucceeded({
        taskName: 'edit-card/membersVoted',
        traceId,
        source,
      });

      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'vote',
        source,
        attributes: {
          updatedOn: 'card',
          value: hasVoted ? 'false' : 'true',
        },
        containers: formatContainers({
          idBoard: boardId,
          idCard: resolvedCardId,
          idEnterprise,
          idList,
        }),
      });
    } catch (err) {
      Analytics.taskFailed({
        taskName: 'edit-card/membersVoted',
        traceId,
        source,
        error: err,
      });
    }
  }, [
    source,
    cardData?.mirrorSourceId,
    cardId,
    hasVoted,
    boardId,
    idEnterprise,
    idList,
    idMember,
    deleteMemberVotedMutation,
    addMemberVotedMutation,
  ]);

  return { toggleVote, hasVoted };
}
