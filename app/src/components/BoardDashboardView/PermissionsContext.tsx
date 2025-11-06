import type { FunctionComponent, PropsWithChildren } from 'react';
import { createContext, useMemo } from 'react';

import { canEdit as canEditBoard } from '@trello/business-logic/board';

import { usePermissionsContextQuery } from './PermissionsContextQuery.generated';

interface PermissionsContextState {
  canEdit: boolean;
}

export const PermissionsContext = createContext<PermissionsContextState>({
  canEdit: false,
});

interface PermissionsContextProviderProps {
  idBoard: string;
}

export const PermissionsContextProvider: FunctionComponent<
  PropsWithChildren<PermissionsContextProviderProps>
> = ({ idBoard, children }) => {
  const { data } = usePermissionsContextQuery({
    variables: {
      idBoard,
    },
    waitOn: ['MemberHeader', 'CurrentBoardInfo'],
  });

  const { board, member } = data ?? {};

  const canEdit = useMemo(() => {
    if (!board || !member) {
      return false;
    }

    return canEditBoard(
      member,
      board,
      board.organization ?? null,
      board.organization?.enterprise,
    );
  }, [board, member]);

  const value = useMemo(() => ({ canEdit }), [canEdit]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};
