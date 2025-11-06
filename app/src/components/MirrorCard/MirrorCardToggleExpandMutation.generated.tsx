import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const MirrorCardToggleExpandDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MirrorCardToggleExpand"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pref"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Input_Board_MyPrefs"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardMyPrefs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pref"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pref"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showCompactMirrorCards"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"MirrorCardToggleExpand","document":MirrorCardToggleExpandDocument}} as const;
export type MirrorCardToggleExpandMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  pref: Types.Input_Board_MyPrefs;
  value: Types.Scalars['String']['input'];
}>;


export type MirrorCardToggleExpandMutation = (
  { __typename: 'Mutation' }
  & { updateBoardMyPrefs?: Types.Maybe<(
    { __typename: 'MyPrefs' }
    & Pick<Types.MyPrefs, 'showCompactMirrorCards'>
  )> }
);

export type MirrorCardToggleExpandMutationFn = Apollo.MutationFunction<
  MirrorCardToggleExpandMutation,
  MirrorCardToggleExpandMutationVariables
>;

/**
 * __useMirrorCardToggleExpandMutation__
 *
 * To run a mutation, you first call `useMirrorCardToggleExpandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMirrorCardToggleExpandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mirrorCardToggleExpandMutation, { data, loading, error }] = useMirrorCardToggleExpandMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      pref: // value for 'pref'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useMirrorCardToggleExpandMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MirrorCardToggleExpandMutation,
    MirrorCardToggleExpandMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MirrorCardToggleExpandMutation,
    MirrorCardToggleExpandMutationVariables
  >(MirrorCardToggleExpandDocument, options);
}
export type MirrorCardToggleExpandMutationHookResult = ReturnType<
  typeof useMirrorCardToggleExpandMutation
>;
export type MirrorCardToggleExpandMutationResult =
  Apollo.MutationResult<MirrorCardToggleExpandMutation>;
export type MirrorCardToggleExpandMutationOptions = Apollo.BaseMutationOptions<
  MirrorCardToggleExpandMutation,
  MirrorCardToggleExpandMutationVariables
>;
