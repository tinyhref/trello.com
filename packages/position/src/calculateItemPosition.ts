import { calculatePosition } from './calculatePosition';
import { NULL_POS } from './position.constants';

export type Item = { id: string; pos: number };

const isInPosition = (index: number, allItems: Item[], item?: Item | null) => {
  if (!item?.id) {
    return false;
  }
  const itemAtPosition = allItems[index];
  return itemAtPosition?.id === item.id;
};

/**
 * Calculates a best guess for the position of an item moved/added to {index}
 * within {allItems}. If {item} is provided, its current position relative to
 * its current index will be considered (items are matched by {id}). If there
 * is no material change, the current position will be respected. If the item
 * is not found in {allItems}, it will be treated as an addition.
 *
 * Generally speaking, the values returned will be centered around the midpoint
 * of the positioning space {INITIAL_POS} (2^47). Items positioned above or
 * below another item will be positioned at a distance of {SPACING} if there is
 * room to do so. Otherwise the item will be positioned at half of the available
 * space. Positions will always be > 0.
 *
 * Note that this does not enforce minimum spacing requirements. The values
 * returned are best guesses and only the sever can definiteively say what
 * the correct position is.
 *
 * @param index The index in {allItems} where the item will be added/moved
 * @param allItems A sorted array of items to consider
 * @param item  An optional item that is being added/moved
 * @returns the position for an item ({item} if provided) that is placed at {index} within {allItems}
 */
export const calculateItemPosition = <TInputItem extends Item>(
  index: number,
  allItems: TInputItem[],
  item?: Item | null,
): number => {
  const items = allItems.filter((thisItem) => item?.id !== thisItem.id);

  // if the item is in position no point in moving it around
  if (item && isInPosition(index, allItems, item)) {
    return item.pos;
  }

  const indexBounded = Math.min(Math.max(index, 0), items.length);

  const itemPrev = items[indexBounded - 1];
  const itemNext = items[indexBounded];

  const posItemCurr = item?.pos ?? NULL_POS;
  const posItemPrev = itemPrev?.pos ?? NULL_POS;
  const posItemNext = itemNext?.pos ?? NULL_POS;

  return calculatePosition(posItemPrev, posItemNext, posItemCurr);
};
