import * as Types from '@trello/graphql/generated';

import type { tag } from '@trello/utility-types';
import { useQuickLoad } from '@trello/quickload';
import type { TrelloQueryHookOptions, TrelloLazyQueryHookOptions, TrelloSuspenseQueryHookOptions } from '@trello/quickload';
import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export type __OpaqueBrandRef = typeof tag;
export const SingleBoardDataWithoutChecklistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SingleBoardDataWithoutChecklists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"boardPlugins"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idAttachment"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"idUploadedBackground"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idCustomField"}},{"kind":"Field","name":{"kind":"Name","value":"idValue"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checked"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"idShort"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mirrorSourceId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"all"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"open"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"nonPublic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deactivated"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}},{"kind":"Field","name":{"kind":"Name","value":"orgMemberType"}},{"kind":"Field","name":{"kind":"Name","value":"unconfirmed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"myPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"selfJoin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"SingleBoardDataWithoutChecklists","document":SingleBoardDataWithoutChecklistsDocument}} as const;
export type SingleBoardDataWithoutChecklistsQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID']['input'];
}>;


export type SingleBoardDataWithoutChecklistsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<
      Types.Board,
      | 'id'
      | 'closed'
      | 'idEnterprise'
      | 'idOrganization'
      | 'name'
      | 'shortLink'
      | 'url'
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
          | 'closed'
          | 'dateLastActivity'
          | 'due'
          | 'dueComplete'
          | 'dueReminder'
          | 'idBoard'
          | 'idList'
          | 'idMembers'
          | 'idShort'
          | 'isTemplate'
          | 'mirrorSourceId'
          | 'name'
          | 'pos'
          | 'start'
          | 'url'
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
              | 'size'
            >
          )>,
          customFieldItems: Array<(
            { __typename: 'CustomFieldItem' }
            & Pick<Types.CustomFieldItem, 'id' | 'idCustomField' | 'idValue'>
            & { value?: Types.Maybe<(
              { __typename: 'CustomFieldItem_Value' }
              & Pick<
                Types.CustomFieldItem_Value,
                | 'checked'
                | 'date'
                | 'number'
                | 'text'
              >
            )> }
          )>,
          labels: Array<(
            { __typename: 'Label' }
            & Pick<
              Types.Label,
              | 'id'
              | 'color'
              | 'idBoard'
              | 'name'
            >
          )>,
        }
      )>,
      customFields: Array<(
        { __typename: 'CustomField' }
        & Pick<Types.CustomField, 'id' | 'name' | 'type'>
        & { options?: Types.Maybe<Array<(
          { __typename: 'CustomField_Option' }
          & Pick<Types.CustomField_Option, 'id' | 'color'>
          & { value: (
            { __typename: 'CustomField_Option_Value' }
            & Pick<Types.CustomField_Option_Value, 'text'>
          ) }
        )>> }
      )>,
      labels: Array<(
        { __typename: 'Label' }
        & Pick<Types.Label, 'id' | 'color' | 'name'>
      )>,
      lists: Array<(
        { __typename: 'List' }
        & Pick<
          Types.List,
          | 'id'
          | 'closed'
          | 'name'
          | 'pos'
          | 'type'
        >
      )>,
      members: Array<(
        { __typename: 'Member' }
        & Pick<
          Types.Member,
          | 'id'
          | 'activityBlocked'
          | 'avatarUrl'
          | 'fullName'
          | 'initials'
          | 'username'
        >
        & { nonPublic?: Types.Maybe<(
          { __typename: 'Member_NonPublic' }
          & Pick<Types.Member_NonPublic, 'avatarUrl' | 'fullName' | 'initials'>
        )> }
      )>,
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
      myPrefs: (
        { __typename: 'MyPrefs' }
        & Pick<Types.MyPrefs, 'calendarKey'>
      ),
      prefs?: Types.Maybe<(
        { __typename: 'Board_Prefs' }
        & Pick<
          Types.Board_Prefs,
          | 'background'
          | 'backgroundColor'
          | 'backgroundImage'
          | 'backgroundTile'
          | 'calendarFeedEnabled'
          | 'isTemplate'
          | 'selfJoin'
        >
        & { backgroundImageScaled?: Types.Maybe<Array<(
          { __typename: 'Board_Prefs_BackgroundImageScaled' }
          & Pick<Types.Board_Prefs_BackgroundImageScaled, 'height' | 'url' | 'width'>
        )>> }
      )>,
    }
  )> }
);

/**
 * __useSingleBoardDataWithoutChecklistsQuery__
 *
 * To run a query within a React component, call `useSingleBoardDataWithoutChecklistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSingleBoardDataWithoutChecklistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSingleBoardDataWithoutChecklistsQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *   },
 * });
 */
export function useSingleBoardDataWithoutChecklistsQuery(
  baseOptions: TrelloQueryHookOptions<
    SingleBoardDataWithoutChecklistsQuery,
    SingleBoardDataWithoutChecklistsQueryVariables
  > &
    (
      | {
          variables: SingleBoardDataWithoutChecklistsQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const isQuickLoading = useQuickLoad({
    waitOn: baseOptions?.waitOn || ['None'],
    document: SingleBoardDataWithoutChecklistsDocument,
    skip: baseOptions?.skip,
  });
  const options = {
    ...defaultOptions,
    ...baseOptions,
    skip: isQuickLoading || baseOptions?.skip,
  };
  const result = Apollo.useQuery<
    SingleBoardDataWithoutChecklistsQuery,
    SingleBoardDataWithoutChecklistsQueryVariables
  >(SingleBoardDataWithoutChecklistsDocument, options);
  // reconstruct result because modifying the useQuery result actually changes apollo behavior because of memoization
  const trelloResult = { ...result };
  if (isQuickLoading) {
    trelloResult.loading = true;
  }

  return trelloResult;
}
export function useSingleBoardDataWithoutChecklistsLazyQuery(
  baseOptions?: TrelloLazyQueryHookOptions<
    SingleBoardDataWithoutChecklistsQuery,
    SingleBoardDataWithoutChecklistsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SingleBoardDataWithoutChecklistsQuery,
    SingleBoardDataWithoutChecklistsQueryVariables
  >(SingleBoardDataWithoutChecklistsDocument, options);
}
export function useSingleBoardDataWithoutChecklistsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | TrelloSuspenseQueryHookOptions<
        SingleBoardDataWithoutChecklistsQuery,
        SingleBoardDataWithoutChecklistsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SingleBoardDataWithoutChecklistsQuery,
    SingleBoardDataWithoutChecklistsQueryVariables
  >(SingleBoardDataWithoutChecklistsDocument, options);
}
export type SingleBoardDataWithoutChecklistsQueryHookResult = ReturnType<
  typeof useSingleBoardDataWithoutChecklistsQuery
>;
export type SingleBoardDataWithoutChecklistsLazyQueryHookResult = ReturnType<
  typeof useSingleBoardDataWithoutChecklistsLazyQuery
>;
export type SingleBoardDataWithoutChecklistsSuspenseQueryHookResult =
  ReturnType<typeof useSingleBoardDataWithoutChecklistsSuspenseQuery>;
export type SingleBoardDataWithoutChecklistsQueryResult = Apollo.QueryResult<
  SingleBoardDataWithoutChecklistsQuery,
  SingleBoardDataWithoutChecklistsQueryVariables
>;
