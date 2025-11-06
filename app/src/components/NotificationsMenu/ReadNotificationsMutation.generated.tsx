import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const ReadNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReadNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"read"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setNotificationsRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}},{"kind":"Argument","name":{"kind":"Name","value":"read"},"value":{"kind":"Variable","name":{"kind":"Name","value":"read"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"ReadNotifications","document":ReadNotificationsDocument}} as const;
export type ReadNotificationsMutationVariables = Types.Exact<{
  ids: Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input'];
  read: Types.Scalars['Boolean']['input'];
}>;


export type ReadNotificationsMutation = (
  { __typename: 'Mutation' }
  & { setNotificationsRead?: Types.Maybe<(
    { __typename: 'Notifications_ReadResponse' }
    & Pick<Types.Notifications_ReadResponse, 'success'>
  )> }
);

export type ReadNotificationsMutationFn = Apollo.MutationFunction<
  ReadNotificationsMutation,
  ReadNotificationsMutationVariables
>;

/**
 * __useReadNotificationsMutation__
 *
 * To run a mutation, you first call `useReadNotificationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadNotificationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readNotificationsMutation, { data, loading, error }] = useReadNotificationsMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *      read: // value for 'read'
 *   },
 * });
 */
export function useReadNotificationsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReadNotificationsMutation,
    ReadNotificationsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ReadNotificationsMutation,
    ReadNotificationsMutationVariables
  >(ReadNotificationsDocument, options);
}
export type ReadNotificationsMutationHookResult = ReturnType<
  typeof useReadNotificationsMutation
>;
export type ReadNotificationsMutationResult =
  Apollo.MutationResult<ReadNotificationsMutation>;
export type ReadNotificationsMutationOptions = Apollo.BaseMutationOptions<
  ReadNotificationsMutation,
  ReadNotificationsMutationVariables
>;
