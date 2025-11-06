import type { FieldNode, FragmentSpreadNode } from 'graphql';
import { Kind } from 'graphql';

import { uniqBy } from '@trello/arrays';
import { SafeURLSearchParams, sanitizeUrl } from '@trello/safe-urls';

import {
  UnsupportedFieldError,
  UnsupportedNestedResourcePathError,
} from '../errors';
import { fragmentRegistry } from '../fragments/fragmentRegistry';
import { singularize } from '../stringOperations';
import type { QueryParams } from '../types';
import { getNestedResource } from './nestedResources';
import { getChildNodes } from './queryParsing';

const mergeQueryParams = (
  params1: QueryParams,
  params2: QueryParams,
): QueryParams => {
  const result = { ...params1 };

  return Object.entries(params2).reduce<QueryParams>(
    (mergedParams, [key, value]) => {
      // If we haven't seen this key yet, just use it's value
      if (!(key in result)) {
        mergedParams[key] = value;
        return mergedParams;
      }

      // Ignore value if it's the same as what already exists
      const existingValue = result[key];
      if (existingValue === value) {
        return mergedParams;
      }

      // Merge 2 string values
      if (typeof existingValue === 'string' && typeof value === 'string') {
        mergedParams[key] = [existingValue, value];
        return mergedParams;
      }

      // Merge an array and a string
      if (Array.isArray(existingValue) && typeof value === 'string') {
        mergedParams[key] = [...existingValue, value];
        return mergedParams;
      }

      // Merge a string and an array
      if (typeof existingValue === 'string' && Array.isArray(value)) {
        mergedParams[key] = [existingValue, ...value];
        return mergedParams;
      }

      // Merge 2 arrays
      if (Array.isArray(existingValue) && Array.isArray(value)) {
        mergedParams[key] = [...existingValue, ...value];
        return mergedParams;
      }

      return mergedParams;
    },
    result,
  );
};

interface FieldNodeWithSelectionSet extends FieldNode {
  selectionSet: NonNullable<FieldNode['selectionSet']>;
}

const hasSelectionSet = (node: FieldNode): node is FieldNodeWithSelectionSet =>
  node.selectionSet?.selections !== undefined;

/**
 * Recursively parse a given node in the Graphql query into an array of query
 * parameters eg. ['cards=all', 'card_fields=name,id', 'card_checklists=all']
 */
const parseQuery = (
  node: FieldNode,
  variables: QueryParams,
  nodeName: string = node.name.value,
  parentPath: string[] = [],
): QueryParams => {
  const path = [...parentPath, nodeName];
  const restResource = getNestedResource(path);

  // If there is no entry in VALID_NESTED_RESOURCES for this node,
  // something has gone horribly wrong with the recursion
  if (!restResource) {
    throw new UnsupportedNestedResourcePathError(path);
  }

  const fragmentSelections =
    node.selectionSet?.selections.filter(
      (selectionNode): selectionNode is FragmentSpreadNode =>
        selectionNode.kind === Kind.FRAGMENT_SPREAD,
    ) ?? [];

  const completedNode: FieldNode = {
    ...node,
    selectionSet: node.selectionSet
      ? {
          ...node.selectionSet,
          selections: node.selectionSet?.selections.filter(
            ({ kind }) => kind !== Kind.FRAGMENT_SPREAD,
          ),
        }
      : undefined,
  };

  if (fragmentSelections.length > 0 && hasSelectionSet(completedNode)) {
    fragmentSelections.forEach((fragmentSpreadNode) => {
      const fragment = fragmentRegistry.lookup(fragmentSpreadNode.name.value);
      if (!fragment) {
        throw new Error(
          `Fragment definition ${fragmentSpreadNode.name.value} not registered. Add your fragment to @trello/graphql/src/fragments and register it in fragmentRegistry.ts`,
        );
      }

      completedNode.selectionSet.selections = [
        ...completedNode.selectionSet.selections,
        ...fragment.selectionSet.selections,
      ];
    });

    completedNode.selectionSet.selections = uniqBy(
      completedNode.selectionSet?.selections as FieldNode[],
      ({ name }) => name.value,
    );
  }

  // Get the query params for this node
  const queryParams = restResource.nodeToQueryParams(completedNode, variables);

  // If we are at a leaf node in the query, exit early.
  // This is uncommon, but handles nested primitive field values.
  if (!hasSelectionSet(completedNode)) {
    return queryParams;
  }

  // Get a Set of all the valid nested resource names from the
  // VALID_NESTED_RESOURCES tree
  const validNestedResources = new Set(
    restResource.nestedResources?.map((resource) => resource.name),
  );
  const validFieldsWithNestedResources = new Set(
    restResource.fieldsWithNestedResources?.map((resource) => resource.name),
  );

  const childNodes = getChildNodes(completedNode);

  // Validation on the child nodes
  childNodes.forEach((childNode) => {
    const name = childNode.name.value;

    // Throw an error if we are trying to query for field that is marked as
    // unsupported at this level of VALID_NESTED_RESOURCES
    if (restResource.unsupportedFields?.includes(name)) {
      throw new UnsupportedFieldError(path, name);
    }
  });

  // Recursively create query params for all the nested resources below our node
  const nestedResourceParams = childNodes
    .filter(
      (childNode) =>
        validNestedResources.has(childNode.name.value) ||
        validFieldsWithNestedResources.has(childNode.name.value),
    )
    .map((childNode) =>
      parseQuery(childNode, variables, childNode.name.value, path),
    )
    .reduce(
      (flatParams, childParams) => mergeQueryParams(flatParams, childParams),
      {},
    );

  // Join all the params together
  return mergeQueryParams(queryParams, nestedResourceParams);
};

const queryParamsToString = (queryParams: QueryParams): string | null => {
  const asKeyValue = Object.entries(queryParams).reduce(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (params, [key, value]) => {
      const isInvalidParamValue = value === undefined;

      if (isInvalidParamValue) {
        return params;
      }

      // `${[id,shortLink,...]}` returns id,shortLink,... Equivalent to join(',')
      const result = `${
        Array.isArray(value) && value.length === 0 ? '' : value
      }`;

      return [
        ...params,
        // encoding ensures that values with special characters are escaped. In queryToApiUrl
        // we use encodeURI, which is correct for the url, while this is correct for the param values.
        `${key}=${encodeURIComponent(result)}`,
      ];
    },
    [],
  );

  // When there is only one query parameter, and that parameter applies no field
  // expansions, then we don't want to return a URL. This is to account for the
  // case where we only request fields that are resolved by a custom resolver.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (asKeyValue.length === 1 && asKeyValue[0].endsWith('=')) {
    return null;
  }

  return asKeyValue.length > 0 ? asKeyValue.join('&') : null;
};

/**
 * Given the root node of a graphql query, generate an API URL that would
 * fetch the requested data. If no rootId is provided, attempted to grab
 * the rootId from the fieldNode's arguments
 */
export const queryToApiUrl = (
  rootNode: FieldNode,
  variables: QueryParams,
  rootId?: string,
) => {
  const rootName = singularize(rootNode.name.value);
  const queryParams = parseQuery(rootNode, variables, rootName);
  const queryParamsAsString = queryParamsToString(queryParams);

  // If there were no query strings, there's no reason to hit the API
  // so we return null to indicate that no request needs to happen
  if (!queryParamsAsString) {
    return null;
  }

  const rootIdPath = rootId ? `/${rootId}` : '';

  const url = `${encodeURI(
    `/1/${rootName}${rootIdPath}`,
  )}?${queryParamsAsString}`;

  return url;
};

export const queryToBatchApiUrl = (
  rootNode: FieldNode,
  variables: QueryParams,
  rootIds: string[],
) => {
  const urls = rootIds
    .map((rootId) => queryToApiUrl(rootNode, variables, rootId))
    .filter((url) => !!url) as string[];

  const params = new SafeURLSearchParams();
  params.set('urls', urls);

  return sanitizeUrl`/1/batch?${params}`;
};
