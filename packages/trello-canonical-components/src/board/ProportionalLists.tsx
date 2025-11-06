import { useMemo, type FunctionComponent, type PropsWithChildren } from 'react';

import { BoardLists } from './Board';
import { List } from './List';

import * as styles from './Board.module.less';

interface ListItem {
  id: string;
  size: number;
}

export const Card: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => <div className={styles.card}>{children}</div>;

const getProportionalSizes = (lists: ListItem[], numLists: number) => {
  if (!lists || lists.length === 0) {
    return [];
  } else if (lists.length === 1) {
    return [lists[0].size];
  } else {
    const sortedLists = [...lists].sort((a, b) => a.size - b.size);
    const biggest = sortedLists[sortedLists.length - 1];
    const smallest = sortedLists[0];
    const disparity = (smallest.size / biggest.size) * 100;

    if (disparity < 80) {
      return lists.slice(0, numLists).map((list) => {
        if (list.size === 0) {
          return 0;
        }
        const sortedIndex = sortedLists.findIndex(
          (item) => item.id === list.id,
        );
        if (sortedIndex < sortedLists.length / 3) {
          return 1;
        } else if (sortedIndex < (sortedLists.length / 3) * 2) {
          return 2;
        } else {
          return 3;
        }
      });
    } else if (disparity < 90) {
      let smallSize = 1;
      let largeSize = 2;
      if (smallest.size > 8) {
        smallSize = 2;
        largeSize = 3;
      }

      return lists.slice(0, numLists).map((list) => {
        if (list.size === 0) {
          return 0;
        }
        const sortedIndex = sortedLists.findIndex(
          (item) => item.id === list.id,
        );
        if (sortedIndex < sortedLists.length / 2) {
          return smallSize;
        }

        return largeSize;
      });
    } else {
      return lists.slice(0, numLists).map((list) => {
        const size = list.size;
        if (!size) {
          return 0;
        } else if (size < 9) {
          return 1;
        } else if (size < 17) {
          return 2;
        } else {
          return 3;
        }
      });
    }
  }
};

const ListOfCards = ({ size }: ListItem) => {
  // the number of cards to render
  const length = Math.min(size || 0, 3);

  const cards = Array.from({ length }, (_, i) => i);

  return (
    <List>
      {cards.map((n) => (
        <Card key={n} />
      ))}
    </List>
  );
};

export const ProportionalBoardLists = ({
  lists,
  numLists,
}: {
  lists: ListItem[];
  numLists: number;
}) => {
  const listSizes = useMemo(
    () => getProportionalSizes(lists, numLists),
    [lists, numLists],
  );

  const listOfCards = useMemo(() => {
    return listSizes.map((size, i) => (
      <ListOfCards size={size} id={lists[i].id} key={lists[i].id} />
    ));
  }, [listSizes, lists]);

  return <BoardLists>{listOfCards}</BoardLists>;
};
