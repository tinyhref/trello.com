import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddMemberToCardShortcutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMemberToCardShortcut"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"idMember"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddMemberToCardShortcut","document":AddMemberToCardShortcutDocument}} as const;
export type AddMemberToCardShortcutMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  idMember: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type AddMemberToCardShortcutMutation = (
  { __typename: 'Mutation' }
  & { addMemberToCard?: Types.Maybe<(
    { __typename: 'Card_Member_AddResponse' }
    & Pick<Types.Card_Member_AddResponse, 'success'>
  )> }
);

export type AddMemberToCardShortcutMutationFn = Apollo.MutationFunction<
  AddMemberToCardShortcutMutation,
  AddMemberToCardShortcutMutationVariables
>;

/**
 * __useAddMemberToCardShortcutMutation__
 *
 * To run a mutation, you first call `useAddMemberToCardShortcutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberToCardShortcutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberToCardShortcutMutation, { data, loading, error }] = useAddMemberToCardShortcutMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      idMember: // value for 'idMember'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useAddMemberToCardShortcutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddMemberToCardShortcutMutation,
    AddMemberToCardShortcutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddMemberToCardShortcutMutation,
    AddMemberToCardShortcutMutationVariables
  >(AddMemberToCardShortcutDocument, options);
}
export type AddMemberToCardShortcutMutationHookResult = ReturnType<
  typeof useAddMemberToCardShortcutMutation
>;
export type AddMemberToCardShortcutMutationResult =
  Apollo.MutationResult<AddMemberToCardShortcutMutation>;
export type AddMemberToCardShortcutMutationOptions = Apollo.BaseMutationOptions<
  AddMemberToCardShortcutMutation,
  AddMemberToCardShortcutMutationVariables
>;
