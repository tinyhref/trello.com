import { CurrentBoardInfoDocument } from './queries/CurrentBoardInfoQuery.generated';
import { CurrentBoardListsCardsDocument } from './queries/CurrentBoardListsCardsQuery.generated';
import { MemberBoardsHomeDocument } from './queries/MemberBoardsHomeQuery.generated';
import { MemberBoardsDocument } from './queries/MemberBoardsQuery.generated';
import { MemberHeaderDocument } from './queries/MemberHeaderQuery.generated';
import { MemberQuickBoardsDocument } from './queries/MemberQuickBoardsQuery.generated';
import { OrganizationBillingPageDocument } from './queries/OrganizationBillingPageQuery.generated';
import { PreloadCardDocument } from './queries/PreloadCardQuery.generated';
import { QuickBoardsSearchDocument } from './queries/QuickBoardsSearchQuery.generated';
import { TrelloBoardMirrorCardsDocument } from './queries/TrelloBoardMirrorCardsQuery.generated';
import { TrelloCurrentBoardInfoDocument } from './queries/TrelloCurrentBoardInfoQuery.generated';
import { TrelloCurrentBoardListsCardsDocument } from './queries/TrelloCurrentBoardListsCardsQuery.generated';
import { TrelloMemberBoardsDocument } from './queries/TrelloMemberBoardsQuery.generated';
import { WorkspaceBoardsPageMinimalDocument } from './queries/WorkspaceBoardsPageMinimalQuery.generated';
import { WorkspaceHomePageMinimalDocument } from './queries/WorkspaceHomePageMinimalQuery.generated';
import type { RouteQueries } from './quickload.types';

export const Requests: RouteQueries = {
  header: {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Members/:idMember',
        query: MemberHeaderDocument,
        rootId: ':idMember',
        modelName: 'Member',
      },
      {
        apiUrl: '/1/Members/:idMember',
        query: MemberBoardsDocument,
        rootId: ':idMember',
        modelName: 'Member',
      },
      {
        apiUrl: '/gateway/api/graphql',
        query: TrelloMemberBoardsDocument,
        rootId: ':idMember',
        modelName: 'TrelloMember',
        useGraphQLNativeApi: true,
      },
    ],
  },
  '^/b/([^/]+)': {
    taskName: 'view-board',
    requests: [
      {
        apiUrl: '/1/Boards/:idBoard',
        query: CurrentBoardInfoDocument,
        rootId: ':idBoard',
        modelName: 'Board',
      },
      {
        apiUrl: '/1/Boards/:idBoard',
        query: CurrentBoardListsCardsDocument,
        rootId: ':idBoard',
        modelName: 'Board',
      },
      {
        apiUrl: '/gateway/api/graphql',
        query: TrelloCurrentBoardInfoDocument,
        rootId: ':idBoard',
        modelName: 'TrelloBoard',
        useGraphQLNativeApi: true,
        dynamicConfig: {
          key: 'trello_web_native_current_board_info',
          value: true,
        },
      },
      {
        apiUrl: '/gateway/api/graphql',
        query: TrelloCurrentBoardListsCardsDocument,
        rootId: ':idBoard',
        modelName: 'TrelloBoard',
        useGraphQLNativeApi: true,
        dynamicConfig: {
          key: 'trello_web_native_current_board_lists_cards',
          value: true,
        },
      },
      {
        apiUrl: '/gateway/api/graphql',
        query: TrelloBoardMirrorCardsDocument,
        rootId: ':idBoard',
        modelName: 'TrelloBoard',
        useGraphQLNativeApi: true,
      },
    ],
  },
  '^//([^/]*([^/]+))$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Members/:idMember',
        query: MemberQuickBoardsDocument,
        rootId: ':idMember',
        modelName: 'Member',
      },
      {
        apiUrl: '/1/Search',
        query: QuickBoardsSearchDocument,
        rootId: ':searchTerm',
        appendRootIdToUrl: false,
        modelName: 'Search',
      },
    ],
  },
  '^/search': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Members/:idMember',
        query: MemberQuickBoardsDocument,
        rootId: ':idMember',
        modelName: 'Member',
      },
    ],
  },
  '^//$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Members/:idMember',
        query: MemberQuickBoardsDocument,
        rootId: ':idMember',
        modelName: 'Member',
      },
    ],
  },
  '^/c/([^/]+)': {
    taskName: 'view-board', // full page loads to the cardback are traced as view-board
    requests: [
      {
        apiUrl: '/1/Cards/:idCard',
        query: PreloadCardDocument,
        rootId: ':idCard',
        modelName: 'Card',
      },
    ],
    deferredPreloads: ['CurrentBoardInfo', 'CurrentBoardListsCards'],
  },
  // trello.com/w/:orgname/billing
  '^/w/([^/]+)/billing$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Organizations/:idOrganization',
        query: OrganizationBillingPageDocument,
        rootId: ':idOrganization',
        modelName: 'Organization',
      },
    ],
  },
  // trello.com/:orgname/billing (deprecated)
  '^/([^/]+)/billing$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Organizations/:idOrganization',
        query: OrganizationBillingPageDocument,
        rootId: ':idOrganization',
        modelName: 'Organization',
      },
    ],
  },
  // trello.com/w/:orgname
  '^/w/(?!search)(?!welcome-to-trello)(?!blank)(?!shortcuts)(?!templates)(?!redeem)([^/]+)$':
    {
      taskName: null,
      requests: [
        {
          apiUrl: '/1/Organizations/:idOrganization',
          query: WorkspaceBoardsPageMinimalDocument,
          rootId: ':idOrganization',
          modelName: 'Organization',
        },
      ],
    },
  // trello.com/:orgname
  '^/(?!search)(?!welcome-to-trello)(?!blank)(?!shortcuts)(?!templates)(?!redeem)([^/]+)$':
    {
      taskName: null,
      requests: [
        {
          apiUrl: '/1/Organizations/:idOrganization',
          query: WorkspaceBoardsPageMinimalDocument,
          rootId: ':idOrganization',
          modelName: 'Organization',
        },
      ],
    },
  // trello.com/w/:orgname/home
  '^/w/([^/]+)/home$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Organizations/:idOrganization',
        query: WorkspaceHomePageMinimalDocument,
        rootId: ':idOrganization',
        modelName: 'Organization',
      },
    ],
  },
  // trello.com/:orgname/home
  '^/([^/]+)/home$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Organizations/:idOrganization',
        query: WorkspaceHomePageMinimalDocument,
        rootId: ':idOrganization',
        modelName: 'Organization',
      },
    ],
  },
  // trello.com/u/:username/boards
  '^/u/([^/]+)/boards$': {
    taskName: null,
    requests: [
      {
        apiUrl: '/1/Members/:idMember',
        query: MemberBoardsHomeDocument,
        rootId: ':idMember',
        modelName: 'Member',
      },
    ],
  },
};
