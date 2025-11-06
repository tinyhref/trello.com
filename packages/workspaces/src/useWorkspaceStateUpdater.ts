import { useCallback, useEffect } from 'react';

import { client } from '@trello/graphql';
import { idCache } from '@trello/id-cache';
import { getInvitationCookieData } from '@trello/invitation-links';
import { deepEqual } from '@trello/objects';
import { getOperationName } from '@trello/quickload';
import { quickLoadSharedState } from '@trello/quickload-shared-state';
import { routerState } from '@trello/router';
import {
  routeDefinitions,
  RouteId,
  type RouteIdType,
} from '@trello/router/routes';
import { useSharedStateSelector } from '@trello/shared-state';
import type { WorkspaceState } from '@trello/workspace-state';
import { workspaceState } from '@trello/workspace-state';

import type {
  WorkspaceForBoardQuery,
  WorkspaceForBoardQueryVariables,
} from './WorkspaceForBoardQuery.generated';
import { WorkspaceForBoardDocument } from './WorkspaceForBoardQuery.generated';
import type {
  WorkspaceForCardQuery,
  WorkspaceForCardQueryVariables,
} from './WorkspaceForCardQuery.generated';
import { WorkspaceForCardDocument } from './WorkspaceForCardQuery.generated';
import type {
  WorkspaceForOrganizationQuery,
  WorkspaceForOrganizationQueryVariables,
} from './WorkspaceForOrganizationQuery.generated';
import { WorkspaceForOrganizationDocument } from './WorkspaceForOrganizationQuery.generated';
import {
  WorkspaceForOrganizationViewDocument,
  type WorkspaceForOrganizationViewQuery,
  type WorkspaceForOrganizationViewQueryVariables,
} from './WorkspaceForOrganizationViewQuery.generated';

interface RouteState {
  type: 'BOARD' | 'CARD' | 'GLOBAL' | 'ORGANIZATION_VIEW' | 'ORGANIZATION';
  idBoard?: string;
  idCard?: string;
  organizationName?: string;
  idOrganizationView?: string;
}

interface RouteStateGetter {
  (...args: string[]): RouteState;
}

function getBoardRouteState(idBoard: string): RouteState {
  return { type: 'BOARD', idBoard };
}

function getInviteAcceptBoardState(orgOrBoardId: string): RouteState {
  return { type: 'BOARD', idBoard: orgOrBoardId };
}

function getCardRouteState(idCard: string): RouteState {
  return { type: 'CARD', idCard };
}

function getOrganizationViewRouteState(idOrganizationView: string): RouteState {
  return { type: 'ORGANIZATION_VIEW', idOrganizationView };
}

function getOrganizationRouteState(organizationName: string): RouteState {
  return { type: 'ORGANIZATION', organizationName };
}

function getGlobalRouteState(): RouteState {
  return { type: 'GLOBAL' };
}

export const routeMap: Record<RouteIdType, RouteStateGetter> = {
  [RouteId.BOARD]: getBoardRouteState,

  [RouteId.BOARD_OLD]: (path: string) => {
    const parts = path.split('/');
    const idBoard = parts.length > 1 ? parts[1] : parts[0];
    return getBoardRouteState(idBoard);
  },

  [RouteId.BOARD_REFERRAL]: getBoardRouteState,

  [RouteId.CARD_OLD]: (...params: string[]) => {
    const idBoard = params.length > 2 ? params[1] : params[0];
    return getBoardRouteState(idBoard);
  },

  [RouteId.CARD_AND_BOARD_OLD]: (...params: string[]) => {
    const idBoard = params.length > 2 ? params[1] : params[0];
    return getBoardRouteState(idBoard);
  },

  [RouteId.CARD]: getCardRouteState,

  [RouteId.INBOX]: getGlobalRouteState,
  [RouteId.OLD_INBOX]: getGlobalRouteState,

  [RouteId.WORKSPACE_VIEW]: getOrganizationViewRouteState,
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]: getOrganizationRouteState,
  [RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW]: getOrganizationRouteState,
  [RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]: getOrganizationRouteState,
  [RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW]:
    getOrganizationRouteState,

  [RouteId.ACCOUNT]: getOrganizationRouteState,
  [RouteId.OLD_ACCOUNT]: getOrganizationRouteState,
  [RouteId.WORKSPACE_BILLING]: getOrganizationRouteState,
  [RouteId.BILLING]: getOrganizationRouteState,
  [RouteId.MEMBER_CARDS_FOR_ORG]: getOrganizationRouteState,
  [RouteId.OLD_MEMBER_CARDS_FOR_ORG]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_BOARDS]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_GUESTS]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_REQUESTS]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_MEMBERS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_BY_ID]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_EXPORT]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_EXPORT]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_FREE_TRIAL]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_FREE_TRIAL]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_GUESTS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_REQUESTS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_MEMBER_CARDS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_MEMBERS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_POWER_UPS]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_POWER_UPS]: getOrganizationRouteState,
  [RouteId.ORGANIZATION_TABLES]: getOrganizationRouteState,
  [RouteId.OLD_ORGANIZATION_TABLES]: getOrganizationRouteState,
  [RouteId.PROFILE]: getOrganizationRouteState,
  [RouteId.REDEEM]: getGlobalRouteState,
  [RouteId.USER_OR_ORG]: getOrganizationRouteState,

  [RouteId.BLANK]: getGlobalRouteState,
  [RouteId.CREATE_FIRST_BOARD]: getGlobalRouteState,
  [RouteId.WELCOME_TO_TRELLO]: getGlobalRouteState,
  [RouteId.DOUBLE_SLASH]: getGlobalRouteState,
  [RouteId.ENTERPRISE_ADMIN_TAB]: getGlobalRouteState,
  [RouteId.ENTERPRISE_ADMIN]: getGlobalRouteState,
  [RouteId.ERROR_PAGE]: getGlobalRouteState,
  [RouteId.GET_APP]: getGlobalRouteState,
  [RouteId.GO]: getGlobalRouteState,
  [RouteId.INVITE_ACCEPT_BOARD]: getInviteAcceptBoardState,
  [RouteId.INVITE_ACCEPT_TEAM]: getGlobalRouteState,
  [RouteId.MEMBER_ACTIVITY]: getGlobalRouteState,
  [RouteId.OLD_MEMBER_ACTIVITY]: getGlobalRouteState,
  [RouteId.MEMBER_ALL_BOARDS]: getGlobalRouteState,
  [RouteId.OLD_MEMBER_ALL_BOARDS]: getGlobalRouteState,
  [RouteId.MEMBER_CARDS]: getGlobalRouteState,
  [RouteId.OLD_MEMBER_CARDS]: getGlobalRouteState,
  [RouteId.MEMBER_HOME]: getGlobalRouteState,
  [RouteId.MEMBER_HOME_WORKSPACE_BOARDS]: getOrganizationRouteState,
  [RouteId.OLD_MEMBER_HOME_WORKSPACE_BOARDS]: getOrganizationRouteState,
  [RouteId.MEMBER_PROFILE_SECTION]: getGlobalRouteState,
  [RouteId.MEMBER_TASKS]: getGlobalRouteState,
  [RouteId.MEMBER_LABS]: getGlobalRouteState,
  [RouteId.OLD_MEMBER_LABS]: getGlobalRouteState,
  [RouteId.POWER_UP_ADMIN]: getGlobalRouteState,
  [RouteId.APPS_ADMIN]: getGlobalRouteState,
  [RouteId.POWER_UP_EDIT]: getGlobalRouteState,
  [RouteId.APPS_ADMIN_EDIT]: getGlobalRouteState,
  [RouteId.POWER_UP_PUBLIC_DIRECTORY]: getGlobalRouteState,
  [RouteId.SEARCH]: getGlobalRouteState,
  [RouteId.OPEN_SOURCE_ATTRIBUTIONS]: getGlobalRouteState,
  [RouteId.SELECT_ORG_TO_UPGRADE]: getGlobalRouteState,
  [RouteId.SELECT_TEAM_TO_UPGRADE]: getGlobalRouteState,
  [RouteId.SHORTCUTS_OVERLAY]: getGlobalRouteState,
  [RouteId.SHORTCUTS]: getGlobalRouteState,
  [RouteId.TEMPLATES_RECOMMEND]: getGlobalRouteState,
  [RouteId.TEMPLATES]: getGlobalRouteState,
  [RouteId.TO]: getGlobalRouteState,
  [RouteId.MEMBER_ACCOUNT]: getGlobalRouteState,
  [RouteId.MEMBER_AI_SETTINGS]: getGlobalRouteState,
};

export const observeWorkspaceState = () => {
  const routeId = routerState.value.id;
  const pathname = routerState.value.location.pathname;
  const getter = routeMap[routeId];
  const match = routeDefinitions[routeId].regExp.exec(pathname.slice(1));
  const params = match?.slice(1) ?? [];

  const { orgOrBoardId } = getInvitationCookieData();
  if (orgOrBoardId) params.push(orgOrBoardId);

  const {
    type,
    idOrganizationView: idOrganizationViewFromPathname,
    organizationName,
    idBoard: idBoardFromPathname,
    idCard: idCardFromPathname,
  } = getter(...params);

  let unsubscribeFromQuery = () => {};
  let isGlobal = type === 'GLOBAL';
  let workspaceId: string | null,
    isLoading: boolean,
    idBoard: string | null,
    workspaceViewId: string | null;

  const possiblySetWorkspaceState = () => {
    const nextState: WorkspaceState = {
      workspaceId,
      isLoading,
      idBoard,
      workspaceViewId,
      isGlobal,
    };

    if (deepEqual(nextState, workspaceState.value)) {
      return;
    }

    workspaceState.setValue(nextState);
  };

  if (type === 'BOARD') {
    const observer = client.watchQuery<
      WorkspaceForBoardQuery,
      WorkspaceForBoardQueryVariables
    >({
      query: WorkspaceForBoardDocument,
      variables: {
        idBoard: idBoardFromPathname ?? '',
      },
      context: {
        operationName: getOperationName(WorkspaceForBoardDocument),
      },
    });

    const subscriber = observer.subscribe((result) => {
      workspaceId = result?.data?.board?.idOrganization ?? null;
      isLoading = result.loading;
      idBoard = result?.data?.board?.id ?? null;
      workspaceViewId = null;
      possiblySetWorkspaceState();
    });

    unsubscribeFromQuery = subscriber.unsubscribe.bind(subscriber);
  } else if (type === 'CARD') {
    const observer = client.watchQuery<
      WorkspaceForCardQuery,
      WorkspaceForCardQueryVariables
    >({
      query: WorkspaceForCardDocument,
      variables: {
        idCard: idCardFromPathname ?? '',
      },
      context: {
        operationName: getOperationName(WorkspaceForCardDocument),
      },
    });

    const subscriber = observer.subscribe((result) => {
      workspaceId = result?.data?.card?.board?.idOrganization ?? null;
      isLoading = result.loading;
      idBoard = result?.data?.card?.board?.id ?? null;
      workspaceViewId = null;
      possiblySetWorkspaceState();
    });

    unsubscribeFromQuery = subscriber.unsubscribe.bind(subscriber);
  } else if (type === 'ORGANIZATION_VIEW') {
    const observer = client.watchQuery<
      WorkspaceForOrganizationViewQuery,
      WorkspaceForOrganizationViewQueryVariables
    >({
      query: WorkspaceForOrganizationViewDocument,
      variables: {
        idOrganizationView: idOrganizationViewFromPathname ?? '',
      },
      context: {
        operationName: getOperationName(WorkspaceForOrganizationViewDocument),
      },
    });

    const subscriber = observer.subscribe((result) => {
      workspaceId = result?.data?.organizationView?.idOrganization ?? null;
      isLoading = result.loading;
      idBoard = null;
      workspaceViewId = result?.data?.organizationView?.id ?? null;
      possiblySetWorkspaceState();
    });

    unsubscribeFromQuery = subscriber.unsubscribe.bind(subscriber);
  } else if (type === 'ORGANIZATION') {
    const observer = client.watchQuery<
      WorkspaceForOrganizationQuery,
      WorkspaceForOrganizationQueryVariables
    >({
      query: WorkspaceForOrganizationDocument,
      variables: {
        orgId: organizationName
          ? (idCache.getWorkspaceId(organizationName) ?? organizationName)
          : '',
      },
      context: {
        operationName: getOperationName(WorkspaceForOrganizationDocument),
      },
    });

    const subscriber = observer.subscribe((result) => {
      workspaceId = result?.data?.organization?.id ?? null;
      isLoading = result.loading;
      idBoard = null;
      workspaceViewId = null;

      // If there is no workspaceId on the USER_OR_ORG route then it means we
      // are on the USER route which should be a global page
      // If there is no workspaceId on the ACCOUNT route then it means we are
      // on the users account settins page which should be a global page
      // If there is no workspaceId on the PROFILE route then it means we are
      // on the users profile page which should be a global page
      // If there is no workspaceId on the BILLING route then it means we are
      // on the users billing page which should be a global page
      if (
        !isLoading &&
        (
          [
            RouteId.USER_OR_ORG,
            RouteId.ACCOUNT,
            RouteId.OLD_ACCOUNT,
            RouteId.PROFILE,
            RouteId.BILLING,
          ] as string[]
        ).includes(routeId) &&
        !workspaceId
      ) {
        isGlobal = true;
      }

      possiblySetWorkspaceState();
    });

    unsubscribeFromQuery = subscriber.unsubscribe.bind(subscriber);
  } else {
    workspaceId = null;
    isLoading = false;
    idBoard = null;
    workspaceViewId = null;

    possiblySetWorkspaceState();
  }

  return unsubscribeFromQuery;
};

/**
 * NOTE. This hook is used in TrelloOnline. That means that the top level of the Trello
 * application will rerender whenever state changes occur in this hook. To avoid that,
 * we use a subscriber in the useEffect and set the value on a shared state.
 */
export function useWorkspaceStateUpdater() {
  const isQuickLoading = useSharedStateSelector(
    quickLoadSharedState,
    useCallback((state) => state.isLoading, []),
  );

  useEffect(() => {
    if (isQuickLoading) {
      return;
    }

    let unsubscribeFromLastState = observeWorkspaceState();
    const unsubscribe = routerState.subscribe((state) => {
      unsubscribeFromLastState();
      unsubscribeFromLastState = observeWorkspaceState();
    });

    return () => {
      unsubscribe();
      unsubscribeFromLastState();
    };
  }, [isQuickLoading]);
}
