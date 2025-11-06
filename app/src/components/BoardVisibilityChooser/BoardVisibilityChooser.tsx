import classNames from 'classnames';
import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line no-restricted-imports
import type { Board_Prefs_PermissionLevel } from '@trello/graphql/generated';
import { intl } from '@trello/i18n';
import type { GlyphProps } from '@trello/nachos/icon';
import { CheckIcon } from '@trello/nachos/icons/check';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { PublicIcon } from '@trello/nachos/icons/public';
import { PopoverMenu, PopoverMenuButton } from '@trello/nachos/popover-menu';
import { Spinner } from '@trello/nachos/spinner';
import { RouterLink } from '@trello/router/router-link';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';
import { getOrganizationAccountUrl } from '@trello/urls';

import { useBoardVisibilityOrganizationQuery } from './BoardVisibilityOrganizationQuery.generated';
import { useBoardVisibility } from './useBoardVisibility';

import * as styles from './BoardVisibilityChooser.module.less';

interface PermissionLevelSetting {
  level: Board_Prefs_PermissionLevel;
  title: string;
  description: ReactNode | string;
  iconColor?: string;
  iconClass: FunctionComponent<GlyphProps>;
  /** Whether a given permission level is restricted from being selected by an admin setting */
  restricted: boolean;
  /** Whether the permission level can be selected for the board's current state (e.g. a board not in an enterprise cannot select 'enterprise' visibility) */
  isAvailable: boolean;
  /** Whether a given permission level is currently selected */
  isEnabled: boolean;
}

interface BoardVisibilityChooserProps {
  boardId?: string | null;
  selectedVisibility?: Board_Prefs_PermissionLevel | null;
  onSelect: (visibility: Board_Prefs_PermissionLevel) => void;
  orgId?: string | null;
  /**
   * Whether the BoardVisibilityChooser is being used to either create or reopen a board. Some messaging around board restrictions
   * is slightly different in that case compared to when a user is changing the visibility of an existing, open, board
   */
  newBoardFlow?: boolean;
}

export const BoardVisibilityChooser: FunctionComponent<
  BoardVisibilityChooserProps
> = ({ boardId, selectedVisibility, onSelect, orgId, newBoardFlow = true }) => {
  const { data, loading } = useBoardVisibilityOrganizationQuery({
    variables: { orgId: orgId || '' },
    skip: !orgId,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const {
    userIsBoardAdmin,
    userIsWorkspaceAdmin,
    boardVisibility,
    boardIsTemplate,
    loading: boardVisibilityRestrictionsLoading,
    workspaceHasEnterprise,
    workspaceAllowsPrivateBoards,
    workspaceAllowsPublicBoards,
    workspaceAllowsWorkspaceVisibleBoards,
    workspaceAllowsEnterpriseVisibleBoards,
    workspaceRestrictsAllBoardVisibilities,
  } = useBoardVisibility({
    boardId,
    orgId,
  });

  const selectedWorkspaceHasRestrictions =
    !workspaceAllowsPrivateBoards ||
    !workspaceAllowsPublicBoards ||
    !workspaceAllowsWorkspaceVisibleBoards ||
    (workspaceHasEnterprise && !workspaceAllowsEnterpriseVisibleBoards);

  const workspaceDisplayName = data?.organization?.displayName;
  const enterpriseDisplayName = data?.organization?.enterprise?.displayName;
  const permissionStringSubstitutionContext = useMemo(
    () => ({
      orgName: workspaceDisplayName,
      enterpriseName: enterpriseDisplayName,
    }),
    [workspaceDisplayName, enterpriseDisplayName],
  );

  const orgTeamContext = useMemo(() => {
    const hasSuperAdmins =
      data?.organization?.premiumFeatures?.includes('superAdmins');

    if (hasSuperAdmins && !workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage(
            {
              id: 'templates.board_menu_vis.org-template-board-with-super-admins',
              defaultMessage:
                'All members of the {orgName} Workspace can see this template. Only board admins can edit.',
              description:
                'Description for Workspace template board visibility where only board admins can edit',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          )
        : intl.formatMessage(
            {
              id: 'templates.board_menu_vis.org-board-with-super-admins',
              defaultMessage:
                'All members of the {orgName} Workspace can see and edit this board.',
              description:
                'Description for Workspace board visibility where all members can see and edit a board',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          );
    }

    if (!orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.org-template-board-without-organization',
            defaultMessage:
              'All members of the Workspace can see this template. The board must be added to a Workspace to enable this.',
            description:
              'Description for Workspace template board visibility where a board needs to be added to the Workspace',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.org-board-without-organization',
            defaultMessage:
              'All members of the Workspace can see and edit this board. The board must be added to a Workspace to enable this.',
            description:
              'Description for Workspace board visibility where the board needs to be added to the Workspace',
          });
    }
    if (workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage(
            {
              id: 'templates.board_menu_vis.org-template-board-with-enterprise',
              defaultMessage:
                'All members of the {orgName} Workspace can see this template. Only board admins can edit.',
              description:
                'Description for Workspace template board visibility for an Enterprise workspace',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          )
        : intl.formatMessage(
            {
              id: 'templates.board_menu_vis.org-board-with-enterprise',
              defaultMessage:
                'All members of the {orgName} Workspace can see and edit this board.',
              description:
                'Description for Workspace board visibility in an Entperise where all members can edit the board',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          );
    }
    if (orgId) {
      return boardIsTemplate
        ? intl.formatMessage(
            {
              id: 'templates.board_menu_vis.org-template-board-with-organization',
              defaultMessage:
                'All members of the {orgName} Workspace can see this template. Only board admins can edit.',
              description:
                'Description for Workspace template board visibility where only board admins can edit',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          )
        : intl.formatMessage(
            {
              id: 'templates.board_menu_vis.org-board-with-organization',
              defaultMessage:
                'All members of the {orgName} Workspace can see and edit this board.',
              description:
                'Description for Workspace board visibility where all members can edit the board',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          );
    }
    return intl.formatMessage(
      {
        id: 'templates.board_menu_vis.org-board-with-organization',
        defaultMessage:
          'All members of the {orgName} Workspace can see and edit this board.',
        description:
          'Description for Workspace board visibility where all members can edit the board',
      },
      { orgName: permissionStringSubstitutionContext.orgName },
    );
  }, [
    boardIsTemplate,
    data?.organization?.premiumFeatures,
    orgId,
    permissionStringSubstitutionContext.orgName,
    workspaceHasEnterprise,
  ]);

  const enterpriseTeamContext = useMemo(() => {
    const hasSuperAdmins =
      data?.organization?.premiumFeatures?.includes('superAdmins');

    if (hasSuperAdmins && !workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.enterprise-template-board-with-super-admins',
            defaultMessage:
              'All members of the organization can see this template. The board must be added to an enterprise Workspace to enable this.',
            description:
              'Description for Enterprise template board visibility where a board needs to be added to the enterprise Workspace',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.enterprise-board-with-super-admins',
            defaultMessage:
              'All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this.',
            description:
              'Description for Enterprise board visibility where a board needs to be added to the enterprise Workspace',
          });
    }

    if (!orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.enterprise-template-board-without-organization',
            defaultMessage:
              'All members of the organization can see this template. The board must be added to an enterprise Workspace to enable this.',
            description:
              'Description for Enterprise template board visibility where a board needs to be added to the enterprise Workspace',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.enterprise-board-without-organization',
            defaultMessage:
              'All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this.',
            description:
              'Description for Enterprise board visibility where a board needs to be added to the enterprise Workspace',
          });
    }
    if (workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage(
            {
              id: 'templates.board_menu_vis.enterprise-template-board-with-enterprise',
              defaultMessage:
                'Anyone at {enterpriseName} can see this template. Only board admins and Workspace admins can edit.',
              description:
                'Description for an Enterprise template board visibility where only board or Workspace admins can edit',
            },
            {
              enterpriseName:
                permissionStringSubstitutionContext.enterpriseName,
            },
          )
        : intl.formatMessage(
            {
              id: 'templates.board_menu_vis.enterprise-board-with-enterprise',
              defaultMessage:
                'Anyone at {enterpriseName} can see this board. Only board members and Workspace admins can edit.',
              description:
                'Description for an Enterprise board visibility where only board or Workspace admins can edit',
            },
            {
              enterpriseName:
                permissionStringSubstitutionContext.enterpriseName,
            },
          );
    }
    if (orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.enterprise-template-board-with-organization',
            defaultMessage:
              'All members of the organization can see this template. The board must be added to an enterprise Workspace to enable this.',
            description:
              'Description for Enterprise template board visibility where the board must be added to the enterprise Workspace',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.enterprise-board-with-organization',
            defaultMessage:
              'All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this.',
            description:
              'Description for Enterprise board visibility where the board must be added to the enterprise Workspace',
          });
    }
    return intl.formatMessage({
      id: 'templates.board_menu_vis.enterprise-board-with-organization',
      defaultMessage:
        'All members of the organization can see this board. The board must be added to an enterprise Workspace to enable this.',
      description:
        'Description for Enterprise board visibility where the board must be added to the enterprise Workspace',
    });
  }, [
    boardIsTemplate,
    data?.organization?.premiumFeatures,
    orgId,
    permissionStringSubstitutionContext.enterpriseName,
    workspaceHasEnterprise,
  ]);

  const publicTeamContext = useMemo(() => {
    const hasSuperAdmins =
      data?.organization?.premiumFeatures?.includes('superAdmins');

    if (hasSuperAdmins && !workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.public-template-board-with-super-admins',
            defaultMessage:
              'Anyone on the internet can see this template. Only board admins can edit.',
            description:
              'Description for public template board visibility where only board admins can edit',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.public-board-with-super-admins',
            defaultMessage:
              'Anyone on the internet can see this board. Only board members can edit.',
            description:
              'Description for public board visibility where only board members can edit',
          });
    }

    if (!orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.public-template-board-without-organization',
            defaultMessage:
              'Anyone on the internet can see this template. Only board admins can edit.',
            description:
              'Description for public template board visibility where only board admins can edit',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.public-board-without-organization',
            defaultMessage:
              'Anyone on the internet can see this board. Only board members can edit.',
            description:
              'Description for public board visibility where only board members can edit',
          });
    }
    if (workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.public-template-board-with-enterprise',
            defaultMessage:
              'Anyone on the internet can see this template. Only board admins can edit.',
            description:
              'Description for public template board visibility where only board admins can edit',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.public-board-with-enterprise',
            defaultMessage:
              'Anyone on the internet can see this board. Only board members can edit.',
            description:
              'Description for public board visibility where only board members can edit',
          });
    }
    if (orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.public-template-board-with-organization',
            defaultMessage:
              'Anyone on the internet can see this template. Only board admins can edit.',
            description:
              'Description for public template board visibility where only board admins can edit',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.public-board-with-organization',
            defaultMessage:
              'Anyone on the internet can see this board. Only board members can edit.',
            description:
              'Description for public board visibility where only board members can edit',
          });
    }
    return intl.formatMessage({
      id: 'templates.board_menu_vis.public-board-with-organization',
      defaultMessage:
        'Anyone on the internet can see this board. Only board members can edit.',
      description:
        'Description for public board visibility where only board members can edit',
    });
  }, [
    boardIsTemplate,
    data?.organization?.premiumFeatures,
    orgId,
    workspaceHasEnterprise,
  ]);

  const privateTeamContext = useMemo(() => {
    const hasSuperAdmins =
      data?.organization?.premiumFeatures?.includes('superAdmins');

    if (hasSuperAdmins && !workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.private-template-board-with-super-admins',
            defaultMessage:
              'Only board members can see and edit this template.',
            description:
              'Description for private template board visibility where only board members can see & edit',
          })
        : intl.formatMessage(
            {
              id: 'templates.board_menu_vis.private-board-with-super-admins',
              defaultMessage:
                'Board members and {orgName} Workspace admins can see and edit this board.',
              description:
                'Description for private board visibility where board members and Workspace admin can see and edit',
            },

            { orgName: permissionStringSubstitutionContext.orgName },
          );
    }

    if (!orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.private-template-board-without-organization',
            defaultMessage:
              'Only board members can see and edit this template.',
            description:
              'Description for private template board visibility where only board members can see and edit',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.private-board-without-organization',
            defaultMessage: 'Only board members can see and edit this board.',
            description:
              'Description for private board visibility where only board members can see and edit',
          });
    }
    if (workspaceHasEnterprise) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.private-template-board-with-enterprise',
            defaultMessage:
              'Only board members can see and edit this template.',
            description:
              'Description for private template board visibility where only board members can see and edit',
          })
        : intl.formatMessage(
            {
              id: 'templates.board_menu_vis.private-board-with-enterprise',
              defaultMessage:
                'Board members and {orgName} Workspace admins can see and edit this board.',
              description:
                'Description for private board visibility where board members and Workspace admin can see and edit',
            },
            { orgName: permissionStringSubstitutionContext.orgName },
          );
    }
    if (orgId) {
      return boardIsTemplate
        ? intl.formatMessage({
            id: 'templates.board_menu_vis.private-template-board-with-organization',
            defaultMessage:
              'Only board members can see this template. Workspace admins can close the board or remove members.',
            description:
              'Description for private template board visibility where only members can see the board, and Workspace admin can close the board and remove members',
          })
        : intl.formatMessage({
            id: 'templates.board_menu_vis.private-board-with-organization',
            defaultMessage:
              'Only board members can see this board. Workspace admins can close the board or remove members.',
            description:
              'Description for private board visibility where only members can see the board, and Workspace admin can close the board and remove members',
          });
    }
    return intl.formatMessage({
      id: 'templates.board_menu_vis.private-board-with-organization-old', //delete this string when the phoenix.web.user-management flag is cleaned up
      defaultMessage: 'Only board members can see and edit this board.',
      description:
        'Description for private board visibility where only members can see the board, and Workspace admin can close the board and remove members',
    });
  }, [
    boardIsTemplate,
    data?.organization?.premiumFeatures,
    orgId,
    permissionStringSubstitutionContext.orgName,
    workspaceHasEnterprise,
  ]);

  const iconProps: Partial<GlyphProps> = useMemo(
    () => ({
      size: 'small',
    }),
    [],
  );
  // this component can be used during the create board flow, or
  // during a flow that has a board selected already. In the create board
  // flow, selectedVisibility is used.
  const currentVisibility = boardVisibility || selectedVisibility;

  const Private: PermissionLevelSetting = useMemo(
    () => ({
      level: 'private',
      title: intl.formatMessage({
        id: 'templates.board_menu_vis.private',
        defaultMessage: 'Private',
        description: 'Title for private permission level',
      }),
      description: privateTeamContext,
      iconClass: PrivateIcon,
      iconColor: token('color.icon.accent.red', '#C9372C'),
      isAvailable: userIsBoardAdmin && workspaceAllowsPrivateBoards,
      restricted: !workspaceAllowsPrivateBoards,
      isEnabled: currentVisibility === 'private',
    }),
    [
      privateTeamContext,
      userIsBoardAdmin,
      workspaceAllowsPrivateBoards,
      currentVisibility,
    ],
  );

  const Org: PermissionLevelSetting = useMemo(
    () => ({
      level: 'org',
      title: intl.formatMessage({
        id: 'templates.board_menu_vis.org',
        defaultMessage: 'Workspace',
        description: 'Title for org permission level',
      }),
      description: orgTeamContext,
      iconClass: OrganizationIcon,
      isAvailable:
        !!orgId && userIsBoardAdmin && workspaceAllowsWorkspaceVisibleBoards,
      restricted: !workspaceAllowsWorkspaceVisibleBoards,
      isEnabled: currentVisibility === 'org',
    }),
    [
      currentVisibility,
      orgId,
      orgTeamContext,
      userIsBoardAdmin,
      workspaceAllowsWorkspaceVisibleBoards,
    ],
  );

  const Enterprise: PermissionLevelSetting = useMemo(
    () => ({
      level: 'enterprise',
      title: intl.formatMessage({
        id: 'templates.board_menu_vis.enterprise',
        defaultMessage: 'Organization',
        description: 'Title for enterprise permission level',
      }),
      description: enterpriseTeamContext,
      iconClass: EnterpriseIcon,
      isAvailable:
        userIsBoardAdmin &&
        workspaceHasEnterprise &&
        workspaceAllowsEnterpriseVisibleBoards,
      restricted:
        workspaceHasEnterprise && !workspaceAllowsEnterpriseVisibleBoards,
      isEnabled: currentVisibility === 'enterprise',
    }),
    [
      currentVisibility,
      enterpriseTeamContext,
      userIsBoardAdmin,
      workspaceAllowsEnterpriseVisibleBoards,
      workspaceHasEnterprise,
    ],
  );

  const Public: PermissionLevelSetting = useMemo(
    () => ({
      level: 'public',
      title: intl.formatMessage({
        id: 'templates.board_menu_vis.public',
        defaultMessage: 'Public',
        description: 'Title for public permission level',
      }),
      description: publicTeamContext,
      iconColor: token('color.icon.accent.green', '#22A06B'),
      iconClass: PublicIcon,
      isAvailable: userIsBoardAdmin && workspaceAllowsPublicBoards,
      restricted: !workspaceAllowsPublicBoards,
      isEnabled: currentVisibility === 'public',
    }),
    [
      currentVisibility,
      publicTeamContext,
      userIsBoardAdmin,
      workspaceAllowsPublicBoards,
    ],
  );

  const permissionLevels: PermissionLevelSetting[] = useMemo(
    () => [Private, Org, Enterprise, Public],
    [Enterprise, Org, Private, Public],
  );

  const _onSelect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (permissionLevel: any) => {
      return () => {
        const permissionSetting = permissionLevels.find(
          (setting) => setting.level === permissionLevel,
        );
        if (permissionSetting?.restricted) {
          return;
        }

        onSelect(permissionLevel as Board_Prefs_PermissionLevel);
      };
    },
    [onSelect, permissionLevels],
  );

  if (loading || boardVisibilityRestrictionsLoading) {
    return <Spinner centered />;
  }

  // It is possible that a BC workspace's settings are such that all board visibilities are restricted for some or all workspace members
  if (workspaceRestrictsAllBoardVisibilities && newBoardFlow) {
    const orgNameBold = <strong key="orgName">{workspaceDisplayName}</strong>;
    const messaging = userIsWorkspaceAdmin
      ? intl.formatMessage(
          {
            id: 'workspace-chooser.board-visibility-all-restricted',
            defaultMessage:
              '{orgName} does not allow new boards. You can change this on the {teamSettingsPageLink} by clicking on “Board Creation Restrictions.”',
            description:
              "A message indicating this organization does not allow new boards, and this setting can be changed on the organization's settings page",
          },
          {
            orgName: orgNameBold,
            teamSettingsPageLink: (
              <RouterLink
                key="settingsLink"
                href={getOrganizationAccountUrl(data?.organization?.name)}
              >
                {intl.formatMessage({
                  id: 'workspace-chooser.workspace-board-visibility-settings-link',
                  defaultMessage: 'Workspace settings page',
                  description: 'The link to the workspace settings page',
                })}
              </RouterLink>
            ),
          },
        )
      : intl.formatMessage(
          {
            id: 'workspace-chooser.workspace-board-visibility-all-restricted-not-admin',
            defaultMessage:
              '{orgName} does not allow new boards. Only an admin of the Workspace can change this setting.',
            description:
              'A message indicating this organization does not allow new boards, and an admin can change this setting',
          },
          {
            orgName: orgNameBold,
          },
        );

    return <p id="allVisibilitiesAreRestrictedMessaging">{messaging}</p>;
  }

  return (
    <PopoverMenu>
      {selectedWorkspaceHasRestrictions && (
        <div className={styles.boardVisibilityDescription}>
          <FormattedMessage
            id="workspace-chooser.workspace-board-visibility-messaging"
            defaultMessage="{orgName} has restrictions on board visibility. Please choose a setting that is allowed in that Workspace."
            description="A message indicating the organization has restrictions on board visibility"
            values={{
              orgName: workspaceDisplayName,
            }}
          />
        </div>
      )}
      {permissionLevels.map((permissionSettings) => {
        const Icon = permissionSettings.iconClass;
        const optionDisabled =
          !permissionSettings.isAvailable || permissionSettings.restricted;

        const iconColor: string | undefined = optionDisabled
          ? token('color.icon.disabled', '#091E424F')
          : permissionSettings.iconColor;

        const checkColor = optionDisabled
          ? token('color.icon.disabled', '#091E424F')
          : token('color.icon', '#44546F');

        return (
          <PopoverMenuButton
            key={permissionSettings.level}
            onClick={_onSelect(permissionSettings.level)}
            disabled={optionDisabled}
            className={classNames(
              optionDisabled && styles.boardVisibilityOptionDisabled,
            )}
            title={
              <>
                {permissionSettings.title}
                {permissionSettings.isEnabled && (
                  <CheckIcon size="small" color={checkColor} />
                )}
              </>
            }
            description={
              <span
                className={classNames(
                  optionDisabled && styles.boardVisibilityOptionDisabled,
                )}
              >
                {permissionSettings.description}
                &nbsp;
                {permissionSettings.restricted && (
                  <span className={styles.boardVisibilityDisabledMessaging}>
                    <FormattedMessage
                      id="workspace-chooser.workspace-board-visibility-option-disabled"
                      defaultMessage="Due to a restriction created by a Workspace admin, you cannot select this visibility."
                      description="A message indicating this board cannot have this visibility due to organization restrictions"
                    />
                  </span>
                )}
              </span>
            }
            iconBefore={<Icon {...iconProps} color={iconColor} />}
            testId={
              `${getTestId<BoardHeaderTestIds>('board-visibility-dropdown-')}${
                permissionSettings.title
              }` as BoardHeaderTestIds
            }
          />
        );
      })}
    </PopoverMenu>
  );
};
