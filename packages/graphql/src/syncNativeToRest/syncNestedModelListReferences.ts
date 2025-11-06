import { type InMemoryCache } from '@apollo/client';
import { gql } from 'graphql-tag';

import type { TargetModel } from './cacheModelTypes';

type NestedModelMapping = {
  models: TargetModel[];
  fieldName: string;
};

/**
 * Syncs a list of nested model references in the Apollo cache by writing a fragment
 * containing the list of models to the parent model's field.
 *
 * @param parentModel - The parent model that contains the list of references
 * @param targetModel - Object containing the field name and array of model references to sync
 * @param cache - The Apollo InMemoryCache instance to write to
 */
export const syncNestedModelListReferences = (
  parentModel: TargetModel,
  targetModel: NestedModelMapping,
  cache: InMemoryCache,
) => {
  const { fieldName, models } = targetModel;
  const fragment = `fragment ${parentModel.type}${fieldName}Write on ${parentModel.type} {
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
      [fieldName]: models.map((model) => ({
        __typename: model.type,
        id: model.id,
      })),
    },
  });
};
