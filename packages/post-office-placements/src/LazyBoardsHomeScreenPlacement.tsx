import { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBoardsHomeScreenPlacement = ({
  workspaceId,
}: {
  workspaceId?: string;
}) => {
  const BoardsHomeScreenPlacement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "boards-home-screen-placement" */ './BoardsHomeScreenPlacement'
      ),
    { namedImport: 'BoardsHomeScreenPlacement' },
  );
  return (
    <Suspense fallback={null}>
      <BoardsHomeScreenPlacement workspaceId={workspaceId} />
    </Suspense>
  );
};
