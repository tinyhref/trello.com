import { getShortLinkFromTrelloUrl } from '@trello/urls';

import type { AddCardToListMutation } from './AddCardToListMutation.generated';

type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};

type CreatedCard = NonNullable<AddCardToListMutation['createCard']>;

export const createOptimisticCardResponse = ({
  id,
  idBoard,
  idList,
  name,
  pos,
  cardRole = null,
  due = null,
  start = null,
}: Pick<
  CreatedCard,
  'cardRole' | 'due' | 'id' | 'idBoard' | 'idList' | 'name' | 'pos' | 'start'
>): CreatedCard => {
  let mirrorSourceId = null;
  if (cardRole === 'mirror') {
    mirrorSourceId = getShortLinkFromTrelloUrl(name) ?? null;
  }
  // Enforce completeness here to ensure that our optimistic response fulfills
  // the type Apollo expects, but return it as the regular type for convenience.
  const card: DeepRequired<CreatedCard> = {
    __typename: 'Card',
    // IDs hoisted to the top:
    id,
    idBoard,
    idList,
    // Shallow fields:
    address: null,
    attachments: [],
    cardRole,
    checklists: [],
    closed: false,
    coordinates: null,
    creationMethod: null,
    creationMethodLoadingStartedAt: null,
    creationMethodError: null,
    customFieldItems: [],
    dateLastActivity: '',
    desc: '',
    descData: null,
    due,
    dueComplete: false,
    dueReminder: null,
    idAttachmentCover: null,
    idLabels: [],
    idMembers: [],
    idShort: 0,
    isTemplate: false,
    labels: [],
    limits: {
      __typename: 'Card_Limits',
      attachments: {
        __typename: 'Card_Limits_Attachments',
        perCard: {
          __typename: 'Card_Limits_Attachments_PerCard',
          count: null,
          disableAt: 1000,
          status: 'ok',
          warnAt: 800,
        },
      },
      checklists: {
        __typename: 'Card_Limits_Checklists',
        perCard: {
          __typename: 'Card_Limits_Checklists_PerCard',
          count: null,
          disableAt: 500,
          status: 'ok',
          warnAt: 400,
        },
      },
      stickers: {
        __typename: 'Card_Limits_Stickers',
        perCard: {
          __typename: 'Card_Limits_Stickers_PerCard',
          count: null,
          disableAt: 70,
          status: 'ok',
          warnAt: 56,
        },
      },
    },
    locationName: null,
    mirrorSourceId,
    name,
    nodeId: '',
    pluginData: [],
    pinned: false,
    pos,
    shortLink: '',
    shortUrl: '',
    start,
    stickers: [],
    subscribed: false,
    url: '',
    urlSource: '',
    urlSourceText: '',
    faviconUrl: '',
    // Nested fields:
    badges: {
      __typename: 'Card_Badges',
      attachments: 0,
      attachmentsByType: {
        __typename: 'Card_Badges_AttachmentsByType',
        trello: {
          __typename: 'Card_Badges_AttachmentsByType_Trello',
          board: 0,
          card: 0,
        },
      },
      checkItems: 0,
      checkItemsChecked: 0,
      checkItemsEarliestDue: null,
      comments: 0,
      description: false,
      due: null,
      dueComplete: false,
      externalSource: null,
      lastUpdatedByAi: false,
      location: false,
      maliciousAttachments: 0,
      start: null,
      subscribed: false,
      viewingMemberVoted: false,
      votes: 0,
    },
    cover: {
      __typename: 'Card_Cover',
      brightness: null,
      color: null,
      edgeColor: null,
      idAttachment: null,
      idPlugin: null,
      idUploadedBackground: null,
      scaled: null,
      sharedSourceUrl: null,
      size: 'normal',
    },
  };

  return card as CreatedCard;
};
