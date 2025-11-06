import {
  type InMemoryCache,
  type Reference,
  type StoreObject,
} from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import { gql } from 'graphql-tag';

import { sendErrorEvent } from '@trello/error-reporting';

import type { Node } from '../generated';
import type {
  IncomingNativeModel,
  RecursivePartial,
  TargetModel,
  TargetModelTypeName,
} from './cacheModelTypes';
import {
  InvalidIdError,
  MissingIdError,
  wrapIdErrorInParent,
} from './cacheSyncingErrors';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';

type NestedModelMappingValue = {
  type: TargetModelTypeName;
  idFieldName?: string;
  /** An optional key name to write to in the cache (e.g. powerUps --> boardPlugins) */
  key?: string;
  /**
   * In cases where the id for the connection lies on the edge, this can be set to true.
   * For example, in TrelloBoardPowerUpEdge we read the objectId from the edge and the
   * powerUp Id is on the node.
   */
  useObjectIdFromEdge?: boolean;

  /**
   * The name of the field corresponding to the parent ID in the nested model, if
   * one exists.
   *
   * For example, in TrelloChecklist, the parentIdFieldName is 'idChecklist'
   * because the idChecklist field is on the Checklist model.
   */
  parentIdFieldName?: string;
};

export type NestedModelListMapping<T extends IncomingNativeModel> = Partial<
  Record<keyof T, NestedModelMappingValue>
>;

type Edge = {
  node: Node;
  objectId?: string;
};

/**
 * Given a model and a nestedModelMapping which refers to all the Connection types
 * on the model, extracts the node IDs from each Connection, validates them,
 * and writes their refs to the cache. Only the ID is written; other fields
 * of each nested model are handled by their own type policy.
 * Note: any nodes with invalid object IDs will be silently ignored; an error
 * will be sent to Sentry but the function will not throw or exit early.
 * @param parentModel The target (non-native) model that's being written to
 * @param nestedModelMapping A {@link NestedModelListMapping} which indicates which
 * fields the refs should be written to and what type the nested models are
 * @param incoming The incoming native GQL model
 * @param cache The cache to write to
 * @param readField A ReadFieldFunction to read fields from a reference
 * @returns
 */
export const syncListsOfModelRefs = <T extends IncomingNativeModel>(
  parentModel: TargetModel,
  nestedModelMapping: NestedModelListMapping<T>,
  incoming: Reference | (RecursivePartial<T> & StoreObject),
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  for (const [fieldName, mapping] of Object.entries(nestedModelMapping)) {
    const { idFieldName, type, key, useObjectIdFromEdge, parentIdFieldName } =
      mapping as NestedModelMappingValue;

    const connection = readField<T>(fieldName, incoming);
    if (!connection) {
      continue;
    }

    const edges = readField<Edge[]>('edges', connection);
    if (!edges) {
      continue;
    }

    const objectIds = useObjectIdFromEdge
      ? edges
          .map((edge) => {
            try {
              return getObjectIdFromCacheObject(edge, readField);
            } catch (err) {
              const error =
                err instanceof InvalidIdError || err instanceof MissingIdError
                  ? wrapIdErrorInParent(err, parentModel, fieldName)
                  : err;
              sendErrorEvent(error);
              return null;
            }
          })
          .filter((id): id is string => id !== null)
      : edges
          .map((edge) => readField<Node>('node', edge))
          .filter((node): node is Node => node !== undefined && node !== null)
          .map((node) => {
            try {
              return getObjectIdFromCacheObject(node, readField);
            } catch (err) {
              const error =
                err instanceof InvalidIdError || err instanceof MissingIdError
                  ? wrapIdErrorInParent(err, parentModel, fieldName)
                  : err;
              sendErrorEvent(error);
              return null;
            }
          })
          .filter((id): id is string => id !== null);

    const mappedKey = key ?? fieldName;

    const fragment = `fragment ${parentModel.type}${mappedKey}Write on ${parentModel.type} {
      ${idFieldName ?? ''}
      ${mappedKey} {
        id
        ${parentIdFieldName ?? ''}
      }
    }`;

    const data: Record<string, unknown> = {
      __typename: parentModel.type,
      id: parentModel.id,
      [mappedKey]: objectIds.map((objectId) => {
        const obj: Record<string, unknown> = {
          __typename: type,
          id: objectId,
        };
        if (parentIdFieldName) {
          obj[parentIdFieldName] = parentModel.id;
        }
        return obj;
      }),
    };

    if (idFieldName) {
      data[idFieldName] = objectIds;
    }

    cache.writeFragment({
      id: cache.identify({ __typename: parentModel.type, id: parentModel.id }),
      fragment: gql(fragment),
      data,
    });
  }
};
