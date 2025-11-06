import type { DocumentNode } from 'graphql';

import { getOperationName } from './getOperationName';
import { Requests } from './requests';

export const getQueryByOperationName = (
  operationName: string,
): DocumentNode | null => {
  for (const regexp of Object.keys(Requests)) {
    const definitions = Requests[regexp].requests;
    const query = definitions.find(
      (definition) => getOperationName(definition.query) === operationName,
    )?.query;
    if (query) {
      return query;
    }
  }

  return null;
};
