import { gql } from '@apollo/client';
import type { Params } from 'react-router';

import { getMemberId } from '@trello/authentication';
import { client } from '@trello/graphql';
import {
  getPreloadsFromInitialPath,
  preloadErrorMessage,
  waitForQuickloadPreload,
} from '@trello/quickload';
import { navigate } from '@trello/router/navigate';

interface UsernameAuthGuardOptions {
  redirectUrl: (usernameDynamicSegment: string) => string;
  getUsernameFromParams: (params: Params<string>) => string;
}

const MEMBER_FRAGMENT = gql`
  fragment MemberInfo on Member {
    id
    username
  }
`;

/**
 * Get the current user's username from preloads or Apollo cache
 * @returns The username or null if not found in cache
 */
const getCurrentUsername = async (): Promise<string | null> => {
  // First check if preload cache is available for retrieving user data
  try {
    const { preloads } = getPreloadsFromInitialPath();
    const memberHeaderPreload = preloads.find(
      (preload) => preload.queryName === 'MemberHeader',
    );
    if (memberHeaderPreload) {
      await waitForQuickloadPreload(memberHeaderPreload.url);
    }
  } catch (error) {
    // This is an "error" we expect to happen once the quickload cache has been cleared, so only log unexpected errors
    if (error !== preloadErrorMessage) {
      console.error('Error fetching current username from preload:', error);
    }
  }
  const memberId = getMemberId();
  // Apollo cache is primed regardless of what state quickload was in when
  // we awaited. Now we're always reading from the same place.
  const cachedMember = client.readFragment({
    id: `Member:${memberId}`,
    fragmentName: 'MemberInfo',
    fragment: MEMBER_FRAGMENT,
  });

  return cachedMember?.username ?? null;
};

/**
 * Username Auth Middleware Factory
 * This middleware validates that the username in the URL matches the currently logged-in user.
 * It prevents users from accessing other users' private pages by checking the :username parameter
 * against the authenticated user's actual username. If they don't match, it redirects to the
 * correct user's page or login if not authenticated.
 * @param options Auth Middleware options
 * @returns Middleware function
 */
export const createUsernameAuthGuard = (options: UsernameAuthGuardOptions) => {
  return async ({
    params,
  }: {
    params: Params<string>;
  }): Promise<Response | void> => {
    // If url contains a username parameter (i.e. :username, :name), validate logged in user matches
    const { redirectUrl, getUsernameFromParams } = options;

    const loginUrl = `/login?returnUrl=${encodeURIComponent(
      window.location.pathname + window.location.search,
    )}`;

    const usernameFromParams = getUsernameFromParams(params);

    if (!usernameFromParams) {
      return; // No username dynamic segment in URL to validate
    }

    const currentUsername = await getCurrentUsername();

    if (!currentUsername) {
      window.location.assign(loginUrl);
      // Return a 401 response to stop further processing of the route
      return new Response(null, {
        status: 401,
      });
    }

    // Validate username dynamic segment in URL
    if (usernameFromParams !== currentUsername) {
      const resolvedRedirectUrl = redirectUrl(
        encodeURIComponent(usernameFromParams),
      );
      navigate(resolvedRedirectUrl, { replace: true });
      // Return a 401 response to stop further processing of the route
      return new Response(null, {
        status: 401,
      });
    }
  };
};
