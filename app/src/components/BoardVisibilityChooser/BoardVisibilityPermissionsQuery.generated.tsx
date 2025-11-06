import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardVisibilityPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardVisibilityPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardVisibilityPermissions","document":BoardVisibilityPermissionsDocument}} as const;
export type BoardVisibilityPermissionsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
}>;


export type BoardVisibilityPermissionsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<
      Types.Board,
      | 'id'
      | 'enterpriseOwned'
      | 'idEnterprise'
      | 'idOrganization'
    >
    & {
      memberships: Array<(
        { __typename: 'Board_Membership' }
        & Pick<
          Types.Board_Membership,
          | 'id'
          | 'deactivated'
          | 'idMember'
          | 'memberType'
          | 'orgMemberType'
          | 'unconfirmed'
        >
      )>,
      organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'idEnterprise' | 'offering'>
        & { memberships: Array<(
          { __typename: 'Organization_Membership' }
          & Pick<
            Types.Organization_Membership,
            | 'id'
            | 'deactivated'
            | 'idMember'
            | 'memberType'
            | 'unconfirmed'
          >
        )> }
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<Types.Board_Prefs, 'isTemplate' | 'permissionLevel'>
      )>,
    }
  )> }
);

/**
 * __useBoardVisibilityPermissionsQuery__
 *
 * To run a query within a React component, call `useBoardVisibilityPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardVisibilityPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardVisibilityPermissionsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardVisibilityPermissionsQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardVisibilityPermissionsQuery,
    BoardVisibilityPermissionsQueryVariables
  > &
    (
      | { variables: BoardVisibilityPermissionsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardVisibilityPermissionsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardVisibilityPermissionsQuery,
    BoardVisibilityPermissionsQueryVariables
  >(BoardVisibilityPermissionsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardVisibilityPermissionsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardVisibilityPermissionsQuery,
    BoardVisibilityPermissionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardVisibilityPermissionsQuery,
    BoardVisibilityPermissionsQueryVariables
  >(BoardVisibilityPermissionsDocument, options);
}
export function useBoardVisibilityPermissionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardVisibilityPermissionsQuery,
        BoardVisibilityPermissionsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardVisibilityPermissionsQuery,
    BoardVisibilityPermissionsQueryVariables
  >(BoardVisibilityPermissionsDocument, options);
}
export type BoardVisibilityPermissionsQueryHookResult = ReturnType<
  typeof useBoardVisibilityPermissionsQuery
>;
export type BoardVisibilityPermissionsLazyQueryHookResult = ReturnType<
  typeof useBoardVisibilityPermissionsLazyQuery
>;
export type BoardVisibilityPermissionsSuspenseQueryHookResult = ReturnType<
  typeof useBoardVisibilityPermissionsSuspenseQuery
>;
export type BoardVisibilityPermissionsQueryResult = Apollo.QueryResult<
  BoardVisibilityPermissionsQuery,
  BoardVisibilityPermissionsQueryVariables
>;
