import type { FunctionComponent } from 'react';
import { memo, useCallback, useMemo } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';

import type { ListComposerProps } from './ListComposer';
import { ListComposer } from './ListComposer';
import { listComposerState } from './listComposerState';

export const PossibleListComposer: FunctionComponent<ListComposerProps> = ({
  prevPosition,
  position,
  nextPosition,
}) => {
  const listComposerPosition = useSharedStateSelector(
    listComposerState,
    useCallback((state) => {
      if (!state.isOpen || state.position === null) return -1;
      return state.position;
    }, []),
  );

  const isListComposerOpenInCurrentPositionalRange = useMemo(
    () =>
      listComposerPosition > prevPosition &&
      listComposerPosition >= position &&
      listComposerPosition < nextPosition,
    [listComposerPosition, prevPosition, position, nextPosition],
  );

  if (!isListComposerOpenInCurrentPositionalRange) {
    return null;
  }

  return (
    <ListComposer
      prevPosition={prevPosition}
      position={position}
      nextPosition={nextPosition}
    />
  );
};

export const MemoizedPossibleListComposer = memo(PossibleListComposer);
