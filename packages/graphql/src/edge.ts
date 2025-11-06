import type { CanReadFunction } from '@apollo/client/cache/core/types/common';
import {
  isReference,
  type Reference,
  type StoreObject,
} from '@apollo/client/utilities';

import { mergeArrays } from './mergeArrays';

/**
 * Represents a Relay-style edge: https://relay.dev/graphql/connections.htm#sec-Edge-Types
 * Trello's edges do not have IDs and are therefore plain objects, not references.
 * Trello's nodes must have IDs and are therefore always references.
 */
export type Edge = { node: Reference | StoreObject };

/**
 * Read function for Edge types. Filters out any edges whose nodes
 * are dangling (nonexistent) references.
 * @param existing The existing edges
 * @returns The list of edges with readable nodes
 */
export const edgeReadFunction = (
  existing: unknown,
  { canRead }: { canRead: CanReadFunction },
) =>
  Array.isArray(existing)
    ? existing.filter((edge) => canRead(edge.node))
    : existing;

/**
 * Merge function for Edge types. Combines existing and incoming
 * edges and filters out edges that contain the same node reference.
 * @param existing The existing edges
 * @param incoming The incoming edges
 * @param keyFieldsFunction A function that returns a string of the key fields of the node
 *  This is used to set the cache key when keyFields is used.
 * @default (node) => `${node.__typename}:${node.id}`
 * @returns The combined, deduped list of edges
 */
export const edgeMergeFunction = (
  existing: Edge[],
  incoming: Edge[],
  keyFieldsFunction: (node: StoreObject) => string = (node) =>
    `${node.__typename}:${node.id}`,
) =>
  mergeArrays(existing ?? [], incoming ?? [], (edge) => {
    if (isReference(edge.node)) {
      return edge.node.__ref;
    } else {
      return keyFieldsFunction(edge.node as StoreObject);
    }
  });

export const edgePolicy = () => ({
  read: edgeReadFunction,
  merge: edgeMergeFunction,
});
