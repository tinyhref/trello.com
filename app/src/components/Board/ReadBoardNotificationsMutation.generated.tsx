import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const ReadBoardNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReadBoardNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setNotificationsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}},{"kind":"Argument","name":{"kind":"Name","value":"read"},"value":{"kind":"BooleanValue","value":true}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ReadBoardNotifications","document":ReadBoardNotificationsDocument}} as const;
export type ReadBoardNotificationsMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
}>;


export type ReadBoardNotificationsMutation = (
  { __typename: 'Mutation' }
  & { setNotificationsRead?: Types.Maybe<(
    { __typename: 'Notifications_ReadResponse' }
    & Pick<Types.Notifications_ReadResponse, 'success'>
  )> }
);

export type ReadBoardNotificationsMutationFn = Apollo.MutationFunction<
  ReadBoardNotificationsMutation,
  ReadBoardNotificationsMutationVariables
>;

/**
 * __useReadBoardNotificationsMutation__
 *
 * To run a mutation, you first call `useReadBoardNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadBoardNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readBoardNotificationsMutation, { data, loading, error }] = useReadBoardNotificationsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useReadBoardNotificationsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReadBoardNotificationsMutation,
    ReadBoardNotificationsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ReadBoardNotificationsMutation,
    ReadBoardNotificationsMutationVariables
  >(ReadBoardNotificationsDocument, options);
}
export type ReadBoardNotificationsMutationHookResult = ReturnType<
  typeof useReadBoardNotificationsMutation
>;
export type ReadBoardNotificationsMutationResult =
  Apollo.MutationResult<ReadBoardNotificationsMutation>;
export type ReadBoardNotificationsMutationOptions = Apollo.BaseMutationOptions<
  ReadBoardNotificationsMutation,
  ReadBoardNotificationsMutationVariables
>;
