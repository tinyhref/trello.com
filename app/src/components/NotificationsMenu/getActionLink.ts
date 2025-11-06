import { getCardUrl } from '@trello/urls';

import { getActionHash } from './getActionHash';
import { getNotificationCardShortUrl } from './getNotificationCardShortUrl';
import type {
  NotificationGroup,
  NotificationType,
} from './NotificationsMenu.types';
import { shouldGenerateActionLink } from './shouldGenerateActionLink';

type Card = NotificationGroup['card'];
interface ActionNotification {
  data?: {
    actionType?: string | null;
    card?: {
      shortLink?: string | null;
      idShort?: number | null;
      name?: string | null;
    } | null;
    checkItem?: {
      id?: string | null;
    } | null;
  };
  idAction?: string;
  type?: NotificationType;
}

export const getActionLink = function (
  notification: ActionNotification,
  card?: Card,
) {
  if (shouldGenerateActionLink(notification)) {
    const actionHash = getActionHash(notification);

    if (card?.url) {
      return getCardUrl(card, actionHash);
    } else if (notification.data?.card) {
      return `${getNotificationCardShortUrl(notification.data)}#${actionHash}`;
    }
  }
};
