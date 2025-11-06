import { ApolloLink } from '@apollo/client';

import { logoutUser } from '@trello/authentication';

/**
 * This function handles the TOKEN_UNAUTHORIZED error code from server
 * and will log the user out. This mimics behavior we have in session-watcher.js
 */
export const handleUnauthorizedTokenLink = new ApolloLink(
  (operation, forward) => {
    return forward(operation).map((data) => {
      const isUnauthenticated = !!data.errors?.some(
        (error) => error.extensions?.errorType === 'TOKEN_UNAUTHORIZED',
      );

      if (isUnauthenticated) {
        logoutUser();
      }

      return data;
    });
  },
);
