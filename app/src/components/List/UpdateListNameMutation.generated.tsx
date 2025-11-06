import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateListNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateListName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"listId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateListName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"listId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateListName","document":UpdateListNameDocument}} as const;
export type UpdateListNameMutationVariables = Types.Exact<{
  listId: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UpdateListNameMutation = (
  { __typename: 'Mutation' }
  & { updateListName?: Types.Maybe<(
    { __typename: 'List' }
    & Pick<Types.List, 'id' | 'name'>
  )> }
);

export type UpdateListNameMutationFn = Apollo.MutationFunction<
  UpdateListNameMutation,
  UpdateListNameMutationVariables
>;

/**
 * __useUpdateListNameMutation__
 *
 * To run a mutation, you first call `useUpdateListNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListNameMutation, { data, loading, error }] = useUpdateListNameMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      name: // value for 'name'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateListNameMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateListNameMutation,
    UpdateListNameMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateListNameMutation,
    UpdateListNameMutationVariables
  >(UpdateListNameDocument, options);
}
export type UpdateListNameMutationHookResult = ReturnType<
  typeof useUpdateListNameMutation
>;
export type UpdateListNameMutationResult =
  Apollo.MutationResult<UpdateListNameMutation>;
export type UpdateListNameMutationOptions = Apollo.BaseMutationOptions<
  UpdateListNameMutation,
  UpdateListNameMutationVariables
>;
