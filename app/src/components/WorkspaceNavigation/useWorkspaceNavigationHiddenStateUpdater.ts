import { useCallback, useEffect } from 'react';

import { isMemberLoggedIn } from '@trello/authentication';
import { isEmbeddedDocument } from '@trello/browser';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useIsActiveRoute } from '@trello/router';
import { RouteId, type RouteIdType } from '@trello/router/routes';
import { useSharedState, useSharedStateSelector } from '@trello/shared-state';
import { workspaceNavigationHiddenState } from '@trello/workspace-navigation';
import { workspaceState } from '@trello/workspace-state';
import { usePreviousWhileLoading } from '@trello/workspaces';

import { workspaceNavigationErrorState } from './workspaceNavigationErrorState';

export const navHiddenRoutes = new Set<RouteIdType>([
  RouteId.MEMBER_HOME_WORKSPACE_BOARDS,
  RouteId.CREATE_FIRST_BOARD,
  RouteId.WELCOME_TO_TRELLO,
  RouteId.MEMBER_CARDS_FOR_ORG,
  RouteId.OLD_MEMBER_CARDS_FOR_ORG,
  RouteId.REDEEM,
  RouteId.BLANK,
  RouteId.DOUBLE_SLASH,
  RouteId.ENTERPRISE_ADMIN_TAB,
  RouteId.ENTERPRISE_ADMIN,
  RouteId.ERROR_PAGE,
  RouteId.GO,
  RouteId.INVITE_ACCEPT_TEAM,
  RouteId.MEMBER_ALL_BOARDS,
  RouteId.OLD_MEMBER_ACTIVITY,
  RouteId.OLD_MEMBER_ALL_BOARDS,
  RouteId.OLD_MEMBER_CARDS,
  RouteId.MEMBER_HOME,
  RouteId.MEMBER_TASKS,
  RouteId.MEMBER_LABS,
  RouteId.OLD_MEMBER_LABS,
  RouteId.POWER_UP_ADMIN,
  RouteId.APPS_ADMIN,
  RouteId.POWER_UP_EDIT,
  RouteId.APPS_ADMIN_EDIT,
  RouteId.POWER_UP_PUBLIC_DIRECTORY,
  RouteId.SEARCH,
  RouteId.OPEN_SOURCE_ATTRIBUTIONS,
  RouteId.SELECT_ORG_TO_UPGRADE,
  RouteId.SELECT_TEAM_TO_UPGRADE,
  RouteId.SHORTCUTS_OVERLAY,
  RouteId.SHORTCUTS,
  RouteId.TEMPLATES_RECOMMEND,
  RouteId.TEMPLATES,
  RouteId.TO,
]);

export const splitScreenHiddenRoutes = new Set<RouteIdType>([
  ...navHiddenRoutes,
  RouteId.CARD,
  RouteId.BOARD,
  RouteId.WORKSPACE_VIEW,
  RouteId.ORGANIZATION_TABLES,
  RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
  RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  RouteId.OLD_ORGANIZATION_TABLES,
  RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
  RouteId.INVITE_ACCEPT_BOARD,
  RouteId.INVITE_ACCEPT_TEAM,
]);

export function useWorkspaceNavigationHiddenStateUpdater() {
  const [navHiddenState, setNavHiddenState] = useSharedState(
    workspaceNavigationHiddenState,
  );
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  let blocklist = new Set(navHiddenRoutes);
  if (isSplitScreenEnabled) {
    blocklist = new Set([...blocklist, ...splitScreenHiddenRoutes]);
  }

  const [navErrorState] = useSharedState(workspaceNavigationErrorState);
  const isHiddenRoute = useIsActiveRoute(blocklist);

  const isMemberProfileRoute = useIsActiveRoute(RouteId.MEMBER_PROFILE_SECTION);
  const isMemberActivityRoute = useIsActiveRoute(RouteId.MEMBER_ACTIVITY);
  const isMemberCardRoute = useIsActiveRoute(RouteId.MEMBER_CARDS);
  const isMemberAccountRoute = useIsActiveRoute(RouteId.MEMBER_ACCOUNT);
  const isMemberAiSettingsRoute = useIsActiveRoute(RouteId.MEMBER_AI_SETTINGS);

  const workspace = useSharedStateSelector(
    workspaceState,
    useCallback(
      (state) => ({
        isGlobal: state.isGlobal,
        isLoading: state.isLoading,
      }),
      [],
    ),
  );

  let isGlobal = usePreviousWhileLoading(
    workspace.isGlobal,
    workspace.isLoading,
    false,
  );
  // m2 workspace pages need global user settings to live in the sidebar, therefore they cannot be global
  // in order to see the workspace switcher
  if (
    isMemberProfileRoute ||
    isMemberActivityRoute ||
    isMemberCardRoute ||
    isMemberAccountRoute ||
    isMemberAiSettingsRoute
  ) {
    isGlobal = false;
  }

  const hideWorkspaceNav =
    isEmbeddedDocument() ||
    isHiddenRoute ||
    isGlobal ||
    navErrorState.hasError ||
    !isMemberLoggedIn();

  useEffect(() => {
    if (hideWorkspaceNav !== navHiddenState.hidden) {
      setNavHiddenState({ hidden: hideWorkspaceNav });
    }
  }, [hideWorkspaceNav, navHiddenState.hidden, setNavHiddenState]);
}
