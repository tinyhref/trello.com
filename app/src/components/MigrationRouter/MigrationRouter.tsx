import { useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

import {
  getRouteParamsFromPathname,
  useLocation,
  useNavigateOptions,
  useRouteId,
} from '@trello/router';
import { isRouteModernized } from '@trello/router/migration';
import { setReactRouterNavigateFunction } from '@trello/router/navigate';
import { RouteId } from '@trello/router/routes';
import { useSharedState } from '@trello/shared-state';

// eslint-disable-next-line no-restricted-imports
import { Controller } from 'app/scripts/controller';
import { errorPage } from 'app/scripts/controller/errorPage';
import { appRenderState } from 'app/src/appRenderState';

import * as styles from './MigrationRouter.module.less';

/**
 * Primary Router for Trello.  This is a light wrapper around React Router.
 * (Temporary) As we migrate routing from Backbone, there is a subset of routes that are
 * still using the Controller to render pages.  Once the migration is complete, we can replace
 * this component with an `Outlet` component and have `TrelloOnline` be the top-level layout component
 * for all routes, and React Router's `RouterProvider` will be at the top of the tree (under `App`).
 */
export const MigrationRouter = () => {
  const routeId = useRouteId();
  const navigateOptions = useNavigateOptions();
  const [, setAppRenderState] = useSharedState(appRenderState);
  const navigate = useNavigate();
  setReactRouterNavigateFunction(navigate);

  const { pathname } = useLocation();

  // In the case where trigger is `false` we don't want to execute the
  // controller function.  This is in line with Backbone's history.navigate
  // behavior.
  const shouldExecuteControllerFunction = navigateOptions?.trigger ?? true;

  useLayoutEffect(() => {
    setAppRenderState('afterPaint');

    if (!shouldExecuteControllerFunction) {
      // if "trigger" option is false, don't call the controller function
      return;
    }

    let clearViewTimeoutId: ReturnType<typeof setTimeout>;

    // We don't want to use the Controller for modernized routes
    if (isRouteModernized(routeId)) {
      clearViewTimeoutId = setTimeout(() => {
        // Clear any roots previously mounted by the Controller
        Controller.clearPreviousView({ isNextViewReact: true });
      }, 0);
      return;
    }

    switch (routeId) {
      // These are in the same order as they're defined in app/scripts/controller/index
      case RouteId.GO:
      case RouteId.TO:
      case RouteId.DOUBLE_SLASH: {
        const routeParams = getRouteParamsFromPathname<
          'doubleSlash' | 'go' | 'to'
        >(pathname);
        Controller.quickBoard(routeParams.search);
        break;
      }
      case RouteId.GET_APP:
        Controller.getAppPage();
        break;
      case RouteId.POWER_UP_ADMIN:
        Controller.powerUpAdmin();
        break;
      case RouteId.APPS_ADMIN:
        Controller.appsAdmin();
        break;
      case RouteId.POWER_UP_EDIT:
        Controller.editPowerUpPage();
        break;
      case RouteId.APPS_ADMIN_EDIT:
        Controller.appsAdminEdit();
        break;
      case RouteId.POWER_UP_PUBLIC_DIRECTORY:
        Controller.publicDirectory();
        break;
      case RouteId.WELCOME_TO_TRELLO:
        Controller.welcomeToTrelloPage();
        break;
      case RouteId.SHORTCUTS:
        Controller.shortcutsPage();
        break;
      case RouteId.SHORTCUTS_OVERLAY:
        Controller.shortcutsOverlayPage();
        break;
      case RouteId.BLANK:
        Controller.blankPage();
        break;
      case RouteId.SELECT_ORG_TO_UPGRADE:
        Controller.selectOrgToUpgradePage();
        break;
      case RouteId.SELECT_TEAM_TO_UPGRADE:
        Controller.selectTeamToUpgradePage();
        break;
      case RouteId.SEARCH:
        Controller.searchPage();
        break;
      case RouteId.OPEN_SOURCE_ATTRIBUTIONS:
        Controller.openSourceAttributionsPage();
        break;
      case RouteId.TEMPLATES:
        Controller.templatesGalleryPublicPage();
        break;
      case RouteId.TEMPLATES_RECOMMEND:
        Controller.templatesGalleryPublicPage();
        break;
      case RouteId.INVITE_ACCEPT_BOARD:
        Controller.inviteAcceptBoardPage();
        break;
      case RouteId.INVITE_ACCEPT_TEAM:
        Controller.inviteAcceptTeamPage();
        break;

      // Board: Old and new URL
      case RouteId.BOARD_OLD:
      case RouteId.BOARD: {
        Controller.boardPage();
        break;
      }

      // Card: Old, old, and new URL
      case RouteId.CARD_AND_BOARD_OLD:
      case RouteId.CARD_OLD:
      case RouteId.CARD: {
        Controller.cardPage();
        break;
      }

      case RouteId.CREATE_FIRST_BOARD:
        Controller.createFirstBoardPage();
        break;

      // Redeem route
      case RouteId.REDEEM:
        Controller.redeemPage();
        break;

      // User or Org routes
      case RouteId.ACCOUNT: {
        const routeParams = getRouteParamsFromPathname<'account'>(pathname);
        Controller.userOrOrgAccountPage(routeParams.name);
        break;
      }
      case RouteId.OLD_ACCOUNT: {
        const routeParams = getRouteParamsFromPathname<'oldAccount'>(pathname);
        Controller.userOrOrgAccountPage(routeParams.name);
        break;
      }
      case RouteId.PROFILE: {
        const routeParams = getRouteParamsFromPathname<'profile'>(pathname);
        Controller.userOrOrgProfilePage(routeParams.name);
        break;
      }
      case RouteId.WORKSPACE_BILLING: {
        const routeParams =
          getRouteParamsFromPathname<'workspaceBilling'>(pathname);
        Controller.organizationBillingView(routeParams.name);
        break;
      }
      case RouteId.BILLING: {
        const routeParams = getRouteParamsFromPathname<'billing'>(pathname);
        Controller.organizationBillingView(routeParams.name);
        break;
      }
      // If in doubt, place your new route before routes.userOrOrg.pattern
      case RouteId.USER_OR_ORG: {
        const routeParams = getRouteParamsFromPathname<'userOrOrg'>(pathname);
        Controller.userOrOrgProfilePage(routeParams.name);
        break;
      }
      case RouteId.ENTERPRISE_ADMIN: {
        const routeParams =
          getRouteParamsFromPathname<'enterpriseAdmin'>(pathname);
        Controller.enterpriseAdminDashboardView(routeParams.name);
        break;
      }
      case RouteId.ENTERPRISE_ADMIN_TAB: {
        const routeParams =
          getRouteParamsFromPathname<'enterpriseAdminTab'>(pathname);
        Controller.enterpriseDashTab(routeParams.name, routeParams.tab);
        break;
      }
      case RouteId.MEMBER_HOME: {
        Controller.memberHomePage();
        break;
      }
      case RouteId.MEMBER_HOME_WORKSPACE_BOARDS: {
        const routeParams =
          getRouteParamsFromPathname<'memberHomeBoards'>(pathname);
        Controller.memberHomeBoardsPage(routeParams.orgname);
        break;
      }
      case RouteId.OLD_MEMBER_HOME_WORKSPACE_BOARDS: {
        const routeParams =
          getRouteParamsFromPathname<'oldMemberHomeBoards'>(pathname);
        Controller.memberHomeBoardsPage(routeParams.orgname);
        break;
      }
      case RouteId.WORKSPACE_VIEW: {
        const routeParams =
          getRouteParamsFromPathname<'workspaceView'>(pathname);
        Controller.workspaceViewPage(routeParams.shortLink);
        break;
      }
      case RouteId.MEMBER_ALL_BOARDS: {
        const routeParams =
          getRouteParamsFromPathname<'memberAllBoards'>(pathname);
        Controller.memberAllBoardsPage(routeParams.username);
        break;
      }
      case RouteId.OLD_MEMBER_ALL_BOARDS: {
        const routeParams =
          getRouteParamsFromPathname<'oldMemberAllBoards'>(pathname);
        Controller.memberAllBoardsPage(routeParams.username);
        break;
      }
      case RouteId.MEMBER_CARDS: {
        const routeParams = getRouteParamsFromPathname<'memberCards'>(pathname);
        Controller.memberCardsPage(routeParams.username);
        break;
      }
      case RouteId.OLD_MEMBER_CARDS: {
        const routeParams =
          getRouteParamsFromPathname<'oldMemberCards'>(pathname);
        Controller.memberCardsPage(routeParams.username);
        break;
      }
      case RouteId.MEMBER_CARDS_FOR_ORG: {
        const routeParams =
          getRouteParamsFromPathname<'memberCardsForOrg'>(pathname);
        Controller.memberCardsPage(routeParams.username, routeParams.orgname);
        break;
      }
      case RouteId.OLD_MEMBER_CARDS_FOR_ORG: {
        const routeParams =
          getRouteParamsFromPathname<'oldMemberCardsForOrg'>(pathname);
        Controller.memberCardsPage(routeParams.username, routeParams.orgname);
        break;
      }
      case RouteId.MEMBER_ACTIVITY: {
        const routeParams =
          getRouteParamsFromPathname<'memberActivity'>(pathname);
        Controller.memberActivityPage(routeParams.username);
        break;
      }
      case RouteId.MEMBER_ACCOUNT: {
        const routeParams =
          getRouteParamsFromPathname<'memberAccount'>(pathname);
        Controller.memberAccountPage(routeParams.username);
        break;
      }
      case RouteId.MEMBER_PROFILE_SECTION: {
        const routeParams =
          getRouteParamsFromPathname<'memberProfile'>(pathname);
        Controller.memberProfilePage(routeParams.username);
        break;
      }
      case RouteId.OLD_MEMBER_ACTIVITY: {
        const routeParams =
          getRouteParamsFromPathname<'oldMemberActivity'>(pathname);
        Controller.memberActivityPage(routeParams.username);
        break;
      }
      case RouteId.MEMBER_TASKS: {
        Controller.memberTasksPage();
        break;
      }
      case RouteId.INBOX: {
        Controller.memberInboxPage();
        break;
      }
      case RouteId.OLD_INBOX: {
        Controller.memberInboxPage();
        break;
      }
      case RouteId.MEMBER_LABS: {
        const routeParams = getRouteParamsFromPathname<'memberLabs'>(pathname);
        Controller.memberLabsPage(routeParams.username);
        break;
      }
      case RouteId.OLD_MEMBER_LABS: {
        const routeParams =
          getRouteParamsFromPathname<'oldMemberLabs'>(pathname);
        Controller.memberLabsPage(routeParams.username);
        break;
      }
      case RouteId.OLD_ORGANIZATION_GUESTS: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationGuests'>(pathname);
        Controller.organizationGuestsView(routeParams.name);
        break;
      }
      case RouteId.OLD_ORGANIZATION_REQUESTS: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationRequests'>(pathname);
        Controller.organizationRequestsView(routeParams.name);
        break;
      }
      case RouteId.OLD_ORGANIZATION_MEMBERS: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationMembers'>(pathname);
        Controller.organizationMembersView(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_BOARDS: {
        const routeParams =
          getRouteParamsFromPathname<'organizationBoards'>(pathname);
        Controller.organizationBoardsView(routeParams.orgname);
        break;
      }
      case RouteId.ORGANIZATION_BY_ID: {
        const routeParams =
          getRouteParamsFromPathname<'organizationById'>(pathname);
        Controller.organizationById(routeParams.id);
        break;
      }
      case RouteId.ORGANIZATION_GUESTS: {
        const routeParams =
          getRouteParamsFromPathname<'organizationGuests'>(pathname);
        Controller.organizationGuestsView(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_REQUESTS: {
        const routeParams =
          getRouteParamsFromPathname<'organizationRequests'>(pathname);
        Controller.organizationRequestsView(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_MEMBERS: {
        const routeParams =
          getRouteParamsFromPathname<'organizationMembers'>(pathname);
        Controller.organizationMembersView(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_MEMBER_CARDS: {
        const routeParams =
          getRouteParamsFromPathname<'organizationMemberCards'>(pathname);
        Controller.organizationMemberCardsView(
          routeParams.name,
          routeParams.username,
        );
        break;
      }
      case RouteId.ORGANIZATION_EXPORT: {
        const routeParams =
          getRouteParamsFromPathname<'organizationExport'>(pathname);
        Controller.organizationExportView(routeParams.name);
        break;
      }
      case RouteId.OLD_ORGANIZATION_EXPORT: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationExport'>(pathname);
        Controller.organizationExportView(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_POWER_UPS: {
        const routeParams =
          getRouteParamsFromPathname<'organizationPowerUps'>(pathname);
        Controller.organizationPowerUpsPage(routeParams.name);
        break;
      }
      case RouteId.OLD_ORGANIZATION_POWER_UPS: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationPowerUps'>(pathname);
        Controller.organizationPowerUpsPage(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_TABLES: {
        const routeParams =
          getRouteParamsFromPathname<'organizationTables'>(pathname);
        Controller.organizationTableView(routeParams.name);
        break;
      }
      case RouteId.OLD_ORGANIZATION_TABLES: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationTables'>(pathname);
        Controller.organizationTableView(routeParams.name);
        break;
      }
      case RouteId.ORGANIZATION_FREE_TRIAL: {
        const routeParams =
          getRouteParamsFromPathname<'organizationFreeTrial'>(pathname);
        Controller.freeTrialView(routeParams.orgname);
        break;
      }
      case RouteId.OLD_ORGANIZATION_FREE_TRIAL: {
        const routeParams =
          getRouteParamsFromPathname<'oldOrganizationFreeTrial'>(pathname);
        Controller.freeTrialView(routeParams.orgname);
        break;
      }
      case RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW: {
        const routeParams =
          getRouteParamsFromPathname<'workspaceDefaultCustomTableView'>(
            pathname,
          );
        Controller.workspaceDefaultCustomTableViewPage(routeParams.orgname);
        break;
      }
      case RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW: {
        const routeParams =
          getRouteParamsFromPathname<'workspaceDefaultCustomTableView'>(
            pathname,
          );
        Controller.workspaceDefaultCustomTableViewPage(routeParams.orgname);
        break;
      }
      case RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW: {
        const routeParams =
          getRouteParamsFromPathname<'workspaceDefaultCustomCalendarView'>(
            pathname,
          );
        Controller.workspaceDefaultCustomCalendarViewPage(routeParams.orgname);
        break;
      }
      case RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW: {
        const routeParams =
          getRouteParamsFromPathname<'oldWorkspaceDefaultCustomCalendarView'>(
            pathname,
          );
        Controller.workspaceDefaultCustomCalendarViewPage(routeParams.orgname);
        break;
      }
      case RouteId.ERROR_PAGE:
        errorPage({
          errorType: 'notFound',
        });
        break;
      default:
      // Do nothing. If we hit this point it means we're rendering a React component instead.
    }
    return () => {
      clearViewTimeoutId && clearTimeout(clearViewTimeoutId);
    };
  }, [pathname, setAppRenderState, routeId, shouldExecuteControllerFunction]);

  // If the route has been modernized, then it should be configured in app/src/routes, and not be part of
  // the switch statement above.
  const isModernized = isRouteModernized(routeId);
  return (
    <>
      <div
        id="content"
        className={isModernized ? styles.hidden : styles.content}
      ></div>
      <div
        id="react-router-content"
        className={isModernized ? styles.content : styles.hidden}
      >
        <Outlet />
      </div>
    </>
  );
};
