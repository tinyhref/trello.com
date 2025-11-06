import { useMemberId } from '@trello/authentication';
import { getLocation } from '@trello/router';
import {
  getRouteIdFromPathname,
  isBoardRoute,
  isCardRoute,
} from '@trello/router/routes';
import { useWorkspace } from '@trello/workspaces';
import { useWorkspaceUserLimit } from '@trello/workspaces/user-limit';

import { useBoardIdFromBoardOrCardRoute } from 'app/src/components/Board/useBoardIdFromBoardOrCardRoute';
import { useWorkspaceUserLimitBoardBannerFragment } from './WorkspaceUserLimitBoardBannerFragment.generated';

interface HookResult {
  wouldRender: boolean;
}

export const useWorkspaceUserLimitBoardBanner = (): HookResult => {
  const memberId = useMemberId();
  const { workspaceId } = useWorkspace();
  const { isWorkspaceFree, isWorkspaceReadOnly, isUserWorkspaceMember } =
    useWorkspaceUserLimit({ workspaceId });

  const boardId = useBoardIdFromBoardOrCardRoute();
  const { data } = useWorkspaceUserLimitBoardBannerFragment({
    from: { id: boardId },
  });

  const isBoardOpen = !data?.closed;
  const isUserBoardMember = data?.members?.some(
    (member) => member.id === memberId,
  );
  const isUserWorkspaceOrBoardMember =
    isUserWorkspaceMember || isUserBoardMember;

  const { pathname } = getLocation();
  const routeId = getRouteIdFromPathname(pathname);
  const isBoardOrCard = isBoardRoute(routeId) || isCardRoute(routeId);

  const wouldRenderUserLimitBoardBanner =
    isWorkspaceFree &&
    isWorkspaceReadOnly &&
    isBoardOrCard &&
    isBoardOpen &&
    isUserWorkspaceOrBoardMember;

  if (wouldRenderUserLimitBoardBanner) {
    return { wouldRender: true };
  }

  return { wouldRender: false };
};
