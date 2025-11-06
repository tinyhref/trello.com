import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { getOrganizationBillingUrl } from '@trello/urls';

import { useDocumentTitle } from 'app/src/components/DocumentTitle';
import {
  useEligibleWorkspacesToUpgradeQuery,
  type EligibleWorkspaceToUpgrade,
} from './useEligibleWorkspacesToUpgradeQuery';
import { WorkspaceSelector } from './WorkspaceSelector';

import * as styles from './SelectWorkspaceToUpgrade.module.less';

export const SelectWorkspaceToUpgrade: FunctionComponent = () => {
  const intl = useIntl();

  useDocumentTitle(
    intl.formatMessage({
      id: 'templates.select_workspace_to_upgrade.select-a-workspace',
      defaultMessage: 'Select a Workspace to upgrade',
      description: 'Title for the select workspace to upgrade page',
    }),
  );

  const memberId = useMemberId();
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<EligibleWorkspaceToUpgrade | null>(null);

  const { workspaces, loading } = useEligibleWorkspacesToUpgradeQuery();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'selectWorkspaceToUpgradeScreen',
    });
  }, []);

  const handleSelectWorkspace = useCallback(
    (workspace: EligibleWorkspaceToUpgrade) => {
      setSelectedWorkspace(workspace);
    },
    [],
  );

  const handleUpgradeClick = useCallback(() => {
    if (!selectedWorkspace) {
      return;
    }
    Analytics.sendClickedButtonEvent({
      buttonName: 'upgradeButton',
      source: 'selectWorkspaceToUpgradeScreen',
      attributes: {
        workspaceId: selectedWorkspace.id,
      },
    });
    window.location.assign(getOrganizationBillingUrl(selectedWorkspace.name));
  }, [selectedWorkspace]);

  if (!memberId) {
    window.location.assign('/login?returnUrl=/select-team-to-upgrade');
    return null;
  }

  // Go directly to billing page if user only has one eligible workspace
  if (workspaces && workspaces.length === 1) {
    window.location.assign(getOrganizationBillingUrl(workspaces[0].name));
    return null;
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>
          <FormattedMessage
            id="templates.select_workspace_to_upgrade.select-a-workspace"
            defaultMessage="Select a Workspace to upgrade"
            description="Title for the select workspace to upgrade page"
          />
        </h1>
        <div className={styles.subText}>
          <FormattedMessage
            id="templates.select_workspace_to_upgrade.plans-applied-to-workspace"
            defaultMessage="Trello plans are applied to a single Workspace. Choose the free or Standard Workspace you’d like to upgrade."
            description="Subtext for the select workspace to upgrade page"
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.listBoxContainer}>
          <WorkspaceSelector
            selectedOrgId={selectedWorkspace?.id}
            organizations={workspaces ?? []}
            onSelectOrg={handleSelectWorkspace}
          />
        </div>
      )}

      {!loading && (
        <div className={styles.upgradeButtonContainer}>
          <Button
            appearance="primary"
            isDisabled={!selectedWorkspace}
            onClick={handleUpgradeClick}
          >
            <FormattedMessage
              id="templates.select_workspace_to_upgrade.upgrade"
              defaultMessage="Upgrade"
              description="Button to upgrade a workspace"
            />
          </Button>
        </div>
      )}
    </div>
  );
};
