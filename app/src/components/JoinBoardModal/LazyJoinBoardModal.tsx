import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { ApolloProvider } from '@trello/graphql';
import { useLazyComponent } from '@trello/use-lazy-component';

export const dialogProps = {
  maxWidth: 600,
  displayType: 'board-invite-modal',
};

export const LazyJoinBoardModal: FunctionComponent<{
  idBoard: string;
}> = ({ idBoard }) => {
  const JoinBoardModal = useLazyComponent(
    () => import(/* webpackChunkName: "join-board-modal" */ './JoinBoardModal'),
    { preload: false, namedImport: 'JoinBoardModal' },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Join Board Modal',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <ApolloProvider>
            <JoinBoardModal idBoard={idBoard} />
          </ApolloProvider>
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
