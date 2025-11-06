import { type InMemoryCache } from '@apollo/client';
import { gql } from 'graphql-tag';

import type { TargetModel } from './cacheModelTypes';

type NestedModelMapping = {
  model: TargetModel;
  fieldName: string;
  idFieldName: string;
};

/**
 * Given a parent model and a nested model, updates the parent model in the cache
 * to contain a reference to the nested model. Other fields of the nested model will be
 * synced via that model's type policy. The purpose of this function is only to
 * ensure a reference exists between the parent and the child.
 * Note: this function does not validate any objectIds. It is the responsibility of the
 * caller to validate the object IDs before passing them into this function.
 * @param parentModel The parent model containing the nested model
 * @param nestedModelMapping A {@link NestedModelMapping} containing the nested model,
 * and how it relates to its parent model in the schema (fieldName, idFieldName)
 * @param cache The cache to write to
 */
export const syncNestedModelReference = (
  parentModel: TargetModel,
  nestedModelMapping: NestedModelMapping,
  cache: InMemoryCache,
) => {
  const { fieldName, idFieldName, model: nestedModel } = nestedModelMapping;

  const fragment = `fragment ${parentModel.type}${fieldName}Write on ${parentModel.type} {
    ${idFieldName}
    ${fieldName} {
      id
    }
  }`;

  cache.writeFragment({
    id: cache.identify({ __typename: parentModel.type, id: parentModel.id }),
    fragment: gql(fragment),
    data: {
      __typename: parentModel.type,
      id: parentModel.id,
      [idFieldName]: nestedModel.id,
      [fieldName]: {
        __typename: nestedModel.type,
        id: nestedModel.id,
      },
    },
  });
};
