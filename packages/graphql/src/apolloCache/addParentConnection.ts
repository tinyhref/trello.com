import type { FieldMergeFunction } from '@apollo/client';

import { addChildrenToParentConnection } from './relation';
import type { OneToManyRelation } from './relation.types';

export const addParentConnection: (
  relation: OneToManyRelation,
) => FieldMergeFunction = (relation) => (_, incoming, options) => {
  const parentId = options.storage?.parentId;
  parentId &&
    addChildrenToParentConnection(incoming ?? [], parentId, relation, options);
  return incoming;
};
