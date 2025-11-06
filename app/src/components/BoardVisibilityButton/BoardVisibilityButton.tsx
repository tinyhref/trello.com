import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { DynamicButton } from '@trello/dynamic-tokens';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { showFlag } from '@trello/nachos/experimental-flags';
import type { GlyphProps } from '@trello/nachos/icon';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { PublicIcon } from '@trello/nachos/icons/public';
import { Popover, PopoverScreen, usePopover } from '@trello/nachos/popover';
import { Tooltip } from '@trello/nachos/tooltip';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useNativeGraphqlMigrationMilestone3 } from 'app/src/components/App/useNativeGraphqlMigrationMilestone3';
import { LazyBoardInviteModal } from 'app/src/components/BoardInviteModal';
import { BoardMenuButton } from 'app/src/components/BoardMenuButton';
import { BoardVisibilityChooser } from 'app/src/components/BoardVisibilityChooser';
import { useBoardVisibilityButtonFragment } from './BoardVisibilityButtonFragment.generated';
import { useTrelloBoardVisibilityButtonFragment } from './TrelloBoardVisibilityButtonFragment.generated';
import { useTrelloUpdateBoardVisibilityMutation } from './TrelloUpdateBoardVisibilityMutation.generated';
import { useUpdateBoardVisibilityMutation } from './updateBoardVisibilityMutation.generated';

import * as styles from './BoardVisibilityButton.module.less';

type BoardPrefsPermissionLevel = 'enterprise' | 'org' | 'private' | 'public';
type TrelloBoardPrefsPermissionLevel =
  | 'ENTERPRISE'
  | 'ORG'
  | 'PRIVATE'
  | 'PUBLIC';

export interface BoardVisibilityButtonProps {
  isCollapsed?: boolean;
  renderingInMenu?: boolean;
  showInviteDialogCallback?: () => void;
  className?: string;
}

const Screens = {
  ChangeVisibilityScreen: 0,
  PublicConfirmationScreen: 1,
} as const;

const visibilityIconMap: Record<
  BoardPrefsPermissionLevel,
  | typeof EnterpriseIcon
  | typeof OrganizationIcon
  | typeof PrivateIcon
  | typeof PublicIcon
> = {
  private: PrivateIcon,
  public: PublicIcon,
  org: OrganizationIcon,
  enterprise: EnterpriseIcon,
};

const visibilityPermissionLevelMapping: Record<
  BoardPrefsPermissionLevel,
  TrelloBoardPrefsPermissionLevel
> = {
  enterprise: 'ENTERPRISE',
  org: 'ORG',
  private: 'PRIVATE',
  public: 'PUBLIC',
};

export const BoardVisibilityButton: FunctionComponent<
  BoardVisibilityButtonProps
> = ({ isCollapsed, renderingInMenu, showInviteDialogCallback, className }) => {
  const shouldUseNativeGraphQL = useNativeGraphqlMigrationMilestone3();
  const intl = useIntl();
  const boardId = useBoardId();
  const nativeBoardId = useBoardId(true);
  const workspaceId = useWorkspaceId();
  const boardNodeId = useBoardId(true);
  const {
    triggerRef,
    toggle,
    push,
    hide: hideVisibilityPopover,
    popoverProps,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screens.ChangeVisibilityScreen,
  });

  const { data: boardData } = useBoardVisibilityButtonFragment({
    from: {
      id: boardId,
    },
  });

  const { data: nativeData } = useTrelloBoardVisibilityButtonFragment({
    from: {
      id: boardNodeId,
    },
  });

  const [updateBoardVisibilityMutation] = useUpdateBoardVisibilityMutation();
  const [trelloUpdateBoardVisibilityMutation] =
    useTrelloUpdateBoardVisibilityMutation();

  const currentVisibility: BoardPrefsPermissionLevel | undefined =
    (nativeData?.prefs?.permissionLevel?.toLowerCase() as BoardPrefsPermissionLevel) ??
    boardData?.prefs?.permissionLevel;

  const idEnterprise =
    nativeData?.enterprise?.objectId ?? boardData?.idEnterprise;
  const idOrganization =
    nativeData?.workspace?.objectId ?? boardData?.idOrganization;

  const onClickVisibilityButton = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'changeBoardVisibilityButton',
      source: renderingInMenu ? 'boardMenuDefaultScreen' : 'boardScreen',
    });
    toggle();
  }, [renderingInMenu, toggle]);

  const updateBoardVisibility = useCallback(
    async (newVisibility: BoardPrefsPermissionLevel) => {
      const sourceName =
        newVisibility === 'public'
          ? 'makeBoardPublicInlineDialog'
          : 'changeBoardVisibilityInlineDialog';

      const traceId = Analytics.startTask({
        taskName: 'edit-board/prefs/permissionLevel',
        source: sourceName,
      });
      try {
        if (shouldUseNativeGraphQL) {
          const newNativeVisibility =
            visibilityPermissionLevelMapping[newVisibility];
          await trelloUpdateBoardVisibilityMutation({
            variables: {
              input: {
                boardId: nativeBoardId,
                visibility: newNativeVisibility,
              },
            },
            context: { traceId },
            optimisticResponse: {
              __typename: 'Mutation',
              trello: {
                __typename: 'TrelloMutationApi',
                updateBoardVisibility: {
                  __typename: 'TrelloUpdateBoardVisibilityPayload',
                  board: {
                    __typename: 'TrelloBoard',
                    id: nativeBoardId,
                    prefs: {
                      __typename: 'TrelloBoardPrefs',
                      permissionLevel: newNativeVisibility,
                    },
                  },
                  success: true,
                },
              },
            },
          });
        } else {
          await updateBoardVisibilityMutation({
            variables: { boardId, visibility: newVisibility },
            optimisticResponse: {
              __typename: 'Mutation',
              updateBoardVisibility: {
                __typename: 'Board',
                id: boardId,
                prefs: {
                  __typename: 'Board_Prefs',
                  permissionLevel: newVisibility,
                },
              },
            },
          });
        }

        Analytics.sendUpdatedBoardFieldEvent({
          field: 'visibility',
          value: newVisibility,
          source: sourceName,
          containers: {
            board: {
              id: boardId,
            },
            organization: {
              id: workspaceId,
            },
            enterprise: {
              id: idEnterprise,
            },
          },
          attributes: {
            change: currentVisibility !== newVisibility,
            previous: currentVisibility,
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-board/prefs/permissionLevel',
          source: sourceName,
          traceId,
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName: 'edit-board/prefs/permissionLevel',
          source: sourceName,
          traceId,
          error,
        });
        showFlag({
          id: 'change-board-visibility-error',
          title: (
            <FormattedMessage
              id="templates.your-cards.something-went-wrong"
              defaultMessage="Something went wrong"
              description="Message displayed when board visibility update fails."
            />
          ),
          appearance: 'error',
          isAutoDismiss: true,
        });
      }
    },
    [
      boardId,
      nativeBoardId,
      currentVisibility,
      idEnterprise,
      workspaceId,
      shouldUseNativeGraphQL,
      updateBoardVisibilityMutation,
      trelloUpdateBoardVisibilityMutation,
    ],
  );

  const onVisibilitySelect = useCallback(
    async (newVisibility: BoardPrefsPermissionLevel) => {
      if (newVisibility === 'public') {
        push(Screens.PublicConfirmationScreen);
      } else {
        toggle();
        await updateBoardVisibility(newVisibility);
      }
    },
    [push, toggle, updateBoardVisibility],
  );

  const onClickConfirmPublicBoardButton = useCallback(async () => {
    toggle();
    await updateBoardVisibility('public');
  }, [toggle, updateBoardVisibility]);

  const {
    dialogProps,
    show: showInviteDialog,
    hide: hideInviteDialog,
  } = useDialog();

  const onClickShareMenuLink = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'shareButton',
      source: 'changeBoardVisibilityInlineDialog',
      containers: {
        board: { id: boardId },
        organization: { id: workspaceId },
        enterprise: { id: idEnterprise },
      },
    });
    hideVisibilityPopover();
    if (renderingInMenu && showInviteDialogCallback) {
      showInviteDialogCallback();
    } else {
      showInviteDialog();
    }
  }, [
    boardId,
    hideVisibilityPopover,
    idEnterprise,
    workspaceId,
    showInviteDialog,
    renderingInMenu,
    showInviteDialogCallback,
  ]);

  if (!currentVisibility || nativeData?.closed || boardData?.closed) {
    return null;
  }

  const VisibilityIcon: FunctionComponent<GlyphProps> =
    visibilityIconMap[currentVisibility];

  const getVisibilityName = (visibility: string) => {
    switch (visibility) {
      case 'private':
        return intl.formatMessage({
          id: 'board perms.private.name',
          defaultMessage: 'Private',
          description: 'The private visibility',
        });
      case 'org':
        return intl.formatMessage({
          id: 'board perms.org.name',
          defaultMessage: 'Workspace visible',
          description: 'The workspace visibility',
        });
      case 'enterprise':
        return intl.formatMessage({
          id: 'board perms.enterprise.name',
          defaultMessage: 'Organization visible',
          description: 'The organization visibility',
        });
      case 'public':
        return intl.formatMessage({
          id: 'board perms.public.name',
          defaultMessage: 'Public',
          description: 'The public visibility',
        });
      default:
        return null;
    }
  };

  const formattedVisibilityName = getVisibilityName(currentVisibility);

  const visibilityLabel = (() => {
    switch (currentVisibility) {
      case 'private':
        return (
          <FormattedMessage
            id="templates.board_menu_vis.visibility-private"
            defaultMessage="Visibility: Private"
            description="The label of the private visibility"
          />
        );
      case 'public':
        return (
          <FormattedMessage
            id="templates.board_menu_vis.visibility-public"
            defaultMessage="Visibility: Public"
            description="The label of the public visibility"
          />
        );
      case 'org':
        return (
          <FormattedMessage
            id="templates.board_menu_vis.visibility-workspace"
            defaultMessage="Visibility: Workspace"
            description="The label of the workspace visibility"
          />
        );
      case 'enterprise':
        return (
          <FormattedMessage
            id="templates.board_menu_vis.visibility-organization"
            defaultMessage="Visibility: Organization"
            description="The label of the organization visibility"
          />
        );
      default:
        return formattedVisibilityName;
    }
  })();

  return (
    <>
      {renderingInMenu ? (
        <BoardMenuButton
          iconBefore={
            <VisibilityIcon
              dangerous_className={styles.boardVisibilityIcon}
              size="medium"
            />
          }
          ref={triggerRef}
          onClick={onClickVisibilityButton}
          className={className}
        >
          {visibilityLabel}
        </BoardMenuButton>
      ) : (
        <span
          className={classNames(
            {
              [styles.boardVisibilityContainer]: true,
              [styles.collapsed]: isCollapsed,
            },
            className,
          )}
        >
          <Tooltip
            content={
              <FormattedMessage
                id="board perms.popover-title"
                defaultMessage="Change visibility"
                description="Tooltip for the board visibility button"
              />
            }
          >
            <DynamicButton
              data-testid={`${getTestId<BoardHeaderTestIds>(
                'board-visibility-option-',
              )}${currentVisibility}`}
              ref={triggerRef}
              onClick={onClickVisibilityButton}
              iconBefore={
                <VisibilityIcon
                  dangerous_className={styles.boardVisibilityIcon}
                  size="medium"
                />
              }
              className={styles.boardVisibilityButton}
              aria-label={formattedVisibilityName ?? ''}
              isHighlighted={popoverProps.isVisible}
            ></DynamicButton>
          </Tooltip>
        </span>
      )}
      <Popover
        {...popoverProps}
        size={'large'}
        title={
          <FormattedMessage
            id="board perms.popover-title"
            defaultMessage="Change visibility"
            description="Title for the board visibility popover"
          />
        }
      >
        <PopoverScreen id={Screens.ChangeVisibilityScreen}>
          <BoardVisibilityChooser
            boardId={boardId}
            onSelect={onVisibilitySelect}
            orgId={idOrganization}
            newBoardFlow={false}
          />
        </PopoverScreen>
        <PopoverScreen
          id={Screens.PublicConfirmationScreen}
          title={
            <FormattedMessage
              id="templates.popover_confirmation_public_boards.public-board-confirmation-view-title"
              defaultMessage="Change to public?"
              description="Title for the public board confirmation screen"
            />
          }
        >
          <div>
            <FormattedMessage
              id="templates.popover_confirmation_public_boards.public-board-confirmation-description"
              defaultMessage="Public boards are visible to anyone on the internet."
              description="Description explaining public board visibility"
            />
          </div>
          <Button
            appearance="primary"
            onClick={onClickConfirmPublicBoardButton}
            shouldFitContainer={true}
            className={styles.publicConfirmButton}
          >
            <FormattedMessage
              id="templates.popover_confirmation_public_boards.confirm"
              defaultMessage="Yes, make board public"
              description="Confirmation button text for making a board public"
            />
          </Button>
          <hr role="presentation" className={styles.divider} />
          <div>
            <p className={styles.shareLinkText}>
              <FormattedMessage
                id="templates.popover_confirmation_public_boards.looking-for-share-link-create-one"
                defaultMessage="Looking for a share link instead? Create one in the share menu. "
                description="Text prompting users to create a share link"
              />
              <Button
                className={styles.shareLinkButton}
                onClick={onClickShareMenuLink}
                appearance="link"
              >
                <FormattedMessage
                  id="templates.popover_confirmation_public_boards.open-share-menu"
                  defaultMessage="Open share menu"
                  description="Button text to open the share menu"
                />
              </Button>
            </p>
          </div>
        </PopoverScreen>
      </Popover>
      <Dialog className={styles.inviteDialog} {...dialogProps}>
        <LazyBoardInviteModal idBoard={boardId} onClose={hideInviteDialog} />
      </Dialog>
    </>
  );
};
