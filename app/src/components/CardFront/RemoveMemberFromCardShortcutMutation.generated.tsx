import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const RemoveMemberFromCardShortcutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMemberFromCardShortcut"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMemberFromCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"idMember"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RemoveMemberFromCardShortcut","document":RemoveMemberFromCardShortcutDocument}} as const;
export type RemoveMemberFromCardShortcutMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  idMember: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type RemoveMemberFromCardShortcutMutation = (
  { __typename: 'Mutation' }
  & { removeMemberFromCard?: Types.Maybe<(
    { __typename: 'Card_Member_DeleteResponse' }
    & Pick<Types.Card_Member_DeleteResponse, 'success'>
  )> }
);

export type RemoveMemberFromCardShortcutMutationFn = Apollo.MutationFunction<
  RemoveMemberFromCardShortcutMutation,
  RemoveMemberFromCardShortcutMutationVariables
>;

/**
 * __useRemoveMemberFromCardShortcutMutation__
 *
 * To run a mutation, you first call `useRemoveMemberFromCardShortcutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMemberFromCardShortcutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMemberFromCardShortcutMutation, { data, loading, error }] = useRemoveMemberFromCardShortcutMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      idMember: // value for 'idMember'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useRemoveMemberFromCardShortcutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveMemberFromCardShortcutMutation,
    RemoveMemberFromCardShortcutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveMemberFromCardShortcutMutation,
    RemoveMemberFromCardShortcutMutationVariables
  >(RemoveMemberFromCardShortcutDocument, options);
}
export type RemoveMemberFromCardShortcutMutationHookResult = ReturnType<
  typeof useRemoveMemberFromCardShortcutMutation
>;
export type RemoveMemberFromCardShortcutMutationResult =
  Apollo.MutationResult<RemoveMemberFromCardShortcutMutation>;
export type RemoveMemberFromCardShortcutMutationOptions =
  Apollo.BaseMutationOptions<
    RemoveMemberFromCardShortcutMutation,
    RemoveMemberFromCardShortcutMutationVariables
  >;
