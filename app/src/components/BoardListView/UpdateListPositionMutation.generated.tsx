import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateListPositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateListPosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idList"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateListPosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"idList"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idList"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateListPosition","document":UpdateListPositionDocument}} as const;
export type UpdateListPositionMutationVariables = Types.Exact<{
  idBoard?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  idList: Types.Scalars['ID']['input'];
  pos: Types.Scalars['Int']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UpdateListPositionMutation = (
  { __typename: 'Mutation' }
  & { updateListPosition?: Types.Maybe<(
    { __typename: 'List' }
    & Pick<Types.List, 'id' | 'idBoard' | 'pos'>
  )> }
);

export type UpdateListPositionMutationFn = Apollo.MutationFunction<
  UpdateListPositionMutation,
  UpdateListPositionMutationVariables
>;

/**
 * __useUpdateListPositionMutation__
 *
 * To run a mutation, you first call `useUpdateListPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateListPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateListPositionMutation, { data, loading, error }] = useUpdateListPositionMutation({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      idList: // value for 'idList'
 *      pos: // value for 'pos'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateListPositionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateListPositionMutation,
    UpdateListPositionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateListPositionMutation,
    UpdateListPositionMutationVariables
  >(UpdateListPositionDocument, options);
}
export type UpdateListPositionMutationHookResult = ReturnType<
  typeof useUpdateListPositionMutation
>;
export type UpdateListPositionMutationResult =
  Apollo.MutationResult<UpdateListPositionMutation>;
export type UpdateListPositionMutationOptions = Apollo.BaseMutationOptions<
  UpdateListPositionMutation,
  UpdateListPositionMutationVariables
>;
