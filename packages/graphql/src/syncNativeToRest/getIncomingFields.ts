import {
  isReference,
  type FragmentRegistryAPI,
  type Reference,
  type StoreObject,
  type StoreValue,
} from '@apollo/client/cache';
import type {
  CanReadFunction,
  ReadFieldFunction,
} from '@apollo/client/cache/core/types/common';
import type { FieldNode, SelectionNode } from 'graphql';
import { Kind } from 'graphql';

import { sendErrorEvent } from '@trello/error-reporting';

const MAX_DEPTH = 20;

class RecursionDepthExceededError extends Error {
  constructor(functionName: string) {
    super(
      `Exceeded maximum recursion depth of ${MAX_DEPTH} in ${functionName}`,
    );
  }
}

class FieldNodeError extends Error {
  constructor(fieldNode: FieldNode | null) {
    const message = fieldNode
      ? 'Field node is missing selection set'
      : 'Field node is null';
    super(message);
  }
}

class UnknownFragmentError extends Error {
  constructor(fragmentName: string) {
    super(`Could not find fragment ${fragmentName} in fragment registry`);
  }
}

class ScalarValueWithSelectionSetError extends Error {
  constructor(key: string, value: unknown) {
    super(
      `Received a scalar value with a selection set in field ${key}. Value has type ${typeof value}`,
    );
  }
}

const isObject = (
  value: StoreObject | StoreValue,
): value is Reference | StoreObject =>
  typeof value === 'object' && value !== null;

const expandFragments = (
  selections: readonly SelectionNode[],
  fragmentRegistry: FragmentRegistryAPI,
  typename: string | undefined,
  recursionDepth: number = 0,
): FieldNode[] => {
  if (recursionDepth > MAX_DEPTH) {
    sendErrorEvent(new RecursionDepthExceededError('expandFragments'), {
      tags: { ownershipArea: 'trello-graphql-data' },
    });
    return [];
  }

  return selections.flatMap((selection) => {
    if (selection.kind === Kind.FRAGMENT_SPREAD) {
      const fragment = fragmentRegistry.lookup(selection.name.value);
      if (!fragment) {
        sendErrorEvent(new UnknownFragmentError(selection.name.value), {
          tags: { ownershipArea: 'trello-graphql-data' },
        });
        return [];
      }
      return expandFragments(
        fragment.selectionSet.selections,
        fragmentRegistry,
        typename,
        recursionDepth + 1,
      );
    }

    if (selection.kind === Kind.INLINE_FRAGMENT) {
      // If this is an inline fragment for a different type, then we don't need those fields
      if (
        selection.typeCondition &&
        selection.typeCondition.name.value !== typename
      ) {
        return [];
      }
      return expandFragments(
        selection.selectionSet.selections,
        fragmentRegistry,
        typename,
        recursionDepth + 1,
      );
    }

    return selection;
  });
};

/**
 * Recursively determines which fields on incoming are new/changed based on
 * the FieldNode that was passed to the writeQuery call that triggered this merge.
 * Returns a subset of incoming that only has the changed fields.
 * @param incoming The incoming object (may be a ref)
 * @param field The FieldNode that was used to write incoming to the cache
 * @param readField A readField function to read fields from incoming
 * @param fragmentRegistry A fragment registry, used to expand fragment spreads
 * @param recursionDepth A safeguard so we don't recurse indefinitely
 * @returns A nested object that is a subset of incoming but without refs
 */
export const getIncomingFields = (
  incoming: Reference | StoreObject | undefined,
  field: FieldNode | null,
  readField: ReadFieldFunction,
  canRead: CanReadFunction,
  fragmentRegistry: FragmentRegistryAPI,
  recursionDepth: number = 0,
) => {
  if (recursionDepth > MAX_DEPTH) {
    sendErrorEvent(new RecursionDepthExceededError('getIncomingFields'), {
      tags: { ownershipArea: 'trello-graphql-data' },
    });
    return null;
  }

  if (!field?.selectionSet) {
    sendErrorEvent(new FieldNodeError(field));
    return null;
  }

  if (isReference(incoming) && !canRead(incoming)) {
    return null;
  }

  const incomingFields: Record<string, unknown> = {};

  // First, recursively expand any fragments at this level
  const typename = readField<string>('__typename', incoming);

  const fieldNodes = expandFragments(
    field.selectionSet.selections,
    fragmentRegistry,
    typename,
  );

  // Always fetch the typename
  fieldNodes.push({
    kind: Kind.FIELD,
    name: {
      kind: Kind.NAME,
      value: '__typename',
    },
  });

  // Now, recursively read each field in fieldNodes and stick it in incomingFIelds
  fieldNodes.forEach((node) => {
    const key = node.name.value;
    const value = readField(key, incoming);

    if (node.selectionSet) {
      if (Array.isArray(value)) {
        incomingFields[key] = value.map((item) => {
          if (isObject(item)) {
            return getIncomingFields(
              item,
              node,
              readField,
              canRead,
              fragmentRegistry,
              recursionDepth + 1,
            );
          }

          if (item !== null) {
            // Except for arrays that allow nulls, we should never have a node with a selectionSet but an array item that is a scalar
            sendErrorEvent(new ScalarValueWithSelectionSetError(key, item), {
              tags: { ownershipArea: 'trello-graphql-data' },
            });
          }

          return item;
        });
      } else if (isObject(value)) {
        incomingFields[key] = getIncomingFields(
          value,
          node,
          readField,
          canRead,
          fragmentRegistry,
          recursionDepth + 1,
        );
      } else {
        incomingFields[key] = value;

        if (value !== null && value !== undefined) {
          // Except null & undefined, we should never have a field with a scalar value that also has a selection set
          sendErrorEvent(new ScalarValueWithSelectionSetError(key, value), {
            tags: { ownershipArea: 'trello-graphql-data' },
          });
        }
      }
    } else {
      incomingFields[key] = value;
    }
  });

  return incomingFields;
};
