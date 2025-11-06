import type { FunctionComponent } from 'react';
import { memo, useCallback, useMemo } from 'react';

import { useListId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';

import type { CardComposerProps } from './CardComposer';
import { CardComposer } from './CardComposer';
import { cardComposerState } from './cardComposerState';

/**
 * The PossibleCardComposer renders above and below each card in a list.
 * This was implemented in order to optimize performance by allowing list cards
 * to have a stable render, with the burden of determining whether or not to
 * render pushed down into this child. This component should short-circuit as
 * quickly as possible, as it currently re-renders every time the card composer
 * is opened anywhere, as many times as there are cards.
 */
export const PossibleCardComposer: FunctionComponent<CardComposerProps> = ({
  prevPosition,
  position,
  nextPosition,
}) => {
  const listId = useListId();

  /**
   * Selects the position of an open card composer in the current list.
   * If the card composer is not open or is open in a different list, returns
   * the unreachable -1.
   * There's an odd bug here that prevents us from combining this callback value
   * with the below useMemo result.
   */
  const cardComposerPositionInList = useSharedStateSelector(
    cardComposerState,
    useCallback(
      ({ listId: activeListId, position: activePosition }) => {
        if (activeListId !== listId || typeof activePosition !== 'number') {
          return -1;
        }
        return activePosition;
      },
      [listId],
    ),
  );

  /**
   * The card composer is treated as a singleton, so we need to use position
   * selectors to narrow down the "active" position of a currently open card
   * composer so that only one can be open at a time.
   */
  const isCardComposerOpenInCurrentPositionalRange = useMemo(
    () =>
      cardComposerPositionInList > prevPosition &&
      cardComposerPositionInList >= position &&
      cardComposerPositionInList < nextPosition,
    [cardComposerPositionInList, prevPosition, position, nextPosition],
  );

  if (!isCardComposerOpenInCurrentPositionalRange) {
    return null;
  }

  return (
    <CardComposer
      prevPosition={prevPosition}
      position={position}
      nextPosition={nextPosition}
    />
  );
};

export const MemoizedPossibleCardComposer = memo(PossibleCardComposer);
