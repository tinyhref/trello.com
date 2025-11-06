import { useMemo } from 'react';

import { isEmbeddedDocument, isEmbeddedInMSTeams } from '@trello/browser';
import { useIsActiveRoute } from '@trello/router';
import { RouteId, type RouteIdType } from '@trello/router/routes';

const HEADER_ROUTES_BLOCKLIST = new Set<RouteIdType>([
  RouteId.CREATE_FIRST_BOARD,
  RouteId.WELCOME_TO_TRELLO,
  RouteId.REDEEM,
  RouteId.ORGANIZATION_BY_ID,
  RouteId.ORGANIZATION_BOARDS,
  RouteId.ORGANIZATION_MEMBERS,
  RouteId.ORGANIZATION_GUESTS,
  RouteId.ORGANIZATION_REQUESTS,
  RouteId.ACCOUNT,
  RouteId.ORGANIZATION_EXPORT,
  RouteId.ORGANIZATION_POWER_UPS,
  RouteId.WORKSPACE_BILLING,
  RouteId.ORGANIZATION_FREE_TRIAL,
  RouteId.WORKSPACE_VIEW,
  RouteId.ORGANIZATION_TABLES,
  RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  RouteId.WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
  RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  RouteId.OLD_ORGANIZATION_TABLES,
  RouteId.OLD_WORKSPACE_DEFAULT_CUSTOM_CALENDAR_VIEW,
  RouteId.MEMBER_PROFILE_SECTION,
  RouteId.MEMBER_ACTIVITY,
  RouteId.MEMBER_CARDS,
  RouteId.MEMBER_ACCOUNT,
  RouteId.MEMBER_AI_SETTINGS,
]);

const BOARD_OR_CARD_ROUTES = new Set<RouteIdType>([
  RouteId.BOARD,
  RouteId.CARD,
]);

/** The Header should be hidden on certain routes. */
export const useShouldRenderHeader = () => {
  const isRouteThatHidesHeader = useIsActiveRoute(HEADER_ROUTES_BLOCKLIST);
  const isBoardOrCardRoute = useIsActiveRoute(BOARD_OR_CARD_ROUTES);
  const isEmbeddedOnBoard = useMemo(
    () => isEmbeddedDocument() && isBoardOrCardRoute,
    [isBoardOrCardRoute],
  );

  // Checks URL params to see if source is MS Teams
  // We don't want to show the header in MS Teams static tabs
  const isEmbeddedinMicrosoftTeams = isEmbeddedInMSTeams();

  return (
    !isRouteThatHidesHeader && !isEmbeddedOnBoard && !isEmbeddedinMicrosoftTeams
  );
};
