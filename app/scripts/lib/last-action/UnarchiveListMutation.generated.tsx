import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UnarchiveListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idList"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveListMutation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idList"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UnarchiveList","document":UnarchiveListDocument}} as const;
export type UnarchiveListMutationVariables = Types.Exact<{
  idList: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UnarchiveListMutation = (
  { __typename: 'Mutation' }
  & { unarchiveListMutation?: Types.Maybe<(
    { __typename: 'List' }
    & Pick<Types.List, 'id'>
  )> }
);

export type UnarchiveListMutationFn = Apollo.MutationFunction<
  UnarchiveListMutation,
  UnarchiveListMutationVariables
>;

/**
 * __useUnarchiveListMutation__
 *
 * To run a mutation, you first call `useUnarchiveListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnarchiveListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unarchiveListMutation, { data, loading, error }] = useUnarchiveListMutation({
 *   variables: {
 *      idList: // value for 'idList'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUnarchiveListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UnarchiveListMutation,
    UnarchiveListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UnarchiveListMutation,
    UnarchiveListMutationVariables
  >(UnarchiveListDocument, options);
}
export type UnarchiveListMutationHookResult = ReturnType<
  typeof useUnarchiveListMutation
>;
export type UnarchiveListMutationResult =
  Apollo.MutationResult<UnarchiveListMutation>;
export type UnarchiveListMutationOptions = Apollo.BaseMutationOptions<
  UnarchiveListMutation,
  UnarchiveListMutationVariables
>;
