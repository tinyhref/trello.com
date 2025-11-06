import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const RemoveStickerFromCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveStickerFromCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idSticker"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeStickerFromCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"idSticker"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idSticker"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RemoveStickerFromCard","document":RemoveStickerFromCardDocument}} as const;
export type RemoveStickerFromCardMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID']['input'];
  idSticker: Types.Scalars['ID']['input'];
}>;


export type RemoveStickerFromCardMutation = (
  { __typename: 'Mutation' }
  & { removeStickerFromCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id'>
  )> }
);

export type RemoveStickerFromCardMutationFn = Apollo.MutationFunction<
  RemoveStickerFromCardMutation,
  RemoveStickerFromCardMutationVariables
>;

/**
 * __useRemoveStickerFromCardMutation__
 *
 * To run a mutation, you first call `useRemoveStickerFromCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveStickerFromCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeStickerFromCardMutation, { data, loading, error }] = useRemoveStickerFromCardMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      idSticker: // value for 'idSticker'
 *   },
 * });
 */
export function useRemoveStickerFromCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveStickerFromCardMutation,
    RemoveStickerFromCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveStickerFromCardMutation,
    RemoveStickerFromCardMutationVariables
  >(RemoveStickerFromCardDocument, options);
}
export type RemoveStickerFromCardMutationHookResult = ReturnType<
  typeof useRemoveStickerFromCardMutation
>;
export type RemoveStickerFromCardMutationResult =
  Apollo.MutationResult<RemoveStickerFromCardMutation>;
export type RemoveStickerFromCardMutationOptions = Apollo.BaseMutationOptions<
  RemoveStickerFromCardMutation,
  RemoveStickerFromCardMutationVariables
>;
