import cx from 'classnames';
import { useCallback, type FunctionComponent } from 'react';

import { LazyAtlassianAppSwitcherButton } from '@trello/atlassian-app-switcher';
import { isMemberLoggedIn } from '@trello/authentication';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useSplitScreenSharedState } from '@trello/split-screen';
import type { HeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyCreateWorkspaceViewPopoverScreenContent } from 'app/src/components/CreateWorkspaceViewPopoverScreen';
import { LazyInternalToolsButton } from 'app/src/components/InternalTools';
import { LazyInviteTeamMembersForm } from 'app/src/components/InviteTeamMembers';
import { LazyLoggedOutHeader } from 'app/src/components/LoggedOutHeader';
import { LazyNotificationsMenuButton } from 'app/src/components/NotificationsMenu';
import { LazyPlanComparisonModal } from 'app/src/components/PlanDetails/LazyPlanComparisonModal';
import { premiumTrialPaymentModalOverlayState } from 'app/src/components/PremiumTrialPaymentModalOverlay';
import { useIsSmartScheduleM2Enabled } from 'app/src/components/SmartSchedule';
import { LazyTacoAnnouncements } from 'app/src/components/TacoAnnouncements';
import { LazyAuthenticatedHeader } from './LazyAuthenticatedHeader';
import { LazySkipNavigation } from './LazySkipNavigation';
import { useShouldRenderHeader } from './useShouldRenderHeader';

import * as styles from './Header.module.less';

export const Header: FunctionComponent = () => {
  const shouldRenderHeader = useShouldRenderHeader();
  const isBoardRoute = useIsActiveRoute(RouteId.BOARD);
  const isCardRoute = useIsActiveRoute(RouteId.CARD);
  const onTrialExtensionClick = useCallback(() => {
    premiumTrialPaymentModalOverlayState.setValue({ isVisible: true });
  }, []);

  const { areMultiplePanelsOpen } = useSplitScreenSharedState();
  const isSmartScheduleM2Enabled = useIsSmartScheduleM2Enabled();
  const isBoardOrCardRouteActive = isCardRoute || isBoardRoute;

  const useReducedHeaderHeight =
    isBoardOrCardRouteActive &&
    areMultiplePanelsOpen &&
    isSmartScheduleM2Enabled;

  if (!shouldRenderHeader) {
    return null;
  }

  const isAuthenticated = isMemberLoggedIn();
  return (
    <div
      data-testid={getTestId<HeaderTestIds>('header-container')}
      data-desktop-id="header"
      // needed for hiding the header in moonshot
      // create-first-board and welcome-to-trello
      data-js-id="header-container"
      className={cx(isAuthenticated ? styles.header : styles.loggedOutHeader, {
        [styles.heightWithoutBottomPadding]: useReducedHeaderHeight,
      })}
    >
      {isBoardRoute && <LazySkipNavigation />}
      {isAuthenticated ? (
        <LazyAuthenticatedHeader
          AtlassianAppSwitcherButton={LazyAtlassianAppSwitcherButton}
          CreateWorkspaceViewPopover={
            LazyCreateWorkspaceViewPopoverScreenContent
          }
          InviteTeamMembersForm={LazyInviteTeamMembersForm}
          InternalToolsButton={LazyInternalToolsButton}
          NotificationsButton={LazyNotificationsMenuButton}
          TacoAnnouncements={LazyTacoAnnouncements}
          PlanComparisonModal={LazyPlanComparisonModal}
          onTrialExtensionClick={onTrialExtensionClick}
        />
      ) : (
        <LazyLoggedOutHeader />
      )}
    </div>
  );
};
