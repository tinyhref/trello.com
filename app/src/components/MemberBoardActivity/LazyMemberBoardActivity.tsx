import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { MemberBoardActivityProps } from './MemberBoardActivity';

export const LazyMemberBoardActivity: FunctionComponent<
  MemberBoardActivityProps
> = (props) => {
  const MemberBoardActivity = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "member-board-activity" */ './MemberBoardActivity'
      ),
    { namedImport: 'MemberBoardActivity' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Member Board Activity',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <MemberBoardActivity {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
