import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/documentNode';
import * as Apollo from '@apollo/client';
export const PreloadCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreloadCard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"card"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"isMalicious"}},{"kind":"Field","name":{"kind":"Name","value":"isUpload"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"previews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentsByType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"}},{"kind":"Field","name":{"kind":"Name","value":"card"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkItems"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsChecked"}},{"kind":"Field","name":{"kind":"Name","value":"checkItemsEarliestDue"}},{"kind":"Field","name":{"kind":"Name","value":"comments"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"externalSource"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedByAi"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"maliciousAttachments"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"viewingMemberVoted"}},{"kind":"Field","name":{"kind":"Name","value":"votes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardRole"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"cover"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brightness"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"edgeColor"}},{"kind":"Field","name":{"kind":"Name","value":"idAttachment"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"idUploadedBackground"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sharedSourceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}},{"kind":"Field","name":{"kind":"Name","value":"creationMethod"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethodError"}},{"kind":"Field","name":{"kind":"Name","value":"creationMethodLoadingStartedAt"}},{"kind":"Field","name":{"kind":"Name","value":"customFieldItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idCustomField"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"idValue"}},{"kind":"Field","name":{"kind":"Name","value":"modelType"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checked"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dateClosed"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"descData"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"faviconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"idAttachmentCover"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"idChecklists"}},{"kind":"Field","name":{"kind":"Name","value":"idLabels"}},{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"idMemberCreator"}},{"kind":"Field","name":{"kind":"Name","value":"idMembers"}},{"kind":"Field","name":{"kind":"Name","value":"idMembersVoted"}},{"kind":"Field","name":{"kind":"Name","value":"idShort"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"limits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checklists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"disableAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"warnAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"manualCoverAttachment"}},{"kind":"Field","name":{"kind":"Name","value":"mirrorSourceId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"pluginData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"idModel"}},{"kind":"Field","name":{"kind":"Name","value":"idPlugin"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"recurrenceRule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rule"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"shortUrl"}},{"kind":"Field","name":{"kind":"Name","value":"singleInstrumentationId"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"stickers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"imageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bytes"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"scaled"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"left"}},{"kind":"Field","name":{"kind":"Name","value":"rotate"}},{"kind":"Field","name":{"kind":"Name","value":"top"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"urlSource"}},{"kind":"Field","name":{"kind":"Name","value":"urlSourceText"}}]}}]}}]} as unknown as DocumentNode;
const defaultOptions = {"context":{"operationName":"PreloadCard","document":PreloadCardDocument}} as const;
export type PreloadCardQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PreloadCardQuery = (
  { __typename: 'Query' }
  & { card?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<
      Types.Card,
      | 'id'
      | 'cardRole'
      | 'closed'
      | 'creationMethod'
      | 'creationMethodError'
      | 'creationMethodLoadingStartedAt'
      | 'dateClosed'
      | 'dateLastActivity'
      | 'desc'
      | 'descData'
      | 'due'
      | 'dueComplete'
      | 'dueReminder'
      | 'email'
      | 'faviconUrl'
      | 'idAttachmentCover'
      | 'idBoard'
      | 'idChecklists'
      | 'idLabels'
      | 'idList'
      | 'idMemberCreator'
      | 'idMembers'
      | 'idMembersVoted'
      | 'idShort'
      | 'isTemplate'
      | 'manualCoverAttachment'
      | 'mirrorSourceId'
      | 'name'
      | 'pinned'
      | 'pos'
      | 'shortLink'
      | 'shortUrl'
      | 'singleInstrumentationId'
      | 'start'
      | 'subscribed'
      | 'url'
      | 'urlSource'
      | 'urlSourceText'
    >
    & {
      attachments: Array<(
        { __typename: 'Attachment' }
        & Pick<
          Types.Attachment,
          | 'id'
          | 'bytes'
          | 'date'
          | 'edgeColor'
          | 'fileName'
          | 'idMember'
          | 'isMalicious'
          | 'isUpload'
          | 'mimeType'
          | 'name'
          | 'pos'
          | 'url'
        >
        & { previews?: Types.Maybe<Array<(
          { __typename: 'Attachment_Preview' }
          & Pick<
            Types.Attachment_Preview,
            | '_id'
            | 'bytes'
            | 'height'
            | 'scaled'
            | 'url'
            | 'width'
          >
        )>> }
      )>,
      badges: (
        { __typename: 'Card_Badges' }
        & Pick<
          Types.Card_Badges,
          | 'attachments'
          | 'checkItems'
          | 'checkItemsChecked'
          | 'checkItemsEarliestDue'
          | 'comments'
          | 'description'
          | 'due'
          | 'dueComplete'
          | 'externalSource'
          | 'lastUpdatedByAi'
          | 'location'
          | 'maliciousAttachments'
          | 'start'
          | 'subscribed'
          | 'viewingMemberVoted'
          | 'votes'
        >
        & { attachmentsByType: (
          { __typename: 'Card_Badges_AttachmentsByType' }
          & { trello: (
            { __typename: 'Card_Badges_AttachmentsByType_Trello' }
            & Pick<Types.Card_Badges_AttachmentsByType_Trello, 'board' | 'card'>
          ) }
        ) }
      ),
      cover?: Types.Maybe<(
        { __typename: 'Card_Cover' }
        & Pick<
          Types.Card_Cover,
          | 'brightness'
          | 'color'
          | 'edgeColor'
          | 'idAttachment'
          | 'idPlugin'
          | 'idUploadedBackground'
          | 'sharedSourceUrl'
          | 'size'
        >
        & { scaled?: Types.Maybe<Array<(
          { __typename: 'Card_Cover_Scaled' }
          & Pick<
            Types.Card_Cover_Scaled,
            | 'id'
            | 'bytes'
            | 'height'
            | 'scaled'
            | 'url'
            | 'width'
          >
        )>> }
      )>,
      customFieldItems: Array<(
        { __typename: 'CustomFieldItem' }
        & Pick<
          Types.CustomFieldItem,
          | 'id'
          | 'idCustomField'
          | 'idModel'
          | 'idValue'
          | 'modelType'
        >
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
      limits: (
        { __typename: 'Card_Limits' }
        & {
          attachments: (
            { __typename: 'Card_Limits_Attachments' }
            & { perCard: (
              { __typename: 'Card_Limits_Attachments_PerCard' }
              & Pick<
                Types.Card_Limits_Attachments_PerCard,
                | 'count'
                | 'disableAt'
                | 'status'
                | 'warnAt'
              >
            ) }
          ),
          checklists: (
            { __typename: 'Card_Limits_Checklists' }
            & { perCard: (
              { __typename: 'Card_Limits_Checklists_PerCard' }
              & Pick<
                Types.Card_Limits_Checklists_PerCard,
                | 'count'
                | 'disableAt'
                | 'status'
                | 'warnAt'
              >
            ) }
          ),
          stickers: (
            { __typename: 'Card_Limits_Stickers' }
            & { perCard: (
              { __typename: 'Card_Limits_Stickers_PerCard' }
              & Pick<
                Types.Card_Limits_Stickers_PerCard,
                | 'count'
                | 'disableAt'
                | 'status'
                | 'warnAt'
              >
            ) }
          ),
        }
      ),
      pluginData: Array<(
        { __typename: 'PluginData' }
        & Pick<
          Types.PluginData,
          | 'id'
          | 'access'
          | 'idModel'
          | 'idPlugin'
          | 'scope'
          | 'value'
        >
      )>,
      recurrenceRule?: Types.Maybe<(
        { __typename: 'Card_RecurrenceRule' }
        & Pick<Types.Card_RecurrenceRule, 'rule'>
      )>,
      stickers: Array<(
        { __typename: 'Sticker' }
        & Pick<
          Types.Sticker,
          | 'id'
          | 'image'
          | 'imageUrl'
          | 'left'
          | 'rotate'
          | 'top'
          | 'zIndex'
        >
        & { imageScaled: Array<(
          { __typename: 'Sticker_ImageScaled' }
          & Pick<
            Types.Sticker_ImageScaled,
            | 'id'
            | 'bytes'
            | 'height'
            | 'scaled'
            | 'url'
            | 'width'
          >
        )> }
      )>,
    }
  )> }
);

/**
 * __usePreloadCardQuery__
 *
 * To run a query within a React component, call `usePreloadCardQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreloadCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreloadCardQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePreloadCardQuery(
  baseOptions: Apollo.QueryHookOptions<
    PreloadCardQuery,
    PreloadCardQueryVariables
  > &
    (
      | { variables: PreloadCardQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PreloadCardQuery, PreloadCardQueryVariables>(
    PreloadCardDocument,
    options,
  );
}
export function usePreloadCardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PreloadCardQuery,
    PreloadCardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PreloadCardQuery, PreloadCardQueryVariables>(
    PreloadCardDocument,
    options,
  );
}
export function usePreloadCardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        PreloadCardQuery,
        PreloadCardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PreloadCardQuery, PreloadCardQueryVariables>(
    PreloadCardDocument,
    options,
  );
}
export type PreloadCardQueryHookResult = ReturnType<typeof usePreloadCardQuery>;
export type PreloadCardLazyQueryHookResult = ReturnType<
  typeof usePreloadCardLazyQuery
>;
export type PreloadCardSuspenseQueryHookResult = ReturnType<
  typeof usePreloadCardSuspenseQuery
>;
export type PreloadCardQueryResult = Apollo.QueryResult<
  PreloadCardQuery,
  PreloadCardQueryVariables
>;
