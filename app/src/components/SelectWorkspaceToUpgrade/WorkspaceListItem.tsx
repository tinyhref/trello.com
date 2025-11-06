import classnames from 'classnames';
import type {
  FunctionComponent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useCallback } from 'react';
import { FormattedMessage, FormattedPlural } from 'react-intl';

import { Key } from '@trello/keybindings';
import { WorkspaceLogo } from '@trello/workspace-logo';

import { OfferingLozenge } from 'app/src/components/OfferingLozenge';
import type { EligibleWorkspaceToUpgrade } from './useEligibleWorkspacesToUpgradeQuery';
import { useWorkspaceToUpgradeBoardsQuery } from './WorkspaceToUpgradeBoardsQuery.generated';

import * as styles from './WorkspaceListItem.module.less';

interface WorkspaceListItemProps {
  workspace: EligibleWorkspaceToUpgrade;
  memberCount: number;
  handleSelectWorkspace: (workspace: EligibleWorkspaceToUpgrade) => void;
  isSelected: boolean;
}

export const WorkspaceListItem: FunctionComponent<WorkspaceListItemProps> = ({
  memberCount,
  handleSelectWorkspace,
  isSelected = false,
  workspace,
}) => {
  const { data, loading } = useWorkspaceToUpgradeBoardsQuery({
    variables: { workspaceId: workspace.id },
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const handleClick = useCallback(
    () => handleSelectWorkspace(workspace),
    [workspace, handleSelectWorkspace],
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === Key.Space || e.key === Key.Enter) {
        handleClick();
      }
    },
    [handleClick],
  );

  const boardCount = data?.organization?.boards
    ? data.organization.boards.length
    : -1;

  return (
    <div
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={classnames({
        [styles.listItemContainer]: true,
        [styles.selected]: isSelected,
      })}
      tabIndex={0}
    >
      <div className={styles.listItem}>
        <div className={styles.avatar}>
          <WorkspaceLogo
            logoHash={workspace.logoHash}
            name={workspace.displayName}
          />
        </div>
        <div className={styles.text}>
          <div className={styles.name}>{workspace.displayName}</div>
          <div className={styles.info}>
            {!loading && (
              <>
                <FormattedPlural
                  value={memberCount}
                  zero={
                    <FormattedMessage
                      id="templates.select_workspace_to_upgrade.no-members"
                      defaultMessage="0 members."
                      description="Subtext shown when there are no members in a workspace"
                    />
                  }
                  one={
                    <FormattedMessage
                      id="templates.select_workspace_to_upgrade.one-member"
                      defaultMessage="1 member."
                      description="Subtext shown when there is one member in a workspace"
                    />
                  }
                  other={
                    <FormattedMessage
                      id="templates.select_workspace_to_upgrade.count-members"
                      defaultMessage="{count} members."
                      description="Subtext shown when there are multiple members in a workspace"
                      values={{ count: memberCount }}
                    />
                  }
                />
                {boardCount >= 0 && (
                  <>
                    {' '}
                    <FormattedPlural
                      value={boardCount}
                      zero={
                        <FormattedMessage
                          id="templates.select_workspace_to_upgrade.no-boards"
                          defaultMessage="0 boards."
                          description="Subtext shown when there are no boards in a workspace"
                        />
                      }
                      one={
                        <FormattedMessage
                          id="templates.select_workspace_to_upgrade.one-board"
                          defaultMessage="1 board."
                          description="Subtext shown when there is one board in a workspace"
                        />
                      }
                      other={
                        <FormattedMessage
                          id="templates.select_workspace_to_upgrade.count-boards"
                          defaultMessage="{count} boards."
                          description="Subtext shown when there are multiple boards in a workspace"
                          values={{ count: boardCount }}
                        />
                      }
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <OfferingLozenge offering={workspace.offering} />
    </div>
  );
};
