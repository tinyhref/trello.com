import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const LabelsPopoverBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LabelsPopoverBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBoard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"LabelsPopoverBoard","document":LabelsPopoverBoardDocument}} as const;
export type LabelsPopoverBoardQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type LabelsPopoverBoardQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'name'>
    & {
      labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id' | 'color' | 'name'>
      )>,
      limits: (
        { __typename: 'Board_Limits' }
        & { labels: (
          { __typename: 'Board_Limits_Labels' }
          & { perBoard: (
            { __typename: 'Limit' }
            & Pick<Types.Limit, 'disableAt' | 'status'>
          ) }
        ) }
      ),
    }
  )> }
);

/**
 * __useLabelsPopoverBoardQuery__
 *
 * To run a query within a React component, call `useLabelsPopoverBoardQuery` and pass it any options that fit your needs.
 * When your component renders, `useLabelsPopoverBoardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLabelsPopoverBoardQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useLabelsPopoverBoardQuery(
  baseOptions: TrelloQueryHookOptions<
    LabelsPopoverBoardQuery,
    LabelsPopoverBoardQueryVariables
  > &
    (
      | { variables: LabelsPopoverBoardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: LabelsPopoverBoardDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    LabelsPopoverBoardQuery,
    LabelsPopoverBoardQueryVariables
  >(LabelsPopoverBoardDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useLabelsPopoverBoardLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    LabelsPopoverBoardQuery,
    LabelsPopoverBoardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LabelsPopoverBoardQuery,
    LabelsPopoverBoardQueryVariables
  >(LabelsPopoverBoardDocument, options);
}
export function useLabelsPopoverBoardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        LabelsPopoverBoardQuery,
        LabelsPopoverBoardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    LabelsPopoverBoardQuery,
    LabelsPopoverBoardQueryVariables
  >(LabelsPopoverBoardDocument, options);
}
export type LabelsPopoverBoardQueryHookResult = ReturnType<
  typeof useLabelsPopoverBoardQuery
>;
export type LabelsPopoverBoardLazyQueryHookResult = ReturnType<
  typeof useLabelsPopoverBoardLazyQuery
>;
export type LabelsPopoverBoardSuspenseQueryHookResult = ReturnType<
  typeof useLabelsPopoverBoardSuspenseQuery
>;
export type LabelsPopoverBoardQueryResult = Apollo.QueryResult<
  LabelsPopoverBoardQuery,
  LabelsPopoverBoardQueryVariables
>;
