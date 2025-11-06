import type { FunctionComponent } from 'react';
import { Suspense } from 'react';
import { ApolloProvider } from '@apollo/client';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { client } from '@trello/graphql';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyAboutThisBoardContent: FunctionComponent<{
  boardId: string;
  onClose: () => void;
}> = ({ boardId, onClose }) => {
  const AboutThisBoardContent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "about-this-board-content" */ './AboutThisBoardContent'
      ),
    { preload: false, namedImport: 'AboutThisBoardContent' },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'About This Board Modal',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <ApolloProvider client={client}>
            <AboutThisBoardContent boardId={boardId} onClose={onClose} />
          </ApolloProvider>
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
