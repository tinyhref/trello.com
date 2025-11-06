// Queries and subscriptions currently return different types.
// However, we want to maintain one entry per model in the Apollo
// cache, regardless if the data came in via a query or subscription.
// This object maps from the subscription typename to the query typename
// to leverage Apollo's normalization on the `${__typename}:${id}` cache key.
// This is manually maintained for now, but we should explore a way to automate or
// handle more generically via the schema.
const SUBSCRIPTION_TYPENAME_MAPPING: { [key: string]: string } = {
  TrelloBoardUpdated: 'TrelloBoard',
  TrelloBoardViewerUpdated: 'TrelloBoardViewer',
  TrelloBoardWorkspaceUpdated: 'TrelloWorkspace',
  TrelloCardDeleted: 'TrelloCard',
  TrelloChecklistConnectionUpdated: 'TrelloChecklistConnection',
  TrelloChecklistEdgeUpdated: 'TrelloChecklistEdge',
  TrelloChecklistUpdated: 'TrelloChecklist',
  TrelloChecklistDeleted: 'TrelloChecklist',
  TrelloCustomFieldConnectionUpdated: 'TrelloCustomFieldConnection',
  TrelloCustomFieldDeleted: 'TrelloCustomField',
  TrelloCustomFieldEdgeUpdated: 'TrelloCustomFieldEdge',
  TrelloCardCustomFieldItemEdgeUpdated: 'TrelloCustomFieldItemEdge',
  TrelloCustomFieldItemUpdatedConnection: 'TrelloCustomFieldItemConnection',
  TrelloCustomFieldId: 'TrelloCustomField',
  TrelloCustomFieldItemUpdated: 'TrelloCustomFieldItem',
  TrelloLabelConnectionUpdated: 'TrelloLabelConnection',
  TrelloLabelEdgeUpdated: 'TrelloLabelEdge',
  TrelloLabelUpdated: 'TrelloLabel',
  TrelloLabelDeleted: 'TrelloLabel',
  TrelloMemberUpdated: 'TrelloMember',
  TrelloWorkspaceUpdated: 'TrelloWorkspace',
  TrelloPlannerUpdated: 'TrelloPlanner',
  TrelloPlannerCalendarEventUpdated: 'TrelloPlannerCalendarEvent',
  TrelloPlannerCalendarEventCardDeleted: 'TrelloPlannerCalendarEventCard',
  TrelloPlannerCalendarEventCardConnectionUpdated:
    'TrelloPlannerCalendarEventCardConnection',
  TrelloProviderCalendarDeleted: 'TrelloPlannerProviderCalendar',
  TrelloPlannerCalendarUpdated: 'TrelloPlannerCalendar',
  TrelloPlannerCalendarAccountUpdated: 'TrelloPlannerCalendarAccount',
  TrelloPlannerCalendarEventCardEdgeUpdated:
    'TrelloPlannerCalendarEventCardEdge',
  TrelloPlannerCalendarEventCardUpdated: 'TrelloPlannerCalendarEventCard',
  TrelloPlannerCalendarEdgeUpdated: 'TrelloPlannerCalendarEdge',
  TrelloPlannerCalendarDeleted: 'TrelloPlannerCalendar',
  TrelloPlannerProviderCalendarEdgeUpdated: 'TrelloPlannerProviderCalendarEdge',
  TrelloPlannerProviderCalendarUpdated: 'TrelloPlannerProviderCalendar',
  TrelloPlannerProviderCalendarConnectionUpdated:
    'TrelloPlannerProviderCalendarConnection',
  TrelloPlannerCalendarAccountEdgeUpdated: 'TrelloPlannerCalendarAccountEdge',
  TrelloPlannerCalendarAccountConnectionUpdated:
    'TrelloPlannerCalendarAccountConnection',
  TrelloPlannerCalendarEventDeleted: 'TrelloPlannerCalendarEvent',
  TrelloPlannerCalendarConnectionUpdated: 'TrelloPlannerCalendarConnection',
  TrelloPlannerCalendarEventEdgeUpdated: 'TrelloPlannerCalendarEventEdge',
  TrelloPlannerCalendarEventConnectionUpdated:
    'TrelloPlannerCalendarEventConnection',
  TrelloCardUpdated: 'TrelloCard',
  TrelloListUpdated: 'TrelloList',
  TrelloAttachmentConnectionUpdated: 'TrelloAttachmentConnection',
  TrelloAttachmentEdgeUpdated: 'TrelloAttachmentEdge',
  TrelloMemberUpdatedConnection: 'TrelloMemberConnection',
  TrelloStickerUpdatedConnection: 'TrelloStickerConnection',
  TrelloLabelUpdatedConnection: 'TrelloLabelConnection',
  TrelloCardLabelEdgeUpdated: 'TrelloLabelEdge',
  TrelloCardUpdatedConnection: 'TrelloCardConnection',
  TrelloCardEdgeUpdated: 'TrelloCardEdge',
  TrelloListUpdatedConnection: 'TrelloListConnection',
  TrelloListEdgeUpdated: 'TrelloListEdge',
  TrelloLabelId: 'TrelloLabel',
  TrelloCardCoverUpdated: 'TrelloCardCover',
  TrelloPlannerCardUpdated: 'TrelloCard',
  TrelloPlannerCardListUpdated: 'TrelloList',
  TrelloPlannerCardBoardUpdated: 'TrelloBoard',
  TrelloStickerEdgeUpdated: 'TrelloStickerEdge',
  TrelloWorkspaceEnterpriseUpdated: 'TrelloEnterprise',
  TrelloInboxUpdated: 'TrelloInbox',
  TrelloCardActionConnectionUpdated: 'TrelloCardActionConnection',
  TrelloCardActionEdgeUpdated: 'TrelloCardActionEdge',
};

export const shouldMapSubscriptionTypename = (typename: string) => {
  return typename in SUBSCRIPTION_TYPENAME_MAPPING;
};

export const getMappedSubscriptionTypename = (typename: string) => {
  return SUBSCRIPTION_TYPENAME_MAPPING[typename];
};
