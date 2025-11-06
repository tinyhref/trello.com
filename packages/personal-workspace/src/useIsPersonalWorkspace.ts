import { useCallback, useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useWorkspaceId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';

import { cachedPersonalWorkspaceIdsState } from './cachedPersonalWorkspaceIdsState';
import { useWorkspaceTypeQuery } from './WorkspaceTypeQuery.generated';

/**
 * Compares the workspace id against the cached member's inbox ids, and the workspaces type,
 * to determine if the workspace is a personal workspace.
 *
 * @param {object} - The parameters containing the workspace id and member id.
 * @returns {boolean} - true if the workspace is a personal workspace, false otherwise.
 */
export const useIsPersonalWorkspacePassContextVals = ({
  workspaceId,
  memberId,
}: {
  workspaceId: string | null;
  memberId: string | null;
}) => {
  const { data: wsData } = useWorkspaceTypeQuery({
    variables: { workspaceId: workspaceId ?? '' },
    waitOn: [],
    skip: !workspaceId,
  });

  const cachedInboxWSId = useSharedStateSelector(
    cachedPersonalWorkspaceIdsState,
    useCallback((state) => state[memberId ?? '']?.idOrganization, [memberId]),
  );

  const isWsPersonal = useMemo(() => {
    if (!workspaceId || !memberId) {
      return false;
    }

    return (
      cachedInboxWSId === workspaceId ||
      wsData?.organization?.type === 'personal'
    );
  }, [cachedInboxWSId, memberId, workspaceId, wsData?.organization?.type]);

  return isWsPersonal;
};

/**
 * Wraps the useIsPersonalWorkspacePassContextVals function passing in the member id
 * from context to provide a more convenient hook.
 *
 * @param workspaceId - The workspace id to check.
 * @returns {boolean} - true if the workspace is a personal workspace, false otherwise.
 */
export const useIsPersonalWorkspaceWithId = (workspaceId: string | null) => {
  const memberId = useMemberId();
  return useIsPersonalWorkspacePassContextVals({ workspaceId, memberId });
};

/**
 * Wraps the useIsPersonalWorkspaceWithId function passing in the workspace id
 * from context to provide the most convenient hook.
 *
 * @returns {boolean} - true if the workspace is a personal workspace, false otherwise.
 */
export const useIsPersonalWorkspace = () => {
  const workspaceId = useWorkspaceId();
  return useIsPersonalWorkspaceWithId(workspaceId);
};
