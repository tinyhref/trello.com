import { useMemberId } from '@trello/authentication';
import { isWorkspaceReadOnly } from '@trello/business-logic/organization';
import { Entitlements } from '@trello/entitlements';

import { useWorkspaceUserLimitFragment } from './WorkspaceUserLimitFragment.generated';
import { useWorkspaceUserLimitQuery } from './WorkspaceUserLimitQuery.generated';

interface Options {
  workspaceId: string | null;
}

export interface WorkspaceUserLimit {
  workspaceName: string;
  collaboratorCount: number;
  isWorkspaceFree: boolean;
  isWorkspaceReadOnly: boolean;
  isBelowLimit: boolean;
  isApproachingLimit: boolean;
  isAtLimit: boolean;
  isOverLimit: boolean;
  isUserWorkspaceMember: boolean;
  maxCollaboratorCount: number;
}

export const useWorkspaceUserLimit = ({
  workspaceId,
}: Options): WorkspaceUserLimit => {
  const memberId = useMemberId();

  const { data } = useWorkspaceUserLimitFragment({
    from: { id: workspaceId || null },
  });

  const workspaceName = data?.name ?? '';
  const limits = data?.limits;
  const offering = data?.offering;

  const usersPerFreeOrg = limits?.orgs?.usersPerFreeOrg;
  const isWorkspaceFree = offering ? Entitlements.isFree(offering) : true;
  const status = usersPerFreeOrg?.status ?? 'ok';
  const disableAt = usersPerFreeOrg?.disableAt ?? 10;
  // count of total collaborators in the workspace (workspace members + workspace guests)
  const collaboratorCount = usersPerFreeOrg?.count ?? 0;

  const shouldSkipQuery = !workspaceId || !isWorkspaceFree;
  const { data: queryData } = useWorkspaceUserLimitQuery({
    variables: { workspaceId: workspaceId ?? '' },
    skip: shouldSkipQuery,
    waitOn: ['None'],
  });

  const isUserWorkspaceMember = !!queryData?.organization?.members?.some(
    (member) => member.id === memberId,
  );

  const isReadOnly = isWorkspaceReadOnly(offering, status);

  return {
    workspaceName,
    collaboratorCount,
    isWorkspaceFree,
    isWorkspaceReadOnly: isReadOnly,
    isBelowLimit: status === 'ok',
    isApproachingLimit: status === 'warn',
    isAtLimit: status === 'disabled',
    isOverLimit: status === 'maxExceeded',
    isUserWorkspaceMember,
    maxCollaboratorCount: disableAt,
  };
};
