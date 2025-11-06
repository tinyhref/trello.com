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

export const LazyBoardInviteModal: FunctionComponent<{
  idBoard: string;
  idOrg?: string;
  onClose: () => void;
  startingTab?: 'members' | 'requests';
}> = ({ idBoard, idOrg = '', onClose, startingTab }) => {
  const BoardInviteModal = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-invite-modal" */ './BoardInviteModal'),
    { preload: false, namedImport: 'BoardInviteModal' },
  );

  return (
    <Suspense fallback={null}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-web-eng',
          feature: 'Board Invite Modal',
        }}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <ApolloProvider>
            <BoardInviteModal
              idBoard={idBoard}
              idOrg={idOrg}
              onClose={onClose}
              startingTab={startingTab}
            />
          </ApolloProvider>
        </ChunkLoadErrorBoundary>
      </ErrorBoundary>
    </Suspense>
  );
};
