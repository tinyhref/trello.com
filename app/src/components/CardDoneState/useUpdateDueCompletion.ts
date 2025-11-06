import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { TrelloCardAri } from '@atlassian/ari';
import type { EventAttributes, SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
// eslint-disable-next-line no-restricted-imports
import type {
  TrelloCard,
  TrelloCardBadgeDueInfo,
} from '@trello/graphql/generated';
import { useBoardId, useCardId, useListId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';

import { useCardDoneStateBoardInfoFragment } from './CardDoneStateBoardInfo.generated';
import { useUpdateDueCompleteMutation } from './UpdateDueCompleteMutation.generated';

export const useUpdateDueCompletion = ({
  analyticsSource,
}: {
  analyticsSource: SourceType;
}) => {
  const intl = useIntl();
  const boardId = useBoardId();
  const cardId = useCardId();
  const listId = useListId();

  /**
   * We can't use the hooks for fetching workspaceId and enterpriseId
   * as the providers we need are frequently not in the tree.
   */
  const { data: board } = useCardDoneStateBoardInfoFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const workspaceId = board?.idOrganization;
  const enterpriseId = board?.idEnterprise;

  const [updateDueCompleteMutation, mutationResult] =
    useUpdateDueCompleteMutation();

  const updateDueComplete = useCallback(
    async (dueComplete: boolean, analyticsAttributes: EventAttributes = {}) => {
      const traceId = Analytics.startTask({
        taskName: 'edit-card/dueComplete',
        source: analyticsSource,
      });

      try {
        const cardAri = TrelloCardAri.create({
          workspaceId: workspaceId ?? '',
          cardId,
        }).toString();

        await updateDueCompleteMutation({
          variables: {
            traceId,
            cardId,
            dueComplete,
          },
          update(cache) {
            cache.modify<TrelloCard>({
              id: cache.identify({
                id: cardAri,
                __typename: 'TrelloCard',
              }),
              fields: {
                badges(existingBadges, { readField }) {
                  if (!existingBadges) {
                    return existingBadges;
                  }

                  const due = readField<TrelloCardBadgeDueInfo>(
                    'due',
                    existingBadges,
                  );
                  return {
                    ...existingBadges,
                    due: due && { ...due, complete: dueComplete },
                  };
                },
              },
            });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCardDueComplete: {
              id: cardId,
              dueComplete,
              badges: {
                __typename: 'Card_Badges',
                dueComplete,
              },
              __typename: 'Card',
            },
          },
        });

        Analytics.sendUpdatedCardFieldEvent({
          field: 'isComplete',
          source: analyticsSource,
          containers: formatContainers({
            listId,
            cardId,
            boardId,
            workspaceId,
            enterpriseId,
          }),
          attributes: {
            taskId: traceId,
            value: dueComplete,
            ...analyticsAttributes,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-card/dueComplete',
          traceId,
          source: analyticsSource,
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName: 'edit-card/dueComplete',
          traceId,
          source: analyticsSource,
          error,
        });
        showFlag({
          id: 'card-front-due-complete',
          title: intl.formatMessage({
            id: 'templates.app_management.something-went-wrong',
            defaultMessage: 'Something went wrong. Please try again later.',
            description:
              'Error message when updating the due complete status of a card fails',
          }),
          appearance: 'error',
          isAutoDismiss: true,
        });
      }
    },
    [
      updateDueCompleteMutation,
      cardId,
      listId,
      boardId,
      workspaceId,
      enterpriseId,
      intl,
      analyticsSource,
    ],
  );

  return [updateDueComplete, mutationResult] as const;
};
