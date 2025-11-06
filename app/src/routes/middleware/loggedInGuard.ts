import { isMemberLoggedIn } from '@trello/authentication';

import type { MiddlewareFunction } from './MiddlewareFunction';

/**
 * Redirect to the login page if the user is not logged in.
 */
export const loggedInGuard: MiddlewareFunction =
  async (): Promise<Response | void> => {
    if (!isMemberLoggedIn()) {
      window.location.assign(
        `/login?returnUrl=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`,
      );
      // Return a 401 response to stop further processing of the route
      return new Response(null, {
        status: 401,
      });
    }
  };
