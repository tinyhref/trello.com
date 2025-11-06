import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardMarketingAnalyticDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardMarketingAnalyticData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idAttachment"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"idUploadedBackground"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"showCompactMirrorCards"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}},{"kind":"Field","name":{"kind":"Name","value":"keyboardShortcutsEnabled"}}]}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardMarketingAnalyticData","document":BoardMarketingAnalyticDataDocument}} as const;
export type BoardMarketingAnalyticDataQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID']['input'];
  memberId: Types.Scalars['ID']['input'];
}>;


export type BoardMarketingAnalyticDataQuery = (
  { __typename: 'Query' }
  & {
    board?: Types.Maybe<(
      { __typename: 'Board' }
      & Pick<
        Types.Board,
        | 'id'
        | 'idMemberCreator'
        | 'idOrganization'
        | 'premiumFeatures'
      >
      & {
        boardPlugins: Array<(
          { __typename: 'BoardPlugin' }
          & Pick<Types.BoardPlugin, 'id' | 'idPlugin'>
        )>,
        cards: Array<(
          { __typename: 'Card' }
          & Pick<
            Types.Card,
            | 'id'
            | 'cardRole'
            | 'dueComplete'
            | 'idList'
          >
          & {
            cover?: Types.Maybe<(
              { __typename: 'Card_Cover' }
              & Pick<
                Types.Card_Cover,
                | 'color'
                | 'idAttachment'
                | 'idPlugin'
                | 'idUploadedBackground'
              >
            )>,
            labels: Array<(
              { __typename: 'Label' }
              & Pick<Types.Label, 'id'>
            )>,
            stickers: Array<(
              { __typename: 'Sticker' }
              & Pick<Types.Sticker, 'id'>
            )>,
          }
        )>,
        lists: Array<(
          { __typename: 'List' }
          & Pick<Types.List, 'id' | 'color'>
        )>,
        myPrefs: (
          { __typename: 'MyPrefs' }
          & Pick<Types.MyPrefs, 'showCompactMirrorCards'>
        ),
        prefs?: Types.Maybe<(
          { __typename: 'Board_Prefs' }
          & Pick<
            Types.Board_Prefs,
            | 'background'
            | 'backgroundImage'
            | 'cardCovers'
            | 'isTemplate'
            | 'permissionLevel'
          >
        )>,
      }
    )>,
    member?: Types.Maybe<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id'>
      & { prefs?: Types.Maybe<(
        { __typename: 'Member_Prefs' }
        & Pick<Types.Member_Prefs, 'colorBlind' | 'keyboardShortcutsEnabled'>
      )> }
    )>,
  }
);

/**
 * __useBoardMarketingAnalyticDataQuery__
 *
 * To run a query within a React component, call `useBoardMarketingAnalyticDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardMarketingAnalyticDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardMarketingAnalyticDataQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardMarketingAnalyticDataQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardMarketingAnalyticDataQuery,
    BoardMarketingAnalyticDataQueryVariables
  > &
    (
      | { variables: BoardMarketingAnalyticDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardMarketingAnalyticDataDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardMarketingAnalyticDataQuery,
    BoardMarketingAnalyticDataQueryVariables
  >(BoardMarketingAnalyticDataDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardMarketingAnalyticDataLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardMarketingAnalyticDataQuery,
    BoardMarketingAnalyticDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardMarketingAnalyticDataQuery,
    BoardMarketingAnalyticDataQueryVariables
  >(BoardMarketingAnalyticDataDocument, options);
}
export function useBoardMarketingAnalyticDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardMarketingAnalyticDataQuery,
        BoardMarketingAnalyticDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardMarketingAnalyticDataQuery,
    BoardMarketingAnalyticDataQueryVariables
  >(BoardMarketingAnalyticDataDocument, options);
}
export type BoardMarketingAnalyticDataQueryHookResult = ReturnType<
  typeof useBoardMarketingAnalyticDataQuery
>;
export type BoardMarketingAnalyticDataLazyQueryHookResult = ReturnType<
  typeof useBoardMarketingAnalyticDataLazyQuery
>;
export type BoardMarketingAnalyticDataSuspenseQueryHookResult = ReturnType<
  typeof useBoardMarketingAnalyticDataSuspenseQuery
>;
export type BoardMarketingAnalyticDataQueryResult = Apollo.QueryResult<
  BoardMarketingAnalyticDataQuery,
  BoardMarketingAnalyticDataQueryVariables
>;
