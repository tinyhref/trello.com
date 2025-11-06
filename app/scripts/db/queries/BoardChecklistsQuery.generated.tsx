import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const BoardChecklistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardChecklists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}},{"kind":"Field","name":{"kind":"Name","value":"idChecklist"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nameData"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idCard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"datePluginDisable"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"descData"}},{"kind":"Field","name":{"kind":"Name","value":"enterpriseOwned"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idTags"}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBottomColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundBrightness"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTopColor"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"canInvite"}},{"kind":"Field","name":{"kind":"Name","value":"cardAging"}},{"kind":"Field","name":{"kind":"Name","value":"cardCovers"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"hideVotes"}},{"kind":"Field","name":{"kind":"Name","value":"invitations"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"permissionLevel"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}},{"kind":"Field","name":{"kind":"Name","value":"switcherViews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"viewType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"BoardChecklists","document":BoardChecklistsDocument}} as const;
export type BoardChecklistsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  traceId: Types.Scalars['String']['input'];
}>;


export type BoardChecklistsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<
      Types.Board,
      | 'id'
      | 'closed'
      | 'creationMethod'
      | 'dateLastActivity'
      | 'dateLastView'
      | 'datePluginDisable'
      | 'desc'
      | 'descData'
      | 'enterpriseOwned'
      | 'idEnterprise'
      | 'idMemberCreator'
      | 'idOrganization'
      | 'idTags'
      | 'name'
      | 'premiumFeatures'
      | 'shortLink'
      | 'shortUrl'
      | 'url'
    >
    & {
      cards: Array<(
        { __typename: 'Card' }
        & Pick<Types.Card, 'id'>
        & { checklists: Array<(
          { __typename: 'Checklist' }
          & Pick<
            Types.Checklist,
            | 'id'
            | 'idBoard'
            | 'idCard'
            | 'name'
            | 'pos'
          >
          & { checkItems: Array<(
            { __typename: 'CheckItem' }
            & Pick<
              Types.CheckItem,
              | 'id'
              | 'due'
              | 'dueReminder'
              | 'idChecklist'
              | 'idMember'
              | 'name'
              | 'nameData'
              | 'pos'
              | 'state'
            >
          )> }
        )> }
      )>,
      lists: Array<(
        { __typename: 'List' }
        & Pick<Types.List, 'id' | 'name' | 'pos'>
      )>,
      prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<
          Types.Board_Prefs,
          | 'background'
          | 'backgroundBottomColor'
          | 'backgroundBrightness'
          | 'backgroundColor'
          | 'backgroundImage'
          | 'backgroundTile'
          | 'backgroundTopColor'
          | 'calendarFeedEnabled'
          | 'canInvite'
          | 'cardAging'
          | 'cardCovers'
          | 'comments'
          | 'hideVotes'
          | 'invitations'
          | 'isTemplate'
          | 'permissionLevel'
          | 'selfJoin'
          | 'voting'
        >
        & {
          backgroundImageScaled?: Types.Maybe<Array<(
            { __typename: 'Board_Prefs_BackgroundImageScaled' }
            & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
          )>>,
          switcherViews: Array<(
            { __typename: 'Board_Prefs_SwitcherView' }
            & Pick<Types.Board_Prefs_SwitcherView, 'enabled' | 'viewType'>
          )>,
        }
      )>,
    }
  )> }
);

/**
 * __useBoardChecklistsQuery__
 *
 * To run a query within a React component, call `useBoardChecklistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardChecklistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardChecklistsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useBoardChecklistsQuery(
  baseOptions: TrelloQueryHookOptions<
    BoardChecklistsQuery,
    BoardChecklistsQueryVariables
  > &
    (
      | { variables: BoardChecklistsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: BoardChecklistsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    BoardChecklistsQuery,
    BoardChecklistsQueryVariables
  >(BoardChecklistsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useBoardChecklistsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    BoardChecklistsQuery,
    BoardChecklistsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    BoardChecklistsQuery,
    BoardChecklistsQueryVariables
  >(BoardChecklistsDocument, options);
}
export function useBoardChecklistsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        BoardChecklistsQuery,
        BoardChecklistsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    BoardChecklistsQuery,
    BoardChecklistsQueryVariables
  >(BoardChecklistsDocument, options);
}
export type BoardChecklistsQueryHookResult = ReturnType<
  typeof useBoardChecklistsQuery
>;
export type BoardChecklistsLazyQueryHookResult = ReturnType<
  typeof useBoardChecklistsLazyQuery
>;
export type BoardChecklistsSuspenseQueryHookResult = ReturnType<
  typeof useBoardChecklistsSuspenseQuery
>;
export type BoardChecklistsQueryResult = Apollo.QueryResult<
  BoardChecklistsQuery,
  BoardChecklistsQueryVariables
>;
