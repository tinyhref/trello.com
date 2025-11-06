import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const TrelloSmartScheduleCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TrelloSmartScheduleCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timezoneOffsetHours"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"smartScheduleCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"cardIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardIds"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"timezoneOffsetHours"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timezoneOffsetHours"}}}]}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"optIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"StringValue","value":"TrelloSmartScheduleCards","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unscheduledCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"TrelloSmartScheduleCards","document":TrelloSmartScheduleCardsDocument}} as const;
export type TrelloSmartScheduleCardsMutationVariables = Types.Exact<{
  cardIds: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  endDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  startDate?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
  timezoneOffsetHours?: Types.InputMaybe<Types.Scalars['Float']['input']>;
}>;


export type TrelloSmartScheduleCardsMutation = (
  { __typename: 'Mutation' }
  & { trello: (
    { __typename: 'TrelloMutationApi' }
    & { smartScheduleCards?: Types.Maybe<(
      { __typename: 'TrelloProposedSmartSchedule' }
      & {
        events?: Types.Maybe<Array<(
          { __typename: 'TrelloProposedSmartScheduleEvent' }
          & Pick<Types.TrelloProposedSmartScheduleEvent, 'endTime' | 'startTime'>
          & { cards?: Types.Maybe<Array<(
            { __typename: 'TrelloCard' }
            & Pick<Types.TrelloCard, 'id' | 'name'>
          )>> }
        )>>,
        unscheduledCards?: Types.Maybe<Array<(
          { __typename: 'TrelloCard' }
          & Pick<Types.TrelloCard, 'id'>
        )>>,
      }
    )> }
  ) }
);

export type TrelloSmartScheduleCardsMutationFn = Apollo.MutationFunction<
  TrelloSmartScheduleCardsMutation,
  TrelloSmartScheduleCardsMutationVariables
>;

/**
 * __useTrelloSmartScheduleCardsMutation__
 *
 * To run a mutation, you first call `useTrelloSmartScheduleCardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrelloSmartScheduleCardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trelloSmartScheduleCardsMutation, { data, loading, error }] = useTrelloSmartScheduleCardsMutation({
 *   variables: {
 *      cardIds: // value for 'cardIds'
 *      endDate: // value for 'endDate'
 *      startDate: // value for 'startDate'
 *      timezoneOffsetHours: // value for 'timezoneOffsetHours'
 *   },
 * });
 */
export function useTrelloSmartScheduleCardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrelloSmartScheduleCardsMutation,
    TrelloSmartScheduleCardsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    TrelloSmartScheduleCardsMutation,
    TrelloSmartScheduleCardsMutationVariables
  >(TrelloSmartScheduleCardsDocument, options);
}
export type TrelloSmartScheduleCardsMutationHookResult = ReturnType<
  typeof useTrelloSmartScheduleCardsMutation
>;
export type TrelloSmartScheduleCardsMutationResult =
  Apollo.MutationResult<TrelloSmartScheduleCardsMutation>;
export type TrelloSmartScheduleCardsMutationOptions =
  Apollo.BaseMutationOptions<
    TrelloSmartScheduleCardsMutation,
    TrelloSmartScheduleCardsMutationVariables
  >;
