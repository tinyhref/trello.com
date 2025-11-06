import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const UpdateCardLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCardLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idLabels"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardLabels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"idLabels"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idLabels"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"UpdateCardLabels","document":UpdateCardLabelsDocument}} as const;
export type UpdateCardLabelsMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
  idLabels: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type UpdateCardLabelsMutation = (
  { __typename: 'Mutation' }
  & { updateCardLabels?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id'>
    & { labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'color' | 'name'>
    )> }
  )> }
);

export type UpdateCardLabelsMutationFn = Apollo.MutationFunction<
  UpdateCardLabelsMutation,
  UpdateCardLabelsMutationVariables
>;

/**
 * __useUpdateCardLabelsMutation__
 *
 * To run a mutation, you first call `useUpdateCardLabelsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardLabelsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardLabelsMutation, { data, loading, error }] = useUpdateCardLabelsMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      idLabels: // value for 'idLabels'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateCardLabelsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCardLabelsMutation,
    UpdateCardLabelsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCardLabelsMutation,
    UpdateCardLabelsMutationVariables
  >(UpdateCardLabelsDocument, options);
}
export type UpdateCardLabelsMutationHookResult = ReturnType<
  typeof useUpdateCardLabelsMutation
>;
export type UpdateCardLabelsMutationResult =
  Apollo.MutationResult<UpdateCardLabelsMutation>;
export type UpdateCardLabelsMutationOptions = Apollo.BaseMutationOptions<
  UpdateCardLabelsMutation,
  UpdateCardLabelsMutationVariables
>;
