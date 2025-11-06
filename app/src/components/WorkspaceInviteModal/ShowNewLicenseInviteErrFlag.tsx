import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';
import type { PIIString } from '@trello/privacy';
import type { TeamTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

const reportClickEvent = () => {
  Analytics.sendClickedLinkEvent({
    source: 'workspaceInviteModal',
    linkName: 'workspaceInviteModalError',
  });
};

export const getDescription = (
  members: (PIIString | string)[],
  newLicenseInviteRestrictUrl: string | null | undefined,
) => {
  return (
    <div>
      {members?.length > 1 && (
        <div>
          {members.map((member, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <Fragment key={index}>
              {member}
              <br />
            </Fragment>
          ))}
          <br />
        </div>
      )}
      <div>
        <FormattedMessage
          id="templates.workspace_invite.error-unauthorized-description"
          defaultMessage="To invite them to your Workspace, ask an Enterprise Admin to invite them instead."
          description="Error message description when a user tries to invite a non-enterprise member to a workspace"
        />
      </div>
      {newLicenseInviteRestrictUrl && (
        <>
          <br />
          <a
            href={newLicenseInviteRestrictUrl}
            onClick={reportClickEvent}
            target="_blank"
            data-testid={getTestId<TeamTestIds>('team-invite-error-link')}
          >
            <FormattedMessage
              id="templates.workspace_invite.request-access-link"
              defaultMessage="Learn how to request access"
              description="Link to learn how to request access to invite non-enterprise members"
            />
          </a>
        </>
      )}
    </div>
  );
};

export function ShowNewLicenseInviteErrFlag(
  members: (PIIString | string)[],
  workspaceId: string,
  newLicenseInviteRestrictUrl: string | null | undefined,
) {
  const title =
    members?.length === 1
      ? intl.formatMessage(
          {
            id: 'templates.workspace_invite.error-unauthorized-invite',
            defaultMessage:
              "{user} can't be invited because they are not an Enterprise member",
            description:
              'Error message when a user tries to invite a non-enterprise member to a workspace',
          },
          {
            user: members[0],
          },
        )
      : intl.formatMessage({
          id: 'templates.workspace_invite.error-unauthorized-invite-many',
          defaultMessage:
            "These users can't be invited because they are not Enterprise members",
          description:
            'Error message when a user tries to invite multiple non-enterprise members to a workspace',
        });

  const description = getDescription(members, newLicenseInviteRestrictUrl);
  Analytics.sendTrackEvent({
    action: 'failed',
    actionSubject: 'workspaceInvitation',
    source: 'workspaceInviteModal',
    containers: {
      workspace: {
        id: workspaceId,
      },
    },
    attributes: {
      numInvited: members.length,
    },
  });

  showFlag({
    id: 'WorkspaceInviteModalError',
    seed:
      members.join() +
      '-' +
      'Unauthorized to grant licenses to non-enterprise members',
    title,
    description,
    appearance: 'error',
    isAutoDismiss: false,
    msTimeout: 8000,
  });
}
