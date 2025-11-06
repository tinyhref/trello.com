import { forwardRef, Suspense, useEffect, useState } from 'react';

import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';
import { useLazyComponent } from '@trello/use-lazy-component';

// eslint-disable-next-line @eslint-react/no-useless-forward-ref
export const LazyBoardScreenPlacement = forwardRef<HTMLElement, unknown>(() => {
  const [showBoardScreenPlacement, setShowBoardScreenPlacement] =
    useState(false);

  const BoardScreenPlacement = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-screen-placement" */ './BoardScreenPlacement'
      ),
    { namedImport: 'BoardScreenPlacement' },
  );

  useEffect(() => {
    const idleTaskId = addIdleTask(() => {
      setShowBoardScreenPlacement(true);
    }, 1000);
    return () => {
      clearIdleTask(idleTaskId);
    };
  }, []);

  if (!showBoardScreenPlacement) {
    return;
  }

  return (
    <Suspense>
      <BoardScreenPlacement />
    </Suspense>
  );
});
