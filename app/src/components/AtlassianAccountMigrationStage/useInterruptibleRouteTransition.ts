import { useEffect, useRef, useState } from 'react';

import { usePathname } from '@trello/router';
import {
  getRouteIdFromPathname,
  isBoardRoute,
  isCardRoute,
  RouteId,
} from '@trello/router/routes';

export function useInterruptibleRouteTransition() {
  const pathname = usePathname();
  const [interrupt, setInterrupt] = useState(true);
  const [isInitialRoute, setIsInitialRoute] = useState(true);
  const previousState = useRef('');

  useEffect(() => {
    const routeId = getRouteIdFromPathname(pathname);
    const previousPathname = previousState.current;
    const previousRouteId = getRouteIdFromPathname(previousPathname);

    const isOnboardingFlow =
      routeId === RouteId.CREATE_FIRST_BOARD ||
      routeId === RouteId.WELCOME_TO_TRELLO;

    const isBoard = isBoardRoute(routeId);
    const isCard = isCardRoute(routeId);
    const wasBoard = isBoardRoute(previousRouteId);
    const wasCard = isCardRoute(previousRouteId);

    const isApp =
      routeId === RouteId.POWER_UP_ADMIN ||
      routeId === RouteId.APPS_ADMIN ||
      routeId === RouteId.POWER_UP_EDIT ||
      routeId === RouteId.APPS_ADMIN_EDIT;
    const isSearch = routeId === RouteId.SEARCH;

    // Initial render/route is interruptible
    if (previousPathname === '') {
      setIsInitialRoute(true);
      setInterrupt(true);

      // Subsequent renders may or may not be interruptable
    } else {
      setIsInitialRoute(false);

      // Don't interrupt if the path hasn't changed
      if (pathname === previousPathname) {
        setInterrupt(false);

        // Don't interrupt during onboarding
      } else if (isOnboardingFlow) {
        setInterrupt(false);

        // Don't interrupt when transitioning to/from a card back
      } else if (isCard || wasCard) {
        setInterrupt(false);

        // Don't interrupt when editing an app
      } else if (isApp) {
        setInterrupt(false);

        // Don't interrupt when searching
      } else if (isSearch) {
        setInterrupt(false);

        // Interrupt when moving from one board to another
      } else if (isBoard && wasBoard && pathname !== previousPathname) {
        setInterrupt(true);

        // Interrupt for any other route change (eg, profile, search, templates, billing, etc.)
      } else {
        setInterrupt(true);
      }
    }

    previousState.current = pathname;
  }, [pathname]);

  return { interrupt, isInitialRoute };
}
