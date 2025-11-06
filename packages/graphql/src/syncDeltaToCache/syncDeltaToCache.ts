import type {
  ApolloCache,
  ApolloClient,
  NormalizedCacheObject,
} from '@apollo/client';
import { gql } from '@apollo/client';
import debounce from 'debounce';
import type { DocumentNode, FieldNode } from 'graphql';

import { Analytics } from '@trello/atlassian-analytics';
import { getMemberId } from '@trello/authentication';
import { dynamicConfigClient } from '@trello/dynamic-config';

import type {
  Action,
  Board,
  BoardPlugin,
  Card,
  Checklist,
  CustomField,
  Label,
  List,
  Member,
  Organization,
  PluginData,
} from '../generated';
import { getOperationDefinitionNode } from '../getOperationDefinitionNode';
import {
  addTypenames,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { firstLetterToLower } from '../stringOperations';
import type {
  DataWithId,
  JSONObject,
  JSONValue,
  QueryParams,
  TypedPartialWithID,
} from '../types';
import {
  handleBoardActionPatching,
  handleCardActionPatching,
} from './filteredActionsPatching/filteredActionsPatching';
import { updateCardsInVisibleList } from './filteredCardsPatching/filteredCardsPatching';
import { boardCardsPatcher } from './filterPatching/boardCardsPatcher';
import { boardLabelsPatcher } from './filterPatching/boardLabelsPatcher';
import { boardListsPatcher } from './filterPatching/boardListsPatcher';
import { cardChecklistsPatcher } from './filterPatching/cardChecklistsPatcher';
import { checklistCheckItemsPatcher } from './filterPatching/checklistCheckItemsPatcher';
import { memberBoardsPatcher } from './filterPatching/memberBoardsPatcher';
import { memberCardsPatcher } from './filterPatching/memberCardsPatcher';
import { organizationBoardsPatcher } from './filterPatching/organizationBoardsPatcher';
import {
  readMultipleRelation,
  readSingleRelation,
  writeDirect,
} from './cacheOperations';
import type {
  CardsOnListFragment,
  CheckItemsAssignedCardsOnListFragment,
  ClosedCardsOnListFragment,
  OpenCardsOnListFragment,
  TemplateCardsOnListFragment,
  VisibleCardsOnListFragment,
} from './CardsOnListFragment.generated';
import {
  CardsOnListFragmentDoc,
  CheckItemsAssignedCardsOnListFragmentDoc,
  ClosedCardsOnListFragmentDoc,
  OpenCardsOnListFragmentDoc,
  TemplateCardsOnListFragmentDoc,
  VisibleCardsOnListFragmentDoc,
} from './CardsOnListFragment.generated';
import type { ClosedListFragment } from './ClosedListFragment.generated';
import { ClosedListFragmentDoc } from './ClosedListFragment.generated';
import { getUnsafeFields } from './getUnsafeFields';
import { overHydrateCache } from './overHydrateCache';
import type {
  RelationToMultipleData,
  RelationToSingleData,
} from './relationPatching';
import {
  patchManyToManyRelation,
  patchManyToOneRelation,
  patchOneToManyRelation,
  patchOneToOneRelation,
  patchSimpleMultipleRelation,
  patchSimpleSingleRelation,
} from './relationPatching';
import { syncNotificationToNotificationGroups } from './syncNotificationToNotificationGroups';

interface EventContext {
  [key: string]: boolean | number | string;
}

interface ImpliedRelationToMany {
  hasMany: true;
  isImplied: true;
}

interface ActualRelationToMany {
  hasMany: true;
  /**
   * Relationships can work bidirectionally, meaning that syncing a CustomFieldItem delta
   * can do a write to the cache for allowing:
   * query CustomFieldItem($id: ID!) {
   *  customFieldItem(id: $id) @client {
   *    id
   *    card {
   *      id
   *    }
   *  }
   * }
   * However, this is rarely needed or used and extremely expensive. We should only do this
   * if absolutely needed.
   */
  syncParentChildRelationship: boolean;
  getRelatedIds: <TDelta>(delta: Partial<TDelta>) => string[] | undefined;
  relatedIdsFragment: DocumentNode;
  updateRelatedFilters?: (
    client: ApolloClient<NormalizedCacheObject>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delta: any,
    relatedIds?: string[],
    previousRelatedIds?: string[],
  ) => () => void;
}

type RelationToMany = ActualRelationToMany | ImpliedRelationToMany;

interface RelationToSingle {
  hasMany: false;
  getRelatedId: <TDelta>(delta: Partial<TDelta>) => string | null | undefined;
  relatedIdFragment: DocumentNode;
  updateRelatedFilters: (
    client: ApolloClient<NormalizedCacheObject>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delta: any,
    relatedId?: string | null,
    previousRelatedId?: string | null,
  ) => () => void;
}

type SyncedRelation = RelationToMany | RelationToSingle;

export interface SyncedRelations {
  [modelName: string]: { [relatedModelName: string]: SyncedRelation };
}

const isImpliedRelationToMany = (
  relation: RelationToMany,
): relation is ImpliedRelationToMany => {
  return (relation as ImpliedRelationToMany).isImplied;
};

const ALLOWED_MODELS = [
  'Action',
  'Board',
  'Card',
  'Enterprise',
  'Member',
  'Organization',
  'List',
  'Label',
  'Checklist',
  'CustomField',
  'CustomFieldItem',
  'Notification',
  'BoardPlugin',
  'PluginData',
];

const SYNCED_RELATIONS: SyncedRelations = {
  Action: {
    cardActions: {
      hasMany: false,
      getRelatedId: (action: Partial<Action>) => {
        // The type of data is a JSONstring that normally needs to get parsed, but it's already parsed here.
        // @ts-expect-error
        return action.data?.card?.id;
      },
      relatedIdFragment: gql`
        fragment cardId on Action {
          data
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        action: TypedPartialWithID<Action, 'Action'>,
        cardId?: string | null,
        previousCardId?: string | null,
      ) => {
        return () => {
          if (previousCardId !== cardId) {
            handleCardActionPatching(client.cache, action, cardId);
          }
        };
      },
    },
    boardActions: {
      hasMany: false,
      getRelatedId: (action: Partial<Action>) => {
        // The type of data is a JSONstring that normally needs to get parsed, but it's already parsed here.
        // @ts-expect-error
        return action.data?.board?.id;
      },
      relatedIdFragment: gql`
        fragment boardId on Action {
          data
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        action: TypedPartialWithID<Action, 'Action'>,
        boardId?: string | null,
        previousBoardId?: string | null,
      ) => {
        return () => {
          if (previousBoardId !== boardId) {
            handleBoardActionPatching(client.cache, action, boardId);
          }
        };
      },
    },
  },
  Card: {
    Board: {
      hasMany: false,
      getRelatedId: (card: Partial<Card>) => card.idBoard,
      relatedIdFragment: gql`
        fragment cardIdBoard on Card {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        card: TypedPartialWithID<Card, 'Card'>,
        boardId?: string | null,
        previousBoardId?: string | null,
      ) => {
        return () => {
          boardCardsPatcher.handleSingleRelationDelta(
            client.cache,
            card,
            boardId,
            previousBoardId,
          );

          if (previousBoardId && boardId !== previousBoardId) {
            boardCardsPatcher.handleSingleRelationDelta(
              client.cache,
              card,
              previousBoardId,
              boardId,
            );
          }
        };
      },
    },
    List: {
      hasMany: false,
      getRelatedId: (card: Partial<Card>) => card.idList,
      relatedIdFragment: gql`
        fragment cardIdList on Card {
          idList
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        card: Partial<Card>,
      ) => {
        return () => {
          if (card.id && card.idList && card.closed !== undefined) {
            const listInCache = client.readFragment<ClosedListFragment>({
              id: `List:${card.idList}`,
              fragment: ClosedListFragmentDoc,
            });
            if (listInCache) {
              if (card.idBoard) {
                updateCardsInVisibleList(
                  client.cache,
                  'board',
                  [card.idBoard],
                  [{ id: card.id, closed: card.closed, __typename: 'Card' }],
                  listInCache.closed,
                );
              }
              updateCardsInVisibleList(
                client.cache,
                'member',
                card.idMembers ?? [],
                [{ id: card.id, closed: card.closed, __typename: 'Card' }],
                listInCache.closed,
              );
            }
          }
        };
      },
    },
    Member: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (card: Partial<Card>) => card.idMembers,
      relatedIdsFragment: gql`
        fragment cardIdMembers on Card {
          idMembers
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        card: TypedPartialWithID<Card, 'Card'>,
        memberIds: string[] = [],
        previousMemberIds: string[] = [],
      ) => {
        return () => {
          memberCardsPatcher.handleMultiRelationDelta(
            client.cache,
            card,
            memberIds,
            previousMemberIds,
          );
        };
      },
    },
    Label: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (card: Partial<Card>) => card.idLabels,
      relatedIdsFragment: gql`
        fragment cardIdLabels on Card {
          idLabels
        }
      `,
    },
    Checklist: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (card: Partial<Card>) => card.idChecklists,
      relatedIdsFragment: gql`
        fragment cardIdChecklists on Card {
          idChecklists
        }
      `,
      updateRelatedFilters:
        (
          client: ApolloClient<NormalizedCacheObject>,
          checklist: Partial<Checklist>,
        ) =>
        () => {},
    },
    CustomFieldItem: {
      hasMany: true,
      syncParentChildRelationship: false,
      getRelatedIds: (card: Partial<Card>) =>
        card.customFieldItems?.map((field) => field.id),
      relatedIdsFragment: gql`
        fragment cardCustomFieldItems on Card {
          customFieldItems {
            id
          }
        }
      `,
    },
    PluginData: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (card: Partial<Card>) =>
        card.pluginData?.map((field) => field.id),
      relatedIdsFragment: gql`
        fragment cardPluginData on Card {
          pluginData {
            id
          }
        }
      `,
    },
  },

  CustomField: {
    Board: {
      hasMany: false,
      getRelatedId: (customField: Partial<CustomField>) => customField.idModel,
      relatedIdFragment: gql`
        fragment customFieldIdBoard on CustomField {
          idModel
        }
      `,
      updateRelatedFilters: () => () => {},
    },
  },

  CustomFieldItem: {
    Card: {
      hasMany: false,
      getRelatedId: (customFieldItem: Partial<CustomField>) =>
        customFieldItem.idModel,
      relatedIdFragment: gql`
        fragment customFieldItemIdCard on CustomFieldItem {
          idModel
        }
      `,
      updateRelatedFilters: () => () => {},
    },
  },

  Label: {
    Board: {
      hasMany: false,
      getRelatedId: (label: Partial<Label>) => label.idBoard,
      relatedIdFragment: gql`
        fragment labelIdBoard on Label {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        label: TypedPartialWithID<Label, 'Label'>,
        boardId?: string | null,
      ) => {
        return () => {
          boardLabelsPatcher.handleSingleRelationDelta(
            client.cache,
            label,
            boardId,
          );
        };
      },
    },
  },

  Checklist: {
    Card: {
      hasMany: false,
      getRelatedId: (checklist: Partial<Checklist>) => checklist.idCard,
      relatedIdFragment: gql`
        fragment checklistIdCard on Card {
          idCard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        checklist: Partial<Checklist> & {
          id: string;
          __typename: 'Checklist';
        },
        idCard,
      ) => {
        return () => {
          cardChecklistsPatcher.handleSingleRelationDelta(
            client.cache,
            checklist,
            idCard,
          );

          checklistCheckItemsPatcher.handleSubdocumentArrayDelta(
            client.cache,
            checklist,
          );
        };
      },
    },
  },

  Member: {
    Board: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
    Organization: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (member: Partial<Member>) => member.idOrganizations,
      relatedIdsFragment: gql`
        fragment memberIdOrganizations on Organization {
          idOrganizations
        }
      `,
    },
    Card: {
      syncParentChildRelationship: true,
      hasMany: true,
      isImplied: true,
    },
    PluginData: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (member: Partial<Member>) =>
        member.pluginData?.map((field) => field.id),
      relatedIdsFragment: gql`
        fragment memberPluginData on Member {
          pluginData {
            id
          }
        }
      `,
    },
  },

  BoardPlugin: {
    Board: {
      hasMany: false,
      getRelatedId: (plugin: Partial<BoardPlugin>) => plugin.idBoard,
      relatedIdFragment: gql`
        fragment pluginIdBoard on BoardPlugin {
          idBoard
        }
      `,
      updateRelatedFilters: () => {
        return () => {};
      },
    },
  },

  Board: {
    Card: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
    List: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
    Label: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
    CustomField: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
    BoardPlugin: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
    Member: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (board: Partial<Board>) =>
        board.memberships
          // NOTE: there is no need to update all the member.boards, only the active
          // authenticated user, since they are the only one actively using the filters
          // for different board types
          ?.filter((membership) => membership.idMember === getMemberId())
          .map((membership) => membership.idMember),
      relatedIdsFragment: gql`
        fragment boardIdMembers on Board {
          memberships {
            idMember
          }
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        board: TypedPartialWithID<Board, 'Board'>,
        memberIds: string[] = [],
        previousMemberIds?: string[],
      ) => {
        return () => {
          // board properties relevant to filters changed, such as board closed
          memberIds.forEach((memberId: string) => {
            memberBoardsPatcher.handleSingleRelationDelta(
              client.cache,
              board,
              memberId,
            );
          });

          // board members change, via memberIds
          memberBoardsPatcher.handleMultiRelationDelta(
            client.cache,
            board,
            memberIds,
            previousMemberIds,
          );
        };
      },
    },
    Organization: {
      hasMany: false,
      getRelatedId: (board: Partial<Board>) => board.idOrganization,
      relatedIdFragment: gql`
        fragment boardIdOrganization on Board {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        board: TypedPartialWithID<Board, 'Board'>,
        organizationId?: string | null,
        previousOrganizationId?: string | null,
      ) => {
        return () => {
          organizationBoardsPatcher.handleSingleRelationDelta(
            client.cache,
            board,
            organizationId,
            previousOrganizationId,
          );
        };
      },
    },
  },

  Organization: {
    Board: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (organization: Partial<Organization>) =>
        organization.idBoards,
      relatedIdsFragment: gql`
        fragment organizationIdBoards on Organization {
          idBoards
        }
      `,
    },
    Member: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (organization: Partial<Organization>) =>
        organization.memberships?.map((membership) => membership.idMember),
      relatedIdsFragment: gql`
        fragment organizationIdMembers on Organization {
          memberships {
            idMember
          }
        }
      `,
    },
    PluginData: {
      hasMany: true,
      syncParentChildRelationship: true,
      getRelatedIds: (board: Partial<Board>) =>
        board.pluginData?.map((field) => field.id),
      relatedIdsFragment: gql`
        fragment boardPluginData on Board {
          pluginData {
            id
          }
        }
      `,
    },
  },

  List: {
    Board: {
      hasMany: false,
      getRelatedId: (list: Partial<List>) => list.idBoard,
      relatedIdFragment: gql`
        fragment listIdBoard on List {
          idBoard
        }
      `,
      updateRelatedFilters: (
        client: ApolloClient<NormalizedCacheObject>,
        list: TypedPartialWithID<List, 'List'>,
        boardId: string | null | undefined,
        previousBoardId: string | null | undefined,
      ) => {
        return () => {
          boardListsPatcher.handleSingleRelationDelta(
            client.cache,
            list,
            boardId,
            previousBoardId,
          );

          if (previousBoardId && boardId !== previousBoardId) {
            // when moving the list, you need to run the handleSingleRelationDelta
            // on the original board so that the lists are removed properly
            boardListsPatcher.handleSingleRelationDelta(
              client.cache,
              list,
              previousBoardId,
              boardId,
            );
          }

          if (boardId && list.id) {
            if (list.closed) {
              const getCardsByFragment = <
                T extends
                  | CardsOnListFragment
                  | CheckItemsAssignedCardsOnListFragment
                  | ClosedCardsOnListFragment
                  | OpenCardsOnListFragment
                  | TemplateCardsOnListFragment
                  | VisibleCardsOnListFragment,
              >(
                fragment: DocumentNode,
              ) =>
                client.readFragment<T>({
                  id: client.cache.identify({ ...list, __typename: 'List' }),
                  fragment,
                })?.cards ?? [];

              const cards = getCardsByFragment<CardsOnListFragment>(
                CardsOnListFragmentDoc,
              );
              const openCards = getCardsByFragment<OpenCardsOnListFragment>(
                OpenCardsOnListFragmentDoc,
              );
              const closedCards = getCardsByFragment<ClosedCardsOnListFragment>(
                ClosedCardsOnListFragmentDoc,
              );
              const visibleCards =
                getCardsByFragment<VisibleCardsOnListFragment>(
                  VisibleCardsOnListFragmentDoc,
                );
              const templateCards =
                getCardsByFragment<TemplateCardsOnListFragment>(
                  TemplateCardsOnListFragmentDoc,
                );
              const checkItemsAssignedCards =
                getCardsByFragment<CheckItemsAssignedCardsOnListFragment>(
                  CheckItemsAssignedCardsOnListFragmentDoc,
                );

              // Merge and deduplicate cards associated with the list
              // using all possible filter shapes
              const listCards = [
                ...new Set([
                  ...cards,
                  ...openCards,
                  ...closedCards,
                  ...visibleCards,
                  ...templateCards,
                  ...checkItemsAssignedCards,
                ]),
              ];
              updateCardsInVisibleList(
                client.cache,
                'board',
                [boardId],
                listCards,
                list.closed,
              );

              const memberCardMap: Record<
                string,
                Pick<Card, '__typename' | 'closed' | 'id'>[]
              > = {};
              listCards.forEach((card) => {
                if (card.idMembers) {
                  card.idMembers.forEach((memberId) => {
                    memberCardMap[memberId] = [
                      ...(memberCardMap[memberId] ?? []),
                      card,
                    ];
                  });
                }
              });

              for (const memberId in memberCardMap) {
                updateCardsInVisibleList(
                  client.cache,
                  'member',
                  [memberId],
                  memberCardMap[memberId],
                  list.closed,
                );
              }
            }
          }
        };
      },
    },
    Card: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
  },

  PluginData: {
    Card: {
      hasMany: false,
      getRelatedId: (pluginData: Partial<PluginData>) =>
        pluginData.scope === 'card' ? pluginData.idModel : undefined,
      relatedIdFragment: gql`
        fragment pluginDataIdCard on PluginData {
          idModel
        }
      `,
      updateRelatedFilters: () => () => {},
    },
    Member: {
      hasMany: false,
      getRelatedId: (pluginData: Partial<PluginData>) =>
        pluginData.scope === 'member' ? pluginData.idModel : undefined,
      relatedIdFragment: gql`
        fragment pluginDataIdCard on PluginData {
          idModel
        }
      `,
      updateRelatedFilters: () => () => {},
    },
    Board: {
      hasMany: false,
      getRelatedId: (pluginData: Partial<PluginData>) =>
        pluginData.scope === 'board' ? pluginData.idModel : undefined,
      relatedIdFragment: gql`
        fragment pluginDataIdCard on PluginData {
          idModel
        }
      `,
      updateRelatedFilters: () => () => {},
    },
  },

  cardActions: {
    Action: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
  },

  boardActions: {
    Action: {
      hasMany: true,
      isImplied: true,
      syncParentChildRelationship: true,
    },
  },
};

const segmentRelationsByType = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  modelName: string,
  id: string,
  delta: DataWithId,
  syncedRelations: SyncedRelations,
) => {
  const simpleSingleRelations: RelationToSingleData[] = [];
  const simpleMultipleRelations: RelationToMultipleData[] = [];
  const oneToOneRelations: RelationToSingleData[] = [];
  const oneToManyRelations: RelationToSingleData[] = [];
  const manyToOneRelations: RelationToMultipleData[] = [];
  const manyToManyRelations: RelationToMultipleData[] = [];

  // Get the relations defined for this model
  const relationsToModel = syncedRelations[modelName];
  if (!relationsToModel) {
    return {
      simpleSingleRelations,
      simpleMultipleRelations,
      oneToOneRelations,
      oneToManyRelations,
      manyToOneRelations,
      manyToManyRelations,
    };
  }

  Object.entries(relationsToModel).forEach(([relatedModelName, relationTo]) => {
    // Get the relation that goes back the other way (if it exists)
    const relationFrom = syncedRelations[relatedModelName]?.[modelName];

    if (!relationTo.hasMany) {
      const relatedId = relationTo.getRelatedId(delta);

      if (relatedId === undefined) {
        return;
      }

      // Read the previous related id from the Apollo Cache, using either the
      // fragment combined with the getRelatedId function (eg. board.idOrganization),
      // or failing that, reading from the relation itself (eg. board -> organization)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const previousRelatedId = readSingleRelation<any>(apolloClient, {
        id,
        modelName,
        relatedModelName,
        relatedIdFragment: relationTo.relatedIdFragment,
        getRelatedId: relationTo.getRelatedId,
      });

      const relation = {
        modelName,
        id,
        relatedModelName,
        relatedId,
        previousRelatedId,
        updateRelatedFilters: relationTo.updateRelatedFilters(
          apolloClient,
          delta,
          relatedId,
          previousRelatedId,
        ),
      };

      if (!relationFrom) {
        simpleSingleRelations.push(relation);
      } else if (!relationFrom.hasMany) {
        oneToOneRelations.push(relation);
      } else if (relationFrom.hasMany) {
        oneToManyRelations.push(relation);
      }
    } else if (relationTo.hasMany && !isImpliedRelationToMany(relationTo)) {
      const relatedIds = relationTo.getRelatedIds(delta);

      if (!relatedIds) {
        return;
      }

      // Read the previous related ids from the Apollo Cache, using either the
      // fragment combined with the getRelatedIds function (eg. card.idMembers),
      // or failing that, reading from the relation itself (eg. card -> members)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const previousRelatedIds = readMultipleRelation<any>(apolloClient, {
        id,
        modelName,
        relatedModelName,
        relatedIdsFragment: relationTo.relatedIdsFragment,
        getRelatedIds: relationTo.getRelatedIds,
      });

      const relation = {
        modelName,
        id,
        relatedModelName,
        relatedIds,
        previousRelatedIds,
        syncParentChildRelationship: relationTo.syncParentChildRelationship,
        updateRelatedFilters: relationTo.updateRelatedFilters?.(
          apolloClient,
          delta,
          relatedIds,
          previousRelatedIds,
        ),
      };

      if (!relationFrom) {
        simpleMultipleRelations.push(relation);
      } else if (!relationFrom.hasMany) {
        manyToOneRelations.push(relation);
      } else if (relationFrom.hasMany) {
        manyToManyRelations.push(relation);
      }
    }
  });

  return {
    simpleSingleRelations,
    simpleMultipleRelations,
    oneToOneRelations,
    oneToManyRelations,
    manyToOneRelations,
    manyToManyRelations,
  };
};

interface PerformanceMetrics {
  model: string;
  totalMs: number;
  directMs: number;
  typesMs: number;
  segmentMs: number;
  simple1: number;
  simple1Ms: number;
  simpleN: number;
  simpleNMs: number;
  '1->1': number;
  '1->1Ms': number;
  '1->n': number;
  '1->nMs': number;
  'n->1': number;
  'n->1Ms': number;
  'n->n': number;
  'n->nMs': number;
}

const truncateMetrics = (perfMetrics: PerformanceMetrics): EventContext => {
  const truncatedMetrics: EventContext = {};
  Object.entries(perfMetrics).forEach(([key, value]) => {
    // Pass any non-numbers straight through
    if (typeof value !== 'number') {
      truncatedMetrics[key] = value;
      return;
    }

    // Round the value to the nearest integer
    const roundedValue = Math.round(value);

    // Only log non 0 rounded values
    if (roundedValue !== 0) {
      truncatedMetrics[key] = roundedValue;
    }
  });

  return truncatedMetrics;
};

const shouldLogMetrics = (perfMetrics: PerformanceMetrics) => {
  if (!dynamicConfigClient.get('trello_web_apollo_cache_hydrator_metrics')) {
    return false;
  }

  return (
    perfMetrics.simple1 > 0 ||
    perfMetrics.simpleN > 0 ||
    perfMetrics['1->1'] > 0 ||
    perfMetrics['1->n'] > 0 ||
    perfMetrics['n->1'] > 0 ||
    perfMetrics['n->n'] > 0 ||
    perfMetrics['segmentMs'] > 5 ||
    perfMetrics['directMs'] > 5
  );
};

/**
 * There is a known issue with the Apollo 2 `writeData` method, where
 * Apollo is unable to determine the selectionSet of a field due to it being
 * null. When this happens, the non-null instances of that field in the cache
 * can get corrupted, essentially breaking any queries or mutation that use
 * that data.
 *
 * This will be fixed when we switch to Apollo 3 and remove our usages of `writeData`,
 * but for now, this function will apply necessary data patching to appease the cache.
 *
 * See:
 * https://github.com/apollographql/apollo-client/issues/4785
 * https://github.com/apollographql/apollo-client/issues/4498
 */
// eslint-disable-next-line @trello/enforce-variable-case
const __patchDelta__ = (modelName: string, delta: DataWithId) => {
  if (modelName === 'Board') {
    if (delta.dashboardViewTiles && Array.isArray(delta.dashboardViewTiles)) {
      // This patches the issue when the first tile on a dashboard is a non-history
      // tile, meaning it will have a `null` `from` field, and hit the Apollo writeData
      // issue. If the first tile has a null `from`, we patch it to have a default value
      const firstTile = delta.dashboardViewTiles[0] as JSONObject | undefined;
      if (firstTile) {
        firstTile.from = firstTile.from ?? {
          dateType: 'relative',
          value: -604800000,
        };
      }
    }
  }
  return delta;
};

function removeDeleted(
  client: ApolloClient<unknown>,
  type: string,
  id: string,
) {
  client.cache.evict({ id: `${type}:${id}` });
  client.cache.gc();
}

/** Return a non-undefined value or a fallback. */
const getDefinedValue = <T>(value: T, fallback: Exclude<T, undefined>) =>
  typeof value === 'undefined' ? fallback : value;

/**
 * Function to patch properties on various deltas that might be missing from
 * a servers websocket update. Obviously, this should be done by server, but sometimes
 * it's too difficult to wait for the turn around to make that happen.
 */
const patchMissingDataForModel = (modelName: string, delta: DataWithId) => {
  switch (modelName) {
    case 'CustomField': {
      delta.options = getDefinedValue(delta.options, null);
      break;
    }
    case 'CustomFieldItem': {
      const defaultValue = {
        checked: null,
        date: null,
        number: null,
        text: null,
      };
      const deltaValue = getDefinedValue(delta.value, null);
      delta.value = deltaValue
        ? {
            ...defaultValue,
            ...(deltaValue as JSONObject),
          }
        : null;
      delta.idValue = getDefinedValue(delta.idValue, null);
      break;
    }
    case 'Card': {
      if (
        delta.cover &&
        typeof delta.cover === 'object' &&
        !Array.isArray(delta.cover)
      ) {
        delta.cover = {
          ...delta.cover,
          sharedSourceUrl: getDefinedValue(delta.cover.sharedSourceUrl, null),
          scaled: getDefinedValue(delta.cover.scaled, null),
          edgeColor: getDefinedValue(delta.cover.edgeColor, null),
        };
      }

      if (delta.customFieldItems && Array.isArray(delta.customFieldItems)) {
        /**
         * The logic here looks complex, but it's simpler in words.
         *
         * Here we basically patch the missing properties in the
         * customFieldItem.value object with null. Only one of
         * checked, date, number, or text will ever be set.
         *
         * However, GraphQL expects all fields in our query
         * to be defined, so we simply keep the existing key
         * and add null for the three others.
         */
        delta.customFieldItems = [...delta.customFieldItems].map(
          (item: JSONValue) => {
            const customFieldItem = { ...(item as JSONObject) };

            const defaultValue = {
              checked: null,
              date: null,
              number: null,
              text: null,
            };

            const deltaValue = getDefinedValue(customFieldItem.value, null);
            customFieldItem.value = deltaValue
              ? {
                  ...defaultValue,
                  ...(deltaValue as JSONObject),
                }
              : null;

            return customFieldItem;
          },
        );
      }

      if (
        delta.badges &&
        typeof delta.badges === 'object' &&
        !Array.isArray(delta.badges) &&
        delta.badges.votes === 0
      ) {
        /**
         * bit of a sketchy workaround, but votes don't get
         * copied when copying a card.  The error was
         * that viewingMemberVoted and subscribed
         * aren't set when copying a card, but that would
         * cause the CardFrontBadgesQuery to return
         * undefined since all the fields are set.
         *
         * If votes are 0, we can safely assume we aren't
         * voting on a card and we can set those fields
         * to false, allowing the query to not fail.
         *
         * We don't want to set those fields when someone
         * has voted, because it will cause the clients
         * to have incorrect values in their cache.
         *
         */
        delta.badges = {
          ...delta.badges,
          subscribed: getDefinedValue(delta.badges.subscribed, false),
          viewingMemberVoted: getDefinedValue(
            delta.badges.viewingMemberVoted,
            false,
          ),
        };
      }
      break;
    }
    default:
      return;
  }
};

interface SyncDeltaToCacheOptionalParams {
  fromQuery?: QueryParams;
  fromDocument?: DocumentNode;
}

export const syncNativeDeltaToCache = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  delta: { trello: Record<string, JSONObject> },
  {
    fromDocument,
    variables,
  }: { fromDocument: DocumentNode; variables: Record<string, unknown> },
) => {
  apolloClient.writeQuery({
    query: fromDocument,
    data: delta,
    variables,
    broadcast: false,
  });
  overHydrateCache(apolloClient.cache, delta);
};
const debouncedBroadcast = debounce(
  (cache: ApolloCache<NormalizedCacheObject>) => {
    // @ts-expect-error
    cache.broadcastWatches();
  },
  100,
);

export const syncDeltaToCache = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  modelName: string,
  _delta: DataWithId,
  { fromQuery, fromDocument }: SyncDeltaToCacheOptionalParams = {},
  syncedRelations: SyncedRelations = SYNCED_RELATIONS,
  allowedModels: string[] = ALLOWED_MODELS,
) => {
  // Paranoid check for an id on our delta
  if (!_delta.id) {
    return;
  }

  if (_delta.deleted) {
    removeDeleted(apolloClient, modelName, _delta.id);
    return;
  }

  // Only allow certain models to be synced
  if (!allowedModels.includes(modelName)) {
    return;
  }
  const delta = { ..._delta };
  __patchDelta__(modelName, delta);

  if (fromQuery) {
    for (const unsafeField of getUnsafeFields(fromQuery)) {
      delete delta[unsafeField];
    }
  }

  const perfMetrics: PerformanceMetrics = {
    model: modelName,
    totalMs: 0,
    directMs: 0,
    typesMs: 0,
    segmentMs: 0,
    simple1: 0,
    simple1Ms: 0,
    simpleN: 0,
    simpleNMs: 0,
    '1->1': 0,
    '1->1Ms': 0,
    '1->n': 0,
    '1->nMs': 0,
    'n->1': 0,
    'n->1Ms': 0,
    'n->n': 0,
    'n->nMs': 0,
  };

  const startTime = performance.now();
  let cursorTime = performance.now();
  const id = delta.id;

  let operationName: string | null = null;
  let formattedDelta = null;
  if (fromDocument) {
    const operationNode = getOperationDefinitionNode(fromDocument);
    const rootNode = operationNode?.selectionSet.selections[0] as FieldNode;

    operationName = operationNode?.name?.value || null;

    formattedDelta = prepareDataForApolloCache(delta, rootNode);
  } else {
    // patch missing fields from server and fill in with null.
    // normally prepareDataForApolloCache does this, but when we get a
    // socket update, we don't have a fromDocument
    patchMissingDataForModel(modelName, delta);
    formattedDelta = addTypenames(
      'Query',
      firstLetterToLower(modelName),
      delta,
    );
  }

  // This should never actually happen, but addTypenames is designed to be recursive
  // so could return undefined for a primitive value that is not in the schema. Given
  // our delta is always an object, this will never be the case
  if (!formattedDelta) {
    return;
  }

  perfMetrics.typesMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  // Segment the relationships by their type. During segmenting, we also read the _current_ values
  // for all the relevant relationships if they exist in the cache (either via a relationship in Apollo,
  // or by some 'idSomething' field on the item)
  const {
    simpleSingleRelations,
    simpleMultipleRelations,
    oneToOneRelations,
    oneToManyRelations,
    manyToOneRelations,
    manyToManyRelations,
  } = segmentRelationsByType(
    apolloClient,
    modelName,
    id,
    delta,
    syncedRelations,
  );
  perfMetrics.segmentMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  // Sync the flat delta, ensuring we do this _after_ all the existing relationships have been read as
  // part of the segmentation
  writeDirect(apolloClient, {
    modelName,
    data: formattedDelta,
    fromDocument,
  });

  perfMetrics.directMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  if (modelName === 'Notification' && typeof formattedDelta === 'object') {
    syncNotificationToNotificationGroups(
      apolloClient,
      // @ts-expect-error
      formattedDelta as unknown as Notification,
    );
  }

  simpleSingleRelations.forEach((relation) => {
    perfMetrics.simple1 += patchSimpleSingleRelation(apolloClient, relation);
  });
  perfMetrics.simple1Ms += performance.now() - cursorTime;
  cursorTime = performance.now();

  simpleMultipleRelations.forEach((relation) => {
    perfMetrics.simpleN += patchSimpleMultipleRelation(apolloClient, relation);
  });
  perfMetrics.simpleNMs += performance.now() - cursorTime;
  cursorTime = performance.now();

  oneToOneRelations.forEach((relation) => {
    perfMetrics['1->1'] += patchOneToOneRelation(apolloClient, relation);
  });
  perfMetrics['1->1Ms'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  oneToManyRelations.forEach((relation) => {
    perfMetrics['1->n'] += patchOneToManyRelation(apolloClient, relation);
  });
  perfMetrics['1->nMs'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  manyToOneRelations.forEach((relation) => {
    perfMetrics['n->1'] += patchManyToOneRelation(apolloClient, relation);
  });
  perfMetrics['n->1Ms'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  manyToManyRelations.forEach((relation) => {
    perfMetrics['n->n'] += patchManyToManyRelation(apolloClient, relation);
  });
  perfMetrics['n->nMs'] += performance.now() - cursorTime;
  cursorTime = performance.now();

  /**
   * Broadcasting queries can be extremely expensive. Apollo does not support
   * manually doing this Typescript wise, however the cache does expose the method
   * to do so. By doing it here, we essentially batch the broadcast into one place,
   * rather than doing it every time we write. On a board with 1000's of cards, for example,
   * this can make a massive difference since each write could potentially check for
   * renderer's and maybe even execute rerenders.
   */
  debouncedBroadcast(apolloClient.cache);

  perfMetrics.totalMs += performance.now() - startTime;

  // Only log the performance metrics if expensive writes or relation patching occurred
  if (shouldLogMetrics(perfMetrics)) {
    // Calculate the metrics first in case the requestAnimationFrame takes some time
    const truncatedMetrics = truncateMetrics(perfMetrics);
    /**
     * Some items in here can be expensive to calculate, so do it behind a requestAnimationFrame
     */
    window.requestAnimationFrame(() => {
      Analytics.sendOperationalEvent({
        source: '@trello/graphql',
        action: 'synced',
        actionSubject: 'cacheSyncing',
        attributes: {
          truncatedMetrics,
          isQuickloadDelta: !!fromDocument,
          isPayloadDelta: !!fromQuery,
          isSocketDelta: !fromDocument && !fromQuery,
          operationName,
          // @ts-expect-error
          cacheSize: Object.keys(apolloClient.cache.data.data).length,
          // @ts-expect-error
          numWatchers: apolloClient.cache?.watches?.size ?? null,
          isIdleTab: document.visibilityState === 'hidden',
        },
      });
    });
  }
};
