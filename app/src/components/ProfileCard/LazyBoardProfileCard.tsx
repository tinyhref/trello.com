import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { Props } from './BoardProfileCard';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';

export const LazyBoardProfileCard: FunctionComponent<Props> = (props) => {
  const BoardProfileCard = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-profile-card" */ './BoardProfileCard'),
    { namedImport: 'BoardProfileCard' },
  );
  return (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Board Profile Card' }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={<ProfileCardSkeleton onClose={props.onClose} />}>
          <BoardProfileCard {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
