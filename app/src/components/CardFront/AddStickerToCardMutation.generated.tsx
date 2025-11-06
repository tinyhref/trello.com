import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddStickerToCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddStickerToCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"left"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rotate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"top"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zIndex"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addStickerToCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"imageUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"left"},"value":{"kind":"Variable","name":{"kind":"Name","value":"left"}}},{"kind":"Argument","name":{"kind":"Name","value":"rotate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rotate"}}},{"kind":"Argument","name":{"kind":"Name","value":"top"},"value":{"kind":"Variable","name":{"kind":"Name","value":"top"}}},{"kind":"Argument","name":{"kind":"Name","value":"zIndex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zIndex"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"rotate"}},{"kind":"Field","name":{"kind":"Name","value":"top"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddStickerToCard","document":AddStickerToCardDocument}} as const;
export type AddStickerToCardMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  image: Types.Scalars['String']['input'];
  imageUrl: Types.Scalars['String']['input'];
  left: Types.Scalars['Float']['input'];
  rotate: Types.Scalars['Float']['input'];
  top: Types.Scalars['Float']['input'];
  zIndex: Types.Scalars['Int']['input'];
}>;


export type AddStickerToCardMutation = (
  { __typename: 'Mutation' }
  & { addStickerToCard?: Types.Maybe<(
    { __typename: 'Sticker' }
    & Pick<
      Types.Sticker,
      | 'id'
      | 'image'
      | 'imageUrl'
      | 'left'
      | 'rotate'
      | 'top'
      | 'zIndex'
    >
    & { imageScaled: Array<(
      { __typename: 'Sticker_ImageScaled' }
      & Pick<
        Types.Sticker_ImageScaled,
        | 'id'
        | 'height'
        | 'scaled'
        | 'url'
        | 'width'
      >
    )> }
  )> }
);

export type AddStickerToCardMutationFn = Apollo.MutationFunction<
  AddStickerToCardMutation,
  AddStickerToCardMutationVariables
>;

/**
 * __useAddStickerToCardMutation__
 *
 * To run a mutation, you first call `useAddStickerToCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStickerToCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStickerToCardMutation, { data, loading, error }] = useAddStickerToCardMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      image: // value for 'image'
 *      imageUrl: // value for 'imageUrl'
 *      left: // value for 'left'
 *      rotate: // value for 'rotate'
 *      top: // value for 'top'
 *      zIndex: // value for 'zIndex'
 *   },
 * });
 */
export function useAddStickerToCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddStickerToCardMutation,
    AddStickerToCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddStickerToCardMutation,
    AddStickerToCardMutationVariables
  >(AddStickerToCardDocument, options);
}
export type AddStickerToCardMutationHookResult = ReturnType<
  typeof useAddStickerToCardMutation
>;
export type AddStickerToCardMutationResult =
  Apollo.MutationResult<AddStickerToCardMutation>;
export type AddStickerToCardMutationOptions = Apollo.BaseMutationOptions<
  AddStickerToCardMutation,
  AddStickerToCardMutationVariables
>;
