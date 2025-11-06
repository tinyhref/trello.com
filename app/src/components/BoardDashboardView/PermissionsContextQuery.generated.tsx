import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const PermissionsContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PermissionsContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PermissionsContext","document":PermissionsContextDocument}} as const;
export type PermissionsContextQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type PermissionsContextQuery = (
  { __typename: 'Query' }
  & {
    board?: Types.Maybe<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'closed'>
      & {
        memberships: Array<(
          { __typename: 'Board_Membership' }
          & Pick<
            Types.Board_Membership,
            | 'id'
            | 'deactivated'
            | 'idMember'
            | 'memberType'
            | 'unconfirmed'
          >
        )>,
        organization?: Types.Maybe<(
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
        )>,
        prefs?: Types.Maybe<(
          { __typename: 'Board_Prefs' }
          & Pick<Types.Board_Prefs, 'isTemplate' | 'selfJoin'>
        )>,
      }
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
 * __usePermissionsContextQuery__
 *
 * To run a query within a React component, call `usePermissionsContextQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsContextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsContextQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function usePermissionsContextQuery(
  baseOptions: TrelloQueryHookOptions<
    PermissionsContextQuery,
    PermissionsContextQueryVariables
  > &
    (
      | { variables: PermissionsContextQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: PermissionsContextDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    PermissionsContextQuery,
    PermissionsContextQueryVariables
  >(PermissionsContextDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function usePermissionsContextLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    PermissionsContextQuery,
    PermissionsContextQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PermissionsContextQuery,
    PermissionsContextQueryVariables
  >(PermissionsContextDocument, options);
}
export function usePermissionsContextSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        PermissionsContextQuery,
        PermissionsContextQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    PermissionsContextQuery,
    PermissionsContextQueryVariables
  >(PermissionsContextDocument, options);
}
export type PermissionsContextQueryHookResult = ReturnType<
  typeof usePermissionsContextQuery
>;
export type PermissionsContextLazyQueryHookResult = ReturnType<
  typeof usePermissionsContextLazyQuery
>;
export type PermissionsContextSuspenseQueryHookResult = ReturnType<
  typeof usePermissionsContextSuspenseQuery
>;
export type PermissionsContextQueryResult = Apollo.QueryResult<
  PermissionsContextQuery,
  PermissionsContextQueryVariables
>;
