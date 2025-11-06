import { useCallback } from 'react';

import { isAtOrOverLimit } from '@trello/business-logic/limit';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';

import type {
  CardComposerLimitsQuery,
  CardComposerLimitsQueryVariables,
} from 'app/src/components/CardComposer/CardComposerLimitsQuery.generated';
import { CardComposerLimitsDocument } from 'app/src/components/CardComposer/CardComposerLimitsQuery.generated';

export const useIsOverCardLimits = () => {
  const idBoard = useBoardId();
  const isOverCardLimits = useCallback(
    (idList: string) => {
      const data = client.readQuery<
        CardComposerLimitsQuery,
        CardComposerLimitsQueryVariables
      >({
        query: CardComposerLimitsDocument,
        variables: {
          listId: idList,
          boardId: idBoard,
        },
      });

      const boardName = data?.board?.name ?? '';
      const listName = data?.list?.name ?? '';

      const boardLimits = data?.board?.limits?.cards;
      const openPerBoard = boardLimits?.openPerBoard;
      const totalPerBoard = boardLimits?.totalPerBoard;

      const listLimits = data?.list?.limits?.cards;
      const openPerList = listLimits?.openPerList;
      const totalPerList = listLimits?.totalPerList;

      if (openPerBoard && isAtOrOverLimit(openPerBoard)) {
        showFlag({
          id: 'too-many-open-cards-per-board',
          title: intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-open-cards-per-board',
              defaultMessage:
                'You have too many open cards on “{boardName}”. Archive some to add more.',
              description: 'Too many open cards on board; archive to add.',
            },
            {
              boardName,
            },
          ),
          appearance: 'error',
          msTimeout: 5000,
        });
        return true;
      } else if (totalPerBoard && isAtOrOverLimit(totalPerBoard)) {
        showFlag({
          id: 'too-many-total-cards-per-board',
          title: intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-total-cards-per-board',
              defaultMessage:
                'You have too many cards on “{boardName}”. Delete some archived cards to add more.',
              description: 'Too many cards on board; delete archived cards.',
            },
            {
              boardName,
            },
          ),
          appearance: 'error',
          msTimeout: 5000,
        });
        return true;
      } else if (openPerList && isAtOrOverLimit(openPerList)) {
        showFlag({
          id: 'too-many-open-cards-per-list',
          title: intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-open-cards-per-list',
              defaultMessage:
                'You have too many open cards on “{listName}”. Archive some to add more.',
              description:
                'Message to inform user that their list has too many open cards and they need to archive some.',
            },
            {
              listName,
            },
          ),
          appearance: 'error',
          msTimeout: 5000,
        });
        return true;
      } else if (totalPerList && isAtOrOverLimit(totalPerList)) {
        showFlag({
          id: 'too-many-total-cards-per-list',
          title: intl.formatMessage(
            {
              id: 'templates.card_limits_error.too-many-total-cards-per-list',
              defaultMessage:
                'You have too many cards on “{listName}”. Delete some archived cards to add more.',
              description:
                'Message to inform user that their list has too many total cards in this list and need to delete archived cards.',
            },
            {
              listName,
            },
          ),
          appearance: 'error',
          msTimeout: 5000,
        });
        return true;
      }

      return false;
    },
    [idBoard],
  );
  return { isOverCardLimits };
};
