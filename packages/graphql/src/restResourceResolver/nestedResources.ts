import type { FieldNode } from 'graphql';

import type { QueryParam, QueryParams } from '../types';
import { getArgument, getChildFieldNames, getChildNode } from './queryParsing';

export interface NestedResource {
  name: string;
  nodeToQueryParams: (node: FieldNode, variables: QueryParams) => QueryParams;
  allowedQueryParamForSyncing?: { [paramName: string]: QueryParam[] };
  nestedResources?: NestedResource[];
  fieldsWithNestedResources?: NestedResource[];
  unsupportedFields?: string[];
}

/**
 * This data structure represents valid 'chains' of nested resources according
 * to the Trello API.
 * See https://developers.trello.com/reference#understanding-nested-resources
 *
 * @name
 * Represents the node's name as it would appear in a graphql query. For
 * example:
 *
 * board {
 *   cards {
 *     checklists
 *   }
 * }
 *
 * Would be expected to match a 'path' down this tree according to the `name`
 * property. In the following explanations, I will refer to this 'path' as
 * [board -> cards -> checklists]
 *
 * @allowedQueryParamForSyncing
 * This object specifies what values for a 'filtering' query param are considered
 * 'allowed' when it comes to cache syncing. Effectively, this should be a single
 * query param key, that matches the 'expansion' parameter (eg member_boards), and
 * the values allowed should be those that indicate 'all' (i.e no filtering taking place).
 * When we receive a REST response in classic, we check whether the classic request
 * contained any query parameters _not_ specified in allowedQueryParamForSyncing, and
 * reject the delta from being synced
 *
 * @nodeToQueryParams
 * A function which is called when parsing a graphql query into query params
 * for a REST API request. It's given a FieldNode and expected to return all
 * the necessary query params to satisfy the data for that given node
 *
 * @unsupportedFields
 * An array of field names that aren't supported by the server at this particular path.
 * This is useful for fields that _should_ be non-nullable (like an ID), but selecting
 * that field via the REST API does not return it.
 *
 * @nestedResources
 * Recursive property used to define the 'tree' of nested resources according to
 * the above.
 *
 * @fieldsWithNestedResources
 * There are times where a nested resource has a field, which has a nested resource.
 * E.g. organization -> memberships -> member. Memberships is a field of organization,
 * while member is a nested resource of memberships. fieldsWithNestedResources captures this relationship.
 */

export const VALID_NESTED_RESOURCES: NestedResource[] = [
  {
    name: 'action',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
    nestedResources: [
      {
        name: 'memberCreator',
        nodeToQueryParams: (node) => ({
          memberCreator: true,
          memberCreator_fields: getChildFieldNames(node),
        }),
      },
    ],
  },
  {
    name: 'board',
    nodeToQueryParams: (node, variables) => {
      const disableMock = getArgument(
        node,
        'organizationDisableMock',
        variables,
      );
      return disableMock !== null
        ? {
            fields: getChildFieldNames(node, ['memberships']),
            organization_disable_mock: disableMock,
          }
        : { fields: getChildFieldNames(node, ['memberships']) };
    },
    nestedResources: [
      {
        name: 'actions',
        nodeToQueryParams: (node, variables) => {
          const filteredFields = getArgument(node, 'filter', variables);

          const mappings: Record<string, string> = {
            updateCardIdList: 'updateCard:idList',
            updateCardClosed: 'updateCard:closed',
            updateCardDue: 'updateCard:due',
            updateCardDueComplete: 'updateCard:dueComplete',
            updateListClosed: 'updateList:closed',
          };

          let actions;
          if (Array.isArray(filteredFields)) {
            actions =
              filteredFields?.map((action) => mappings[action] || action) ||
              'all';
          } else {
            actions = filteredFields || 'all';
          }

          return {
            actions,
            actions_limit: getArgument(node, 'limit', variables),
            actions_display: true,
            action_fields: getChildFieldNames(node),
          };
        },
        allowedQueryParamForSyncing: {
          actions: ['all'],
        },
        nestedResources: [
          {
            name: 'memberCreator',
            nodeToQueryParams: (node) => ({
              action_memberCreator: true,
              action_memberCreator_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'reactions',
            nodeToQueryParams: () => ({
              action_reactions: true,
            }),
            nestedResources: [
              {
                name: 'member',
                nodeToQueryParams: () => ({
                  action_reactions_member: true,
                }),
              },
            ],
          },
        ],
      },
      {
        name: 'enterprise',
        nodeToQueryParams: (node, variables) => ({
          enterprise: true,
          enterprise_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'recommendedMembers',
        nodeToQueryParams: (node, variables) => ({
          recommendedMembers: true,
          recommendedMember_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'butlerButtonLimit',
        nodeToQueryParams: () => ({
          butlerButtonLimit: true,
        }),
      },
      {
        name: 'privateButlerButtons',
        nodeToQueryParams: () => ({
          privateButlerButtons: true,
        }),
      },
      {
        name: 'sharedButlerButtons',
        nodeToQueryParams: () => ({
          sharedButlerButtons: true,
        }),
      },
      {
        name: 'butlerButtonOverrides',
        nodeToQueryParams: () => ({
          butlerButtonOverrides: true,
        }),
      },
      {
        name: 'boardPlugins',
        nodeToQueryParams: () => ({
          boardPlugins: true,
        }),
      },
      {
        name: 'cards',
        nodeToQueryParams: (node, variables) => {
          const extraOpts: {
            card_attachments?: string;
            card_attachment_fields?: string[] | 'none';
          } = {};

          // In case of requesting card.cover.scaled, but not requesting attachments we need to enforce it
          // Otherwise server will omit the scaled field in response
          if (
            !getChildNode(node, 'attachments') &&
            getChildNode(getChildNode(node, 'cover'), 'scaled')
          ) {
            extraOpts.card_attachments = 'cover';
            extraOpts.card_attachment_fields = 'none';
          }
          return {
            cards: getArgument(node, 'filter', variables) || 'all',
            // Labels are included as a field to the Card rather than supplying an
            // additional query param
            card_fields: getChildFieldNames(node, ['labels']),
            ...extraOpts,
          };
        },
        allowedQueryParamForSyncing: {
          cards: ['all'],
        },
        nestedResources: [
          {
            name: 'attachments',
            nodeToQueryParams: (node, variables) => ({
              card_attachments: getArgument(node, 'filter', variables) || true,
              card_attachment_fields: getChildFieldNames(node),
            }),
            allowedQueryParamForSyncing: {
              card_attachments: [true],
            },
          },
          {
            name: 'checklists',
            nodeToQueryParams: (node, variables) => ({
              card_checklists: getArgument(node, 'filter', variables) || 'all',
              card_checklist_fields: getChildFieldNames(node),
            }),
            allowedQueryParamForSyncing: {
              card_checklists: ['all'],
            },
            nestedResources: [
              {
                name: 'checkItems',
                nodeToQueryParams: (node, variables) => ({
                  card_checklist_checkItems:
                    getArgument(node, 'filter', variables) || 'all',
                }),
                allowedQueryParamForSyncing: {
                  card_checklist_checkItems: ['all'],
                },
              },
            ],
          },
          {
            name: 'customFieldItems',
            nodeToQueryParams: () => ({
              card_customFieldItems: true,
            }),
          },
          {
            name: 'labels',
            nodeToQueryParams: () => ({
              // Labels are included as a field to the Card rather than supplying an
              // additional query param
            }),
          },
          {
            name: 'stickers',
            nodeToQueryParams: () => ({
              card_stickers: true,
            }),
          },
          {
            name: 'pluginData',
            nodeToQueryParams: () => ({
              card_pluginData: true,
            }),
          },
        ],
      },
      {
        name: 'customFields',
        nodeToQueryParams: () => ({
          customFields: true,
        }),
      },
      {
        name: 'dashboardViewTiles',
        nodeToQueryParams: () => ({
          dashboardViewTiles: true,
        }),
      },
      {
        name: 'lists',
        nodeToQueryParams: (node, variables) => ({
          lists: getArgument(node, 'filter', variables) || 'all',
          list_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          lists: ['all'],
        },
      },
      {
        name: 'related',
        nodeToQueryParams: (node, variables) => ({
          related: true,
          related_fields: getChildFieldNames(node),
          related_count: getArgument(node, 'count', variables),
        }),
      },
      {
        name: 'labels',
        nodeToQueryParams: (node, variables) => ({
          labels: 'all', // 'all' and 'none' are the only values server accepts
          label_fields: getChildFieldNames(node),
          labels_limit: getArgument(node, 'limit', variables) ?? 1000,
        }),
        allowedQueryParamForSyncing: {
          labels: ['all'],
        },
      },
      {
        name: 'members',
        nodeToQueryParams: (node, variables) => ({
          members: getArgument(node, 'filter', variables) || 'all',
          member_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          members: ['all'],
          // We also want to avoid syncing for filtered membership collection,
          // as the membership property is what we use when patching the 'members'
          // relationship
          memberships: [],
        },
      },
      {
        name: 'membershipCounts',
        nodeToQueryParams: (node, variables) => ({
          membershipCounts: getArgument(node, 'filter', variables) || 'all',
        }),
        allowedQueryParamForSyncing: {
          membershipCounts: ['all'],
        },
      },
      {
        name: 'myPrefs',
        nodeToQueryParams: () => ({
          myPrefs: true,
        }),
      },
      {
        name: 'organization',
        nodeToQueryParams: (node) => ({
          organization: true,
          organization_fields: getChildFieldNames(node),
        }),
        nestedResources: [
          {
            name: 'enterprise',
            nodeToQueryParams: () => ({
              organization_enterprise: true,
            }),
          },
          {
            name: 'pluginData',
            nodeToQueryParams: () => ({
              organization_pluginData: true,
            }),
          },
          {
            name: 'tags',
            nodeToQueryParams: () => ({
              organization_tags: true,
            }),
          },
          {
            name: 'memberships',
            nodeToQueryParams: (node, variables) => ({
              organization_memberships:
                getArgument(node, 'filter', variables) || 'all',
            }),
          },
        ],
      },
      {
        name: 'plugins',
        nodeToQueryParams: (node, variables) => ({
          plugins: getArgument(node, 'filter', variables) || 'all',
        }),
        allowedQueryParamForSyncing: {
          plugins: ['all'],
        },
      },
      {
        name: 'pluginData',
        nodeToQueryParams: () => ({
          pluginData: true,
        }),
      },
      {
        name: 'starCounts',
        nodeToQueryParams: () => ({
          starCounts: 'organization',
        }),
        allowedQueryParamForSyncing: {
          starCounts: ['all'],
        },
      },
      {
        name: 'accessRequests',
        nodeToQueryParams: () => ({
          accessRequests: true,
        }),
      },
    ],
    fieldsWithNestedResources: [
      {
        name: 'memberships',
        nodeToQueryParams: (node, variables) => ({
          // memberships are included as a field to the org rather than supplying an
          // additional query param. Although you CAN supply them if you want to filter
        }),
        nestedResources: [
          {
            name: 'orgMemberType',
            nodeToQueryParams: () => ({
              memberships_orgMemberType: true,
            }),
          },
          {
            name: 'member',
            nodeToQueryParams: (node) => ({
              memberships_member: true,
              memberships_member_fields: getChildFieldNames(node),
            }),
          },
        ],
      },
    ],
  },
  {
    name: 'checklist',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
    nestedResources: [
      {
        name: 'checkItems',
        nodeToQueryParams: (node, variables) => ({
          checkItems: getArgument(node, 'filter', variables) || 'all',
          checkItem_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          checkItems: ['all'],
        },
      },
      {
        name: 'cards',
        nodeToQueryParams: (node) => ({
          cards: 'all',
          card_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          cards: ['all'],
        },
      },
    ],
  },
  {
    name: 'card',
    nodeToQueryParams: (node) => {
      const extraOpts: {
        attachments?: string;
        attachment_fields?: string[] | 'none';
      } = {};

      // In case of requesting card.cover.scaled, but not requesting attachments we need to enforce it
      // Otherwise server will omit the scaled field in response
      if (
        !getChildNode(node, 'attachments') &&
        getChildNode(getChildNode(node, 'cover'), 'scaled')
      ) {
        extraOpts.attachments = 'cover';
        extraOpts.attachment_fields = 'none';
      }

      return {
        // Labels are included as a field to the Card rather than supplying an
        // additional query param
        fields: getChildFieldNames(node, ['labels']),
        ...extraOpts,
      };
    },
    nestedResources: [
      {
        name: 'checklists',
        nodeToQueryParams: (node) => ({
          checklists: 'all',
          checklist_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          checklists: ['all'],
        },
        nestedResources: [
          {
            name: 'checkItems',
            nodeToQueryParams: () => ({
              checklist_checkItems: 'all',
            }),
            allowedQueryParamForSyncing: {
              checklist_checkItems: ['all'],
            },
          },
        ],
      },
      {
        name: 'customFields',
        nodeToQueryParams: () => ({
          customFields: true,
        }),
      },
      {
        name: 'customFieldItems',
        nodeToQueryParams: () => ({
          customFieldItems: true,
        }),
      },
      {
        name: 'board',
        nodeToQueryParams: (node) => ({
          board: true,
          board_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'labels',
        nodeToQueryParams: () => ({
          // Labels are included as a field to the Card rather than supplying an
          // additional query param
        }),
      },
      {
        name: 'list',
        nodeToQueryParams: (node) => ({
          list: true,
          list_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'members',
        nodeToQueryParams: (node) => ({
          members: true,
          member_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'attachments',
        nodeToQueryParams: (node, variables) => ({
          attachments: getArgument(node, 'filter', variables) || true,
          attachment_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          attachments: [true],
        },
      },
      {
        name: 'pluginData',
        nodeToQueryParams: () => ({
          pluginData: true,
        }),
      },
      {
        name: 'stickers',
        nodeToQueryParams: (node) => ({
          stickers: true,
          sticker_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'membersVoted',
        nodeToQueryParams: () => ({
          membersVoted: true,
        }),
      },
    ],
  },
  {
    name: 'list',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
    nestedResources: [
      {
        name: 'cards',
        nodeToQueryParams: (node, variables) => ({
          cards: getArgument(node, 'filter', variables) || 'all',
          card_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          cards: ['all'],
        },
      },
      {
        name: 'board',
        nodeToQueryParams: (node) => ({
          board: true,
          board_fields: getChildFieldNames(node),
        }),
      },
    ],
  },
  {
    name: 'member',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
    nestedResources: [
      {
        name: 'campaigns',
        nodeToQueryParams: (node, variables) => ({
          campaigns: true,
        }),
      },
      {
        name: 'domain',
        nodeToQueryParams: (node, variables) => ({
          domain: true,
          domain_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'cards',
        nodeToQueryParams: (node, variables) => ({
          cards: getArgument(node, 'filter', variables) || 'all',
          card_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          cards: ['all'],
        },
        nestedResources: [
          {
            name: 'members',
            nodeToQueryParams: (node) => ({
              card_members: true,
              card_member_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'attachments',
            nodeToQueryParams: (node, variables) => ({
              card_attachments: getArgument(node, 'filter', variables) || true,
              card_attachment_fields: getChildFieldNames(node),
            }),
            allowedQueryParamForSyncing: {
              card_attachments: [true],
            },
          },
          {
            name: 'checklists',
            nodeToQueryParams: (node, variables) => ({
              card_checklists: getArgument(node, 'filter', variables) || 'all',
              card_checklist_fields: getChildFieldNames(node),
            }),
            allowedQueryParamForSyncing: {
              card_checklists: ['all'],
            },
            nestedResources: [
              {
                name: 'checkItems',
                nodeToQueryParams: (node, variables) => ({
                  card_checklist_checkItems:
                    getArgument(node, 'filter', variables) || 'all',
                }),
                allowedQueryParamForSyncing: {
                  card_checklist_checkItems: ['all'],
                },
              },
            ],
          },
        ],
      },
      {
        name: 'organizations',
        nodeToQueryParams: (node, variables) => ({
          organizations: getArgument(node, 'filter', variables) || 'all',
          organization_fields: getChildFieldNames(node, ['credits']),
        }),
        allowedQueryParamForSyncing: {
          organizations: ['all'],
        },
        nestedResources: [
          {
            name: 'enterprise',
            nodeToQueryParams: () => ({
              organization_enterprise: true,
            }),
          },
          {
            name: 'paidAccount',
            nodeToQueryParams: (node) => ({
              organization_paidAccount: true,
              organization_paidAccount_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'plugins',
            nodeToQueryParams: (node, variables) => ({
              organization_plugins:
                getArgument(node, 'filter', variables) || 'all',
            }),
            allowedQueryParamForSyncing: {
              plugins: ['all'],
            },
          },
          {
            name: 'domain',
            nodeToQueryParams: (node, variables) => ({
              organization_domain: true,
              organization_domain_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'memberships',
            nodeToQueryParams: (node, variables) => ({
              organization_memberships:
                getArgument(node, 'filter', variables) || 'all',
            }),
          },
        ],
      },
      {
        name: 'boards',
        nodeToQueryParams: (node, variables) => ({
          boards: getArgument(node, 'filter', variables) || 'all',
          board_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          boards: ['all'],
        },
        nestedResources: [
          {
            name: 'organization',
            nodeToQueryParams: (node) => ({
              board_organization: true,
              board_organization_fields: getChildFieldNames(node),
            }),
            nestedResources: [
              {
                name: 'domain',
                nodeToQueryParams: () => ({
                  board_organization_domain: true,
                }),
              },
            ],
          },
          {
            name: 'memberships',
            nodeToQueryParams: (node, variables) => ({
              board_memberships:
                getArgument(node, 'filter', variables) || 'all',
            }),
          },
          {
            name: 'lists',
            nodeToQueryParams: (node, variables) => ({
              board_lists: getArgument(node, 'filter', variables) || 'all',
              list_fields: getChildFieldNames(node),
            }),
            allowedQueryParamForSyncing: {
              lists: ['all'],
            },
          },
        ],
      },
      {
        name: 'boardStars',
        nodeToQueryParams: () => ({
          boardStars: true,
        }),
      },
      {
        name: 'credits',
        nodeToQueryParams: (node, variables) => ({
          credits: getArgument(node, 'filter', variables),
        }),
        allowedQueryParamForSyncing: {
          credits: [], // no server supported filter for specifying 'all credits'
        },
      },
      {
        name: 'customStickers',
        nodeToQueryParams: () => ({
          customStickers: 'all',
        }),
      },
      {
        name: 'boardBackgrounds',
        nodeToQueryParams: () => ({
          boardBackgrounds: 'custom',
        }),
      },
      {
        name: 'logins',
        nodeToQueryParams: () => ({
          logins: true,
        }),
      },
      {
        name: 'enterprises',
        nodeToQueryParams: (node, variables) => {
          let enterprise_filter = getArgument(node, 'filter', variables);

          if (Array.isArray(enterprise_filter)) {
            enterprise_filter = enterprise_filter.map((filter) => {
              if (filter === 'memberUnconfirmed') {
                return 'member-unconfirmed';
              }
              return filter;
            });
          } else {
            if (enterprise_filter === 'memberUnconfirmed') {
              enterprise_filter = 'member-unconfirmed';
            }
          }

          return {
            enterprises: true,
            enterprise_filter: enterprise_filter || 'all',
            enterprise_fields: getChildFieldNames(node),
          };
        },
      },
      {
        name: 'enterpriseLicenses',
        nodeToQueryParams: () => ({
          enterpriseLicenses: true,
        }),
      },
      {
        name: 'enterpriseWithRequiredConversion',
        nodeToQueryParams: () => ({
          enterpriseWithRequiredConversion: true,
        }),
      },
      {
        name: 'paidAccount',
        nodeToQueryParams: (node) => ({
          paidAccount: true,
          paidAccount_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'pluginData',
        nodeToQueryParams: () => ({
          pluginData: true,
        }),
      },
      {
        name: 'savedSearches',
        nodeToQueryParams: () => ({
          savedSearches: true,
        }),
      },
      {
        name: 'tokens',
        nodeToQueryParams: () => ({
          tokens: 'all',
        }),
      },
      {
        name: 'credentials',
        nodeToQueryParams: () => ({
          credentials: 'all',
        }),
      },
      {
        name: 'sessions',
        nodeToQueryParams: () => ({
          sessions: 'all',
        }),
      },
      {
        name: 'inbox',
        nodeToQueryParams: (node) => ({
          inbox: true,
          inbox_fields: getChildFieldNames(node),
        }),
        nestedResources: [
          {
            name: 'board',
            nodeToQueryParams: (node) => ({
              inbox_board: true,
              inbox_board_fields: getChildFieldNames(node),
            }),
          },
        ],
      },
      {
        name: 'cohorts',
        nodeToQueryParams: () => ({
          cohorts: true,
        }),
      },
    ],
  },
  {
    name: 'organization',
    nodeToQueryParams: (node) => {
      const fields = getChildFieldNames(node, ['memberships']);
      /*
       * `idBoardsMostActive` is an outlier on server as an organization property that
       * can be queried. Instead of including it as a field name, it must be added as
       * it's own query param (eg. /1/organizations/:idOrg?idBoardsMostActive=true)
       */
      return {
        fields: fields.filter((f) => f !== 'idBoardsMostActive'),
        idBoardsMostActive: fields.includes('idBoardsMostActive')
          ? true
          : undefined,
      };
    },
    nestedResources: [
      {
        name: 'boards',
        nodeToQueryParams: (node, variables) => ({
          // its okay to supply boards "all" and board_ids filter
          boards: getArgument(node, 'filter', variables) || 'all',
          board_ids: getArgument(node, 'boardIds', variables),
          boards_count: getArgument(node, 'boardsCount', variables),
          boards_startIndex: getArgument(node, 'boardsStartIndex', variables),
          board_fields: getChildFieldNames(node, ['memberships']),
          boards_sortBy: getArgument(node, 'sortBy', variables),
          boards_sortOrder: getArgument(node, 'sortOrder', variables),
        }),
        allowedQueryParamForSyncing: {
          boards: ['all'],
        },
        nestedResources: [
          {
            name: 'lists',
            nodeToQueryParams: (node, variables) => ({
              board_lists: getArgument(node, 'filter', variables) || 'all',
              board_list_fields: getChildFieldNames(node),
            }),
            allowedQueryParamForSyncing: {
              board_lists: ['all'],
            },
          },
          {
            name: 'labels',
            nodeToQueryParams: (node, variables) => ({
              board_labels: getArgument(node, 'filter', variables) || 'all',
              board_labels_limit: getArgument(node, 'limit', variables),
              board_label_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'starCounts',
            nodeToQueryParams: () => ({
              board_starCounts: 'organization',
            }),
            allowedQueryParamForSyncing: {
              board_starCounts: ['organization'],
            },
          },
          {
            name: 'membershipCounts',
            nodeToQueryParams: (node, variables) => ({
              board_membershipCounts:
                getArgument(node, 'filter', variables) || 'all',
            }),
            allowedQueryParamForSyncing: {
              board_membershipCounts: ['all'],
            },
          },
          {
            name: 'boardPlugins',
            nodeToQueryParams: () => ({
              board_boardPlugins: true,
            }),
          },
          {
            name: 'members',
            nodeToQueryParams: (node, variables) => ({
              board_members: getArgument(node, 'filter', variables) || 'all',
              board_member_fields: getChildFieldNames(node),
            }),
          },
        ],
      },
      // The nested boards resolver for organizations is implemented in
      // resolvers/organizations.ts as `organizationBoardsResolver`
      {
        name: 'members',
        nodeToQueryParams: (node, variables) => ({
          members: getArgument(node, 'filter', variables) || 'all',
          member_fields: getChildFieldNames(node),
        }),
        allowedQueryParamForSyncing: {
          members: ['all'],
          // We also want to avoid syncing for filtered membership collection,
          // as the membership property is what we use when patching the 'members'
          // relationship
          memberships: [],
        },
      },
      {
        name: 'enterprise',
        nodeToQueryParams: () => ({
          enterprise: true,
        }),
      },
      {
        name: 'collaborators',
        nodeToQueryParams: () => ({
          collaborators: true,
        }),
      },
      {
        name: 'paidAccount',
        nodeToQueryParams: (node) => ({
          paidAccount: true,
          paidAccount_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'tags',
        nodeToQueryParams: () => ({
          tags: true,
        }),
      },
      {
        name: 'pluginData',
        nodeToQueryParams: () => ({
          organization_pluginData: true,
        }),
      },
      {
        name: 'exports',
        nodeToQueryParams: () => ({
          exports: true,
        }),
      },
      {
        name: 'plugins',
        nodeToQueryParams: (node, variables) => ({
          plugins: getArgument(node, 'filter', variables) || 'all',
        }),
        allowedQueryParamForSyncing: {
          plugins: ['all'],
        },
        nestedResources: [
          {
            name: 'enabledBoards',
            nodeToQueryParams: () => ({
              plugins_enabledBoards: true,
            }),
          },
        ],
      },
      {
        name: 'privateButlerButtons',
        nodeToQueryParams: () => ({
          privateButlerButtons: true,
        }),
      },
      {
        name: 'sharedButlerButtons',
        nodeToQueryParams: () => ({
          sharedButlerButtons: true,
        }),
      },
      {
        name: 'organizationViews',
        nodeToQueryParams: (node, variables) => ({
          organizationViews: getArgument(
            node,
            'organizationViewsFilter',
            variables,
          ),
          organizationViews_fields: getChildFieldNames(node),
          organizationViews_sortBy: getArgument(node, 'sortBy', variables),
          organizationViews_sortOrder: getArgument(
            node,
            'sortOrder',
            variables,
          ),
        }),
      },
      {
        name: 'domain',
        nodeToQueryParams: (node) => ({
          domain: true,
          domain_fields: getChildFieldNames(node),
        }),
      },
      {
        name: 'accessRequests',
        nodeToQueryParams: () => ({
          accessRequests: true,
        }),
      },
      {
        name: 'collaborators',
        nodeToQueryParams: () => ({
          collaborators: true,
        }),
      },
    ],
    fieldsWithNestedResources: [
      {
        name: 'memberships',
        nodeToQueryParams: (node, variables) => ({
          // TODO: have api use memberships_filter to follow patterns elsewhere
          memberships: getArgument(node, 'filter', variables),
        }),
        nestedResources: [
          {
            name: 'member',
            nodeToQueryParams: () => ({
              memberships_member: true,
            }),
          },
        ],
      },
    ],
  },
  {
    name: 'organizationView',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
    nestedResources: [
      {
        name: 'organization',
        nodeToQueryParams: (node) => ({
          organization: true,
          organization_fields: getChildFieldNames(node),
        }),
        nestedResources: [
          {
            name: 'enterprise',
            nodeToQueryParams: () => ({
              organization_enterprise: true,
            }),
          },
        ],
      },
    ],
  },
  {
    name: 'label',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
  },
  {
    name: 'enterprise',
    nestedResources: [
      {
        name: 'paidAccount',
        nodeToQueryParams: (node) => ({
          paidAccount: true,
          paidAccount_fields: getChildFieldNames(node),
        }),
      },
    ],
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
  },
  {
    name: 'search',
    nodeToQueryParams: (node, variables) => ({
      query: getArgument(node, 'query', variables),
      idBoards: getArgument(node, 'idBoards', variables),
      idOrganizations: getArgument(node, 'idOrganizations', variables),
      idCards: getArgument(node, 'idCards', variables),
      partial: getArgument(node, 'partial', variables),
    }),
    nestedResources: [
      {
        name: 'cards',
        nodeToQueryParams: (node, variables) => ({
          modelTypes: 'cards',
          card_fields: getChildFieldNames(node, ['labels']),
          cards_limit: getArgument(node, 'limit', variables),
          cards_page: getArgument(node, 'page', variables),
        }),
        allowedQueryParamForSyncing: {
          modelTypes: ['cards'],
        },
        nestedResources: [
          {
            name: 'board',
            nodeToQueryParams: (node) => ({
              card_board: true,
              board_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'list',
            nodeToQueryParams: () => ({ card_list: true }),
          },
          {
            name: 'members',
            nodeToQueryParams: (node) => ({
              card_members: true,
              member_fields: getChildFieldNames(node),
            }),
          },
          {
            name: 'attachments',
            nodeToQueryParams: (node, variables) => ({
              card_attachments: getArgument(node, 'filter', variables) || true,
            }),
            allowedQueryParamForSyncing: {
              card_attachments: [true],
            },
          },
          {
            name: 'stickers',
            nodeToQueryParams: () => ({
              card_stickers: true,
            }),
          },
        ],
      },
      {
        name: 'boards',
        nodeToQueryParams: (node, variables) => ({
          modelTypes: 'boards',
          board_fields: getChildFieldNames(node),
          boards_limit: getArgument(node, 'limit', variables),
        }),
        allowedQueryParamForSyncing: {
          modelTypes: ['boards'],
        },
        nestedResources: [
          {
            name: 'organization',
            nodeToQueryParams: (node) => ({
              board_organization: true,
              board_organization_fields: getChildFieldNames(node),
            }),
          },
        ],
      },
      {
        name: 'members',
        nodeToQueryParams: (node, variables) => ({
          modelTypes: 'members',
          member_fields: getChildFieldNames(node),
          members_limit: getArgument(node, 'limit', variables),
        }),
        allowedQueryParamForSyncing: {
          modelTypes: ['members'],
        },
      },
      {
        name: 'organizations',
        nodeToQueryParams: (node, variables) => ({
          modelTypes: 'organizations',
          organization_fields: getChildFieldNames(node),
          organizations_limit: getArgument(node, 'limit', variables),
        }),
        allowedQueryParamForSyncing: {
          modelTypes: ['organizations'],
        },
      },
    ],
  },
  {
    name: 'plugin',
    nodeToQueryParams: (node) => ({
      fields: getChildFieldNames(node),
    }),
    nestedResources: [
      {
        name: 'stats',
        nodeToQueryParams: (node) => ({
          stats: true,
        }),
      },
    ],
  },
  {
    name: 'customField',
    nodeToQueryParams: (node) => ({
      customField: true,
    }),
  },
  {
    name: 'domain',
    nodeToQueryParams: (node, variables) => ({
      fields: getChildFieldNames(node, ['organizations', 'stats']),
      limit: getArgument(node, 'limit', variables),
    }),
    nestedResources: [
      {
        name: 'organizations',
        nodeToQueryParams: (node, variables) => ({
          organizations: getArgument(node, 'filter', variables) || 'all',
          organization_fields: getChildFieldNames(node, [
            'credits',
            'memberships',
            'domainName',
            'stats',
          ]),
        }),
      },
      {
        name: 'stats',
        nodeToQueryParams: (node, variables) => ({
          stats_fields: getChildFieldNames(node, []),
        }),
      },
    ],
  },
];

/**
 * Find the node in VALID_NESTED_RESOURCES on a given 'path' down the tree
 */
export const getNestedResource = (
  path: string[],
  nestedResources: NestedResource[] = VALID_NESTED_RESOURCES,
  fieldsWithNestedResources?: NestedResource[],
): NestedResource | undefined => {
  let node = nestedResources.find((n) => n.name === path[0]);
  if (!node) {
    // if the node can't be found in nestedResources, try looking
    // in fieldsWithNestedResources
    node = fieldsWithNestedResources?.find((n) => n.name === path[0]);
    if (!node) {
      return undefined;
    }
  }

  if (path.length === 1) {
    return node;
  }

  return getNestedResource(
    path.slice(1),
    node.nestedResources,
    node.fieldsWithNestedResources,
  );
};
