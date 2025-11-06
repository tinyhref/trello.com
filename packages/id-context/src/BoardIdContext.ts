import { createContext } from 'react';

type BoardIdComplexContext = {
  /** Legacy board id from the REST / client-side GraphQL schema (`objectId` in the new native graphql schema) */
  boardId: string;
  /** New Native GraphQL board id (`nodeId` in the old schema) */
  boardNodeId?: string | null;
};

export const BoardIdContext = createContext<
  BoardIdComplexContext | string | null
>(null);

export const BoardIdProvider = BoardIdContext.Provider;
