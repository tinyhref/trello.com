import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import type { CurrentBoardFullCardFragment } from '@trello/graphql';
import {
  client,
  getFragmentDocument,
  optimisticIdManager,
} from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import type { Board } from '@trello/model-types';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { calculateItemPosition } from '@trello/position';

import { createOptimisticCardResponse } from 'app/src/components/CardComposer/createOptimisticCardResponse';
import { readListVisibleCardsFromCache } from 'app/src/components/List/readListVisibleCardsFromCache';
import { bypassViewportCheckForListOrCardId } from 'app/src/components/List/useListsAndCardsViewportObserver';
import { useCardLimits } from 'app/src/components/MoveCardPopover/useCardLimits';
import { useCreateCardFromSmartListMutation } from './CreateCardFromSmartListMutation.generated';
import type { SmartListFragment } from './SmartListFragment.generated';
import { SmartListFragmentDoc } from './SmartListFragment.generated';
import { useToggleSmartListFilter } from './useToggleSmartListFilter';

const SMART_LIST_CARD_DROP_MESSAGE = 'smart-list-card-drop-message';

type CreateCardArgs = {
  idBoard?: string;
  idList: string;
  idListSource: string;
  index: number;
  isDnD?: boolean;
  source: SourceType;
  url: string;
};

export function useCreateCardFromSmartList() {
  const currentBoardId = useBoardId();
  const [createCardMutation] = useCreateCardFromSmartListMutation();
  const { dismissOneTimeMessage, isOneTimeMessageDismissed } =
    useOneTimeMessagesDismissed();
  const { toggleFilter } = useToggleSmartListFilter();
  const { isOverLimits } = useCardLimits();

  const dismiss = useCallback(() => {
    dismissFlag({ id: 'smartListCardDrop' });
    dismissOneTimeMessage(SMART_LIST_CARD_DROP_MESSAGE);
  }, [dismissOneTimeMessage]);

  const toggle = useCallback(
    (idList: string, newFilterValue: boolean) => {
      dismissFlag({ id: 'smartListCardDrop' });
      toggleFilter({ idList });
      Analytics.sendUIEvent({
        action: 'toggled',
        actionSubject: 'checkItem',
        actionSubjectId: 'filterSmartListToggle',
        source: 'boardScreen',
        attributes: {
          newFilterValue,
          toggledFrom: 'cardCopySuccess',
        },
      });
    },
    [toggleFilter],
  );

  const createCard = useCallback(
    async ({
      idBoard = currentBoardId,
      idList,
      idListSource,
      index,
      isDnD,
      source,
      url,
    }: CreateCardArgs) => {
      const cards = readListVisibleCardsFromCache({
        boardId: idBoard,
        listId: idList,
      });

      if (!cards) {
        return;
      }

      const limitsError = isOverLimits(idBoard, idList);

      if (limitsError) {
        showFlag({
          id: 'smartListCardDropLimitExceeded',
          title: limitsError,
          appearance: 'error',
        });
        return;
      }

      // useListAsDropTarget will use 1e9 to represent bottom of list
      const targetIndex = Math.min(cards.length, index);

      const taskName = 'create-card/list';
      const traceId = Analytics.startTask({
        taskName,
        source,
      });

      try {
        const cardRole = 'link';
        const name = url;
        const pos = calculateItemPosition(targetIndex, cards);

        const optimisticId = optimisticIdManager.generateOptimisticId('Card');

        const result = await createCardMutation({
          variables: {
            cardRole,
            idList,
            name,
            pos,
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createCard: createOptimisticCardResponse({
              id: optimisticId,
              idBoard,
              idList,
              cardRole,
              name,
              pos,
            }),
          },
          update(cache, { data }) {
            const newCard = data?.createCard;
            if (!newCard) {
              return;
            }

            bypassViewportCheckForListOrCardId(newCard.id);

            if (newCard.id !== optimisticId) {
              optimisticIdManager.resolveId(optimisticId, newCard.id);
            }

            /**
             * First part of getting optimistic updates to work is adding the card
             * to the set of board.cards, which will refresh the queries that include
             * board.cards. For example, the BoardListsContextQuery.
             */
            cache.modify<Board>({
              id: cache.identify({
                id: idBoard,
                __typename: 'Board',
              }),
              fields: {
                cards(existingCards = [], { readField }) {
                  const newCardRef =
                    cache.writeFragment<CurrentBoardFullCardFragment>({
                      data: newCard,
                      fragment: getFragmentDocument('CurrentBoardFullCard'),
                      fragmentName: 'CurrentBoardFullCard',
                    });

                  // Quick safety check - if the new card is already
                  // present in the cache, we don't need to add it again.
                  if (
                    !newCardRef ||
                    existingCards.some(
                      (cardRef) => readField('id', cardRef) === newCard.id,
                    )
                  ) {
                    return existingCards;
                  }

                  // Append the new ref to the array of existing refs for cards
                  return existingCards.concat(newCardRef);
                },
              },
            });
          },
        });

        const idCard = result.data?.createCard?.id;

        const sourceList = client.readFragment<SmartListFragment>(
          {
            id: client.cache.identify({
              id: idListSource,
              __typename: 'List',
            }),
            fragment: SmartListFragmentDoc,
          },
          true,
        );
        const isFilterEnabled = sourceList?.datasource?.filter ?? false;

        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source,
          attributes: {
            taskId: traceId,
            cardRole,
            sourceListType: 'jira',
            isSmartListCopy: true,
            smartListFilterValue: isFilterEnabled,
          },
          containers: formatContainers({ idBoard, idCard, idList }),
        });

        Analytics.taskSucceeded({ taskName, source, traceId });

        if (isDnD && !isOneTimeMessageDismissed(SMART_LIST_CARD_DROP_MESSAGE)) {
          const flagDescriptionCopy = isFilterEnabled
            ? intl.formatMessage(
                {
                  id: 'templates.smart_lists.copied-cards-in-list-are-hidden',
                  defaultMessage:
                    'Copied cards in {listName} are hidden. You can disable the filter to show them.',
                  description:
                    'Body of flag appearing on drop of Smart List card',
                },
                { listName: sourceList?.name },
              )
            : intl.formatMessage({
                id: 'templates.smart_lists.use-the-jira-list-filter',
                defaultMessage:
                  'Use the Jira list filter to hide copied cards.',
                description:
                  'Body of flag appearing on drop of Smart List card',
              });

          const toggleFilterCopy = isFilterEnabled
            ? intl.formatMessage(
                {
                  id: 'templates.smart_lists.show-all-cards-in-list',
                  defaultMessage: 'Show all cards in {listName}',
                  description: 'Flag link button to toggle smart list filter',
                },
                { listName: sourceList?.name },
              )
            : intl.formatMessage({
                id: 'templates.smart_lists.card-copied-flag-button',
                defaultMessage: 'Hide copied cards',
                description: 'Flag link button to toggle smart list filter',
              });

          showFlag({
            id: 'smartListCardDrop',
            title: intl.formatMessage({
              id: 'templates.smart_lists.card-copied-flag-title',
              defaultMessage: 'The card was copied',
              description:
                'Title of flag appearing on drag start of Smart List card',
            }),
            description: flagDescriptionCopy,
            appearance: 'success',
            actions: [
              {
                content: toggleFilterCopy,
                onClick: () => toggle(idListSource, !isFilterEnabled),
                type: 'link',
              },
              {
                content: intl.formatMessage({
                  id: 'templates.smart_lists.dont-show-this-again',
                  defaultMessage: "Don't show this again",
                  description: 'Button to not show this flag again',
                }),
                onClick: dismiss,
                type: 'link',
              },
            ],
            isAutoDismiss: true,
          });
        }
      } catch (error) {
        Analytics.taskFailed({ taskName, source, traceId, error });
      }
    },
    [
      createCardMutation,
      currentBoardId,
      dismiss,
      isOneTimeMessageDismissed,
      isOverLimits,
      toggle,
    ],
  );

  return { createCard };
}
