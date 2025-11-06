import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type { EventContainer } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { useIsAtlassianIntelligenceEnabled } from '@trello/atlassian-intelligence';
import { isAndroid, isIos } from '@trello/browser';
import { DynamicButton } from '@trello/dynamic-tokens';
import { useFeatureGate } from '@trello/feature-gate-client';
import { intl } from '@trello/i18n';
import { Key, registerShortcut, Scope } from '@trello/keybindings';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { OverflowMenuHorizontalIcon } from '@trello/nachos/icons/overflow-menu-horizontal';
import { Popover, usePopover } from '@trello/nachos/popover';
import { useNewFeature } from '@trello/new-feature';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSharedState } from '@trello/shared-state';
import { getTestId, type BoardMenuTestIds } from '@trello/test-ids';
import { usePressTracing } from '@trello/ufo';

import { LazyBoardInviteModal } from 'app/src/components/BoardInviteModal';
import { isEditingBoardDescriptionState } from 'app/src/components/BoardMenuDescription/isEditingBoardDescriptionState';
import { LazyBoardMenuPopover } from 'app/src/components/BoardMenuPopover/LazyBoardMenuPopover';
import {
  LazySpotlightManager,
  LazySpotlightTarget,
  Pulse,
} from 'app/src/components/Onboarding';
import type { Board } from 'app/src/components/PluginHeaderButton/PluginHeaderButton.types';

import * as styles from './BoardHeaderShowSidebarButton.module.less';

interface BoardHeaderShowSidebarButtonProps {
  boardId: string;
  workspaceId: string;
  legacyBoardModel: Board;
  canInviteMembers: boolean;
  eventContainers: EventContainer;
}

export const BoardHeaderShowSidebarButton: FunctionComponent<
  BoardHeaderShowSidebarButtonProps
> = ({
  eventContainers,
  boardId,
  workspaceId,
  legacyBoardModel,
  canInviteMembers,
}) => {
  const { value: isTrelloE2bAIEnabled } = useFeatureGate(
    'trello-server-e2b-ai',
  );

  const isAtlassianIntelligenceEnabled = useIsAtlassianIntelligenceEnabled({
    boardId,
  });

  const {
    isNewFeature: isNewE2BAIFeature,
    acknowledgeNewFeature: acknowledgeE2BAINewFeature,
  } = useNewFeature('trello-e2b-ai');

  const traceInteraction = usePressTracing('board-menu-popover-press-tracing');

  const isActiveCardRoute = useIsActiveRoute(RouteId.CARD);

  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState(false);
  const {
    triggerRef,
    toggle,
    push,
    hide: hideMenuPopover,
    popoverProps,
    pop,
  } = usePopover({
    placement: 'bottom-end',
    onHide: () => {
      // Reset the shared state in the event the board menu popover was closed
      // while editing the board description.
      isEditingBoardDescriptionState.setValue(false);
    },
  });

  const {
    dialogProps,
    show: showInviteDialog,
    hide: hideInviteDialog,
  } = useDialog();

  useEffect(() => {
    setIsSpotlightEnabled(
      !!isTrelloE2bAIEnabled &&
        !!isAtlassianIntelligenceEnabled &&
        isNewE2BAIFeature &&
        !isActiveCardRoute &&
        !isIos() &&
        !isAndroid(),
    );
  }, [
    isTrelloE2bAIEnabled,
    isNewE2BAIFeature,
    isActiveCardRoute,
    isAtlassianIntelligenceEnabled,
  ]);

  const handleMenuOpen = useCallback(
    (
      type: 'button' | 'shortcut',
      event?: KeyboardEvent | React.KeyboardEvent | React.MouseEvent,
    ) => {
      traceInteraction(event); // trigger UFO tracing interaction

      if (type === 'button') {
        Analytics.sendClickedButtonEvent({
          buttonName: 'showSidebarButton',
          source: 'boardScreen',
          containers: eventContainers,
        });
      } else {
        Analytics.sendPressedShortcutEvent({
          shortcutName: 'boardsMenuShortcut',
          keyValue: ']',
          source: 'boardScreen',
          containers: eventContainers,
        });
      }

      toggle();

      acknowledgeE2BAINewFeature({ source: 'boardScreen' });
    },
    [traceInteraction, acknowledgeE2BAINewFeature, eventContainers, toggle],
  );

  const openInviteDialog = useCallback(() => {
    showInviteDialog();
    hideMenuPopover();
  }, [hideMenuPopover, showInviteDialog]);

  registerShortcut((event) => handleMenuOpen('shortcut', event), {
    scope: Scope.Sidebar,
    key: Key.ClosedBracket,
  });

  const [isFocusTrappingDisabled] = useSharedState<boolean>(
    isEditingBoardDescriptionState,
  );

  const menuButtonComponent = (
    <DynamicButton
      className={isSpotlightEnabled ? '' : styles.showSidebarButton}
      aria-label={intl.formatMessage({
        id: 'templates.board_header.show-menu',
        defaultMessage: 'Show menu',
        description: 'aria-label for show menu button',
      })}
      iconBefore={<OverflowMenuHorizontalIcon size={'medium'} />}
      onClick={(event) => handleMenuOpen('button', event)}
      ref={triggerRef}
    />
  );

  return (
    <>
      <LazySpotlightManager>
        <LazySpotlightTarget name="sidebarButton">
          {isSpotlightEnabled ? (
            <Pulse
              className={styles.sidebarExtraMargin}
              onClick={(event) => handleMenuOpen('button', event)}
            >
              {menuButtonComponent}
            </Pulse>
          ) : (
            menuButtonComponent
          )}
        </LazySpotlightTarget>
      </LazySpotlightManager>
      {
        <>
          <Popover
            {...popoverProps}
            noHorizontalPadding
            dangerous_className={styles.popover}
            dangerous_width={354}
            enableArrowKeyNavigation={!isFocusTrappingDisabled}
            testId={getTestId<BoardMenuTestIds>('board-menu-popover')}
          >
            <LazyBoardMenuPopover
              push={push}
              pop={pop}
              hideMenuPopover={hideMenuPopover}
              legacyBoardModel={legacyBoardModel}
              canInviteMembers={canInviteMembers}
              showInviteDialogCallback={openInviteDialog}
              menuSidebarButtonElement={popoverProps.triggerElement}
            />
          </Popover>
          <Dialog {...dialogProps}>
            <LazyBoardInviteModal
              idBoard={boardId}
              idOrg={workspaceId}
              onClose={hideInviteDialog}
            />
          </Dialog>
        </>
      }
    </>
  );
};
