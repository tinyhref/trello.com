import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateListDatasourceFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateListDatasourceFilter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateListDatasourceFilter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datasource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filter"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateListDatasourceFilter","document":UpdateListDatasourceFilterDocument}} as const;
export type UpdateListDatasourceFilterMutationVariables = Types.Exact<{
  listId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
  value: Types.Scalars['Boolean']['input'];
}>;


export type UpdateListDatasourceFilterMutation = (
  { __typename: 'Mutation' }
  & { updateListDatasourceFilter?: Types.Maybe<(
    { __typename: 'List' }
    & Pick<Types.List, 'id'>
    & { datasource?: Types.Maybe<(
      { __typename: 'List_DataSource' }
      & Pick<Types.List_DataSource, 'filter'>
    )> }
  )> }
);

export type UpdateListDatasourceFilterMutationFn = Apollo.MutationFunction<
  UpdateListDatasourceFilterMutation,
  UpdateListDatasourceFilterMutationVariables
>;

/**
 * __useUpdateListDatasourceFilterMutation__
 *
 * To run a mutation, you first call `useUpdateListDatasourceFilterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListDatasourceFilterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListDatasourceFilterMutation, { data, loading, error }] = useUpdateListDatasourceFilterMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      traceId: // value for 'traceId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateListDatasourceFilterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateListDatasourceFilterMutation,
    UpdateListDatasourceFilterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateListDatasourceFilterMutation,
    UpdateListDatasourceFilterMutationVariables
  >(UpdateListDatasourceFilterDocument, options);
}
export type UpdateListDatasourceFilterMutationHookResult = ReturnType<
  typeof useUpdateListDatasourceFilterMutation
>;
export type UpdateListDatasourceFilterMutationResult =
  Apollo.MutationResult<UpdateListDatasourceFilterMutation>;
export type UpdateListDatasourceFilterMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateListDatasourceFilterMutation,
    UpdateListDatasourceFilterMutationVariables
  >;
