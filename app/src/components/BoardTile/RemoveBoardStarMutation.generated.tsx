import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const RemoveBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardStarId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RemoveBoardStar","document":RemoveBoardStarDocument}} as const;
export type RemoveBoardStarMutationVariables = Types.Exact<{
  boardStarId: Types.Scalars['ID']['input'];
  memberId: Types.Scalars['ID']['input'];
  traceId?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type RemoveBoardStarMutation = (
  { __typename: 'Mutation' }
  & Pick<Types.Mutation, 'removeBoardStar'>
);

export type RemoveBoardStarMutationFn = Apollo.MutationFunction<
  RemoveBoardStarMutation,
  RemoveBoardStarMutationVariables
>;

/**
 * __useRemoveBoardStarMutation__
 *
 * To run a mutation, you first call `useRemoveBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBoardStarMutation, { data, loading, error }] = useRemoveBoardStarMutation({
 *   variables: {
 *      boardStarId: // value for 'boardStarId'
 *      memberId: // value for 'memberId'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useRemoveBoardStarMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveBoardStarMutation,
    RemoveBoardStarMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveBoardStarMutation,
    RemoveBoardStarMutationVariables
  >(RemoveBoardStarDocument, options);
}
export type RemoveBoardStarMutationHookResult = ReturnType<
  typeof useRemoveBoardStarMutation
>;
export type RemoveBoardStarMutationResult =
  Apollo.MutationResult<RemoveBoardStarMutation>;
export type RemoveBoardStarMutationOptions = Apollo.BaseMutationOptions<
  RemoveBoardStarMutation,
  RemoveBoardStarMutationVariables
>;
