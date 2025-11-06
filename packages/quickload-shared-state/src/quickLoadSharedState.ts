import type { QuickLoadOperations } from '@trello/quickload';
import { SharedState } from '@trello/shared-state';

export const quickLoadSharedState = new SharedState<{
  isLoading: boolean;
  routeToLoadingState: Record<QuickLoadOperations, boolean>;
}>({
  isLoading: true,
  routeToLoadingState: {
    MemberHeader: false,
    MemberBoardsHome: false,
    MemberBoards: false,
    TrelloMemberBoards: false,
    CurrentBoardInfo: false,
    CurrentBoardListsCards: false,
    TrelloCurrentBoardInfo: false,
    TrelloCurrentBoardListsCards: false,
    MemberQuickBoards: false,
    QuickBoardsSearch: false,
    PreloadCard: false,
    OrganizationBillingPage: false,
    WorkspaceBoardsPageMinimal: false,
    TrelloBoardMirrorCards: false,
    WorkspaceHomePageMinimal: false,
  },
});
