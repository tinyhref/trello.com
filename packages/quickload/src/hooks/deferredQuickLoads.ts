import { Deferred } from '@trello/deferred';

import type { QuickLoadOperations } from '../operation-to-quickload-url.generated';

export const deferredQuickLoads: Record<
  QuickLoadOperations,
  Deferred<null> | null
> = {
  CurrentBoardInfo: new Deferred(),
  CurrentBoardListsCards: new Deferred(),
  MemberHeader: null,
  MemberBoardsHome: null,
  MemberBoards: null,
  TrelloMemberBoards: null,
  TrelloCurrentBoardInfo: new Deferred(),
  TrelloCurrentBoardListsCards: new Deferred(),
  MemberQuickBoards: null,
  QuickBoardsSearch: null,
  PreloadCard: null,
  OrganizationBillingPage: null,
  TrelloBoardMirrorCards: new Deferred(),
  WorkspaceBoardsPageMinimal: null,
  WorkspaceHomePageMinimal: null,
};
