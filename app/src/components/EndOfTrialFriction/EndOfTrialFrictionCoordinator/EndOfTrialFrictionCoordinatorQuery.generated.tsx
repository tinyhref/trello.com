import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const EndOfTrialFrictionCoordinatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EndOfTrialFrictionCoordinator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"dateClosed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"freeBoardsPerOrg"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"EndOfTrialFrictionCoordinator","document":EndOfTrialFrictionCoordinatorDocument}} as const;
export type EndOfTrialFrictionCoordinatorQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['ID']['input'];
}>;


export type EndOfTrialFrictionCoordinatorQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'displayName'>
    & {
      boards: Array<(
        { __typename: 'Board' }
        & Pick<
          Types.Board,
          | 'id'
          | 'closed'
          | 'dateClosed'
          | 'name'
        >
        & { prefs?: Types.Maybe<(
          { __typename: 'Board_Prefs' }
          & Pick<Types.Board_Prefs, 'backgroundColor'>
          & { backgroundImageScaled?: Types.Maybe<Array<(
            { __typename: 'Board_Prefs_BackgroundImageScaled' }
            & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
          )>> }
        )> }
      )>,
      limits: (
        { __typename: 'Organization_Limits' }
        & { orgs: (
          { __typename: 'Organization_Limits_Orgs' }
          & { freeBoardsPerOrg: (
            { __typename: 'Limit' }
            & Pick<
              Types.Limit,
              | 'count'
              | 'disableAt'
              | 'status'
              | 'warnAt'
            >
          ) }
        ) }
      ),
    }
  )> }
);

/**
 * __useEndOfTrialFrictionCoordinatorQuery__
 *
 * To run a query within a React component, call `useEndOfTrialFrictionCoordinatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useEndOfTrialFrictionCoordinatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEndOfTrialFrictionCoordinatorQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useEndOfTrialFrictionCoordinatorQuery(
  baseOptions: TrelloQueryHookOptions<
    EndOfTrialFrictionCoordinatorQuery,
    EndOfTrialFrictionCoordinatorQueryVariables
  > &
    (
      | {
          variables: EndOfTrialFrictionCoordinatorQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: EndOfTrialFrictionCoordinatorDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    EndOfTrialFrictionCoordinatorQuery,
    EndOfTrialFrictionCoordinatorQueryVariables
  >(EndOfTrialFrictionCoordinatorDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useEndOfTrialFrictionCoordinatorLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    EndOfTrialFrictionCoordinatorQuery,
    EndOfTrialFrictionCoordinatorQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    EndOfTrialFrictionCoordinatorQuery,
    EndOfTrialFrictionCoordinatorQueryVariables
  >(EndOfTrialFrictionCoordinatorDocument, options);
}
export function useEndOfTrialFrictionCoordinatorSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        EndOfTrialFrictionCoordinatorQuery,
        EndOfTrialFrictionCoordinatorQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    EndOfTrialFrictionCoordinatorQuery,
    EndOfTrialFrictionCoordinatorQueryVariables
  >(EndOfTrialFrictionCoordinatorDocument, options);
}
export type EndOfTrialFrictionCoordinatorQueryHookResult = ReturnType<
  typeof useEndOfTrialFrictionCoordinatorQuery
>;
export type EndOfTrialFrictionCoordinatorLazyQueryHookResult = ReturnType<
  typeof useEndOfTrialFrictionCoordinatorLazyQuery
>;
export type EndOfTrialFrictionCoordinatorSuspenseQueryHookResult = ReturnType<
  typeof useEndOfTrialFrictionCoordinatorSuspenseQuery
>;
export type EndOfTrialFrictionCoordinatorQueryResult = Apollo.QueryResult<
  EndOfTrialFrictionCoordinatorQuery,
  EndOfTrialFrictionCoordinatorQueryVariables
>;
