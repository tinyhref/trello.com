import type { FunctionComponent, PropsWithChildren } from 'react';

import { ApolloProvider } from '@trello/graphql';
import { TrelloIntlProvider } from '@trello/i18n';

export const ComponentWrapper: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  return (
    <div className="js-react-root">
      <TrelloIntlProvider>
        <ApolloProvider>{children}</ApolloProvider>
      </TrelloIntlProvider>
    </div>
  );
};
