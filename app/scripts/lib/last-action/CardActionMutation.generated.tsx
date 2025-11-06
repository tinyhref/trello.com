import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const CardActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CardAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"card"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCardArgs"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"card"},"value":{"kind":"Variable","name":{"kind":"Name","value":"card"}}},{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}},{"kind":"Field","name":{"kind":"Name","value":"idLabels"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CardAction","document":CardActionDocument}} as const;
export type CardActionMutationVariables = Types.Exact<{
  card: Types.UpdateCardArgs;
  cardId: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type CardActionMutation = (
  { __typename: 'Mutation' }
  & { updateCard?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'closed'
      | 'desc'
      | 'due'
      | 'dueReminder'
      | 'idLabels'
      | 'idList'
      | 'idMembers'
      | 'name'
      | 'pos'
      | 'start'
      | 'subscribed'
    >
  )> }
);

export type CardActionMutationFn = Apollo.MutationFunction<
  CardActionMutation,
  CardActionMutationVariables
>;

/**
 * __useCardActionMutation__
 *
 * To run a mutation, you first call `useCardActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCardActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cardActionMutation, { data, loading, error }] = useCardActionMutation({
 *   variables: {
 *      card: // value for 'card'
 *      cardId: // value for 'cardId'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useCardActionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CardActionMutation,
    CardActionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CardActionMutation, CardActionMutationVariables>(
    CardActionDocument,
    options,
  );
}
export type CardActionMutationHookResult = ReturnType<
  typeof useCardActionMutation
>;
export type CardActionMutationResult =
  Apollo.MutationResult<CardActionMutation>;
export type CardActionMutationOptions = Apollo.BaseMutationOptions<
  CardActionMutation,
  CardActionMutationVariables
>;
