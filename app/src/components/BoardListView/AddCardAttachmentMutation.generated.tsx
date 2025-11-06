import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const AddCardAttachmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCardAttachment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FileUpload"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mimeType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NumberOrString"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addAttachmentToCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}},{"kind":"Argument","name":{"kind":"Name","value":"mimeType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mimeType"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"AddCardAttachment","document":AddCardAttachmentDocument}} as const;
export type AddCardAttachmentMutationVariables = Types.Exact<{
  file?: Types.InputMaybe<Types.Scalars['FileUpload']['input']>;
  idCard: Types.Scalars['ID']['input'];
  mimeType?: Types.InputMaybe<Types.Scalars['String']['input']>;
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  pos?: Types.InputMaybe<Types.Scalars['NumberOrString']['input']>;
  url?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type AddCardAttachmentMutation = (
  { __typename: 'Mutation' }
  & { addAttachmentToCard?: Types.Maybe<(
    { __typename: 'Attachment' }
    & Pick<
      Types.Attachment,
      | 'id'
      | 'fileName'
      | 'mimeType'
      | 'name'
      | 'pos'
      | 'url'
    >
  )> }
);

export type AddCardAttachmentMutationFn = Apollo.MutationFunction<
  AddCardAttachmentMutation,
  AddCardAttachmentMutationVariables
>;

/**
 * __useAddCardAttachmentMutation__
 *
 * To run a mutation, you first call `useAddCardAttachmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCardAttachmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCardAttachmentMutation, { data, loading, error }] = useAddCardAttachmentMutation({
 *   variables: {
 *      file: // value for 'file'
 *      idCard: // value for 'idCard'
 *      mimeType: // value for 'mimeType'
 *      name: // value for 'name'
 *      pos: // value for 'pos'
 *      url: // value for 'url'
 *   },
 * });
 */
export function useAddCardAttachmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddCardAttachmentMutation,
    AddCardAttachmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddCardAttachmentMutation,
    AddCardAttachmentMutationVariables
  >(AddCardAttachmentDocument, options);
}
export type AddCardAttachmentMutationHookResult = ReturnType<
  typeof useAddCardAttachmentMutation
>;
export type AddCardAttachmentMutationResult =
  Apollo.MutationResult<AddCardAttachmentMutation>;
export type AddCardAttachmentMutationOptions = Apollo.BaseMutationOptions<
  AddCardAttachmentMutation,
  AddCardAttachmentMutationVariables
>;
