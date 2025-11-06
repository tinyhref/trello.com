import { gql, type InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';

import { sendErrorEvent } from '@trello/error-reporting';

import type {
  PremiumFeatures,
  TrelloBoard,
  TrelloEnterprise,
  TrelloScaleProps,
  TrelloWorkspace,
} from '../generated';
import type { RecursivePartial, TargetModel } from './cacheModelTypes';
import {
  InvalidIdError,
  InvalidValueError,
  MissingIdError,
  wrapIdErrorInParent,
} from './cacheSyncingErrors';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import {
  syncListsOfEdgeRefs,
  type EdgeRelationMapping,
} from './syncListsOfEdgeRefs';
import {
  syncListsOfModelRefs,
  type NestedModelListMapping,
} from './syncListsOfModelRefs';
import {
  syncNativeNestedObjectArray,
  type NestedObjectArrayFieldMapping,
} from './syncNativeNestedObjectArray';
import {
  syncNativeNestedObjectToRest,
  type NestedObjectFieldMapping,
} from './syncNativeNestedObjectToRest';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { syncNestedModelReference } from './syncNestedModelReference';
import {
  isBool,
  isEnumString,
  isNumber,
  isObjectId,
  isString,
  nullOrString,
} from './validateHelpers';

const premiumFeatures: PremiumFeatures[] = [
  'activity',
  'additionalBoardBackgrounds',
  'additionalStickers',
  'advancedChecklists',
  'advancedPlanner',
  'aiQuickCapture',
  'atlassianIntelligence',
  'boardExport',
  'butler',
  'butlerBC',
  'butlerEnterprise',
  'butlerPremium',
  'butlerStandard',
  'ccpBilling',
  'collapsibleLists',
  'crown',
  'csvExport',
  'customBoardBackgrounds',
  'customEmoji',
  'customStickers',
  'deactivated',
  'deactivatedInEnterprise',
  'enterpriseUI',
  'export',
  'externallyBilled',
  'fogshopEquivalent',
  'goldMembers',
  'googleApps',
  'infinitePlugins',
  'inviteBoard',
  'inviteOrg',
  'isBc',
  'isPremium',
  'isStandard',
  'labelVariants',
  'largeAttachments',
  'listColors',
  'multiBoardGuests',
  'observers',
  'paidCorePlugins',
  'plugins',
  'premiumMirrorCards',
  'privateTemplates',
  'readSecrets',
  'removal',
  'restrictVis',
  'savedSearches',
  'selfServeExpansion',
  'shortExportHistory',
  'starCounts',
  'stats',
  'superAdmins',
  'tags',
  'threePlugins',
  'trelloSso',
  'views',
  'workspaceViews',
];

export const fieldMappings = {
  id: { validate: isString, key: 'nodeId' },
  name: { validate: isString },
  premiumFeatures: {
    validate: (value: unknown) =>
      Array.isArray(value) &&
      value.every((item) => isEnumString(item, premiumFeatures)),
    sendValueToSentry: true,
  },
  url: { validate: isString },
};

export const boardPrefsFieldMapping: NestedObjectFieldMapping<
  TrelloBoard['prefs']
> = {
  cardAging: {
    validate: (value) => isEnumString(value, ['pirate', 'regular']),
    sendValueToSentry: true,
  },
  cardCovers: {
    validate: isBool,
    sendValueToSentry: true,
  },
  showCompleteStatus: {
    validate: isBool,
    sendValueToSentry: true,
  },
};

const nestedListMappings: NestedModelListMapping<TrelloBoard> = {
  powerUps: {
    type: 'BoardPlugin' as const,
    key: 'boardPlugins',
    useObjectIdFromEdge: true,
  },
  customFields: { type: 'CustomField' as const },
  members: { type: 'Member' as const },
};

const edgeRelationMappings: EdgeRelationMapping<TrelloBoard> = {
  members: {
    type: 'Board_Membership' as const,
    edgeField: 'membership',
    nodeIdKey: 'idMember',
    edgeKey: 'memberships',
  },
};

export const boardPrefsBackgroundFieldMapping: NestedObjectFieldMapping<
  TrelloBoard['prefs']['background']
> = {
  bottomColor: {
    validate: isString,
    key: 'backgroundBottomColor',
  },
  brightness: {
    validate: (value) => isEnumString(value, ['light', 'dark', 'unknown']),
    key: 'backgroundBrightness',
  },
  color: {
    validate: nullOrString,
    key: 'backgroundColor',
  },
  image: {
    validate: nullOrString,
    key: 'backgroundImage',
  },
  tile: {
    validate: isBool,
    key: 'backgroundTile',
  },
  topColor: {
    validate: isString,
    key: 'backgroundTopColor',
  },
};

export const generateBoardPrefsFragment = (field: string) => {
  return `fragment Board_Prefs${field} on Board {
    id
    prefs {
      ${field}
    }
  }`;
};

export const generateBoardPrefsData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'Board',
    id,
    prefs: {
      __typename: 'Board_Prefs',
      [field]: value,
    },
  };
};

export const backgroundImageScaledFieldMapping: NestedObjectArrayFieldMapping<TrelloScaleProps> =
  {
    height: {
      validate: isNumber,
    },
    width: {
      validate: isNumber,
    },
    url: {
      validate: isString,
    },
  };

export const generateBackgroundImageScaledFragment = () => {
  return `fragment BackgroundImageScaledWrite on Board {
    id
    prefs {
      backgroundImageScaled
    }
  }`;
};

export const generateBackgroundImageScaledData = (
  id: string | undefined,
  value: unknown,
) => {
  return {
    __typename: 'Board',
    id,
    prefs: {
      __typename: 'Board_Prefs',
      backgroundImageScaled: Array.isArray(value)
        ? value.map((obj) => ({
            ...obj,
            __typename: 'Board_Prefs_BackgroundImageScaled',
          }))
        : value,
    },
  };
};

/**
 * Given native TrelloBoard data, writes all board data to the Board model
 * in the Apollo Cache
 * @param incoming A partial TrelloBoard model
 * @param cache The cache to write to
 */
export const syncTrelloBoardToBoard = (
  incoming: RecursivePartial<TrelloBoard>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const boardId = getObjectIdFromCacheObject(incoming, readField);
    const board: TargetModel = { type: 'Board', id: boardId };

    /**
     * Temporary code to debug failing to sync premium features errors.
     *
     * The entire premiumFeatures field is being sent to sentry, but this gets
     * cut off after a handful of features so we're not able to see the entire array.
     * This will send just the invalid feature to sentry.
     */
    const incomingPremiumFeatures = readField<PremiumFeatures[]>(
      'premiumFeatures',
      incoming,
    );
    incomingPremiumFeatures?.forEach((feature) => {
      if (!isEnumString(feature, premiumFeatures)) {
        sendErrorEvent(
          new InvalidValueError(
            board.type,
            'premiumFeatures',
            feature,
            board,
            true,
          ),
          {
            tags: {
              ownershipArea: 'trello-graphql-data',
            },
          },
        );
      }
    });

    syncNativeToRestScalars(board, fieldMappings, incoming, cache, readField);

    syncListsOfModelRefs(board, nestedListMappings, incoming, cache, readField);

    syncListsOfEdgeRefs(
      board,
      edgeRelationMappings,
      incoming,
      cache,
      readField,
    );

    const prefs = readField<TrelloBoard['prefs']>('prefs', incoming);

    if (prefs) {
      syncNativeNestedObjectToRest<TrelloBoard['prefs']>(
        board,
        boardPrefsFieldMapping,
        generateBoardPrefsFragment,
        generateBoardPrefsData,
        prefs,
        cache,
      );

      const background = readField<TrelloBoard['prefs']['background']>(
        'background',
        prefs,
      );
      if (background) {
        syncNativeNestedObjectToRest(
          board,
          boardPrefsBackgroundFieldMapping,
          generateBoardPrefsFragment,
          generateBoardPrefsData,
          background,
          cache,
        );

        const backgroundImageScaled = readField<
          NonNullable<TrelloBoard['prefs']['background']>['imageScaled']
        >('imageScaled', background);
        syncNativeNestedObjectArray<TrelloScaleProps>(
          board,
          backgroundImageScaledFieldMapping,
          generateBackgroundImageScaledFragment,
          generateBackgroundImageScaledData,
          backgroundImageScaled,
          cache,
          { shouldMapNullFieldToNull: true },
        );
      }
    }

    const powerUps = readField<TrelloBoard['powerUps']>('powerUps', incoming);
    if (powerUps) {
      syncNativeToRestScalars(
        board,
        {
          powerUps: {
            /**
             * A bit of a hack, but the REST API always returns powerUps: [] since now all power up
             * data is stored in boardPlugins which references the power up id as opposed to
             * its string name.
             *
             * We mimic this behavior by always syncing an empty array to the powerUps field.
             *
             * We avoid adding this in the main top level field mapping because it's a bit
             * unnecessary to sync the powerUps field every time we sync a board. Ensuring
             * that we only do this when the client is syncing the boardPlugins field
             * should help to gate this behavior to only when it's needed.
             */
            validate: () => true,
            transform: () => [],
            key: 'powerUps',
          },
        },
        incoming,
        cache,
        readField,
      );
    }

    try {
      const workspace = readField<TrelloWorkspace>('workspace', incoming);
      if (workspace) {
        const workspaceId = getObjectIdFromCacheObject(workspace, readField);
        syncNestedModelReference(
          board,
          {
            model: { id: workspaceId, type: 'Organization' },
            fieldName: 'organization',
            idFieldName: 'idOrganization',
          },
          cache,
        );
      }
    } catch (err) {
      let error = err;
      if (err instanceof InvalidIdError || err instanceof MissingIdError) {
        error = wrapIdErrorInParent(err, board, 'workspace');
      }
      sendErrorEvent(error);
    }

    const enterprise = readField<TrelloBoard['enterprise']>(
      'enterprise',
      incoming,
    );

    if (enterprise === null) {
      const fragment = `fragment ${board.type}enterpriseWrite on ${board.type} {
        id
        idEnterprise
      }`;

      cache.writeFragment({
        id: cache.identify({ __typename: board.type, id: board.id }),
        fragment: gql(fragment),
        data: {
          __typename: board.type,
          id: board.id,
          idEnterprise: null,
        },
      });
    } else if (enterprise) {
      // We don't use the ARI because the enterprise ARI may or may not contain the enterprise object ID
      // See this ticket for context: https://trello.atlassian.net/browse/MRLD-416
      const enterpriseId = readField<TrelloEnterprise['objectId']>(
        'objectId',
        enterprise,
      );

      if (!enterpriseId) {
        throw new MissingIdError('TrelloBoard', 'enterprise', board);
      }
      if (!isObjectId(enterpriseId)) {
        throw new InvalidIdError(
          'TrelloBoard',
          enterpriseId,
          'enterprise',
          board,
        );
      }

      syncNestedModelReference(
        board,
        {
          model: { id: enterpriseId, type: 'Enterprise' },
          fieldName: 'enterprise',
          idFieldName: 'idEnterprise',
        },
        cache,
      );
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
