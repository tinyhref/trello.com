import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const RefetchWorkspaceGuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RefetchWorkspaceGuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"RefetchWorkspaceGuests","document":RefetchWorkspaceGuestsDocument}} as const;
export type RefetchWorkspaceGuestsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type RefetchWorkspaceGuestsQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'offering'>
    & { collaborators: Array<(
      { __typename: 'Collaborator' }
      & Pick<Types.Collaborator, 'id' | 'activityBlocked' | 'fullName'>
      & { nonPublic?: Types.Maybe<(
        { __typename: 'Member_NonPublic' }
        & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
      )> }
    )> }
  )> }
);

/**
 * __useRefetchWorkspaceGuestsQuery__
 *
 * To run a query within a React component, call `useRefetchWorkspaceGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefetchWorkspaceGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefetchWorkspaceGuestsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useRefetchWorkspaceGuestsQuery(
  baseOptions: TrelloQueryHookOptions<
    RefetchWorkspaceGuestsQuery,
    RefetchWorkspaceGuestsQueryVariables
  > &
    (
      | { variables: RefetchWorkspaceGuestsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: RefetchWorkspaceGuestsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    RefetchWorkspaceGuestsQuery,
    RefetchWorkspaceGuestsQueryVariables
  >(RefetchWorkspaceGuestsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useRefetchWorkspaceGuestsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    RefetchWorkspaceGuestsQuery,
    RefetchWorkspaceGuestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    RefetchWorkspaceGuestsQuery,
    RefetchWorkspaceGuestsQueryVariables
  >(RefetchWorkspaceGuestsDocument, options);
}
export function useRefetchWorkspaceGuestsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        RefetchWorkspaceGuestsQuery,
        RefetchWorkspaceGuestsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    RefetchWorkspaceGuestsQuery,
    RefetchWorkspaceGuestsQueryVariables
  >(RefetchWorkspaceGuestsDocument, options);
}
export type RefetchWorkspaceGuestsQueryHookResult = ReturnType<
  typeof useRefetchWorkspaceGuestsQuery
>;
export type RefetchWorkspaceGuestsLazyQueryHookResult = ReturnType<
  typeof useRefetchWorkspaceGuestsLazyQuery
>;
export type RefetchWorkspaceGuestsSuspenseQueryHookResult = ReturnType<
  typeof useRefetchWorkspaceGuestsSuspenseQuery
>;
export type RefetchWorkspaceGuestsQueryResult = Apollo.QueryResult<
  RefetchWorkspaceGuestsQuery,
  RefetchWorkspaceGuestsQueryVariables
>;
