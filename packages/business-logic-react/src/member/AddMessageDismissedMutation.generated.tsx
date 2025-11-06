import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddMessageDismissedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMessageDismissed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastDismissed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMessageDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lastDismissed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastDismissed"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"messagesDismissed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"lastDismissed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddMessageDismissed","document":AddMessageDismissedDocument}} as const;
export type AddMessageDismissedMutationVariables = Types.Exact<{
  lastDismissed: Types.Scalars['String']['input'];
  memberId: Types.Scalars['ID']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type AddMessageDismissedMutation = (
  { __typename: 'Mutation' }
  & { addMessageDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { messagesDismissed?: Types.Maybe<Array<(
      { __typename: 'Member_MessageDismissed' }
      & Pick<
        Types.Member_MessageDismissed,
        | 'id'
        | '_id'
        | 'count'
        | 'lastDismissed'
        | 'name'
      >
    )>> }
  )> }
);

export type AddMessageDismissedMutationFn = Apollo.MutationFunction<
  AddMessageDismissedMutation,
  AddMessageDismissedMutationVariables
>;

/**
 * __useAddMessageDismissedMutation__
 *
 * To run a mutation, you first call `useAddMessageDismissedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageDismissedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageDismissedMutation, { data, loading, error }] = useAddMessageDismissedMutation({
 *   variables: {
 *      lastDismissed: // value for 'lastDismissed'
 *      memberId: // value for 'memberId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddMessageDismissedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddMessageDismissedMutation,
    AddMessageDismissedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddMessageDismissedMutation,
    AddMessageDismissedMutationVariables
  >(AddMessageDismissedDocument, options);
}
export type AddMessageDismissedMutationHookResult = ReturnType<
  typeof useAddMessageDismissedMutation
>;
export type AddMessageDismissedMutationResult =
  Apollo.MutationResult<AddMessageDismissedMutation>;
export type AddMessageDismissedMutationOptions = Apollo.BaseMutationOptions<
  AddMessageDismissedMutation,
  AddMessageDismissedMutationVariables
>;
