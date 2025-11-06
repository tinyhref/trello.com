import { useCallback, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { getAddMembershipErrorType } from '@trello/business-logic/membership';
import { intl } from '@trello/i18n';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { showFlag } from '@trello/nachos/experimental-flags';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { ShowNewLicenseInviteErrFlag } from 'app/src/components/WorkspaceInviteModal/ShowNewLicenseInviteErrFlag';
import { useAddGuestMemberDetailsLazyQuery } from './AddGuestMemberDetailsQuery.generated';
import { useAddGuestToWorkspaceMutation } from './AddGuestToWorkspaceMutation.generated';
import { useAddGuestWorkspaceDetailsFragment } from './AddGuestWorkspaceDetailsFragment.generated';
import { RefetchWorkspaceGuestsDocument } from './RefetchWorkspaceGuestsQuery.generated';

export const useAddGuestToWorkspace = ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}) => {
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [addGuestToWorkspaceFn] = useAddGuestToWorkspaceMutation({
    refetchQueries: [
      {
        query: RefetchWorkspaceGuestsDocument,
        variables: {
          workspaceId,
        },
        context: {
          operationName: 'RefetchWorkspaceGuests',
          document: RefetchWorkspaceGuestsDocument,
        },
      },
    ],
  });
  const { data: workspaceData } = useAddGuestWorkspaceDetailsFragment({
    from: { id: workspaceId },
  });

  // TODO: convert this to client.query
  // eslint-disable-next-line @trello/prefer-client-query-over-lazy-query
  const [loadGuestMemberData] = useAddGuestMemberDetailsLazyQuery({
    variables: { id: memberId },
  });

  const addGuestToWorkspace = useCallback(
    async (onComplete?: () => void) => {
      setIsRequestPending(true);

      const { data } = await loadGuestMemberData();
      const memberData = data?.member;

      const dangerousFullName = dangerouslyConvertPrivacyString(
        memberData?.fullName,
      );
      const dangerousUsername = dangerouslyConvertPrivacyString(
        memberData?.username,
      );
      const userDisplayString = `${dangerousFullName} (${dangerousUsername})`;

      const traceId = Analytics.startTask({
        taskName: 'edit-organization/members/add',
        source: getScreenFromUrl(),
      });

      addGuestToWorkspaceFn({
        variables: { workspaceId, user: { id: memberId }, traceId },
      })
        .then((response) => {
          if (!response.data?.addMemberToOrg?.success) {
            throw new Error('Failed to add member');
          }
          Analytics.taskSucceeded({
            taskName: 'edit-organization/members/add',
            source: getScreenFromUrl(),
            traceId,
          });
          showFlag({
            id: 'manage-org-members',
            seed: memberId,
            title: intl.formatMessage(
              {
                id: 'adding members to workspace.added',
                defaultMessage: '{user} was added.',
                description: 'User was added message',
              },
              {
                user: userDisplayString,
              },
            ),
            appearance: 'success',
            isAutoDismiss: true,
            msTimeout: 8000,
          });
        })
        .catch((error) => {
          setIsRequestPending(false);
          Analytics.taskFailed({
            taskName: 'edit-organization/members/add',
            source: getScreenFromUrl(),
            traceId,
            error,
          });
          const errorType = getAddMembershipErrorType(error?.message ?? '');
          if (errorType === 'unauthorized-licensed-invite') {
            ShowNewLicenseInviteErrFlag(
              [userDisplayString],
              workspaceId,
              workspaceData?.prefs?.newLicenseInviteRestrictUrl,
            );
          } else {
            showFlag({
              id: 'manage-org-members',
              seed: memberId,
              title: intl.formatMessage(
                {
                  id: `adding members to workspace.${errorType}`,
                  defaultMessage: 'Error adding member',
                  description: 'Error title',
                },
                {
                  // eslint-disable-next-line formatjs/enforce-placeholders -- eslint thinks this may not get used, but its used in every string
                  user: userDisplayString,
                  // eslint-disable-next-line formatjs/enforce-placeholders -- depending on the error message this may or may not get used
                  workspaceMemberLimit:
                    workspaceData?.limits?.orgs?.totalMembersPerOrg?.disableAt,
                },
              ),
              appearance: 'error',
              isAutoDismiss: true,
              msTimeout: 8000,
            });
          }
        })
        .finally(() => {
          onComplete?.();
        });
    },
    [
      addGuestToWorkspaceFn,
      loadGuestMemberData,
      memberId,
      workspaceData?.limits?.orgs?.totalMembersPerOrg?.disableAt,
      workspaceData?.prefs?.newLicenseInviteRestrictUrl,
      workspaceId,
    ],
  );

  return {
    isRequestPending,
    addGuestToWorkspace,
  };
};
