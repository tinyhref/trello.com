import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardVisibilityMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardVisibilityMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardVisibilityMember","document":BoardVisibilityMemberDocument}} as const;
export type BoardVisibilityMemberQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']['input'];
}>;


export type BoardVisibilityMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<
      Types.Member,
      | 'id'
      | 'idEnterprisesAdmin'
      | 'idPremOrgsAdmin'
      | 'memberType'
    >
  )> }
);

/**
 * __useBoardVisibilityMemberQuery__
 *
 * To run a query within a React component, call `useBoardVisibilityMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardVisibilityMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardVisibilityMemberQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardVisibilityMemberQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardVisibilityMemberQuery,
    BoardVisibilityMemberQueryVariables
  > &
    (
      | { variables: BoardVisibilityMemberQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardVisibilityMemberDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardVisibilityMemberQuery,
    BoardVisibilityMemberQueryVariables
  >(BoardVisibilityMemberDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardVisibilityMemberLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardVisibilityMemberQuery,
    BoardVisibilityMemberQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardVisibilityMemberQuery,
    BoardVisibilityMemberQueryVariables
  >(BoardVisibilityMemberDocument, options);
}
export function useBoardVisibilityMemberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardVisibilityMemberQuery,
        BoardVisibilityMemberQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardVisibilityMemberQuery,
    BoardVisibilityMemberQueryVariables
  >(BoardVisibilityMemberDocument, options);
}
export type BoardVisibilityMemberQueryHookResult = ReturnType<
  typeof useBoardVisibilityMemberQuery
>;
export type BoardVisibilityMemberLazyQueryHookResult = ReturnType<
  typeof useBoardVisibilityMemberLazyQuery
>;
export type BoardVisibilityMemberSuspenseQueryHookResult = ReturnType<
  typeof useBoardVisibilityMemberSuspenseQuery
>;
export type BoardVisibilityMemberQueryResult = Apollo.QueryResult<
  BoardVisibilityMemberQuery,
  BoardVisibilityMemberQueryVariables
>;
