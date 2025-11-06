import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PermissionsBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PermissionsBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PermissionsBoard","document":PermissionsBoardDocument}} as const;
export type PermissionsBoardQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  memberId: Types.Scalars['ID']['input'];
}>;


export type PermissionsBoardQuery = (
  { __typename: 'Query' }
  & {
    board?: Types.Maybe<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id'>
      & { organization?: Types.Maybe<(
        { __typename: 'Organization' }
        & Pick<Types.Organization, 'id' | 'offering'>
        & {
          enterprise?: Types.Maybe<(
            { __typename: 'Enterprise' }
            & Pick<Types.Enterprise, 'id' | 'idAdmins'>
          )>,
          memberships: Array<(
            { __typename: 'Organization_Membership' }
            & Pick<
              Types.Organization_Membership,
              | 'id'
              | 'deactivated'
              | 'idMember'
              | 'memberType'
              | 'unconfirmed'
            >
          )>,
        }
      )> }
    )>,
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<
        Types.Member,
        | 'id'
        | 'idEnterprisesAdmin'
        | 'idPremOrgsAdmin'
        | 'memberType'
      >
    )>,
  }
);

/**
 * __usePermissionsBoardQuery__
 *
 * To run a query within a React component, call `usePermissionsBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsBoardQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function usePermissionsBoardQuery(
  baseOptions: TrelloQueryHookOptions<
    PermissionsBoardQuery,
    PermissionsBoardQueryVariables
  > &
    (
      | { variables: PermissionsBoardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PermissionsBoardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PermissionsBoardQuery,
    PermissionsBoardQueryVariables
  >(PermissionsBoardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePermissionsBoardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PermissionsBoardQuery,
    PermissionsBoardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PermissionsBoardQuery,
    PermissionsBoardQueryVariables
  >(PermissionsBoardDocument, options);
}
export function usePermissionsBoardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PermissionsBoardQuery,
        PermissionsBoardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PermissionsBoardQuery,
    PermissionsBoardQueryVariables
  >(PermissionsBoardDocument, options);
}
export type PermissionsBoardQueryHookResult = ReturnType<
  typeof usePermissionsBoardQuery
>;
export type PermissionsBoardLazyQueryHookResult = ReturnType<
  typeof usePermissionsBoardLazyQuery
>;
export type PermissionsBoardSuspenseQueryHookResult = ReturnType<
  typeof usePermissionsBoardSuspenseQuery
>;
export type PermissionsBoardQueryResult = Apollo.QueryResult<
  PermissionsBoardQuery,
  PermissionsBoardQueryVariables
>;
