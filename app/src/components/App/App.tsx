import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { ApolloProvider } from '@trello/graphql';
import { TrelloIntlProvider } from '@trello/i18n';
import { UFORootSegment } from '@trello/ufo';

import { routes } from 'app/src/routes';
import { useApolloReadWriteReporter } from './useApolloReadWriteReporter';
import { useOfflineState } from './useOfflineState';
import { useQuickload } from './useQuickload';
import { useSecurityPolicyViolationReporter } from './useSecurityPolicyViolationReporter';

const router = createBrowserRouter(routes);

export const App = () => {
  const wasEverOffline = useOfflineState();
  useQuickload();
  useApolloReadWriteReporter();
  useSecurityPolicyViolationReporter();

  if (wasEverOffline) {
    window.location.href = `https://trello.status.atlassian.com/`;
  }

  return (
    <UFORootSegment>
      <TrelloIntlProvider>
        <ApolloProvider>
          <RouterProvider router={router} />
        </ApolloProvider>
      </TrelloIntlProvider>
    </UFORootSegment>
  );
};
