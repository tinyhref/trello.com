import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const BoardJoinButtonAddMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BoardJoinButtonAddMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"acceptUnconfirmed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allowBillableGuest"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"member"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberOrEmail"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"acceptUnconfirmed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"acceptUnconfirmed"}}},{"kind":"Argument","name":{"kind":"Name","value":"allowBillableGuest"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allowBillableGuest"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"member"},"value":{"kind":"Variable","name":{"kind":"Name","value":"member"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardJoinButtonAddMember","document":BoardJoinButtonAddMemberDocument}} as const;
export type BoardJoinButtonAddMemberMutationVariables = Types.Exact<{
  acceptUnconfirmed?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  allowBillableGuest?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
  boardId: Types.Scalars['ID']['input'];
  member: Types.MemberOrEmail;
  traceId: Types.Scalars['String']['input'];
  type?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type BoardJoinButtonAddMemberMutation = (
  { __typename: 'Mutation' }
  & { addMemberToBoard?: Types.Maybe<(
    { __typename: 'InviteMember_Response' }
    & Pick<Types.InviteMember_Response, 'success'>
  )> }
);

export type BoardJoinButtonAddMemberMutationFn = Apollo.MutationFunction<
  BoardJoinButtonAddMemberMutation,
  BoardJoinButtonAddMemberMutationVariables
>;

/**
 * __useBoardJoinButtonAddMemberMutation__
 *
 * To run a mutation, you first call `useBoardJoinButtonAddMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBoardJoinButtonAddMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [boardJoinButtonAddMemberMutation, { data, loading, error }] = useBoardJoinButtonAddMemberMutation({
 *   variables: {
 *      acceptUnconfirmed: // value for 'acceptUnconfirmed'
 *      allowBillableGuest: // value for 'allowBillableGuest'
 *      boardId: // value for 'boardId'
 *      member: // value for 'member'
 *      traceId: // value for 'traceId'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useBoardJoinButtonAddMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    BoardJoinButtonAddMemberMutation,
    BoardJoinButtonAddMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    BoardJoinButtonAddMemberMutation,
    BoardJoinButtonAddMemberMutationVariables
  >(BoardJoinButtonAddMemberDocument, options);
}
export type BoardJoinButtonAddMemberMutationHookResult = ReturnType<
  typeof useBoardJoinButtonAddMemberMutation
>;
export type BoardJoinButtonAddMemberMutationResult =
  Apollo.MutationResult<BoardJoinButtonAddMemberMutation>;
export type BoardJoinButtonAddMemberMutationOptions =
  Apollo.BaseMutationOptions<
    BoardJoinButtonAddMemberMutation,
    BoardJoinButtonAddMemberMutationVariables
  >;
