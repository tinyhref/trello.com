import { LIST_ID_ATTRIBUTE } from 'app/src/components/List/List.constants';

export const getListElement = (listId?: string) =>
  // eslint-disable-next-line @trello/no-query-selector
  listId ? document.querySelector(`[${LIST_ID_ATTRIBUTE}="${listId}"]`) : null;
export const getNodeListId = (node?: Node) =>
  (node as HTMLElement)?.dataset.listId;

/**
 * Creates a TreeWalker of all the list elements on a board.
 * This can be used for easily navigating from list to list.
 */
export const getListsTreeWalker = (currentListId?: string) => {
  const listsWalker = document.createTreeWalker(
    document.getElementById('board')!,
    NodeFilter.SHOW_ELEMENT,
    (node) => {
      // Don't search within lists; skip to the next one.
      if (node.parentNode && getNodeListId(node.parentNode)) {
        return NodeFilter.FILTER_REJECT;
      }
      return getNodeListId(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  );

  const currentList = getListElement(currentListId);
  if (currentList) {
    listsWalker.currentNode = currentList;
  }
  return listsWalker;
};
