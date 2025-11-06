import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import useResizeObserver from 'use-resize-observer';

import { formatContainers } from '@trello/atlassian-analytics';
import { isEmbeddedInAtlassian } from '@trello/browser';
import { CrossFlowProvider } from '@trello/cross-flow';
import { useSharedStateSelector } from '@trello/shared-state';

import { BoardFacepile } from 'app/src/components/BoardFacepile';
import { BoardHeaderPluginButtons } from 'app/src/components/BoardHeaderPluginButtons';
import { BoardHeaderShowSidebarButton } from 'app/src/components/BoardHeaderShowSidebarButton';
import { BoardHeaderStarButton } from 'app/src/components/BoardHeaderStarButton';
import {
  BoardJoinButton,
  useBoardJoinButton,
} from 'app/src/components/BoardJoinButton';
import { BoardName } from 'app/src/components/BoardName';
import { BoardShareButton } from 'app/src/components/BoardShareButton';
import { BoardTemplateBadge } from 'app/src/components/BoardTile';
import { BoardVisibilityButton } from 'app/src/components/BoardVisibilityButton';
import { SingleBoardFilterPopoverButton } from 'app/src/components/FilterPopover';
import type { Board } from 'app/src/components/PluginHeaderButton/PluginHeaderButton.types';
import { ViewSwitcher } from 'app/src/components/ViewSwitcher';
import { boardHeaderButtonState } from './boardHeaderButtonState';
import { useBoardHeader } from './useBoardHeader';

import * as styles from './BoardHeader.module.less';

export interface BoardHeaderProps {
  legacyBoardModel: Board;
}

export const BoardHeader: FunctionComponent<BoardHeaderProps> = ({
  legacyBoardModel,
}) => {
  const {
    boardId,
    nativeBoardId,
    workspaceId,
    isClosed,
    isTemplate,
    isBoardMember,
    canInviteMembers,
  } = useBoardHeader();

  const headerIsEmbedded = isEmbeddedInAtlassian();

  const collapseDefaultButtons = useSharedStateSelector(
    boardHeaderButtonState,
    useCallback(
      ({
        pluginButtonCount,
        automationButtonCount,
        hasCalendarPowerUp,
        hasMapPowerUp,
      }) => {
        let totalPluginButtons = pluginButtonCount + automationButtonCount;
        if (hasCalendarPowerUp) {
          totalPluginButtons++;
        }
        if (hasMapPowerUp) {
          totalPluginButtons++;
        }
        return totalPluginButtons >= 4;
      },
      [],
    ),
  );

  const collapsePluginButtons = useSharedStateSelector(
    boardHeaderButtonState,
    useCallback(
      ({
        pluginButtonCount,
        automationButtonCount,
        hasCalendarPowerUp,
        hasMapPowerUp,
      }) => {
        let totalPluginButtons = pluginButtonCount + automationButtonCount;
        if (hasCalendarPowerUp) {
          totalPluginButtons++;
        }
        if (hasMapPowerUp) {
          totalPluginButtons++;
        }
        return totalPluginButtons >= 6;
      },
      [],
    ),
  );

  const { width, ref: headerRef } = useResizeObserver<HTMLElement>();

  const showPluginsButtons = width && width > 1000;
  const showFacepile = width && width > 800;
  const showActionsButtons = width && width > 640;
  const showShareButton = width && width > 480;
  const showJoinButton = width && width > 480;

  const { showJoinButton: shouldRenderJoinButton } = useBoardJoinButton({
    boardId,
  });

  return (
    <div className={cx(styles['board-header'])} ref={headerRef}>
      <span
        className={cx({
          [styles.boardHeaderLeftSplit]: true,
        })}
      >
        <BoardName boardId={boardId} nativeBoardId={nativeBoardId} />
        {isTemplate && (
          <div className={styles.boardTemplateBadgeContainer}>
            <BoardTemplateBadge />
          </div>
        )}
        <CrossFlowProvider>
          <ViewSwitcher
            idBoard={boardId}
            isCollapsed={collapseDefaultButtons}
          />
        </CrossFlowProvider>
      </span>
      <span className={styles.boardHeaderRightSplit}>
        {showFacepile && (
          <BoardFacepile boardId={boardId} nativeBoardId={nativeBoardId} />
        )}

        {!headerIsEmbedded && isBoardMember && showPluginsButtons && (
          <BoardHeaderPluginButtons
            boardId={boardId}
            orgId={workspaceId}
            legacyBoardModel={legacyBoardModel}
            collapseDefaultButtons={collapseDefaultButtons}
            collapsePluginButtons={collapsePluginButtons}
          />
        )}
        <SingleBoardFilterPopoverButton
          idBoard={boardId}
          isCollapsed={collapseDefaultButtons}
        />
        {showActionsButtons && (
          <div className={styles.actionsButtons}>
            {!headerIsEmbedded && (
              <BoardHeaderStarButton
                boardId={boardId}
                isClosed={isClosed}
                isTemplate={isTemplate}
              />
            )}
            <BoardVisibilityButton
              isCollapsed={collapseDefaultButtons}
              className={styles.boardVisibilityButton}
            />
          </div>
        )}
        {canInviteMembers && showShareButton && !shouldRenderJoinButton && (
          <BoardShareButton idBoard={boardId} idOrg={workspaceId} />
        )}
        {showJoinButton && shouldRenderJoinButton && (
          <BoardJoinButton boardId={boardId} workspaceId={workspaceId} />
        )}
        {/** Sidebar button hides itself if the sidebar is visible */}
        {!headerIsEmbedded && (
          <BoardHeaderShowSidebarButton
            boardId={boardId}
            workspaceId={workspaceId}
            legacyBoardModel={legacyBoardModel}
            canInviteMembers={canInviteMembers}
            eventContainers={formatContainers({
              boardId,
              workspaceId,
            })}
          />
        )}
      </span>
    </div>
  );
};
