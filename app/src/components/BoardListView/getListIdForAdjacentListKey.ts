import { Key } from '@trello/keybindings';

import { getListsTreeWalker, getNodeListId } from './getListsTreeWalker';

type MoveCardToAdjacentListKey =
  | typeof Key.AngleLeft
  | typeof Key.AngleRight
  | typeof Key.Comma
  | typeof Key.Period;

export const getListIdForAdjacentListKey = (
  currentListId: string,
  key: MoveCardToAdjacentListKey,
) => {
  const listsWalker = getListsTreeWalker(currentListId);

  switch (key) {
    case Key.AngleLeft:
    case Key.Comma: {
      const previousList = listsWalker.previousSibling();
      return previousList ? getNodeListId(previousList) : null;
    }

    case Key.AngleRight:
    case Key.Period: {
      const nextList = listsWalker.nextSibling();
      return nextList ? getNodeListId(nextList) : null;
    }

    default:
      return;
  }
};
