import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const CanPasteCardFromClipboardBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanPasteCardFromClipboardBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enterprise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idAdmins"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"offering"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"CanPasteCardFromClipboardBoard","document":CanPasteCardFromClipboardBoardDocument}} as const;
export type CanPasteCardFromClipboardBoardQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type CanPasteCardFromClipboardBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<
      Types.Board,
      | 'id'
      | 'enterpriseOwned'
      | 'idEnterprise'
      | 'idOrganization'
      | 'name'
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
    }
  )> }
);

/**
 * __useCanPasteCardFromClipboardBoardQuery__
 *
 * To run a query within a React component, call `useCanPasteCardFromClipboardBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useCanPasteCardFromClipboardBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCanPasteCardFromClipboardBoardQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useCanPasteCardFromClipboardBoardQuery(
  baseOptions: TrelloQueryHookOptions<
    CanPasteCardFromClipboardBoardQuery,
    CanPasteCardFromClipboardBoardQueryVariables
  > &
    (
      | {
          variables: CanPasteCardFromClipboardBoardQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: CanPasteCardFromClipboardBoardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    CanPasteCardFromClipboardBoardQuery,
    CanPasteCardFromClipboardBoardQueryVariables
  >(CanPasteCardFromClipboardBoardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useCanPasteCardFromClipboardBoardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    CanPasteCardFromClipboardBoardQuery,
    CanPasteCardFromClipboardBoardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    CanPasteCardFromClipboardBoardQuery,
    CanPasteCardFromClipboardBoardQueryVariables
  >(CanPasteCardFromClipboardBoardDocument, options);
}
export function useCanPasteCardFromClipboardBoardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        CanPasteCardFromClipboardBoardQuery,
        CanPasteCardFromClipboardBoardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    CanPasteCardFromClipboardBoardQuery,
    CanPasteCardFromClipboardBoardQueryVariables
  >(CanPasteCardFromClipboardBoardDocument, options);
}
export type CanPasteCardFromClipboardBoardQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardBoardQuery
>;
export type CanPasteCardFromClipboardBoardLazyQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardBoardLazyQuery
>;
export type CanPasteCardFromClipboardBoardSuspenseQueryHookResult = ReturnType<
  typeof useCanPasteCardFromClipboardBoardSuspenseQuery
>;
export type CanPasteCardFromClipboardBoardQueryResult = Apollo.QueryResult<
  CanPasteCardFromClipboardBoardQuery,
  CanPasteCardFromClipboardBoardQueryVariables
>;
