import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { getPaidStatus } from '@trello/business-logic/organization';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';

import { useAddGuestWorkspaceDetailsFragment } from './AddGuestWorkspaceDetailsFragment.generated';
import { useAddGuestToWorkspace } from './useAddGuestToWorkspace';

import * as styles from './AddGuestToWorkspacePopoverContent.module.less';

interface AddGuestToWorkspacePopoverContentProps {
  workspaceId: string;
  memberId: string;
  hide: () => void;
}

export const AddGuestToWorkspacePopoverContent: FunctionComponent<
  AddGuestToWorkspacePopoverContentProps
> = ({ workspaceId, memberId, hide }) => {
  const { data: workspaceData } = useAddGuestWorkspaceDetailsFragment({
    from: { id: workspaceId },
  });
  const paidStatus = getPaidStatus(workspaceData?.offering ?? '');

  const { addGuestToWorkspace, isRequestPending } = useAddGuestToWorkspace({
    workspaceId,
    memberId,
  });

  const handleClick = useCallback(() => {
    addGuestToWorkspace(hide);
  }, [addGuestToWorkspace, hide]);

  return (
    <div>
      <p className={styles.disclaimerMessage}>
        <FormattedMessage
          id={`templates.popover_add_to_team.add to team ${paidStatus}`}
          defaultMessage="Adding people to your Premium Workspace will update your billing automatically."
          description="Disclaimer for adding guests to a Workspace based on the workspace type (Standard, Premium, or Enterprise)."
        />
      </p>
      <Button
        appearance="primary"
        size="fullwidth"
        className={styles.addToWorkspaceButton}
        isDisabled={isRequestPending}
        onClick={handleClick}
      >
        {isRequestPending ? (
          <Spinner inline small />
        ) : (
          <FormattedMessage
            id={'templates.popover_add_to_team.add to team-cta'}
            defaultMessage="Add to Workspace"
            description="Call to action to add guests to a Workspace."
          />
        )}
      </Button>
    </div>
  );
};
