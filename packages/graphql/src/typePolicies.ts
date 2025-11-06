import type { TypePolicies } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import { type Reference } from '@apollo/client/utilities';
import { gql } from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';

import { idToDate } from '@trello/dates';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';
import { idCache } from '@trello/id-cache';

import { addParentConnection } from './apolloCache/addParentConnection';
import { defaultKeyArgsFunction } from './apolloCache/defaultKeyArgsFunction';
import { mergeIncomingAndFillNulls } from './apolloCache/mergeIncomingAndFillNulls';
import { readWithDefault } from './apolloCache/readWithDefault';
import {
  boardToCardsRelation,
  listToCardsRelation,
} from './apolloCache/relation';
import { saveParentId } from './apolloCache/saveParentId';
import { fragmentRegistry } from './fragments/fragmentRegistry';
import {
  batchRestResourceFieldPolicies,
  readMemberMe,
  restResourceFieldPolicies,
} from './restResourceResolver/restResourceCacheRedirects';
import { getIncomingFields } from './syncNativeToRest/getIncomingFields';
import { syncTrelloActionToAction } from './syncNativeToRest/syncTrelloActionToAction';
import { syncTrelloAttachmentToAttachment } from './syncNativeToRest/syncTrelloAttachmentToAttachment';
import { syncTrelloBoardToBoard } from './syncNativeToRest/syncTrelloBoardToBoard';
import { syncTrelloCardToCard } from './syncNativeToRest/syncTrelloCardToCard';
import { syncTrelloCheckItemToCheckItem } from './syncNativeToRest/syncTrelloCheckItemToCheckItem';
import { syncTrelloChecklistToChecklist } from './syncNativeToRest/syncTrelloChecklistToChecklist';
import { syncTrelloCustomFieldItemToCustomFieldItem } from './syncNativeToRest/syncTrelloCustomFieldItemToCustomFieldItem';
import { syncTrelloCustomFieldToCustomField } from './syncNativeToRest/syncTrelloCustomFieldToCustomField';
import { syncTrelloLabelToLabel } from './syncNativeToRest/syncTrelloLabelToLabel';
import { syncTrelloListToList } from './syncNativeToRest/syncTrelloListToList';
import { syncTrelloMembershipToMembership } from './syncNativeToRest/syncTrelloMembershipToMembership';
import { syncTrelloMemberToMember } from './syncNativeToRest/syncTrelloMemberToMember';
import { syncTrelloPowerUpDataToPluginData } from './syncNativeToRest/syncTrelloPowerUpDataToPluginData';
import { syncTrelloPowerUpToBoardPlugins } from './syncNativeToRest/syncTrelloPowerUpToBoardPlugins';
import { syncTrelloStickerToSticker } from './syncNativeToRest/syncTrelloStickerToSticker';
import { edgeMergeFunction, edgeReadFunction, type Edge } from './edge';
import type {
  Organization_Limits,
  OrganizationCardsArgs,
  TrelloReaction,
} from './generated';
import { mergeArrays } from './mergeArrays';
import { queryMap } from './resolvers';

const addMemberToIdCache = (
  member: Reference,
  readField: ReadFieldFunction,
) => {
  const typename = member && readField('__typename', member);

  const id = readField('id', member) as string;
  const objectId = readField('objectId', member) as string;
  const nodeId = readField('nodeId', member) as string;
  const username = readField('username', member) as string;

  const ari = typename === 'TrelloMember' ? id : nodeId;
  const trelloId = typename === 'TrelloMember' ? objectId : id;

  if (trelloId && username && !idCache.getMemberId(username)) {
    idCache.setMemberId(username, trelloId);
  }
  if (ari && username && !idCache.getMemberAri(username)) {
    idCache.setMemberAri(username, ari);
  }
};

const MEMBER_NON_PUBLIC_FIELDS = ['avatarUrl', 'fullName', 'initials'];
const getMemberNonPublicMerge = () =>
  mergeIncomingAndFillNulls(MEMBER_NON_PUBLIC_FIELDS);

const fieldPolicies = {
  ...restResourceFieldPolicies(queryMap),
  ...batchRestResourceFieldPolicies(queryMap),
};

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      ...fieldPolicies,
      member: {
        read: readMemberMe,
      },
      domain: {
        merge: true,
      },
      trello: {
        merge: true,
      },
      organizationBoards: {
        keyArgs: ['id', 'filter', 'search', 'sortBy', 'sortOrder', 'tags'],
        // If fetching more, append new results to the existing results
        // Otherwise, replace the existing data with the incoming results
        merge(existing = [], incoming = [], opts) {
          return opts?.args?.offset
            ? mergeArrays(existing, incoming)
            : incoming;
        },
      },
      memberActions: {
        keyArgs: ['memberId', 'limit', 'idModels'],
        merge(existing = [], incoming: Reference[]) {
          const combined = mergeArrays(existing, incoming);
          const sorted = combined.sort((a, b) => {
            const idA = a.__ref.replace('Action:', '');
            const idB = b.__ref.replace('Action:', '');
            return idToDate(idB).getTime() - idToDate(idA).getTime();
          });
          return sorted;
        },
      },
      highlights: {
        keyArgs: ['memberId', 'organizationId'],
        merge(
          existing = {},
          incoming: Record<
            | 'boards'
            | 'cards'
            | 'highlights'
            | 'lists'
            | 'members'
            | 'organizations',
            Reference[]
          >,
        ) {
          const merged = (
            [
              'boards',
              'cards',
              'highlights',
              'lists',
              'members',
              'organizations',
            ] as const
          ).reduce(
            (result, key) => {
              result[key] = mergeArrays(incoming[key], existing[key]);
              return result;
            },
            {} as Record<
              | 'boards'
              | 'cards'
              | 'highlights'
              | 'lists'
              | 'members'
              | 'organizations',
              Reference[]
            >,
          );

          merged.highlights = merged.highlights.sort(
            (a: Reference, b: Reference) => {
              const idA = a.__ref.replace('Action:', '');
              const idB = b.__ref.replace('Action:', '');
              return idToDate(idB).getTime() - idToDate(idA).getTime();
            },
          );

          return merged;
        },
      },
    },
  },
  TrelloQueryApi: {
    fields: {
      application: {
        read: (_, { args, toReference }) => {
          return toReference({
            __typename: 'TrelloApplication',
            id: args?.id,
          });
        },
      },
      board: {
        read: (_, { args, toReference }) => {
          return toReference({
            __typename: 'TrelloBoard',
            id: args?.id,
          });
        },
      },
    },
  },
  Action: {
    fields: {
      reactions: {
        read: readWithDefault([]),
        merge: (existing = [], incoming = []) => {
          if (dangerouslyGetFeatureGateSync('goo_sync_reactions_to_cache')) {
            return mergeArrays(existing, incoming);
          } else {
            return incoming;
          }
        },
      },
      display: {
        merge: true,
      },
    },
  },
  Reaction: {
    fields: {
      emoji: {
        merge: true,
      },
    },
  },
  Board: {
    fields: {
      actions: {
        merge(existing = [], incoming: Reference[]) {
          const combined = mergeArrays(existing, incoming);
          const sorted = combined.sort((a, b) => {
            const idA = a.__ref.replace('Action:', '');
            const idB = b.__ref.replace('Action:', '');
            return idToDate(idB).getTime() - idToDate(idA).getTime();
          });
          return sorted;
        },
      },
      cards: {
        // We have to use it if both read and merge function are defined on the field
        // Otherwise Apollo replaces it with `keyArgs: false`
        // https://github.com/apollographql/apollo-client/blob/2553695750f62657542792e22d0abe9b50a7dab2/src/cache/inmemory/policies.ts#L462
        keyArgs: defaultKeyArgsFunction,
        read: saveParentId,

        merge: addParentConnection(boardToCardsRelation),
      },
      customFields: {
        merge: (existing = [], incoming = []) => {
          // Technically I don't think we need merging but merging arrays by ref
          // is safer than replacing
          return mergeArrays(existing, incoming);
        },
      },
      prefs: {
        merge: true,
      },
      templateGallery: {
        merge: true,
      },
      myPrefs: {
        merge: mergeIncomingAndFillNulls(),
      },
      members: {
        merge: (existing, incoming, { readField }) => {
          incoming?.forEach((member: Reference) => {
            addMemberToIdCache(member, readField);
          });
          return mergeArrays(existing ?? [], incoming ?? []);
        },
      },
      limits: {
        merge: true,
      },
    },
    merge: (existing, incoming, { mergeObjects, readField }) => {
      const id =
        (existing !== undefined && readField('id', existing)) || incoming?.id;
      const ari =
        (existing !== undefined && readField('nodeId', existing)) ||
        incoming?.nodeId;
      const shortLink =
        (existing !== undefined && readField('shortLink', existing)) ||
        incoming?.shortLink;
      if (id && shortLink && !idCache.getBoardId(shortLink)) {
        idCache.setBoardId(shortLink, id);
      }
      if (ari && shortLink && !idCache.getBoardAri(shortLink)) {
        idCache.setBoardAri(shortLink, ari);
      }

      return mergeObjects(existing, incoming);
    },
  },
  List: {
    fields: {
      cards: {
        // We have to use it if both read and merge function are defined on the field
        // Otherwise Apollo replaces it with `keyArgs: false`
        // https://github.com/apollographql/apollo-client/blob/2553695750f62657542792e22d0abe9b50a7dab2/src/cache/inmemory/policies.ts#L462
        keyArgs: defaultKeyArgsFunction,
        read: saveParentId,

        merge: addParentConnection(listToCardsRelation),
      },
    },
  },
  Card: {
    fields: {
      attachments: {
        // For now we will always send every attachment, every single time, over RT updates
        merge: false,
      },
      badges: {
        merge: true,
      },
      cover: {
        merge: true,
      },
      coordinates: {
        merge: true,
      },
      limits: {
        merge: true,
      },
      recurrenceRule: {
        merge: true,
      },
      checklists: {
        // we need the keyArgs since there's cache entries for the different filters
        keyArgs: ['filter'],
        merge: (existing, incoming) => {
          if (existing?.length > 0 && incoming?.length === 0) {
            /**
             * This handles a removal event for a checkItem with the due filter.
             * Removing this line will break the test in syncDeltaToCache "should remove checkItem".
             *
             * CheckItems have special syncing in syncDeltaToCache because of filter patchers,
             * which applies logic to determine when we should sync to a filter.  In this case,
             * it looks like there's some interaction between the legacy filter patchers already
             * attempting to sync to a filter which stops us from being able to directly
             * mergeArrays as with customFieldItems below.
             */
            return [];
          }
          return mergeArrays(existing ?? [], incoming ?? []);
        },
      },
      customFieldItems: {
        merge: (existing, incoming) => {
          return mergeArrays(existing ?? [], incoming ?? []);
        },
      },
      members: {
        // For now we will always send every member, every single time, over RT updates
        merge: false,
      },
      membersVoted: {
        // For now we will always send every voting member, every single time, over RT updates
        merge: false,
      },
    },
    merge: (existing, incoming, { mergeObjects, readField, cache }) => {
      const id =
        (existing !== undefined && readField('id', existing)) ||
        incoming?.id ||
        readField('id', incoming);
      const ari =
        (existing !== undefined && readField('nodeId', existing)) ||
        incoming?.nodeId;
      const shortLink =
        (existing !== undefined && readField('shortLink', existing)) ||
        incoming?.shortLink ||
        readField('shortLink', incoming);
      if (id && shortLink && !idCache.getCardId(shortLink)) {
        idCache.setCardId(shortLink, id);
      }
      if (ari && shortLink && !idCache.getCardAri(shortLink)) {
        idCache.setCardAri(shortLink, ari);
      }

      /**
       * when we add a card via socket update or adding directly, the response
       * from server will not contain checklists. If we don't do the following,
       * we'd make network requests to get data we already have because of a cache
       * miss for checklists. To fix that, this writes the an empty checklists
       * array to the cache when a card is added and there were not previously
       * checklists present on the card in the cache
       */
      const checklists = cache.readFragment({
        id: cache.identify(existing || incoming),
        fragment: gql`
          fragment CardChecklistsRead on Card {
            checklists {
              id
            }
          }
        `,
      });
      if (!checklists) {
        cache.writeFragment({
          id: cache.identify(existing || incoming),
          fragment: gql`
            fragment CardChecklistsWrite on Card {
              checklists(filter: all) {
                id
              }
              checklistsDue: checklists(filter: due) {
                id
              }
              checklistNoArgs: checklists {
                id
              }
            }
          `,
          data: {
            checklists: [],
            checklistsDue: [],
            checklistNoArgs: [],
          },
        });
      }

      /** Sync idMembersVoted to membersVoted */
      const idMembersVoted = readField<string[]>('idMembersVoted', incoming);
      if (
        idMembersVoted &&
        idMembersVoted !== (existing && readField('idMembersVoted', existing))
      ) {
        if (Array.isArray(idMembersVoted)) {
          cache.writeFragment({
            id: cache.identify(incoming),
            fragment: gql`
              fragment CardMembersVotedWrite on Card {
                membersVoted {
                  id
                }
              }
            `,
            data: {
              membersVoted: idMembersVoted.map((idMember) => ({
                __typename: 'Member',
                id: idMember,
              })),
            },
          });
        }
      }

      return mergeObjects(existing, incoming);
    },
  },
  Card_Badges_AttachmentsByType: {
    fields: {
      trello: {
        merge: true,
      },
    },
  },
  Card_Limits_Attachments: {
    fields: {
      perCard: {
        merge: true,
      },
    },
  },
  Card_Limits_Checklists: {
    fields: {
      perCard: {
        merge: true,
      },
    },
  },
  Card_Limits_Stickers: {
    fields: {
      perCard: {
        merge: true,
      },
    },
  },
  CardEntity: {
    // This is needed because the CardEntity cache entry was being refrenced by multiple notifications.
    // This would cause data to be incorrectly overwritten for fields not always returned by server,
    // because it would always use the 'last' value, which would sometimes be null.
    keyFields: () => `CardEntity:${uuidv4()}`,
  },
  Checklist: {
    fields: {
      pos: {
        // -1 means position is unknown. See `calcPos` in app/scripts/lib/util/index.js

        read: readWithDefault(-1),
      },
      checkItems: {
        // In both classic sockets and GQL subscriptions, we send every check item, every time,
        // so we need to replace the existing array instead of merging it
        merge: false,
      },
    },
  },
  CustomFieldItem: {
    fields: {
      value: {
        merge: true,
      },
    },
    merge: true,
  },
  Enterprise: {
    fields: {
      paidAccount: {
        merge: true,
      },
      organizations: {
        keyArgs: ['filter', 'sortBy', 'sortOrder', 'count'],
        read(existing, { canRead }) {
          if (!existing) return undefined;
          return {
            ...existing,
            organizations: existing.organizations.filter(canRead),
          };
        },
        merge(existing, incoming) {
          return {
            ...incoming,
            organizations: mergeArrays(
              existing?.organizations ?? [],
              incoming.organizations,
            ),
          };
        },
      },
      claimedOrganizations: {
        keyArgs: ['query', 'activeSince', 'inactiveSince'],
        merge(existing, incoming) {
          return {
            ...incoming,
            organizations: mergeArrays(
              existing?.organizations ?? [],
              incoming.organizations,
            ),
          };
        },
      },
      claimableOrganizations: {
        keyArgs: ['name', 'activeSince', 'inactiveSince'],
        read(existing, { args }) {
          return existing && existing?.cursor === args?.cursor
            ? undefined
            : existing;
        },
        merge(existing, incoming) {
          return {
            ...incoming,
            organizations: mergeArrays(
              existing?.organizations || [],
              incoming.organizations,
            ),
          };
        },
      },
      pendingOrganizations: {
        keyArgs: [
          'search',
          'activeSince',
          'inactiveSince',
          'sortBy',
          'sortOrder',
          'count',
        ],
        read(existing, { canRead }) {
          if (!existing) return undefined;
          return {
            ...existing,
            organizations: existing.organizations.filter(canRead),
          };
        },
        merge(existing, incoming) {
          return {
            ...incoming,
            organizations: mergeArrays(
              existing?.organizations ?? [],
              incoming.organizations,
            ),
          };
        },
      },
      boards: {
        keyArgs: [
          'count',
          'filter',
          'members',
          'organization',
          'search',
          'sortBy',
          'sortOrder',
          'idOrganizations',
        ],
        merge: (existing, incoming) => {
          return {
            ...incoming,
            boards: mergeArrays(existing?.boards || [], incoming?.boards || []),
          };
        },
      },
      prefs: {
        merge: true,
      },
      licenses: {
        merge: true,
      },
      organizationPrefs: {
        merge: true,
      },
    },
  },
  Organization: {
    fields: {
      paidAccount: {
        merge: true,
      },
      prefs: {
        merge: true,
      },
      cards: {
        keyArgs: (
          args: Partial<OrganizationCardsArgs> | null,
          { fieldName },
        ): string => {
          if (!args) {
            // https://github.com/apollographql/apollo-client/blob/d403a072b81fb9b10102d19ee636fa56186f9385/src/cache/inmemory/policies.ts#L267
            return fieldName;
          }
          const { limit, cursor, date, ...rest } = args;

          const keyObj = {
            ...rest,
            // `date` is not a keyArg since it's used for pagination on the
            // calendar. However, its absence or presence is a keyArg, because
            // it indicates whether we are paginating cards by `cursor` (table
            // view) or loading cards by date range (calendar view). This
            // computation is why keyArgs is a function instead of array for
            // this field.
            hasDateRange: Boolean(date),
          };

          return `${fieldName}:${JSON.stringify(keyObj)}`;
        },
        merge: (existing, incoming) => {
          return {
            ...incoming,
            cards: mergeArrays(existing?.cards || [], incoming?.cards || []),
          };
        },
      },
      members: {
        merge: (existing, incoming, { readField }) => {
          incoming?.forEach((member: Reference) => {
            addMemberToIdCache(member, readField);
          });
          return mergeArrays(existing ?? [], incoming ?? []);
        },
      },
      /**
       * API for limits will return no count field until the org
       * hits the warnAt threshold, resulting in a cache miss for orgs.
       * Defaulting to null here fixing excessive requests for org
       */
      limits: {
        merge(existing: Organization_Limits, incoming: Organization_Limits) {
          return {
            ...existing,
            ...incoming,
            orgs: {
              ...(existing?.orgs || {}),
              ...(incoming?.orgs || {}),
              freeBoardsPerOrg: {
                ...(existing?.orgs?.freeBoardsPerOrg || {}),
                ...(incoming?.orgs?.freeBoardsPerOrg || {}),
                count:
                  incoming?.orgs?.freeBoardsPerOrg?.count ||
                  existing?.orgs?.freeBoardsPerOrg?.count ||
                  null,
              },
            },
          };
        },
      },
      enterprise: {
        merge: true,
      },
      enterpriseJoinRequest: {
        merge: true,
      },
      domain: {
        merge: true,
      },
    },
    merge: (existing, incoming, { mergeObjects, readField }) => {
      const id =
        (existing !== undefined && readField('id', existing)) || incoming?.id;
      const ari =
        (existing !== undefined && readField('nodeId', existing)) ||
        incoming?.nodeId;
      const name =
        (existing !== undefined && readField('name', existing)) ||
        incoming?.name;
      if (id && name && !idCache.getWorkspaceId(name)) {
        idCache.setWorkspaceId(name, id);
      }
      if (ari && name && !idCache.getWorkspaceAri(name)) {
        idCache.setWorkspaceAri(name, ari);
      }
      return mergeObjects(existing, incoming);
    },
  },
  Member: {
    fields: {
      boardStars: {
        merge(existing = [], incoming: unknown[]) {
          return [...incoming];
        },
      },
      prefs: {
        merge: true,
      },
      paidAccount: {
        merge: true,
      },
      domain: {
        merge: true,
      },
      nonPublic: {
        merge: getMemberNonPublicMerge(),
      },
    },
    merge: (existing, incoming, { mergeObjects, readField }) => {
      addMemberToIdCache(incoming, readField);
      return mergeObjects(existing, incoming);
    },
  },
  Collaborator: {
    fields: {
      nonPublic: {
        merge: getMemberNonPublicMerge(),
      },
    },
  },
  TrelloSubscriptionApi: {
    merge: true,
  },
  TrelloBoard: {
    fields: {
      labels: {
        keyArgs: false,
        merge: (existing, incoming) => ({
          ...existing,
          ...incoming,
          edges: edgeMergeFunction(
            existing?.edges ?? [],
            incoming?.edges ?? [],
          ),
        }),
      },
      powerUps: {
        keyArgs: false,
      },
      prefs: {
        merge: true,
      },
      viewer: {
        merge: true,
      },
    },
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloBoardToBoard(incomingFields, cache, readField);
      }
      return incoming;
    },
  },
  TrelloBoardBackground: {
    merge: true,
  },
  TrelloBoardUpdated: {
    merge: false,
  },
  TrelloLabelConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
    merge: false,
  },
  TrelloList: {
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloListToList(incomingFields, cache, readField);
      }
      return incoming;
    },
  },
  TrelloMember: {
    fields: {
      inbox: {
        keyArgs: false,
      },
    },
    merge: (
      existing,
      incoming,
      { cache, mergeObjects, readField, field, canRead },
    ) => {
      addMemberToIdCache(incoming, readField);
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloMemberToMember(incomingFields, cache, readField);
      }
      return mergeObjects(existing, incoming);
    },
  },
  TrelloBoardMembershipInfo: {
    keyFields: (membership) => {
      const objectId = membership.objectId;
      // Slash ensures compatibility with ARIs
      return `TrelloBoardMembershipInfo/${objectId}`;
    },
    merge: (
      existing,
      incoming,
      { cache, mergeObjects, readField, field, canRead },
    ) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloMembershipToMembership(incomingFields, cache, readField);
      }
      return mergeObjects(existing, incoming);
    },
  },
  TrelloCard: {
    fields: {
      actions: {
        keyArgs: false,
      },
      attachments: {
        keyArgs: false,
      },
      customFieldItems: {
        keyArgs: false,
      },
      due: {
        merge: true,
      },
      labels: {
        keyArgs: false,
      },
      list: {
        keyArgs: false,
      },
      members: {
        keyArgs: false,
      },
      powerUpData: {
        keyArgs: ['filter'],
      },
      stickers: {
        keyArgs: false,
      },
    },
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloCardToCard(incomingFields, cache, readField);
      }
      return incoming;
    },
  },
  TrelloCardBadges: {
    merge: (existing, incoming, { mergeObjects }) =>
      mergeObjects(existing, incoming),
  },
  TrelloCardActionConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloCardActions: {
    fields: {
      reactions: {
        merge: (existing, incoming) => {
          const merged = mergeArrays(
            existing,
            incoming,
            (reaction: TrelloReaction) => reaction.objectId,
          );
          return merged;
        },
      },
    },
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      if (dangerouslyGetFeatureGateSync('goo_card_back_cache_syncing')) {
        const incomingFields = getIncomingFields(
          incoming,
          field,
          readField,
          canRead,
          fragmentRegistry,
        );
        if (incomingFields) {
          syncTrelloActionToAction(incomingFields, cache, readField);
        }
      }
      return incoming;
    },
  },

  TrelloAttachmentConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloAttachment: {
    merge: (
      existing,
      incoming,
      { cache, readField, field, canRead, mergeObjects },
    ) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloAttachmentToAttachment(incomingFields, cache, readField);
      }
      return mergeObjects(existing, incoming);
    },
  },
  TrelloCardCover: {
    merge: (existing, incoming, { mergeObjects }) =>
      mergeObjects(existing, incoming),
  },
  TrelloCheckItem: {
    merge: (
      existing,
      incoming,
      { cache, readField, field, canRead, mergeObjects },
    ) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloCheckItemToCheckItem(incomingFields, cache, readField);
      }
      return mergeObjects(existing, incoming);
    },
  },
  TrelloChecklist: {
    merge: (
      existing,
      incoming,
      { cache, readField, field, canRead, mergeObjects },
    ) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloChecklistToChecklist(incomingFields, cache, readField);
      }
      return mergeObjects(existing, incoming);
    },
  },
  TrelloCustomField: {
    merge: (
      existing,
      incoming,
      { cache, readField, field, mergeObjects, canRead },
    ) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloCustomFieldToCustomField(incomingFields, cache, readField);
      }
      return incoming;
    },
  },
  TrelloCustomFieldConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
        merge: (existing, incoming) => edgeMergeFunction(existing, incoming),
      },
    },
  },
  TrelloCustomFieldItemConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloCustomFieldItem: {
    keyFields: (customFieldItem) => {
      const objectId = customFieldItem.objectId;
      // Slash ensures compatibility with ARIs
      return `TrelloCustomFieldItem/${objectId}`;
    },
    merge: (
      existing,
      incoming,
      { cache, mergeObjects, readField, field, canRead },
    ) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloCustomFieldItemToCustomFieldItem(
          incomingFields,
          cache,
          readField,
        );
      }

      return mergeObjects(existing, incoming);
    },
  },
  TrelloCustomFieldOption: {
    keyFields: (customFieldOption) => {
      const objectId = customFieldOption.objectId;
      // Slash ensures compatibility with ARIs
      return `TrelloCustomFieldOption/${objectId}`;
    },
    merge: true,
  },
  TrelloCustomFieldItemValueInfo: {
    merge: true,
    keyFields: false,
  },
  TrelloLabel: {
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloLabelToLabel(incomingFields, cache, readField);
      }

      return incoming;
    },
  },
  TrelloBoardPowerUpConnection: {
    /**
     * This is a tricky case because the objectId for the board plugin actually lives
     * on the edge as opposed to the node, so we need to run the sync code on the
     * edge as opposed to just defining a type policy for the TrelloBoardPowerUp.
     *
     * The objectId for the powerup itself lives on the node.
     */
    fields: {
      edges: {
        merge: (existing, incoming, { cache, readField, field, canRead }) => {
          if (Array.isArray(incoming)) {
            incoming.forEach((edge) => {
              const incomingFields = getIncomingFields(
                edge,
                field,
                readField,
                canRead,
                fragmentRegistry,
              );
              if (incomingFields) {
                syncTrelloPowerUpToBoardPlugins(
                  incomingFields,
                  cache,
                  readField,
                );
              }
            });
          }
          return incoming;
        },
      },
    },
  },
  TrelloPowerUpData: {
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloPowerUpDataToPluginData(incomingFields, cache, readField);
      }

      return incoming;
    },
  },
  TrelloSticker: {
    merge: (existing, incoming, { cache, readField, field, canRead }) => {
      const incomingFields = getIncomingFields(
        incoming,
        field,
        readField,
        canRead,
        fragmentRegistry,
      );
      if (incomingFields) {
        syncTrelloStickerToSticker(incomingFields, cache, readField);
      }

      return incoming;
    },
  },
  TrelloMirrorCardConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
        merge(existingEdges: Edge[], incomingEdges: Edge[]) {
          return edgeMergeFunction(existingEdges, incomingEdges);
        },
      },
    },
  },
  TrelloPlanner: {
    fields: {
      accounts: {
        merge: (existing, incoming) => {
          if (!existing && incoming === null) {
            return incoming;
          }

          return {
            ...existing,
            ...incoming,
            edges: edgeMergeFunction(
              existing?.edges || [],
              incoming?.edges || [],
            ),
            pageInfo: {
              ...existing?.pageInfo,
              ...incoming?.pageInfo,
            },
          };
        },
      },
    },
  },
  TrelloPlannerCalendar: {
    fields: {
      events: {
        keyArgs: ['filter'],
        merge: (existing, incoming) => {
          if (!existing && incoming === null) {
            return incoming;
          }

          // Handle null nodes by filtering them out
          const filterNullNodes = (
            edges: Edge[] | undefined,
          ): Edge[] | undefined => {
            if (!edges) return edges;
            return edges.filter((edge: Edge) => edge && edge.node !== null);
          };

          return {
            ...existing,
            ...incoming,
            edges: edgeMergeFunction(
              filterNullNodes(existing?.edges) || [],
              filterNullNodes(incoming?.edges) || [],
            ),
            pageInfo: {
              ...existing?.pageInfo,
              ...incoming?.pageInfo,
            },
          };
        },
      },
      forceUpdateTimestamp: {
        merge: (existing, incoming) => {
          // If forceUpdateTimestamp already exists and we get a new one, only update it if it's more recent.
          if (existing && incoming) {
            if (new Date(incoming).getTime() > new Date(existing).getTime()) {
              return incoming;
            }
            return existing;
          }
          return incoming;
        },
      },
    },
  },
  TrelloPlannerCalendarAccount: {
    fields: {
      providerCalendars: {
        merge: (existing, incoming) => ({
          ...existing,
          ...incoming,
          edges: edgeMergeFunction(
            existing?.edges,
            incoming?.edges,
            (node) =>
              `${node.__typename}:${JSON.stringify({ id: node.id, providerAccountId: node.providerAccountId })}`,
          ),
          pageInfo: {
            ...existing?.pageInfo,
            ...incoming?.pageInfo,
          },
        }),
        keyArgs: false,
      },
      enabledCalendars: {
        merge: (existing, incoming) => ({
          ...existing,
          ...incoming,
          edges: edgeMergeFunction(existing?.edges, incoming?.edges),
          pageInfo: {
            ...existing?.pageInfo,
            ...incoming?.pageInfo,
          },
        }),
        keyArgs: false,
      },
    },
  },
  TrelloPlannerCalendarAccountConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloPlannerCalendarEvent: {
    keyFields: ['id', 'plannerCalendarId'],
    fields: {
      cards: {
        keyArgs: false,
      },
    },
  },
  TrelloPlannerCalendarEventConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloPlannerCalendarConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloPlannerProviderCalendar: {
    keyFields: ['id', 'providerAccountId'],
  },
  TrelloPlannerProviderCalendarConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
      },
    },
  },
  TrelloPlannerCalendarEventCardConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
        merge(existingEdges: Edge[], incomingEdges: Edge[]) {
          return edgeMergeFunction(existingEdges, incomingEdges);
        },
      },
    },
  },
  TrelloPlannerCalendarEventDeleted: {
    merge: (existing, incoming, { cache, readField }) => {
      const eventToRemoveId = readField('id', incoming);
      const plannerCalendarId = readField('plannerCalendarId', incoming);
      if (eventToRemoveId && plannerCalendarId) {
        cache.evict({
          id: cache.identify({
            __typename: 'TrelloPlannerCalendarEvent',
            id: eventToRemoveId,
            plannerCalendarId,
          }),
        });
        cache.gc();
      }
      return incoming;
    },
  },
  TrelloPlannerCalendarEventCardDeleted: {
    merge: (existing, incoming, { cache, readField }) => {
      const cardToRemoveId = readField('id', incoming);
      if (cardToRemoveId) {
        cache.evict({
          id: cache.identify({
            __typename: 'TrelloPlannerCalendarEventCard',
            id: cardToRemoveId,
          }),
        });
        cache.gc();
      }
      return incoming;
    },
  },
  TrelloPlannerCalendarDeleted: {
    merge: (existing, incoming, { cache, readField }) => {
      const calendarToRemoveId = readField('id', incoming);
      if (calendarToRemoveId) {
        cache.evict({
          id: cache.identify({
            __typename: 'TrelloPlannerCalendar',
            id: calendarToRemoveId,
          }),
        });
        cache.gc();
      }
      return incoming;
    },
  },
  TrelloMemberAiRuleConnection: {
    fields: {
      edges: {
        read: edgeReadFunction,
        merge: (existing, incoming) => {
          return edgeMergeFunction(existing, incoming);
        },
      },
    },
  },
  TrelloAiRuleDeleted: {
    merge: (existing, incoming, { cache, readField }) => {
      const aiRuleToRemoveId = readField('id', incoming);
      if (aiRuleToRemoveId) {
        cache.evict({
          id: cache.identify({
            __typename: 'TrelloAiRule',
            id: aiRuleToRemoveId,
          }),
        });
        cache.gc();
      }
      return incoming;
    },
  },
  TrelloApplication: {
    fields: {
      oauth2Client: {
        merge: true,
      },
    },
  },
};
