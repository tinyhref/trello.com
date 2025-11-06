import { ApolloLink } from '@apollo/client';

import { Analytics } from '@trello/atlassian-analytics';

export const trelloRequiredHeadersLink = new ApolloLink(
  (operation, forward) => {
    const context = operation.getContext();
    const clientVersion = context.clientAwareness?.version || 'dev-0';
    const traceId: string | undefined = context.traceId;

    operation.setContext(() => ({
      headers: {
        ...(context.headers || {}),
        'X-Trello-Client-Version': clientVersion,
        'Atl-Client-Name': 'Trello Web',
        'Atl-Client-Version': clientVersion,
        ...Analytics.getTaskRequestHeaders(traceId),
      },
    }));

    return forward(operation).map((response) => {
      const trelloServerVersion = operation
        .getContext()
        .response?.headers.get('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
      return response;
    });
  },
);
