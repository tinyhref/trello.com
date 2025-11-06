import { useCallback } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';

import { boardSwitcherSharedState } from './boardSwitcherSharedState';

export const useBoardSwitcherMode = () => {
  return useSharedStateSelector(
    boardSwitcherSharedState,
    useCallback((state) => state.mode, []),
  );
};
