import { useContext } from 'react';

import { ListIdContext } from './ListIdContext';

export const useListId = () => {
  const listId = useContext(ListIdContext);

  if (listId === null) {
    throw new Error(
      'Could not find list ID in the React context. Did you forget to wrap the root component in a <ListIdProvider>?',
    );
  }

  return listId;
};
