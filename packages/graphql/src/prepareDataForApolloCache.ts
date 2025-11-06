import type { FieldNode, FragmentSpreadNode, SelectionNode } from 'graphql';
import { Kind } from 'graphql';
import type { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import {
  getNamedType,
  isLeafType,
  isListType,
  isNonNullType,
  isObjectType,
} from 'graphql/type';

import { fragmentRegistry } from './fragments/fragmentRegistry';
import { astSchema } from './astSchema';
import {
  AddTypenamesError,
  InvalidRootFieldError,
  InvalidTypenameError,
  MissingSelectionSetError,
} from './errors';
import type {
  JSONArray,
  JSONObject,
  JSONValue,
  TypedJSONArray,
  TypedJSONObject,
  TypedJSONValue,
} from './types';

function isObject(aVar: object | string | []) {
  return (
    Object.prototype.toString.call(aVar) === '[object Object]' &&
    aVar.constructor.name === 'Object'
  );
}

const filterObjectByQuery = (
  obj: TypedJSONValue,
  queryNode: FieldNode,
): TypedJSONValue => {
  // Just return primitive values
  if (
    obj === null ||
    typeof obj === 'string' ||
    typeof obj === 'number' ||
    typeof obj === 'boolean'
  ) {
    return obj;
  }

  // Map over arrays and filter each object
  if (Array.isArray(obj)) {
    return obj.map((val) => filterObjectByQuery(val, queryNode));
  }

  // If there's no typename, we are dealing with an object that had its typename
  // adding ignored (like a custom scalar)
  if (!obj.__typename) {
    return obj;
  }

  const filteredObject: TypedJSONObject = {
    __typename: obj.__typename,
  };

  // If the object has an ID, we want to include it regardless
  // of whether it was on the selection set
  if (obj.id) {
    filteredObject.id = obj.id as string;
  }

  if (!queryNode.selectionSet) {
    throw new MissingSelectionSetError(obj.__typename);
  }

  let selections = queryNode.selectionSet.selections;
  const fragmentSelections = selections.filter(
    (node): node is FragmentSpreadNode => node.kind === Kind.FRAGMENT_SPREAD,
  );

  fragmentSelections.forEach((fragmentSpreadNode) => {
    const fragment = fragmentRegistry.lookup(fragmentSpreadNode.name.value);
    if (!fragment) {
      throw new Error(
        `Fragment definition ${fragmentSpreadNode.name.value} not registered. Add your fragment to @trello/graphql/src/fragments and register it in fragmentRegistry.ts`,
      );
    }

    const filteredSelections: SelectionNode[] = selections
      // filter out the FRAGMENT_SPREAD node so that we don't concat the field node for
      // the fragment spread node, which would result in adding the name of the fragment
      // as a field onto the data.
      .filter((node) => node.kind !== Kind.FRAGMENT_SPREAD);

    selections = filteredSelections.concat(fragment.selectionSet.selections);
  });

  // @ts-expect-error
  return selections.reduce(
    // @ts-expect-error
    (context, childQueryNode: FieldNode) => {
      const key = childQueryNode.name.value;
      if (key === '__typename') {
        return context;
      }

      const val = obj[key];

      if (
        val === null ||
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
      ) {
        context[key] = val;
      } else if (val === undefined) {
        // Patch all undefined fields to be null
        context[key] = null;
      } else {
        if (Array.isArray(val)) {
          if (isObject(val[0] as object)) {
            context[key] = val.map((listVal) => {
              return filterObjectByQuery(
                listVal as TypedJSONObject,
                childQueryNode,
              );
            });
          } else {
            context[key] = val;
          }
        } else {
          context[key] = filterObjectByQuery(val, childQueryNode);
        }
      }
      return context;
    },
    filteredObject,
  );
};

const addTypenamesToObject = (
  value: JSONObject,
  objectType: GraphQLObjectType,
  schema: GraphQLSchema = astSchema,
): TypedJSONObject | null => {
  if (!value || Object.keys(value).length === 0) {
    return null;
  }

  const typename = getNamedType(objectType).name;
  const obj: TypedJSONObject = {
    __typename: typename,
  };
  Object.entries(value).forEach(([key, val]) => {
    // Forward _id through as id for consistency
    if (key === '_id' && typeof val === 'string') {
      obj['id'] = val;
      // Recursively add typenames to all the child properties. We still want to add the _id
      // field for items that use that, so that we dont get cache misses
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const valueWithTypenames = addTypenames(typename, key, val, schema);
      if (valueWithTypenames !== undefined) {
        obj[key] = valueWithTypenames;
      }
    } else {
      // Recursively add typenames to all the child properties
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const valueWithTypenames = addTypenames(typename, key, val, schema);
      if (valueWithTypenames !== undefined) {
        obj[key] = valueWithTypenames;
      }
    }
  });
  return obj;
};

export const addTypenames = (
  parentTypename: string | undefined,
  fieldName: string,
  value: JSONValue,
  schema: GraphQLSchema = astSchema,
): TypedJSONValue | undefined => {
  if (!schema || !parentTypename) {
    return undefined;
  }
  const parentType = schema.getType(parentTypename);
  if (!parentType || !isObjectType(parentType)) {
    throw new InvalidTypenameError(parentTypename);
  }

  const possiblyNonNullableField = parentType.getFields()[fieldName];
  if (!possiblyNonNullableField) {
    // Uncomment this for easy identification of schema 'gaps' while running Trello
    // console.warn(
    //   `Received ${parentTypename}->${fieldName} which is not supported by the schema`,
    // );
    return undefined;
  }

  const possiblyNonNullableFieldType = possiblyNonNullableField.type;
  const fieldType = isNonNullType(possiblyNonNullableFieldType)
    ? possiblyNonNullableFieldType.ofType
    : possiblyNonNullableFieldType;

  // Return primitives
  if (isLeafType(fieldType)) {
    // If this is a JSONString, serialize it before adding to the cache
    if (fieldType.name === 'JSONString' && value) {
      return JSON.stringify(value);
    }

    return value as TypedJSONValue;
  }

  // Recurse down objects
  if (isObjectType(fieldType)) {
    return addTypenamesToObject(value as JSONObject, fieldType, schema);
  }

  // Recurse down lists
  if (isListType(fieldType)) {
    if (!value) {
      return null;
    }

    // Turn a type like [Board!]! into Board
    const unpackedType = getNamedType(fieldType);
    const valueAsArray = value as JSONArray;

    return valueAsArray.map((val) => {
      if (isLeafType(unpackedType)) {
        return val;
      } else if (isObjectType(unpackedType)) {
        return addTypenamesToObject(val as JSONObject, unpackedType, schema);
      }
    }) as TypedJSONArray;
  }
};

const getRootType = (fieldName: string, schema: GraphQLSchema = astSchema) => {
  const mutationType = schema.getType('Mutation');
  if (
    mutationType &&
    isObjectType(mutationType) &&
    mutationType.getFields()[fieldName]
  ) {
    return 'Mutation';
  }

  const queryType = schema.getType('Query');
  if (
    queryType &&
    isObjectType(queryType) &&
    queryType.getFields()[fieldName]
  ) {
    return 'Query';
  }

  throw new InvalidRootFieldError(fieldName);
};

export const prepareDataForApolloCache = (
  data: JSONArray | JSONObject,
  info: FieldNode,
  parentType?: string,
  schema: GraphQLSchema = astSchema,
): TypedJSONValue => {
  const rootNode = info;
  const rootFieldName = rootNode.name.value;
  const rootType = parentType || getRootType(rootFieldName, schema);

  const dataWithTypenames = addTypenames(rootType, rootFieldName, data, schema);

  if (dataWithTypenames === undefined) {
    throw new AddTypenamesError(rootType, rootFieldName);
  }

  return filterObjectByQuery(dataWithTypenames, rootNode);
};
