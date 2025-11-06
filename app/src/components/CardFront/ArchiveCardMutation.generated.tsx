import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const ArchiveCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateClosed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateClosed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateClosed"}}},{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateClosed"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ArchiveCard","document":ArchiveCardDocument}} as const;
export type ArchiveCardMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID']['input'];
  dateClosed: Types.Scalars['String']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type ArchiveCardMutation = (
  { __typename: 'Mutation' }
  & { archiveCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'closed'
      | 'dateClosed'
      | 'idBoard'
    >
  )> }
);

export type ArchiveCardMutationFn = Apollo.MutationFunction<
  ArchiveCardMutation,
  ArchiveCardMutationVariables
>;

/**
 * __useArchiveCardMutation__
 *
 * To run a mutation, you first call `useArchiveCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveCardMutation, { data, loading, error }] = useArchiveCardMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      dateClosed: // value for 'dateClosed'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useArchiveCardMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ArchiveCardMutation,
    ArchiveCardMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ArchiveCardMutation, ArchiveCardMutationVariables>(
    ArchiveCardDocument,
    options,
  );
}
export type ArchiveCardMutationHookResult = ReturnType<
  typeof useArchiveCardMutation
>;
export type ArchiveCardMutationResult =
  Apollo.MutationResult<ArchiveCardMutation>;
export type ArchiveCardMutationOptions = Apollo.BaseMutationOptions<
  ArchiveCardMutation,
  ArchiveCardMutationVariables
>;
