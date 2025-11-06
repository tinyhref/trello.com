import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';

import { environment } from '@trello/config';

/**
 * Beginning with version 3.8, Apollo client omits error messages from its core
 * bundle to reduce its bundle size, replacing them with a link to this page:
 * https://www.apollographql.com/docs/react/errors/#what-is-this-page
 *
 * This page is frankly not very useful, especially since its URL completely
 * disables our ability to easily parse meaningful user-facing errors, and
 * introduces serious indirection to the debugging process.
 * This method adds those error messages back in, in all environments.
 * It should be called once, in the app root.
 */
export function loadErrorMessagesForApolloClient(): void {
  loadErrorMessages();

  if (environment !== 'prod') {
    loadDevMessages();
  }
}
