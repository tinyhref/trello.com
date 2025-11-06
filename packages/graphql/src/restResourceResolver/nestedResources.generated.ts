// This is a generated file. Run "npm -w @trello/graphql run generate-static-resolver-info" if it needs to be updated.
import type { GeneratedNestedResource } from './queryParsing';

export const GENERATED_NESTED_RESOURCES: GeneratedNestedResource[] = [
  {
    name: 'action',
    nestedResources: [
      {
        name: 'memberCreator',
      },
    ],
  },
  {
    name: 'board',
    nestedResources: [
      {
        name: 'actions',
        nestedResources: [
          {
            name: 'memberCreator',
          },
          {
            name: 'reactions',
            nestedResources: [
              {
                name: 'member',
              },
            ],
          },
        ],
      },
      {
        name: 'enterprise',
      },
      {
        name: 'recommendedMembers',
      },
      {
        name: 'butlerButtonLimit',
      },
      {
        name: 'privateButlerButtons',
      },
      {
        name: 'sharedButlerButtons',
      },
      {
        name: 'butlerButtonOverrides',
      },
      {
        name: 'boardPlugins',
      },
      {
        name: 'cards',
        nestedResources: [
          {
            name: 'attachments',
          },
          {
            name: 'checklists',
            nestedResources: [
              {
                name: 'checkItems',
              },
            ],
          },
          {
            name: 'customFieldItems',
          },
          {
            name: 'labels',
          },
          {
            name: 'stickers',
          },
          {
            name: 'pluginData',
          },
        ],
      },
      {
        name: 'customFields',
      },
      {
        name: 'dashboardViewTiles',
      },
      {
        name: 'lists',
      },
      {
        name: 'related',
      },
      {
        name: 'labels',
      },
      {
        name: 'members',
      },
      {
        name: 'membershipCounts',
      },
      {
        name: 'myPrefs',
      },
      {
        name: 'organization',
        nestedResources: [
          {
            name: 'enterprise',
          },
          {
            name: 'pluginData',
          },
          {
            name: 'tags',
          },
          {
            name: 'memberships',
          },
        ],
      },
      {
        name: 'plugins',
      },
      {
        name: 'pluginData',
      },
      {
        name: 'starCounts',
      },
      {
        name: 'accessRequests',
      },
    ],
  },
  {
    name: 'checklist',
    nestedResources: [
      {
        name: 'checkItems',
      },
      {
        name: 'cards',
      },
    ],
  },
  {
    name: 'card',
    nestedResources: [
      {
        name: 'checklists',
        nestedResources: [
          {
            name: 'checkItems',
          },
        ],
      },
      {
        name: 'customFields',
      },
      {
        name: 'customFieldItems',
      },
      {
        name: 'board',
      },
      {
        name: 'labels',
      },
      {
        name: 'list',
      },
      {
        name: 'members',
      },
      {
        name: 'attachments',
      },
      {
        name: 'pluginData',
      },
      {
        name: 'stickers',
      },
      {
        name: 'membersVoted',
      },
    ],
  },
  {
    name: 'list',
    nestedResources: [
      {
        name: 'cards',
      },
      {
        name: 'board',
      },
    ],
  },
  {
    name: 'member',
    nestedResources: [
      {
        name: 'campaigns',
      },
      {
        name: 'domain',
      },
      {
        name: 'cards',
        nestedResources: [
          {
            name: 'members',
          },
          {
            name: 'attachments',
          },
          {
            name: 'checklists',
            nestedResources: [
              {
                name: 'checkItems',
              },
            ],
          },
        ],
      },
      {
        name: 'organizations',
        nestedResources: [
          {
            name: 'enterprise',
          },
          {
            name: 'paidAccount',
          },
          {
            name: 'plugins',
          },
          {
            name: 'domain',
          },
          {
            name: 'memberships',
          },
        ],
      },
      {
        name: 'boards',
        nestedResources: [
          {
            name: 'organization',
            nestedResources: [
              {
                name: 'domain',
              },
            ],
          },
          {
            name: 'memberships',
          },
          {
            name: 'lists',
          },
        ],
      },
      {
        name: 'boardStars',
      },
      {
        name: 'credits',
      },
      {
        name: 'customStickers',
      },
      {
        name: 'boardBackgrounds',
      },
      {
        name: 'logins',
      },
      {
        name: 'enterprises',
      },
      {
        name: 'enterpriseLicenses',
      },
      {
        name: 'enterpriseWithRequiredConversion',
      },
      {
        name: 'paidAccount',
      },
      {
        name: 'pluginData',
      },
      {
        name: 'savedSearches',
      },
      {
        name: 'tokens',
      },
      {
        name: 'credentials',
      },
      {
        name: 'sessions',
      },
      {
        name: 'inbox',
        nestedResources: [
          {
            name: 'board',
          },
        ],
      },
      {
        name: 'cohorts',
      },
    ],
  },
  {
    name: 'organization',
    nestedResources: [
      {
        name: 'boards',
        nestedResources: [
          {
            name: 'lists',
          },
          {
            name: 'labels',
          },
          {
            name: 'starCounts',
          },
          {
            name: 'membershipCounts',
          },
          {
            name: 'boardPlugins',
          },
          {
            name: 'members',
          },
        ],
      },
      {
        name: 'members',
      },
      {
        name: 'enterprise',
      },
      {
        name: 'collaborators',
      },
      {
        name: 'paidAccount',
      },
      {
        name: 'tags',
      },
      {
        name: 'pluginData',
      },
      {
        name: 'exports',
      },
      {
        name: 'plugins',
        nestedResources: [
          {
            name: 'enabledBoards',
          },
        ],
      },
      {
        name: 'privateButlerButtons',
      },
      {
        name: 'sharedButlerButtons',
      },
      {
        name: 'organizationViews',
      },
      {
        name: 'domain',
      },
      {
        name: 'accessRequests',
      },
      {
        name: 'collaborators',
      },
    ],
  },
  {
    name: 'organizationView',
    nestedResources: [
      {
        name: 'organization',
        nestedResources: [
          {
            name: 'enterprise',
          },
        ],
      },
    ],
  },
  {
    name: 'label',
  },
  {
    name: 'enterprise',
    nestedResources: [
      {
        name: 'paidAccount',
      },
    ],
  },
  {
    name: 'search',
    nestedResources: [
      {
        name: 'cards',
        nestedResources: [
          {
            name: 'board',
          },
          {
            name: 'list',
          },
          {
            name: 'members',
          },
          {
            name: 'attachments',
          },
          {
            name: 'stickers',
          },
        ],
      },
      {
        name: 'boards',
        nestedResources: [
          {
            name: 'organization',
          },
        ],
      },
      {
        name: 'members',
      },
      {
        name: 'organizations',
      },
    ],
  },
  {
    name: 'plugin',
    nestedResources: [
      {
        name: 'stats',
      },
    ],
  },
  {
    name: 'customField',
  },
  {
    name: 'domain',
    nestedResources: [
      {
        name: 'organizations',
      },
      {
        name: 'stats',
      },
    ],
  },
];
