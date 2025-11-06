import { type FunctionComponent } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyBoardPowerUpsDirectory: FunctionComponent = () => {
  const BoardPowerUpsDirectory = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-power-ups-directory" */ './BoardPowerUpsDirectory'
      ),
    { namedImport: 'BoardPowerUpsDirectory' },
  );

  return <BoardPowerUpsDirectory />;
};
