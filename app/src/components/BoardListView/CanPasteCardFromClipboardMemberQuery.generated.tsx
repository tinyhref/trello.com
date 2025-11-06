import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CanPasteCardFromClipboardMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanPasteCardFromClipboardMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idMember"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprisesAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganizations"}},{"kind":"Field","name":{"kind":"Name","value":"idPremOrgsAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CanPasteCardFromClipboardMember","document":CanPasteCardFromClipboardMemberDocument}} as const;
export type CanPasteCardFromClipboardMemberQueryVariables = Types.Exact<{
  idMember: Types.Scalars['ID']['input'];
}>;


export type CanPasteCardFromClipboardMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<
      Types.Member,
      | 'id'
      | 'idEnterprisesAdmin'
      | 'idOrganizations'
      | 'idPremOrgsAdmin'
      | 'memberType'
    >
    & { organizations: Array<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'id' | 'idEnterprise'>
    )> }
  )> }
);

/**
 * __useCanPasteCardFromClipboardMemberQuery__
 *
 * To run a query within a React component, call `useCanPasteCardFromClipboardMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanPasteCardFromClipboardMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanPasteCardFromClipboardMemberQuery({
 *   variables: {
 *      idMember: // value for 'idMember'
 *   },
 * });
 */
export function useCanPasteCardFromClipboardMemberQuery(
  baseOptions: TrelloQueryHookOptions<
    CanPasteCardFromClipboardMemberQuery,
    CanPasteCardFromClipboardMemberQueryVariables
  > &
    (
      | {
          variables: CanPasteCardFromClipboardMemberQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CanPasteCardFromClipboardMemberDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CanPasteCardFromClipboardMemberQuery,
    CanPasteCardFromClipboardMemberQueryVariables
  >(CanPasteCardFromClipboardMemberDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCanPasteCardFromClipboardMemberLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CanPasteCardFromClipboardMemberQuery,
    CanPasteCardFromClipboardMemberQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CanPasteCardFromClipboardMemberQuery,
    CanPasteCardFromClipboardMemberQueryVariables
  >(CanPasteCardFromClipboardMemberDocument, options);
}
export function useCanPasteCardFromClipboardMemberSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CanPasteCardFromClipboardMemberQuery,
        CanPasteCardFromClipboardMemberQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CanPasteCardFromClipboardMemberQuery,
    CanPasteCardFromClipboardMemberQueryVariables
  >(CanPasteCardFromClipboardMemberDocument, options);
}
export type CanPasteCardFromClipboardMemberQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardMemberQuery
>;
export type CanPasteCardFromClipboardMemberLazyQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardMemberLazyQuery
>;
export type CanPasteCardFromClipboardMemberSuspenseQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardMemberSuspenseQuery
>;
export type CanPasteCardFromClipboardMemberQueryResult = Apollo.QueryResult<
  CanPasteCardFromClipboardMemberQuery,
  CanPasteCardFromClipboardMemberQueryVariables
>;
