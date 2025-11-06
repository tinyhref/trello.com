import { type InMemoryCache, type StoreObject } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import { gql } from 'graphql-tag';

import { sendErrorEvent } from '@trello/error-reporting';

import type { Node, TrelloBoardMembershipInfo } from '../generated';
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

type EdgeRelationMappingValue = {
  // The typename we should map the edge relation to (e.g. Member)
  type: TargetModelTypeName;
  // The field on the edge that contains the edge relation (e.g. membership)
  edgeField: keyof EdgeRelation;
  // The name of the field we should map the id on the node to (e.g. node.id maps to idMember)
  nodeIdKey?: string;
  // The name of the field we should map to (e.g. memberships)
  edgeKey: string;
};

export type EdgeRelationMapping<T extends IncomingNativeModel> = Partial<
  Record<keyof T, EdgeRelationMappingValue>
>;

type EdgeRelation = {
  membership: TrelloBoardMembershipInfo;
};

type Edge = {
  node: Node;
  objectId?: string;
};

/**
 * Syncs lists of edge references from a native GraphQL model to the Apollo cache.
 *
 * This function processes edge relations (such as memberships) defined in the provided
 * edgeRelationMapping, extracts the relevant node and edge relation IDs from the incoming
 * data, and writes references to the Apollo cache. It is designed to handle cases where
 * the relationship between models is represented by an edge object (e.g., Board_Membership).
 *
 * @template T - The type of the incoming native model.
 * @param parentModel - The target (non-native) model to write to in the cache.
 * @param edgeRelationMapping - A mapping that describes how to extract edge relations for each field.
 * @param incoming - The incoming native GraphQL model data.
 * @param cache - The Apollo InMemoryCache instance to write to.
 * @param readField - A function to read fields from references or objects in the cache.
 */
export const syncListsOfEdgeRefs = <T extends IncomingNativeModel>(
  parentModel: TargetModel,
  edgeRelationMapping: EdgeRelationMapping<T>,
  incoming: RecursivePartial<T> & StoreObject,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  for (const [fieldName, mapping] of Object.entries(edgeRelationMapping)) {
    const {
      nodeIdKey,
      edgeKey,
      edgeField,
      type: edgeType,
    } = mapping as EdgeRelationMappingValue;

    const connection = readField<T>(fieldName, incoming);
    if (!connection) {
      continue;
    }

    const edges = readField<Edge[]>('edges', connection);
    if (!edges) {
      continue;
    }

    const objectIds: { nodeId: string; edgeRelationId?: string }[] = edges
      .map((edge) => {
        const node = readField<Node>('node', edge);
        const connectionEdgeRelation = edgeField
          ? readField<EdgeRelation[keyof EdgeRelation]>(edgeField, edge)
          : undefined;

        return {
          node,
          connectionEdgeRelation,
        };
      })
      .filter(
        (
          obj,
        ): obj is {
          node: Node;
          connectionEdgeRelation: EdgeRelation[keyof EdgeRelation] | undefined;
        } => obj.node !== null && obj.node !== undefined,
      )
      .map(
        ({
          node,
          connectionEdgeRelation,
        }: {
          node: Node;
          connectionEdgeRelation?: EdgeRelation[keyof EdgeRelation];
        }) => {
          let nodeId: string | undefined = undefined;
          let edgeRelationId: string | undefined = undefined;
          try {
            nodeId = getObjectIdFromCacheObject(node, readField);
          } catch (err) {
            const error =
              err instanceof InvalidIdError || err instanceof MissingIdError
                ? wrapIdErrorInParent(err, parentModel, fieldName)
                : err;
            sendErrorEvent(error);
          }
          try {
            edgeRelationId =
              connectionEdgeRelation !== undefined
                ? getObjectIdFromCacheObject(connectionEdgeRelation, readField)
                : undefined;
          } catch (err) {
            const error =
              err instanceof InvalidIdError || err instanceof MissingIdError
                ? wrapIdErrorInParent(err, parentModel, fieldName)
                : err;
            sendErrorEvent(error);
          }
          return {
            nodeId,
            edgeRelationId,
          };
        },
      )
      .filter(
        (
          obj,
        ): obj is {
          nodeId: string;
          edgeRelationId: string | undefined;
        } => obj?.nodeId !== undefined,
      )
      .map((obj) => {
        if (edgeField !== undefined && obj.edgeRelationId === undefined) {
          return {
            nodeId: obj.nodeId,
          };
        }
        return obj;
      });

    const mappedKey = edgeKey ?? fieldName;
    /**
     * If we have an edgeRelation, we can write a fragment with both the node data and also the
     * field present on the edge to the parent model at once.
     */
    const fragmentToWrite = `fragment ${parentModel.type}${mappedKey}Write on ${parentModel.type} {
      ${mappedKey} {
        id
        ${nodeIdKey ?? ''}
      }
    }`;

    const edgeIds = objectIds.filter(
      ({ edgeRelationId }) => edgeRelationId !== undefined,
    );

    const data: Record<string, unknown> = {
      __typename: parentModel.type,
      id: parentModel.id,
      [mappedKey]: edgeIds.map(({ edgeRelationId, nodeId }) => {
        const obj: Record<string, unknown> = {
          __typename: edgeType,
          id: edgeRelationId,
        };
        if (nodeIdKey) {
          obj[nodeIdKey] = nodeId;
        }
        return obj;
      }),
    };

    cache.writeFragment({
      id: cache.identify({ __typename: parentModel.type, id: parentModel.id }),
      fragment: gql(fragmentToWrite),
      data,
    });
  }
};
