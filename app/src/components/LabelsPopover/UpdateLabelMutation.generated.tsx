import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"label"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputLabel"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"label"},"value":{"kind":"Variable","name":{"kind":"Name","value":"label"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateLabel","document":UpdateLabelDocument}} as const;
export type UpdateLabelMutationVariables = Types.Exact<{
  label: Types.InputLabel;
  traceId: Types.Scalars['String']['input'];
}>;


export type UpdateLabelMutation = (
  { __typename: 'Mutation' }
  & { updateLabel?: Types.Maybe<(
    { __typename: 'Label' }
    & Pick<
      Types.Label,
      | 'id'
      | 'color'
      | 'idBoard'
      | 'name'
    >
  )> }
);

export type UpdateLabelMutationFn = Apollo.MutationFunction<
  UpdateLabelMutation,
  UpdateLabelMutationVariables
>;

/**
 * __useUpdateLabelMutation__
 *
 * To run a mutation, you first call `useUpdateLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLabelMutation, { data, loading, error }] = useUpdateLabelMutation({
 *   variables: {
 *      label: // value for 'label'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateLabelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLabelMutation,
    UpdateLabelMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLabelMutation, UpdateLabelMutationVariables>(
    UpdateLabelDocument,
    options,
  );
}
export type UpdateLabelMutationHookResult = ReturnType<
  typeof useUpdateLabelMutation
>;
export type UpdateLabelMutationResult =
  Apollo.MutationResult<UpdateLabelMutation>;
export type UpdateLabelMutationOptions = Apollo.BaseMutationOptions<
  UpdateLabelMutation,
  UpdateLabelMutationVariables
>;
