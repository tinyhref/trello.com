import type { GraphQLResolveInfo } from 'graphql';

import type { QueryInfo } from './types';

export const isQueryInfo = (
  infoOrFieldNode: GraphQLResolveInfo | QueryInfo,
): infoOrFieldNode is QueryInfo => {
  return Boolean((infoOrFieldNode as QueryInfo)?.field);
};
