import { isCheckItemNotification } from './isCheckItemNotification';
import { isCommentLike } from './isCommentLike';
import type { NotificationType } from './NotificationsMenu.types';

export const shouldGenerateActionLink = ({
  type,
  data,
}: {
  type?: NotificationType;
  data?: {
    actionType?: string | null;
    checkItem?: {
      id?: string | null;
    } | null;
  };
}) =>
  isCommentLike({ type, data }) ||
  isCheckItemNotification({ type, data }) ||
  (type &&
    [
      'changeCard',
      'createdCard',
      'addAttachmentToCard',
      'addedToCard',
      'removedFromCard',
      'cardDueSoon',
    ].includes(type));
