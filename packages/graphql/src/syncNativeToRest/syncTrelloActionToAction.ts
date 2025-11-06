import { gql, type InMemoryCache } from '@apollo/client';
import type { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import { cloneDeep } from '@apollo/client/utilities';

import { sendErrorEvent } from '@trello/error-reporting';
import { dangerouslyGetFeatureGateSync } from '@trello/feature-gate-client';

import type {
  Action_Type,
  TrelloAction,
  TrelloCardActions,
  TrelloMember,
} from '../generated';
import { handleCardActionPatching } from '../syncDeltaToCache/filteredActionsPatching/filteredActionsPatching';
import type {
  IncomingNativeModel,
  RecursivePartial,
  TargetModel,
} from './cacheModelTypes';
import { getObjectIdFromCacheObject } from './getObjectIdFromCacheObject';
import { syncNativeNestedObjectToRest } from './syncNativeNestedObjectToRest';
import { syncNativeToRestScalars } from './syncNativeToRestScalars';
import { syncNestedModelReference } from './syncNestedModelReference';
import { syncTrelloReactionToReaction } from './syncTrelloReactionToReaction';
import { isEnumString, isObject, isString } from './validateHelpers';

const validActionTypes: Action_Type[] = [
  'acceptEnterpriseJoinRequest',
  'addAdminToEnterprise',
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToBoard',
  'addMemberToCard',
  'addMemberToOrganization',
  'addOrganizationToEnterprise',
  'addToEnterprisePluginWhitelist',
  'addToOrganizationBoard',
  'butlerRuleFailedBoard',
  'changeEnterprisePublicBoardVisibility',
  'commentCard',
  'convertToCardFromCheckItem',
  'copyBoard',
  'copyCard',
  'copyInboxCard',
  'copyCommentCard',
  'createBoard',
  'createCard',
  'createInboxCard',
  'createCustomField',
  'createEnterpriseJoinRequest',
  'createList',
  'createOrganization',
  'deactivatedMemberInEnterprise',
  'deactivatedMemberInOrganization',
  'declineEnterpriseJoinRequest',
  'deleteAttachmentFromCard',
  'deleteBoardInvitation',
  'deleteCard',
  'deleteCustomField',
  'deleteList',
  'deleteOrganizationInvitation',
  'disableEnterprisePluginWhitelist',
  'disableIssuingOfConsentTokensInEnterprise',
  'disablePlugin',
  'disablePowerUp',
  'emailCard',
  'enableEnterprisePluginWhitelist',
  'enableIssuingOfConsentTokensInEnterprise',
  'enablePlugin',
  'enablePowerUp',
  'enterpriseAdminViewedPrivateBoard',
  'makeAdminOfBoard',
  'makeNormalMemberOfBoard',
  'makeNormalMemberOfOrganization',
  'makeObserverOfBoard',
  'memberJoinedTrello',
  'moveCardFromBoard',
  'moveCardToBoard',
  'moveInboxCardToBoard',
  'moveListFromBoard',
  'moveListToBoard',
  'reactivatedMemberInEnterprise',
  'reactivatedMemberInOrganization',
  'removeAdminFromEnterprise',
  'removeChecklistFromCard',
  'removeDeprecatedPlugin',
  'removedAllTokensFromOwnedMembers',
  'removedTokensFromMember',
  'removeFromEnterprisePluginWhitelist',
  'removeFromOrganizationBoard',
  'removeMemberFromCard',
  'removeOrganizationFromEnterprise',
  'trelloAddAdminToEnterprise',
  'trelloAddOrganizationToEnterprise',
  'trelloRemoveAdminFromEnterprise',
  'trelloRemoveOrganizationFromEnterprise',
  'unconfirmedBoardInvitation',
  'unconfirmedOrganizationInvitation',
  'updateBoard',
  'updateBoardOrg',
  'updateBoardVisibility',
  'updateCard',
  'updateCheckItemStateOnCard',
  'updateChecklist',
  'updateEnterprise',
  'updateCustomField',
  'updateCustomFieldItem',
  'updateList',
  'updateMember',
  'updateOrganization',
  'withdrawEnterpriseJoinRequest',
  'grantEnterpriseLicense',
  'revokeEnterpriseLicense',
  'grantOrganizationLicenses',
  'updateCardIdList',
  'updateCardClosed',
  'updateCardDue',
  'updateCardDueComplete',
  'updateListClosed',
  'updateCardRecurrenceRule',
];

export const fieldMappings = {
  type: {
    validate: (value: unknown) => isEnumString(value, validActionTypes),
    sendValueToSentry: true,
  },
  date: { validate: isString },
};

const dataFields = [
  'board',
  'card',
  'attachment',
  'checklist',
  'checkItem',
  'member',
  'cardSource',
  'list',
  'sourceCard',
  'creationMethod',
  'listBefore',
  'listAfter',
  'customField',
  'customFieldItem',
  'dateLastEdited',
];

/**
 * Helper function to sync the non-native Action.data field, which
 * is stored as a JSON string containing miscellaneous fields on
 * the action.
 *
 * On the incoming TrelloCardAction model, fields such as
 * board, card, etc are nested under the action.
 * @param action The action to write to the cache
 * @param incoming The incoming native TrelloAction data
 * @param cache The cache to write to
 * @param readField The readField function
 */

const syncActionData = (
  action: TargetModel,
  incoming: RecursivePartial<TrelloCardActions>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  const data: Record<string, unknown> = {};

  Object.entries(incoming).forEach(
    ([key, value]: [string, IncomingNativeModel]) => {
      if (!dataFields.includes(key)) {
        return;
      }

      if (key === 'dateLastEdited' && value !== null) {
        data[key] = value;
        return;
      } else if (key !== 'dateLastEdited') {
        // For all other data fields, just sync the id
        try {
          const id = getObjectIdFromCacheObject(value, readField);
          if (id) {
            data[key] = { id };
          }
        } catch (err) {
          sendErrorEvent(err);
        }
      }
    },
  );

  const stringifiedData = JSON.stringify(data);

  /**
   * The data field doesn't exist in the native TrelloAction model, so we can't
   * use one of our helpers to sync this field.
   */
  cache.writeFragment({
    id: cache.identify({ __typename: 'Action', id: action.id }),
    fragment: gql`
      fragment ActionData on Action {
        data
      }
    `,
    data: {
      __typename: 'Action',
      id: action.id,
      data: stringifiedData,
    },
  });
};

const displayfieldMappings = {
  displayKey: { validate: isString, key: 'translationKey' },
  displayEntities: {
    validate: (val: unknown) => {
      // Check that it's an object
      if (isObject(val)) {
        // Check that each entry in the object is [string, Record<string, unknown> | null]
        const isValidEntity = (ent: unknown) => ent === null || isObject(ent);
        return Object.entries(val).every(
          ([key, entity]) =>
            typeof key === 'string' &&
            (key === '__typename'
              ? typeof entity === 'string'
              : isValidEntity(entity)),
        );
      }
      return false;
    },
    key: 'entities',
    transform: (val: Record<string, Record<string, unknown> | null>) => {
      // Clone
      const displayEntities = cloneDeep(val);

      delete displayEntities.__typename;

      Object.entries(displayEntities).forEach(([entityName, entity]) => {
        // Sometimes an entity will be null (e.g. TrelloAddMemberToCard -> member will be null if you add yourself to a card)
        // We don't want to write these to the cache
        if (entity === null) {
          delete displayEntities[entityName];
          return;
        }
        /**
         * This is a workaround since our native GraphQL schema uses the key checkItem for display entities which is
         * then synced to the client cache. The action display expects the key checkitem instead, but we want to keep
         * the camelCase name in the GraphQL schema, so we just sync the name that the client cache expects.
         */
        if (entityName === 'checkItem') {
          displayEntities['checkitem'] = entity;
          delete displayEntities[entityName];
        }

        // Transform non-null entities
        delete entity.__typename;

        if ('objectId' in entity) {
          entity['id'] = entity.objectId;
          delete entity.objectId;
        }

        // Remove null fields from each entity
        // e.g. not all AttachmentPreview display entities will have a previewUrl
        Object.entries(entity).forEach(([key, value]) => {
          if (value === null) {
            delete entity[key];
          }
        });
      });

      // Serialize to JSON string
      return JSON.stringify(displayEntities);
    },
  },
};

const generateActionDisplayFragment = (field: string) => {
  return `fragment Action${field}Write on Action {
    id
    display {
      ${field}
    }
  }`;
};

const generateActionDisplayData = (
  id: string,
  field: string,
  value: unknown,
) => {
  return {
    __typename: 'Action',
    id,
    display: {
      __typename: 'Action_Display',
      [field]: value,
    },
  };
};

/**
 * Given native TrelloAction data, writes all action data to the Action model
 * in the Apollo Cache
 * @param incoming A partial TrelloAction model
 * @param cache The cache to write to
 * @param readField The readField function
 */
export const syncTrelloActionToAction = (
  incoming: RecursivePartial<TrelloCardActions>,
  cache: InMemoryCache,
  readField: ReadFieldFunction,
) => {
  try {
    const actionId = getObjectIdFromCacheObject(incoming, readField);
    // Action updates with reactions are not new actions, and we can skip
    // the normal action sync
    if (incoming.reactions) {
      if (dangerouslyGetFeatureGateSync('goo_sync_reactions_to_cache')) {
        const reactions: Array<{ __typename: 'Reaction'; id: string }> =
          incoming.reactions
            .filter((r) => r !== undefined)
            .map((r) => syncTrelloReactionToReaction(r, cache, readField))
            .filter((r) => r !== undefined)
            .map((r) => {
              return { id: r.id, __typename: 'Reaction' };
            });

        cache.writeFragment({
          id: cache.identify({ __typename: 'Action', id: actionId }),
          fragment: gql`
            fragment ActionReactionsSync on Action {
              id
              reactions {
                id
              }
            }
          `,
          data: {
            __typename: 'Action',
            id: actionId,
            reactions,
          },
        });
      }
      return;
    }
    const action: TargetModel = { type: 'Action', id: actionId };
    syncNativeToRestScalars<TrelloAction>(
      action,
      fieldMappings,
      incoming,
      cache,
      readField,
    );

    const member = readField<TrelloMember>('creator', incoming);

    if (member) {
      const memberId = getObjectIdFromCacheObject(member, readField);
      syncNestedModelReference(
        action,
        {
          model: { type: 'Member', id: memberId },
          fieldName: 'memberCreator',
          idFieldName: 'idMemberCreator',
        },
        cache,
      );
    }

    const appCreator = incoming.appCreator;
    if (appCreator === null) {
      cache.writeFragment({
        id: cache.identify({ __typename: 'Action', id: action.id }),
        fragment: gql`
          fragment ActionAppCreator on Action {
            appCreator {
              id
            }
          }
        `,
        data: {
          __typename: 'Action',
          id: action.id,
          appCreator: null,
        },
      });
    } else if (appCreator) {
      const appCreatorId = getObjectIdFromCacheObject(appCreator, readField);
      syncNestedModelReference(
        action,
        {
          model: { type: 'AppCreator', id: appCreatorId },
          fieldName: 'appCreator',
          idFieldName: 'idAppCreator',
        },
        cache,
      );
    }

    /**
     * Reactions and limits are currently not being included in server updates
     * so we sync default values here so that all the necessary fields are being
     * included for existing queries.
     */
    cache.writeFragment({
      id: cache.identify({ __typename: 'Action', id: action.id }),
      fragment: gql`
        fragment ActionReactions on Action {
          reactions {
            id
          }
        }
      `,
      data: {
        __typename: 'Action',
        id: action.id,
        reactions: [],
      },
    });

    if (!incoming.limits) {
      cache.writeFragment({
        id: cache.identify({ __typename: 'Action', id: action.id }),
        fragment: gql`
          fragment ActionLimits on Action {
            limits
          }
        `,
        data: {
          __typename: 'Action',
          id: action.id,
          limits: null,
        },
      });
    }

    syncActionData(action, incoming, cache, readField);
    syncNativeNestedObjectToRest(
      action,
      displayfieldMappings,
      generateActionDisplayFragment,
      generateActionDisplayData,
      // @ts-expect-error TS(2345): Types of property '__typename' are incompatible. I promise __typename will be a string
      incoming,
      cache,
    );

    const card = incoming.card;

    /**
     * The CardBackActionsQuery won't automatically include new actions we sync because
     * it relies on actions being included in a particular filter (for example all
     * card actions or a reduced set of actions).
     *
     * To ensure that our incoming action is included, we need to use
     * handleCardActionPatching which originally was used to sync legacy delta
     * updates to the correct card actions filter.
     */

    if (incoming.__typename && incoming.type && card) {
      const cardId = getObjectIdFromCacheObject(card, readField);

      const typeNameToActionTypeMapping: Record<string, Action_Type> = {
        TrelloUpdateCardCompleteAction: 'updateCardDueComplete',
        TrelloUpdateCardDueAction: 'updateCardDue',
        TrelloMoveCardAction: 'updateCardIdList',
        TrelloUpdateCardClosedAction: 'updateCardClosed',
      };

      let actionType: Action_Type | undefined;
      if (incoming.type === 'updateCard') {
        actionType = typeNameToActionTypeMapping[incoming.__typename];
      } else {
        actionType = incoming.type as Action_Type;
      }

      handleCardActionPatching(
        cache,
        {
          id: action.id,
          __typename: 'Action',
          type: actionType,
        },
        cardId,
      );
    } else {
      /**
       * If we get this error, then it means we weren't able to populate the card actions filter with the incoming
       * action.
       *
       * We send all the data we have about the action to Sentry so that we can investigate the issue.
       */
      sendErrorEvent(
        new Error(
          `unable to update card actions filter: ${action.id}, ${incoming.__typename} ${incoming.type} ${card ? 'has card' : 'no card'}`,
        ),
        {
          extraData: {
            component: 'syncNativeToRest',
            ownershipArea: 'trello-graphql-data',
          },
        },
      );
    }
  } catch (err) {
    sendErrorEvent(err);
  }
};
