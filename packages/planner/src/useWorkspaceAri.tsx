import { useMemo } from 'react';

import { useMemberNodeId } from '@trello/business-logic-react/member';

import { usePlannerWorkspaceIdFragment } from './PlannerWorkspaceIdFragment.generated';

interface WorkspaceInfo {
  workspaceAri: string;
  workspaceId: string | null | undefined;
}

/**
 * Custom hook to retrieve the workspace ARI (Atlassian Resource Identifier) and ID for the current member.
 *
 * This hook uses the member's node ID to fetch the planner workspace information and extract both the
 * full workspace ARI and the workspace ID. The return value is memoized to prevent unnecessary re-renders.
 *
 * @returns {WorkspaceInfo} An object containing:
 *   - workspaceAri: The full workspace ARI string (e.g. "ari:cloud:trello::workspace/workspace1")
 *   - workspaceId: The workspace ID extracted from the ARI (e.g. "workspace1")
 *
 * @example
 * const { workspaceAri, workspaceId } = useWorkspaceAri();
 * // workspaceAri: "ari:cloud:trello::workspace/workspace1"
 * // workspaceId: "workspace1"
 */
export const useWorkspaceAri = (): WorkspaceInfo => {
  const memberNodeId = useMemberNodeId();

  const { data } = usePlannerWorkspaceIdFragment({
    from: { id: memberNodeId },
    optimistic: true,
  });

  return useMemo(() => {
    const workspaceAri = data?.planner?.workspace?.id || '';
    // Extract just the ID part from the ARI (e.g. "workspace1" from "ari:cloud:trello::workspace/workspace1")
    const workspaceId = workspaceAri.split('/').pop() || '';

    return {
      workspaceAri,
      workspaceId,
    };
  }, [data?.planner?.workspace?.id]);
};
