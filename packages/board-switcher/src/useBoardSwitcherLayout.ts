import { useCallback } from 'react';

import { useSharedStateSelector } from '@trello/shared-state';

import { boardSwitcherSharedState } from './boardSwitcherSharedState';

export const useBoardSwitcherLayout = () => {
  return useSharedStateSelector(
    boardSwitcherSharedState,
    useCallback((state) => state.layout, []),
  );
};
