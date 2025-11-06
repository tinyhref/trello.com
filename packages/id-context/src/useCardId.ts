import { useContext } from 'react';

import { CardIdContext } from './CardIdContext';

export const useCardId = () => {
  const cardId = useContext(CardIdContext);

  if (cardId === null) {
    throw new Error(
      'Could not find card ID in the React context. Did you forget to wrap the root component in a <CardIdProvider>?',
    );
  }

  return cardId;
};
