import type { StringSubstitutions } from '@trello/legacy-i18n';
import { forEntities } from '@trello/legacy-i18n';
import { isTrelloAttachmentUrl, isTrelloUrl, isUrl } from '@trello/urls';

import type { NotificationType } from 'app/src/components/NotificationsMenu';
import { getActionLink } from 'app/src/components/NotificationsMenu/getActionLink';
import type {
  ActionDisplayType,
  ActionEntityType,
  AttachmentEntity,
  AttachmentPreviewEntity,
  CardEntity,
  CheckItemEntity,
  IdText,
} from './types';

export class EntityTransformers {
  private display: ActionDisplayType;

  constructor(display: ActionDisplayType) {
    this.display = display;
  }

  private addOrUpdateEntity(key: string, entity: ActionEntityType, props = {}) {
    this.display = {
      ...this.display,
      entities: {
        ...this.display.entities,
        [key]: {
          ...entity,
          ...props,
        },
      },
    };
  }

  private findEntityType<T extends ActionEntityType>(entityType: T['type']) {
    const { entities } = this.display;
    if (entities) {
      for (const [, entity] of Object.entries(entities)) {
        if (entity?.type === entityType) {
          return entity as T;
        }
      }
    }
  }

  private getTranslationKeys(idContext: string) {
    const translationKey = this.display.translationKey;
    const entities = this.display.entities;

    const nonContextKeys = [translationKey];
    if (!idContext || !entities) {
      return nonContextKeys;
    }

    const matchingPair = Object.entries(entities).find(
      ([, entity]) => (entity as IdText).id === idContext,
    );

    if (matchingPair) {
      const matchingType = matchingPair[0];

      return [[translationKey, matchingType].join('@'), ...nonContextKeys];
    }

    return nonContextKeys;
  }

  getEntityStrings(idContext: string, type: 'actions') {
    const format = forEntities(type, { shouldEscapeStrings: false });
    const { entities } = this.display;
    const translationKeys = this.getTranslationKeys(idContext);

    const substitutions: StringSubstitutions = {};
    if (entities) {
      Object.entries(entities).forEach(([key, entity]) => {
        substitutions[key] = (entity as IdText).text
          ? (entity as IdText).text
          : '';
      });
    }

    return format(translationKeys[0], substitutions);
  }

  fixDateIssues() {
    const { translationKey, entities } = this.display;
    const cardEntity = this.findEntityType<CardEntity>('card');
    const checkItemEntity = this.findEntityType<CheckItemEntity>('checkItem');
    // FIX ME: this hack for changing the string key
    // for removing due date on a card. Normally this would be
    // provided by the server, so once this is fixed serverside,
    // we should remove this condition
    if (entities) {
      if (cardEntity) {
        if (
          translationKey === 'notification_changed_due_date' &&
          cardEntity.due === null
        ) {
          this.display = {
            ...this.display,
            translationKey: 'notification_removed_due_date',
          };
        }

        // We also manually provide a date entity for use in the string keys
        if (
          [
            'notification_changed_due_date',
            'notification_added_a_due_date',
          ].includes(translationKey) &&
          cardEntity.due
        ) {
          this.addOrUpdateEntity('date', {
            type: 'date',
            date: cardEntity.due,
          });
        }
      } else if (checkItemEntity) {
        // We also manually provide a date entity for use in the string keys
        if (
          [
            'notification_changed_due_date_on_checkitem',
            'notification_added_a_due_date_to_checkitem',
          ].includes(translationKey) &&
          checkItemEntity.due
        ) {
          this.addOrUpdateEntity('date', {
            type: 'date',
            date: checkItemEntity.due,
          });
        }
      }
    }

    return this;
  }

  fixTranslatebleLocaleGroup(localeGroup: string) {
    const { entities } = this.display;

    if (entities) {
      for (const [key, entity] of Object.entries(entities)) {
        if (entity?.type === 'translatable') {
          this.addOrUpdateEntity(key, entity, {
            translationKey: [localeGroup, entity.translationKey],
          });
        }
      }
    }

    return this;
  }

  addUrlContext() {
    const { entities } = this.display;

    if (entities) {
      const contextEntity =
        this.findEntityType<AttachmentPreviewEntity>('attachmentPreview');
      const urlContext = contextEntity?.originalUrl;

      if (urlContext) {
        for (const [key, entity] of Object.entries(entities)) {
          if (entity?.type === 'text') {
            this.addOrUpdateEntity(key, entity, { urlContext });
          }
        }
      }
    }

    return this;
  }

  makeEntitiesFriendly(overrideTrelloHost?: string) {
    const { entities } = this.display;
    if (entities) {
      for (const [key, entity] of Object.entries(entities)) {
        if (entity?.type === 'text' || entity?.type === 'attachment') {
          const { type, text, urlContext } = entity;
          const { url } = entity as AttachmentEntity;

          const newProps: {
            url?: string;
            type?: string;
            isFriendly?: boolean;
            isTrello?: boolean;
            isTrelloAttachment?: boolean;
          } = {
            url,
          };

          if (!url && (urlContext || isUrl(text))) {
            if (type === 'text') {
              newProps.type = 'attachment';
            }
            newProps.url = urlContext || text;
            newProps.isFriendly = true;
          }

          if (newProps.url) {
            newProps.isTrelloAttachment = isTrelloAttachmentUrl(newProps.url);
            newProps.isTrello = isTrelloUrl(newProps.url, overrideTrelloHost);
          }

          this.addOrUpdateEntity(key, entity, newProps);
        }
      }
    }

    return this;
  }

  // Add an action url to clickable actions
  addActionUrl(
    actionData?: {
      actionType?: string | null;
      card?: {
        shortLink?: string | null;
        idShort?: number | null;
        name?: string | null;
      } | null;
      checkItem?: {
        id?: string | null;
      } | null;
    },
    actionType?: NotificationType,
    idAction?: string,
  ) {
    const { entities } = this.display;
    if (entities) {
      for (const [key, entity] of Object.entries(entities)) {
        if (['comment', 'checkItem'].includes(entity?.type)) {
          const actionUrl = getActionLink({
            data: actionData,
            type: actionType,
            idAction,
          });

          this.addOrUpdateEntity(key, entity, { actionUrl });
        }
      }
    }

    return this;
  }

  addCardAndBoardIdToComment(actionData?: {
    actionType?: string | null;
    card?: {
      id?: string | null;
    } | null;
    board?: {
      id?: string | null;
    } | null;
  }) {
    const { entities } = this.display;
    if (entities) {
      for (const [key, entity] of Object.entries(entities)) {
        if (entity?.type === 'comment') {
          this.addOrUpdateEntity(key, entity, {
            cardId: actionData?.card?.id,
            boardId: actionData?.board?.id,
          });
        }
      }
    }

    return this;
  }

  // For relative date entities we need context on the type of notification to
  // determine whether the text used should be upper or lower case
  addNotificationContext(notificationType?: NotificationType) {
    const { entities } = this.display;
    if (entities) {
      for (const [key, entity] of Object.entries(entities)) {
        if (entity?.type === 'relDate') {
          this.addOrUpdateEntity(key, entity, { notificationType });
        }
      }
    }

    return this;
  }

  checkForTruncation(notificationType?: NotificationType) {
    const { entities } = this.display;
    if (entities) {
      for (const [key, entity] of Object.entries(entities)) {
        if (entity?.type === 'comment' && entity.text.length > 150) {
          this.addOrUpdateEntity(key, entity, {
            canTruncate: true,
            // We don't want to truncate @-mentions by default, because the @-mention might
            // be below the fold, and we want to be sure the user's attention is drawn to it
            defaultIsTruncated: notificationType !== 'mentionedOnCard',
          });
        }
      }
    }
    return this;
  }

  value() {
    return this.display;
  }
}
