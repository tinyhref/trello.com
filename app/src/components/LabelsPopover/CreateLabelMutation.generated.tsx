import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CreateLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Label_Color"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CreateLabel","document":CreateLabelDocument}} as const;
export type CreateLabelMutationVariables = Types.Exact<{
  color?: Types.InputMaybe<Types.Label_Color>;
  idBoard: Types.Scalars['ID']['input'];
  idCard?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  traceId: Types.Scalars['String']['input'];
}>;


export type CreateLabelMutation = (
  { __typename: 'Mutation' }
  & { createLabel?: Types.Maybe<(
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

export type CreateLabelMutationFn = Apollo.MutationFunction<
  CreateLabelMutation,
  CreateLabelMutationVariables
>;

/**
 * __useCreateLabelMutation__
 *
 * To run a mutation, you first call `useCreateLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLabelMutation, { data, loading, error }] = useCreateLabelMutation({
 *   variables: {
 *      color: // value for 'color'
 *      idBoard: // value for 'idBoard'
 *      idCard: // value for 'idCard'
 *      name: // value for 'name'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCreateLabelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateLabelMutation,
    CreateLabelMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateLabelMutation, CreateLabelMutationVariables>(
    CreateLabelDocument,
    options,
  );
}
export type CreateLabelMutationHookResult = ReturnType<
  typeof useCreateLabelMutation
>;
export type CreateLabelMutationResult =
  Apollo.MutationResult<CreateLabelMutation>;
export type CreateLabelMutationOptions = Apollo.BaseMutationOptions<
  CreateLabelMutation,
  CreateLabelMutationVariables
>;
