import { type InMemoryCache, type Reference } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type {
  TrelloCard,
  TrelloCardAttachmentsByType,
  TrelloCardAttachmentsCount,
  TrelloCardBadgeDueInfo,
  TrelloCardViewer,
} from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import { InvalidIdError, MissingIdError } from './cacheSyncingErrors';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import {
  syncNativeNestedObjectToRest,
  type NestedObjectFieldMapping,
} from './syncNativeNestedObjectToRest';
import { isBool, isNumber, isObjectId, nullOrString } from './validateHelpers';

export const fieldMappingBadges: NestedObjectFieldMapping<
  TrelloCard['badges']
> = {
  attachments: {
    validate: isNumber,
  },
  checkItems: {
    validate: isNumber,
  },
  checkItemsChecked: {
    validate: isNumber,
  },
  checkItemsEarliestDue: {
    validate: nullOrString,
  },
  comments: {
    validate: isNumber,
  },
  description: {
    validate: isBool,
  },
  externalSource: {
    validate: (value) =>
      value === null ||
      ['BROWSER_EXTENSION', 'EMAIL', 'MSTEAMS', 'SIRI', 'SLACK'].includes(
        value as string,
      ),
    sendValueToSentry: true,
  },
  lastUpdatedByAi: {
    validate: isBool,
  },
  location: {
    validate: isBool,
  },
  maliciousAttachments: {
    validate: isNumber,
  },
  startedAt: {
    validate: nullOrString,
    key: 'start',
  },
  votes: {
    validate: isNumber,
  },
};

const cardBadgesFragmentToWrite = (field: string) => {
  return `fragment Card_Badges${field} on Card {
      id
      badges {
        ${field}
      }
    }`;
};

export const cardBadgesDataToWrite = (
  id: string | undefined,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'Card',
    id,
    badges: {
      __typename: 'Card_Badges',
      [field]: value,
    },
  };
};

const syncTrelloCardAttachmentsByType = (
  id: string | undefined,
  targetModel: TargetModel,
  incoming: Partial<TrelloCard['badges']> | Reference,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  if (!incoming || !id) {
    return;
  }
  const attachmentsByType = readField<TrelloCardAttachmentsByType>(
    'attachmentsByType',
    incoming,
  );
  if (!attachmentsByType) {
    return;
  }
  const trelloAttachments = readField<TrelloCardAttachmentsCount>(
    'trello',
    attachmentsByType,
  );

  if (!trelloAttachments) {
    return;
  }

  const fieldMappingAttachmentsByType: NestedObjectFieldMapping<
    TrelloCardAttachmentsByType['trello']
  > = {
    board: {
      validate: isNumber,
    },
    card: {
      validate: isNumber,
    },
  };

  const trelloAttachmentsWriteFragment = (field: string) => {
    return `
    fragment Card_BadgesTrelloAttachments${field} on Card {
      id
      badges {
        attachmentsByType {
          trello {
            ${field}
            }
            }
            }
            }`;
  };
  const trelloAttachmentsWriteData = (
    cardId: string | undefined,
    field: string,
    value: unknown,
  ) => {
    return {
      __typename: 'Card',
      id: cardId,
      badges: {
        __typename: 'Card_Badges',
        attachmentsByType: {
          __typename: 'Card_Badges_AttachmentsByType',
          trello: {
            __typename: 'Card_Badges_AttachmentsByType_Trello',
            [field]: value,
          },
        },
      },
    };
  };
  syncNativeNestedObjectToRest<TrelloCardAttachmentsByType['trello']>(
    targetModel,
    fieldMappingAttachmentsByType,
    trelloAttachmentsWriteFragment,
    trelloAttachmentsWriteData,
    trelloAttachments,
    cache,
  );
};

const syncTrelloCardDueBadge = (
  id: string | undefined,
  targetModel: TargetModel,
  incoming: Partial<TrelloCard['badges']> | Reference,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  if (!incoming || !id) {
    return;
  }

  const due = readField<TrelloCardBadgeDueInfo>('due', incoming);
  if (!due) {
    return;
  }

  const fieldMappingDue: NestedObjectFieldMapping<TrelloCardBadgeDueInfo> = {
    at: {
      validate: nullOrString,
      key: 'due',
    },
    complete: {
      validate: isBool,
      key: 'dueComplete',
    },
  };
  syncNativeNestedObjectToRest<TrelloCardBadgeDueInfo>(
    targetModel,
    fieldMappingDue,
    cardBadgesFragmentToWrite,
    cardBadgesDataToWrite,
    due,
    cache,
  );
};

const syncTrelloCardViewerBadges = (
  id: string | undefined,
  targetModel: TargetModel,
  incoming: Partial<TrelloCard['badges']> | Reference,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  if (!incoming || !id) {
    return;
  }
  const viewer = readField<TrelloCardViewer>('viewer', incoming);
  if (!viewer) {
    return;
  }

  const fieldMappingViewer: NestedObjectFieldMapping<TrelloCardViewer> = {
    subscribed: {
      validate: isBool,
      key: 'subscribed',
    },
    voted: {
      validate: isBool,
      key: 'viewingMemberVoted',
    },
  };
  syncNativeNestedObjectToRest<TrelloCardViewer>(
    targetModel,
    fieldMappingViewer,
    cardBadgesFragmentToWrite,
    cardBadgesDataToWrite,
    viewer,
    cache,
  );
};

export const syncTrelloCardBadgesToCardBadges = (
  targetModel: TargetModel,
  incoming: RecursivePartial<TrelloCard>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const id = readField<string>('id', incoming);
  if (!id) {
    // This should never happen because we have a lint rule ensuring id is always fetched
    sendErrorEvent(new MissingIdError('Card'));
    return;
  }

  const objectId = getObjectIdFromCacheObject(incoming, readField);
  if (!isObjectId(objectId)) {
    sendErrorEvent(new InvalidIdError('Card', id));
    return;
  }
  const cardBadges = readField<TrelloCard['badges']>('badges', incoming);
  syncNativeNestedObjectToRest<TrelloCard['badges']>(
    targetModel,
    fieldMappingBadges,
    cardBadgesFragmentToWrite,
    cardBadgesDataToWrite,
    cardBadges,
    cache,
  );
  syncTrelloCardAttachmentsByType(
    objectId,
    targetModel,
    cardBadges,
    cache,
    readField,
  );
  syncTrelloCardDueBadge(objectId, targetModel, cardBadges, cache, readField);
  syncTrelloCardViewerBadges(
    objectId,
    targetModel,
    cardBadges,
    cache,
    readField,
  );
};
