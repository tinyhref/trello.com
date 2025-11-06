import type { FunctionComponent } from 'react';

import { useBoardId } from '@trello/id-context';

import { useBoardTitle } from './useBoardTitle';

/**
 * Component wrapping the board title hook to minimize rerenders.
 */
export const BoardTitleUpdater: FunctionComponent = () => {
  const boardId = useBoardId();
  useBoardTitle(boardId);

  return null;
};
