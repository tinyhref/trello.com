import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const DeleteLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idLabel"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idLabel"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"DeleteLabel","document":DeleteLabelDocument}} as const;
export type DeleteLabelMutationVariables = Types.Exact<{
  idLabel: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type DeleteLabelMutation = (
  { __typename: 'Mutation' }
  & { deleteLabel?: Types.Maybe<(
    { __typename: 'Label_DeleteResponse' }
    & Pick<Types.Label_DeleteResponse, 'success'>
  )> }
);

export type DeleteLabelMutationFn = Apollo.MutationFunction<
  DeleteLabelMutation,
  DeleteLabelMutationVariables
>;

/**
 * __useDeleteLabelMutation__
 *
 * To run a mutation, you first call `useDeleteLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLabelMutation, { data, loading, error }] = useDeleteLabelMutation({
 *   variables: {
 *      idLabel: // value for 'idLabel'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useDeleteLabelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteLabelMutation,
    DeleteLabelMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteLabelMutation, DeleteLabelMutationVariables>(
    DeleteLabelDocument,
    options,
  );
}
export type DeleteLabelMutationHookResult = ReturnType<
  typeof useDeleteLabelMutation
>;
export type DeleteLabelMutationResult =
  Apollo.MutationResult<DeleteLabelMutation>;
export type DeleteLabelMutationOptions = Apollo.BaseMutationOptions<
  DeleteLabelMutation,
  DeleteLabelMutationVariables
>;
