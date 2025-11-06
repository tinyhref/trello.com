import {
  useBoardId,
  useEnterpriseId,
  useWorkspaceId,
} from '@trello/id-context';

import { useRedirectToBoardRequestAccessOverlay } from './useRedirectToBoardRequestAccessOverlay';
import { useRedirectToBoardShareOverlay } from './useRedirectToBoardShareOverlay';
import { useRedirectToJoinBoardOverlay } from './useRedirectToJoinBoardOverlay';

export const RedirectToBoardOverlay = () => {
  const enterpriseId = useEnterpriseId();
  const workspaceId = useWorkspaceId();
  const boardId = useBoardId();

  useRedirectToJoinBoardOverlay(boardId);
  useRedirectToBoardShareOverlay(workspaceId, enterpriseId);
  useRedirectToBoardRequestAccessOverlay(workspaceId, enterpriseId);

  return null;
};
