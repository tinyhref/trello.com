import type { Operation } from '@apollo/client';
import { Kind, OperationTypeNode } from 'graphql';
import type {
  ArgumentNode,
  DocumentNode,
  FieldNode,
  ObjectFieldNode,
  ObjectValueNode,
  OperationDefinitionNode,
  SelectionNode,
  SelectionSetNode,
  ValueNode,
  VariableDefinitionNode,
  VariableNode,
} from 'graphql';

import { sendErrorEvent } from '@trello/error-reporting';

import type { Scalars } from '../generated';
import type { JSONObject, JSONValue } from '../types';

/**
 * Get all of the built in and custom scalars from the schema.
 *
 * Exclude some weird custom scalars that I'm not sure how to handle yet
 * since their type is represented as a union or some other complex type
 * like a File, as I'm not sure what we would map their
 * kind to.
 *
 * We'd probably have to do type inference on the value to determine what the kind
 * should be in the case of a union (eg NumberOrString).
 */
type ScalarMappings = Omit<
  Scalars,
  | 'BigDecimal'
  | 'ButlerCommand'
  | 'CardPaletteColor'
  | 'CardTypeHierarchyLevelType'
  | 'FileUpload'
  | 'NumberOrString'
  | 'SoftwareBoardFeatureKey'
  | 'SoftwareBoardPermission'
  | 'SprintScopeChangeEventType'
  | 'Void'
>;

/**
 * Somewhat dangerous mapping of Trello defined custom GraphQL scalars to the
 * basic AST node kinds. This is because we want to write arguments/filters for
 * nested fields to the cache with their argument value so they can get
 * mapped correctly to the cache with keyArgs.
 */
const customScalarToKind: Record<keyof ScalarMappings, Kind> = {
  ID: Kind.STRING,
  Boolean: Kind.BOOLEAN,
  Int: Kind.INT,
  Float: Kind.FLOAT,
  String: Kind.STRING,
  Date: Kind.STRING,
  DateTime: Kind.STRING,
  URL: Kind.STRING,
  PIIString: Kind.STRING,
  SecureString: Kind.STRING,
  SensitiveString: Kind.STRING,
  UGCString: Kind.STRING,
  TrelloShortLink: Kind.STRING,
  JSON: Kind.STRING,
  JSONString: Kind.STRING,
  Long: Kind.INT,
  TrelloCardPosition: Kind.STRING,
  UUID: Kind.STRING,
};

/**
 * Maps AGG and Trello defined custom GraphQL scalar types to basic GraphQL AST node kinds.
 * This function is only exported for testing purposes.
 *
 * Sends an error to sentry if the custom type is not supported, in which
 * case we might need to include it in the customScalarToKind map.
 *
 * @param type - The scalar type to map to a GraphQL AST node kind
 * @returns The corresponding GraphQL AST node kind, or undefined if not found
 */
export const getCustomScalarKind = (type: unknown): Kind | undefined => {
  if (type === undefined) {
    return undefined;
  }

  if (Object.values(Kind).includes(type as Kind)) {
    return type as Kind;
  }

  if (!Object.keys(customScalarToKind).includes(type as string)) {
    sendErrorEvent({
      error: new Error(`Unknown GraphQL custom scalar type: ${type}`),
      metadata: {
        ownershipArea: 'trello-graphql-data',
        feature: 'syncDeltaToCache',
      },
    });

    return undefined;
  }

  return customScalarToKind[type as keyof typeof customScalarToKind];
};

/**
 * We don't want to use the ASTNode type since it's too general
 * and includes various types that aren't relevant to our use case.
 *
 * This simplifies it so that we only deal with argument and value types
 * that we need to process.
 */
type ASTNodeType =
  | ArgumentNode
  | ObjectFieldNode
  | ObjectValueNode
  | ValueNode
  | VariableNode;

/**
 * Get the argument values corresponding to field level arguments
 * and inline them in the arguments array for the AST node.
 *
 * This is necessary so that we're writing the field arguments to the
 * cache, which is needed whenever we want to write the incoming
 * data to the cache with keyArgs in the type policy.
 *
 * @param argumentsArray - The arguments array to process
 * @param queryVariables - The query variables
 * @param variableDefinitions - The variable definitions
 * @returns The processed arguments array
 */
const getFieldArguments = (
  argumentsArray: readonly ASTNodeType[],
  // this is actually typed as Record<string, any> in the graphql package
  queryVariables?: Record<string, unknown>,
  variableDefinitions?: readonly VariableDefinitionNode[],
): Array<ASTNodeType | undefined> | undefined => {
  if (!argumentsArray) {
    return undefined;
  }

  // @ts-expect-error Type 'undefined' is not assignable to type 'readonly ObjectFieldNode[]'.ts(2322)
  return argumentsArray.map((arg: ASTNodeType) => {
    /**
     * In the future we may also need to sync nested arrays of variables
     * for keyArgs, in which case we'd need to identify if the
     * arg.value.kind === Kind.LIST and then recurse through the list
     * values to find the corresponding argument node in the AST.
     */
    if (Kind.ARGUMENT === arg.kind && Kind.OBJECT === arg.value.kind) {
      const fieldValue = arg.value;
      const newFields = getFieldArguments(
        fieldValue.fields,
        queryVariables,
        variableDefinitions,
      )?.filter((item) => item !== undefined);

      return {
        ...arg,
        value: {
          ...fieldValue,
          fields: newFields,
        },
      };
    }

    // this gets the variable name associated with the argument
    const variableName: string | undefined =
      Kind.OBJECT_FIELD === arg.kind && Kind.VARIABLE === arg.value.kind
        ? arg.value.name.value
        : undefined;

    // make sure that the variable name is defined in the variables for the query
    if (!variableName || !queryVariables?.[variableName]) {
      return undefined;
    }

    // find the corresponding variable definition node for the variable name. This
    // is needed so that we can get the data type for the value when we write to the cache.
    const variableDefinition = variableDefinitions?.find((item) => {
      return item.variable.name.value === variableName;
    });

    const dataType =
      Kind.NAMED_TYPE === variableDefinition?.type?.kind
        ? variableDefinition.type.name.value
        : undefined;

    const variableKind = getCustomScalarKind(dataType);

    if (!variableKind) {
      return undefined;
    }

    return {
      ...arg,
      value: {
        kind: variableKind,
        value: queryVariables?.[variableName],
        // This field was set when I used inline field arguments in the graphql generated code for a query, so it's probably worth setting here.
        block: false,
      },
    };
  });
};

/**
 * Creates a selection set from object. This is the equivalent
 * of what is returned from gql`query {}` where it includes a
 * selection set of fields based on the object provided
 */
const selectionSetFromObj = (
  obj: JSONValue,
  selectionNodes?: readonly SelectionNode[],
  queryVariables?: Record<string, unknown>,
  variableDefinitions?: readonly VariableDefinitionNode[],
): SelectionSetNode | null => {
  if (
    typeof obj === 'number' ||
    typeof obj === 'boolean' ||
    typeof obj === 'string' ||
    typeof obj === 'undefined' ||
    obj === null
  ) {
    // No selection set here
    return null;
  }

  if (Array.isArray(obj)) {
    // GraphQL queries don't include arrays
    return selectionSetFromObj(
      obj[0],
      selectionNodes,
      queryVariables,
      variableDefinitions,
    );
  }

  // Now we know it's an object
  const selections: FieldNode[] = [];

  Object.keys(obj).forEach((key) => {
    /**
     * Find the nested item in the selection set that corresponds to the
     * key at the next level down in the mutableOperation object.
     *
     * type cast this to FieldNode since we know if we find a node then it's a FieldNode
     */
    const nestedOperation = selectionNodes?.find((item) => {
      return item.kind === Kind.FIELD && item.name.value === key;
    }) as FieldNode | undefined;

    const nestedSelSet: SelectionSetNode | null = selectionSetFromObj(
      obj[key],
      nestedOperation?.selectionSet?.selections,
      queryVariables,
      variableDefinitions,
    );

    const fieldArguments = nestedOperation?.arguments ?? [];

    /**
     * Once we know we have a fieldNode, we want to recurse through the
     * mutableOperations.arguments object to find the corresponding
     * argument node in the AST.
     *
     * Once we have this object, we'll inline the argument value
     * in the value field for the node.
     *
     * We type cast this type because when we recurse through the arguments
     * we deal with nested types that are children of the ArgumentNode.
     * However when the recursion is finished, we'll end up with an
     * ArgumentNode type.
     */
    const newFieldArguments = getFieldArguments(
      fieldArguments,
      queryVariables,
      variableDefinitions,
    )?.filter((arg) => arg !== undefined) as readonly ArgumentNode[];

    const field: FieldNode = {
      kind: Kind.FIELD,
      name: {
        kind: Kind.NAME,
        value: key,
      },
      arguments: newFieldArguments.length > 0 ? newFieldArguments : undefined,
      selectionSet: nestedSelSet || undefined,
    };
    selections.push(field);
  });

  const selectionSet: SelectionSetNode = {
    kind: Kind.SELECTION_SET,
    selections,
  };

  return selectionSet;
};

export const queryFromPojo = (
  obj: JSONObject,
  variables?: { id: string },
  operation?: Operation,
): DocumentNode => {
  const queryDefinitions = operation?.query?.definitions;
  let operationSelections: readonly SelectionNode[] | undefined = undefined;
  let operationVariableDefinitions: readonly VariableDefinitionNode[] = [];

  if (queryDefinitions?.[0]?.kind === Kind.OPERATION_DEFINITION) {
    operationSelections = queryDefinitions[0].selectionSet.selections;
    operationVariableDefinitions =
      queryDefinitions[0].variableDefinitions ?? [];
  }

  const selectionSet = selectionSetFromObj(
    obj,
    operationSelections,
    operation?.variables ?? {},
    operationVariableDefinitions,
  ) || {
    kind: Kind.SELECTION_SET,
    selections: [],
  };

  const variableDefinitions: VariableDefinitionNode[] = Object.keys(
    variables || {},
  ).map(() => ({
    directives: [],
    kind: Kind.VARIABLE_DEFINITION,
    type: {
      kind: Kind.NON_NULL_TYPE,
      type: {
        kind: Kind.NAMED_TYPE,
        name: {
          kind: Kind.NAME,
          value: 'ID',
        },
      },
    },
    variable: {
      kind: Kind.VARIABLE,
      name: {
        kind: Kind.NAME,
        value: 'id',
      },
    },
  }));

  if (selectionSet.selections[0]) {
    // @ts-expect-error
    selectionSet.selections[0].arguments = [
      {
        kind: Kind.ARGUMENT,
        name: {
          kind: Kind.NAME,
          value: 'id',
        },
        value: {
          kind: Kind.VARIABLE,
          name: {
            kind: Kind.NAME,
            value: 'id',
          },
        },
      },
    ];
  }

  const op: OperationDefinitionNode = {
    kind: Kind.OPERATION_DEFINITION,
    operation: OperationTypeNode.QUERY,
    name: {
      kind: Kind.NAME,
      value: 'GeneratedClientQuery',
    },
    selectionSet,
    variableDefinitions,
  };

  const out: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions: [op],
  };

  return out;
};
