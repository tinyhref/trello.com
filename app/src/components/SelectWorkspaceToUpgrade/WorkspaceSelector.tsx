import cx from 'classnames';
import type { ChangeEventHandler, FunctionComponent } from 'react';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { SearchIcon } from '@trello/nachos/icons/search';
import { Textfield } from '@trello/nachos/textfield';
import { getTestId } from '@trello/test-ids';
import type { WorkspaceSelectorTestIds } from '@trello/test-ids';
import { token } from '@trello/theme';
import { useLazyComponent } from '@trello/use-lazy-component';

import { hasAlreadyUsedTrial } from 'app/src/components/FreeTrial/useStartFreeTrialForOrg';
import { LazyInviteTeamMembersForm } from 'app/src/components/InviteTeamMembers';
import type { EligibleWorkspaceToUpgrade } from './useEligibleWorkspacesToUpgradeQuery';
import { WorkspaceListItem } from './WorkspaceListItem';

import * as styles from './WorkspaceSelector.module.less';

interface WorkspaceSelectorProps {
  selectedOrgId: string | undefined;
  organizations: EligibleWorkspaceToUpgrade[];
  onSelectOrg: (workspace: EligibleWorkspaceToUpgrade) => void;
  groupByTrialEligibility?: boolean;
}

const isEligibleForTrial = (workspace: EligibleWorkspaceToUpgrade) => {
  return !hasAlreadyUsedTrial(workspace.credits ?? []);
};

export const WorkspaceSelector: FunctionComponent<WorkspaceSelectorProps> = ({
  selectedOrgId,
  organizations,
  onSelectOrg,
  groupByTrialEligibility = false,
}) => {
  /**
   * Create overlay logic
   */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const openModal = useCallback(
    () => setShowCreateModal(true),
    [setShowCreateModal],
  );
  const closeModal = useCallback(
    () => setShowCreateModal(false),
    [setShowCreateModal],
  );

  const CreateWorkspaceOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-team-overlay" */ 'app/src/components/CreateTeamOverlay'
      ),
    {
      preload: false,
      namedImport: 'CreateTeamOverlay',
    },
  );

  /**
   * Filter logic
   */
  const [search, setSearch] = useState('');
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => setSearch(target.value),
    [setSearch],
  );

  const showCreateWorkspace = organizations.length === 0;
  const filteredOrgs = useMemo(() => {
    if (groupByTrialEligibility) {
      return [];
    }
    return organizations.filter((org) =>
      org.displayName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [organizations, search, groupByTrialEligibility]);

  const groupedOrgs = useMemo(() => {
    if (!groupByTrialEligibility) {
      return {
        eligible: [],
        ineligible: [],
      };
    }
    return organizations.reduce(
      (result, org) => {
        if (org.displayName.toLowerCase().includes(search.toLowerCase())) {
          if (isEligibleForTrial(org)) {
            result.eligible.push(org);
          } else {
            result.ineligible.push(org);
          }
        }

        return result;
      },
      { eligible: [], ineligible: [] } as {
        eligible: EligibleWorkspaceToUpgrade[];
        ineligible: EligibleWorkspaceToUpgrade[];
      },
    );
  }, [organizations, search, groupByTrialEligibility]);

  /**
   * If there are no workspaces, render an empty state that prompts the user
   * to create a new workspace. This will open the create workspace modal.
   */
  if (showCreateWorkspace) {
    return (
      <div>
        <div className={cx(styles.listBoxContainer, styles.empty)}>
          <div className={styles.noWorkspaceContainer}>
            <div
              data-testid="no-workspace-message"
              className={styles.noWorkspaceText}
            >
              <FormattedMessage
                id="templates.redeem_page.no-eligible-workspaces"
                description="Message shown when there are no eligible workspaces"
                defaultMessage="You currently don’t have any eligible Workspaces"
              />
            </div>
            <div>
              <Button name="create-workspace" onClick={openModal}>
                <FormattedMessage
                  id="templates.redeem_page.create-workspace"
                  description="Button text for creating a new workspace"
                  defaultMessage="Create Workspace"
                />
              </Button>
            </div>
          </div>
        </div>
        {showCreateModal && (
          <Suspense fallback={null}>
            <CreateWorkspaceOverlay
              teamType="default"
              redirectOnClose={false}
              onClose={closeModal}
              InviteTeamMembersForm={LazyInviteTeamMembersForm}
            />
          </Suspense>
        )}
      </div>
    );
  }

  return (
    <div className={styles.listBoxContainer}>
      <Textfield
        iconBefore={
          <SearchIcon color={token('color.icon.subtle', '#626F86')} />
        }
        type="text"
        name="search-workspaces"
        placeholder={intl.formatMessage({
          id: 'templates.redeem_page.search-workspaces',
          description: 'Placeholder text for searching workspaces',
          defaultMessage: 'Search Workspaces',
        })}
        onChange={handleSearchChange}
        value={search}
        autoComplete="off"
      />

      {/**
       * If we're not grouping by trial eligibility, render all workspaces
       * in a single list. Filter by search term
       */}
      {!groupByTrialEligibility && (
        <section
          className={styles.workspacesContainer}
          data-testid={getTestId<WorkspaceSelectorTestIds>('workspace-list')}
        >
          {filteredOrgs.map((org, i) => (
            <WorkspaceListItem
              key={org.id}
              handleSelectWorkspace={onSelectOrg}
              isSelected={selectedOrgId === org.id}
              memberCount={org.memberships.length}
              workspace={org}
            />
          ))}
          {search && !filteredOrgs.length && (
            <p className={styles.noWorkspaceText}>
              <FormattedMessage
                id="templates.redeem_page.no-matching-workspaces"
                description="Message shown when there are no matching workspaces"
                defaultMessage="No matching workspaces"
              />
            </p>
          )}
        </section>
      )}

      {/**
       * If we're grouping by trial eligibility, render two lists:
       * - One for workspaces eligible for trial
       * - One for workspaces not eligible for trial
       * Filter by both lists by search term. If the search term filters
       * out all workspaces in a list, remove the list and its title
       */}
      {groupByTrialEligibility && (
        <div className={styles.workspacesContainer}>
          {groupedOrgs.eligible.length > 0 && (
            <section
              data-testid={getTestId<WorkspaceSelectorTestIds>(
                'trial-eligible-workspace-list',
              )}
              className={styles.workspacesGroup}
            >
              <h3 className={styles.groupHeader}>
                <FormattedMessage
                  id="templates.redeem_page.available-for-trial"
                  description="Label for workspaces available for trial"
                  defaultMessage="Available for trial"
                />
              </h3>
              {groupedOrgs.eligible.map((org, i) => (
                <WorkspaceListItem
                  key={org.id}
                  handleSelectWorkspace={onSelectOrg}
                  isSelected={selectedOrgId === org.id}
                  memberCount={org.memberships.length}
                  workspace={org}
                />
              ))}
            </section>
          )}
          {groupedOrgs.ineligible.length > 0 && (
            <section
              data-testid={getTestId<WorkspaceSelectorTestIds>(
                'upgrade-eligible-workspace-list',
              )}
              className={styles.workspacesGroup}
            >
              <h3 className={styles.groupHeader}>
                <FormattedMessage
                  id="templates.redeem_page.available-for-upgrade"
                  description="Label for workspaces available for upgrade"
                  defaultMessage="Available for upgrade"
                />
              </h3>
              {groupedOrgs.ineligible.map((org, i) => (
                <WorkspaceListItem
                  key={org.id}
                  handleSelectWorkspace={onSelectOrg}
                  isSelected={selectedOrgId === org.id}
                  memberCount={org.memberships.length}
                  workspace={org}
                />
              ))}
            </section>
          )}
          {search &&
            !groupedOrgs.eligible.length &&
            !groupedOrgs.ineligible.length && (
              <p className={styles.noWorkspaceText}>
                <FormattedMessage
                  id="templates.redeem_page.no-matching-workspaces"
                  description="Message shown when there are no matching workspaces"
                  defaultMessage="No matching workspaces"
                />
              </p>
            )}
        </div>
      )}
    </div>
  );
};
