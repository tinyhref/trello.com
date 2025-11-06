import { useCallback } from 'react';

import { validateEmail } from '@trello/emails';
import { Entitlements } from '@trello/entitlements';

import { useWouldPushWorkspaceOverLimitFragment } from './WouldPushWorkspaceOverLimitFragment.generated';
import { useWouldPushWorkspaceOverLimitQuery } from './WouldPushWorkspaceOverLimitQuery.generated';

/**
 * Determines whether inviting the user indicated by the potentialMemberId
 * would push the workspace over the user limit by returning true or false.
 * Function will check if the collaborator count would be pushed over the limit,
 * then check if the user is already a member or a guest. If the user is already a
 * member or guest, even if the invite would have pushed the workspace over the limit,
 * the function will return false. If neither Prevent or Enable are enabled, the function
 * will always return false.
 * @param {string} workspaceId the workspace ID of the workspace that the user would be invited to
 * @returns {(potentialMemberId: string, selectedMemberKeys?: string[], isWorkspaceCreation?: boolean) => boolean} whether the invite would push the workspace over the limit
 */
export const useWouldPushWorkspaceOverLimit = ({
  workspaceId,
}: {
  workspaceId: string | null;
}) => {
  const { data } = useWouldPushWorkspaceOverLimitFragment({
    from: { id: workspaceId },
  });

  const limits = data?.limits;
  const offering = data?.offering;

  const usersPerFreeOrg = limits?.orgs?.usersPerFreeOrg;
  const disableAt = usersPerFreeOrg?.disableAt ?? 10;
  const collaboratorCount = usersPerFreeOrg?.count ?? 0;

  const isWorkspaceFree = offering ? Entitlements.isFree(offering) : true;

  const shouldSkipQuery = !workspaceId || !isWorkspaceFree;
  const { data: queryData } = useWouldPushWorkspaceOverLimitQuery({
    variables: { workspaceId: workspaceId ?? '' },
    skip: shouldSkipQuery,
    waitOn: ['None'],
  });

  const wouldPushWorkspaceOverLimit = useCallback(
    (
      potentialMemberId: string,
      selectedMemberKeys?: string[],
      isWorkspaceCreation?: boolean,
    ) => {
      if (!isWorkspaceFree) {
        return false;
      }

      const newSelectedMemberCount = selectedMemberKeys?.filter((memberKey) => {
        const isEmail = validateEmail(memberKey);

        if (isEmail) {
          return true;
        }

        const isIdWorkspaceMember = queryData?.organization?.members?.some(
          (member) => memberKey === member.id,
        );
        const isIdWorkspaceGuest = queryData?.organization?.collaborators?.some(
          (guest) => memberKey === guest.id,
        );

        return !isIdWorkspaceGuest && !isIdWorkspaceMember;
      }).length;

      const createdWorkspaceCollaboratorCount = isWorkspaceCreation
        ? 1
        : collaboratorCount;
      const createdWorkspaceDisableAt = disableAt ?? 10;

      const wouldInvitePushWorkspaceOverDisableAt =
        createdWorkspaceCollaboratorCount + (newSelectedMemberCount ?? 0) + 1 >
        createdWorkspaceDisableAt;

      const isPotentialMemberWorkspaceMember =
        queryData?.organization?.members?.some(
          (member) => member.id === potentialMemberId,
        );

      const isPotentialMemberWorkspaceGuest =
        queryData?.organization?.collaborators?.some(
          (guest) => guest?.id === potentialMemberId,
        );

      const isAlreadyCollaborator =
        isPotentialMemberWorkspaceMember || isPotentialMemberWorkspaceGuest;
      if (
        wouldInvitePushWorkspaceOverDisableAt &&
        (!potentialMemberId || !isAlreadyCollaborator)
      ) {
        return true;
      }

      return false;
    },
    [
      collaboratorCount,
      disableAt,
      isWorkspaceFree,
      queryData?.organization?.collaborators,
      queryData?.organization?.members,
    ],
  );

  return wouldPushWorkspaceOverLimit;
};
