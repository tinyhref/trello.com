import { useMemo, type FunctionComponent, type PropsWithChildren } from 'react';
import { createContext } from 'use-context-selector';

import { useBoardId } from '@trello/id-context';

import { useBoardPreferencesContextFragment } from './BoardPreferencesContextFragment.generated';

export interface BoardPreferencesContextValue {
  showCardCovers: boolean;
}

const defaultContextValue: BoardPreferencesContextValue = {
  showCardCovers: true,
};

export const BoardPreferencesContext =
  createContext<BoardPreferencesContextValue>(defaultContextValue);

export const BoardPreferencesContextProvider: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const boardId = useBoardId();

  let contextValue = defaultContextValue;

  const { data: board } = useBoardPreferencesContextFragment({
    from: {
      id: boardId,
    },
  });

  const showCardCovers = board?.prefs?.cardCovers ?? true;

  contextValue = useMemo(
    () => ({
      showCardCovers,
    }),
    [showCardCovers],
  );

  return (
    <BoardPreferencesContext.Provider value={contextValue}>
      {children}
    </BoardPreferencesContext.Provider>
  );
};
