import { gql, type ApolloClient, type OnDataOptions } from '@apollo/client';
import { useCallback, type FunctionComponent } from 'react';

import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import type { TrelloMirrorCardSubscriptionCardFragment } from '@trello/graphql';
// eslint-disable-next-line no-restricted-imports -- we want the types for type safety?
import type { CustomField, CustomField_Type } from '@trello/graphql/generated';
import { idCache } from '@trello/id-cache';
import type { Board, Card, Label } from '@trello/model-types';
import { convertToUGCString, type UGCString } from '@trello/privacy';

import type { MirrorCardFragment } from './MirrorCardFragment.generated';
import { MirrorCardFragmentDoc } from './MirrorCardFragment.generated';
import {
  MirrorCardSourceBoardCustomFieldsFragmentDoc,
  type MirrorCardSourceBoardCustomFieldsFragment,
} from './MirrorCardSourceBoardCustomFieldsFragment.generated';
import {
  MirrorCardSourceBoardInfoFragmentDoc,
  type MirrorCardSourceBoardInfoFragment,
} from './MirrorCardSourceBoardInfoFragment.generated';
import { useTrelloMirrorCardsActionsSubscription } from './TrelloMirrorCardsActionsSubscription.generated';
import {
  useTrelloMirrorCardsSubscription,
  type TrelloMirrorCardsSubscription,
} from './TrelloMirrorCardsSubscription.generated';

type Sticker = NonNullable<MirrorCardFragment>['stickers'][number];
type Checklist = NonNullable<MirrorCardFragment>['checklists'][number];
type Badges = NonNullable<MirrorCardFragment>['badges'];
type Attachment = NonNullable<MirrorCardFragment>['attachments'][number];

interface CustomFieldItemValue {
  __typename: 'CustomFieldItem_Value';
  text: string | null;
  number: string | null;
  date: string | null;
  checked: string | null;
}

interface CustomFieldItem {
  __typename: 'CustomFieldItem';
  id: string;
  idCustomField: string;
  idValue?: string | null;
  idModel: string;
  modelType: 'card';
  value?: CustomFieldItemValue | null | undefined;
}

export const getSubscriptionData = (
  data: OnDataOptions<TrelloMirrorCardsSubscription>,
) => data?.data?.data?.trello.onBoardUpdated;

const updateBoard = (
  boardIdOrShortLink: string,
  data: OnDataOptions<TrelloMirrorCardsSubscription>,
) => {
  const client = data.client;

  const isCardBackCacheSyncingEnabled = dangerouslyGetFeatureGateSync(
    'goo_card_back_cache_syncing',
  );

  const subscriptionData = getSubscriptionData(data);
  if (!subscriptionData) {
    return;
  }

  const boardId =
    boardIdOrShortLink.length === 8
      ? (idCache.getBoardId(boardIdOrShortLink) ?? '')
      : boardIdOrShortLink;

  const existingBoard = client.readFragment<MirrorCardSourceBoardInfoFragment>({
    id: client.cache.identify({
      id: boardId,
      __typename: 'Board',
    }),
    fragment: MirrorCardSourceBoardInfoFragmentDoc,
  });
  if (subscriptionData.name && existingBoard?.name !== subscriptionData.name) {
    client.cache.modify<Board>({
      id: client.cache.identify({
        id: boardId,
        __typename: 'Board',
      }),
      fields: {
        name: () => subscriptionData.name || '',
      },
    });
  }

  if (!isCardBackCacheSyncingEnabled && subscriptionData.customFields?.edges) {
    const existingCustomFields =
      client.readFragment<MirrorCardSourceBoardCustomFieldsFragment>({
        id: client.cache.identify({
          id: boardId,
          __typename: 'Board',
        }),
        fragment: MirrorCardSourceBoardCustomFieldsFragmentDoc,
      });
    subscriptionData.customFields.edges.map((customField) => {
      if (
        existingCustomFields?.customFields?.some(
          (field) => field.id === customField.node.objectId,
        )
      ) {
        const existingField = client.cache.identify({
          id: customField.node.objectId,
          __typename: 'CustomField',
        });
        if (existingField) {
          client.cache.modify<CustomField>({
            id: existingField,
            fields: {
              name: (prev) => customField.node.name ?? prev,
              options: (prev) =>
                customField.node.options?.map((option) => ({
                  __typename: 'CustomField_Option' as const,
                  id: option.objectId,
                  idCustomField: customField.node.objectId,
                  pos: option.position ?? 0,
                  value: {
                    __typename: 'CustomField_Option_Value' as const,
                    text: option.value?.text ?? '',
                  },
                  color: option.color ?? '',
                })) ?? prev,
            },
          });
        }
      } else {
        client.cache.modify<Board>({
          id: client.cache.identify({
            id: boardId,
            __typename: 'Board',
          }),
          fields: {
            customFields: (prev) => {
              const newCustomFieldRef = client.cache.writeFragment({
                data: {
                  __typename: 'CustomField',
                  id: customField.node.objectId,
                  name: customField.node.name ?? '',
                  type: customField.node.type as CustomField_Type,
                  options:
                    customField.node.options?.map((option) => ({
                      __typename: 'CustomField_Option',
                      id: option.objectId,
                      idCustomField: customField.node.objectId,
                      value: {
                        text: option.value?.text ?? '',
                      },
                      color: option.color ?? '',
                      pos: option.position ?? 0,
                    })) ?? [],
                  pos: customField.node.position ?? 0,
                  fieldGroup: '',
                  modelType: 'board',
                  isSuggestedField: false,
                  idModel: boardId,
                  display: {
                    __typename: 'CustomField_Display',
                    cardFront: customField.node.display?.cardFront ?? false,
                  },
                },
                fragment: gql`
                  fragment NewCustomField on CustomField {
                    id
                    name
                    type
                    options {
                      id
                      idCustomField
                      value {
                        text
                      }
                      color
                      pos
                    }
                    pos
                    fieldGroup
                    modelType
                    isSuggestedField
                    idModel
                    display {
                      cardFront
                    }
                  }
                `,
              });
              if (!newCustomFieldRef) {
                return prev;
              }
              return [...prev, newCustomFieldRef];
            },
          },
        });
      }
    });
  }
};

/**
 * Updates an existing checklist directly in the cache
 */
const updateChecklist = (
  client: ApolloClient<object>,
  checklist: NonNullable<
    NonNullable<TrelloMirrorCardSubscriptionCardFragment['checklists']>['edges']
  >[number]['node'],
) => {
  const checklistFields: {
    [key: string]: () => UGCString | number | string;
  } = {};

  // Since some fields may be set to 'null' incorrectly and we don't have delta processing
  // code here, check that each field is non-null before updating it

  if (typeof checklist.position === 'number') {
    const newPosition = checklist.position;
    checklistFields.pos = () => newPosition;
  }

  if (typeof checklist.name === 'string') {
    const newName = checklist.name;
    checklistFields.name = () => convertToUGCString(newName);
  }

  const checklistCacheId = client.cache.identify({
    id: checklist.objectId,
    __typename: 'Checklist',
  });
  client.cache.modify<Checklist>({
    id: checklistCacheId,
    fields: checklistFields,
    optimistic: true,
  });
};

const updateCards = (
  data: OnDataOptions<TrelloMirrorCardsSubscription>,
  cardRealIds: string[],
  boardId: string,
) => {
  const client = data.client;
  const isCardBackCacheSyncingEnabled = dangerouslyGetFeatureGateSync(
    'goo_card_back_cache_syncing',
  );

  const subscriptionData = getSubscriptionData(data);
  if (!subscriptionData) {
    return;
  }

  const updatedCards = subscriptionData.lists?.edges?.[0]?.node?.cards?.edges
    ?.map((c) => c.node)
    ?.filter((c) => c.objectId && cardRealIds.includes(c.objectId));
  if (updatedCards) {
    updatedCards.forEach((updatedCard) => {
      const existingCard = client.readFragment<MirrorCardFragment>({
        id: client.cache.identify({
          id: updatedCard.objectId,
          __typename: 'Card',
        }),
        fragment: MirrorCardFragmentDoc,
      });
      const cacheId = client.cache.identify({
        id: updatedCard.objectId,
        __typename: 'Card',
      });

      const fields: {
        [key: string]: () =>
          | Attachment[]
          | Badges
          | Checklist[]
          | CustomFieldItem[]
          | Label[]
          | Sticker[]
          | string[]
          | boolean
          | number
          | string
          | { __typename: string }
          | { __typename: string; latitude: number; longitude: number };
      } = {};

      if (!isCardBackCacheSyncingEnabled && updatedCard.attachments?.edges) {
        fields.attachments = () =>
          updatedCard.attachments?.edges?.map(
            (edge): Attachment => ({
              __typename: 'Attachment' as const,
              id: edge.node.objectId,
              isMalicious: edge.node.isMalicious || false,
              name: convertToUGCString(edge.node.name || ''),
              url: convertToUGCString(edge.node.url || ''),
              date: convertToUGCString(edge.node.date || ''),
              idMember: edge.node.creatorId || '',
              pos: edge.node.position || 0,
              bytes: edge.node.bytes || 0,
              edgeColor: edge.node.edgeColor || '',
              fileName: edge.node.fileName || '',
              isUpload: edge.node.isUpload || false,
              mimeType: edge.node.mimeType || '',
            }),
          ) ??
          existingCard?.attachments ??
          [];
      }

      if (
        !isCardBackCacheSyncingEnabled &&
        subscriptionData.lists?.edges?.[0]?.node?.objectId &&
        existingCard?.idList !==
          subscriptionData.lists?.edges?.[0]?.node?.objectId
      ) {
        const listId = subscriptionData.lists?.edges?.[0]?.node?.objectId;
        if (listId) {
          client.cache.modify<Card>({
            id: cacheId,
            fields: {
              list: (existing, { toReference }) => {
                const ref = toReference({ __typename: 'List', id: listId });
                if (!ref) {
                  return existing;
                }
                return ref;
              },
              idList: () => listId,
            },
            optimistic: true,
          });
        }
      }

      const existingChecklistIds = existingCard?.idChecklists ?? [];
      const existingChecklists = existingCard?.checklists ?? [];
      if (
        !isCardBackCacheSyncingEnabled &&
        updatedCard.checklists?.edges?.[0]
      ) {
        // checklists will only ever contain one checklist, an updated or newly inserted checklist
        const checklist = updatedCard.checklists.edges[0].node;

        const i = existingChecklistIds.findIndex(
          (idChecklist) => idChecklist === checklist.objectId,
        );

        if (i === -1) {
          // Add new checklist
          fields.idChecklists = () => [
            ...existingChecklistIds,
            checklist.objectId,
          ];

          const newChecklist: Checklist = {
            __typename: 'Checklist',
            id: checklist.objectId,
            pos: checklist.position!, // should never be null for new checklists
            name: convertToUGCString(checklist.name ?? ''),
            idBoard: boardId,
            // We already check that objectId is set above so this should never be ''
            idCard: updatedCard.objectId ?? '',
            checkItems: [],
          };
          fields.checklists = () => [...existingChecklists, newChecklist];
        } else {
          // Update existing checklist
          updateChecklist(client, checklist);
        }

        // card.onChecklistDeleted and card.checklists should never both be populated in the same update
      } else if (
        !isCardBackCacheSyncingEnabled &&
        updatedCard.onChecklistDeleted?.[0]
      ) {
        const deletedChecklistId = updatedCard.onChecklistDeleted[0].id
          .split('/')
          .pop();

        // Delete the object from the cache
        const deletedChecklistCacheId = client.cache.identify({
          id: deletedChecklistId,
          __typename: 'Checklist',
        });
        client.cache.evict({ id: deletedChecklistCacheId });

        // Remove dangling reference from card.idChecklists
        const idChecklistsIndex = existingChecklistIds.findIndex(
          (idChecklist) => idChecklist === deletedChecklistId,
        );
        if (idChecklistsIndex > -1) {
          fields.idChecklists = () => [
            ...existingChecklistIds.slice(0, idChecklistsIndex),
            ...existingChecklistIds.slice(idChecklistsIndex + 1),
          ];
        }

        // Remove dangling reference from card.checklists
        const checklistsIndex = existingChecklists.findIndex(
          ({ id }) => id === deletedChecklistId,
        );
        if (checklistsIndex > -1) {
          fields.checklists = () => [
            ...existingChecklists.slice(0, checklistsIndex),
            ...existingChecklists.slice(checklistsIndex + 1),
          ];
        }
      }

      if (
        !isCardBackCacheSyncingEnabled &&
        updatedCard.__typename === 'TrelloCardUpdated' &&
        updatedCard.location
      ) {
        fields.address = () => updatedCard.location?.address || '';
        fields.locationName = () => updatedCard.location?.name || '';
        if (updatedCard.location?.coordinates) {
          fields.coordinates = () => {
            return {
              __typename: 'Card_Coordinates',
              latitude: updatedCard.location?.coordinates?.latitude || 0,
              longitude: updatedCard.location?.coordinates?.longitude || 0,
            };
          };
        }
      }

      if (!isCardBackCacheSyncingEnabled && updatedCard.position) {
        fields.pos = () => updatedCard.position || 0;
      }
      client.cache.modify<Card>({
        id: cacheId,
        fields,
      });
    });
  }
};

const onDataFn: (
  boardId: string,
  cardRealIds: string[],
) => (data: OnDataOptions<TrelloMirrorCardsSubscription>) => void =
  (boardId, cardRealIds) => (data) => {
    updateBoard(boardId, data);
    updateCards(data, cardRealIds, boardId);
  };

export const MirrorCardBoardSubscription: FunctionComponent<{
  boardShortLink: string;
  cardShortLinks: string[];
}> = ({ boardShortLink, cardShortLinks }) => {
  const boardAri = idCache.getBoardAri(boardShortLink) ?? '';
  const cardAris = cardShortLinks.map(
    (cardShortLink) => idCache.getCardAri(cardShortLink) ?? '',
  );
  const cardIds = cardShortLinks.map(
    (cardShortLink) => idCache.getCardId(cardShortLink) ?? '',
  );

  const onData = useCallback(
    (data: OnDataOptions<TrelloMirrorCardsSubscription>) =>
      onDataFn(boardShortLink, cardIds)(data),
    [cardIds, boardShortLink],
  );

  const mirrorCardParmsAreInValid =
    cardAris.length === 0 || !boardAri || cardAris.some((cardAri) => !cardAri);

  useTrelloMirrorCardsSubscription({
    variables: { boardId: boardAri, nodeIds: cardAris },
    skip: mirrorCardParmsAreInValid,
    onData,
  });

  const isCardBackCacheSyncingEnabled = dangerouslyGetFeatureGateSync(
    'goo_card_back_cache_syncing',
  );
  useTrelloMirrorCardsActionsSubscription({
    variables: { boardId: boardAri, nodeIds: cardAris },
    skip: !isCardBackCacheSyncingEnabled || mirrorCardParmsAreInValid,
    // cacheSubscriptionResponseLink will handle writing to cache
    fetchPolicy: 'no-cache',
  });

  return null;
};
