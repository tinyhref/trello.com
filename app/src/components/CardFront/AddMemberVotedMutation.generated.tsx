import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddMemberVotedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMemberVoted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberVoted"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"idMember"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddMemberVoted","document":AddMemberVotedDocument}} as const;
export type AddMemberVotedMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  idMember: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type AddMemberVotedMutation = (
  { __typename: 'Mutation' }
  & { addMemberVoted?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id'>
  )> }
);

export type AddMemberVotedMutationFn = Apollo.MutationFunction<
  AddMemberVotedMutation,
  AddMemberVotedMutationVariables
>;

/**
 * __useAddMemberVotedMutation__
 *
 * To run a mutation, you first call `useAddMemberVotedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMemberVotedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMemberVotedMutation, { data, loading, error }] = useAddMemberVotedMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      idMember: // value for 'idMember'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useAddMemberVotedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddMemberVotedMutation,
    AddMemberVotedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddMemberVotedMutation,
    AddMemberVotedMutationVariables
  >(AddMemberVotedDocument, options);
}
export type AddMemberVotedMutationHookResult = ReturnType<
  typeof useAddMemberVotedMutation
>;
export type AddMemberVotedMutationResult =
  Apollo.MutationResult<AddMemberVotedMutation>;
export type AddMemberVotedMutationOptions = Apollo.BaseMutationOptions<
  AddMemberVotedMutation,
  AddMemberVotedMutationVariables
>;
