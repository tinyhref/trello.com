import { isCheckItemNotification } from './isCheckItemNotification';
import { isCommentLike } from './isCommentLike';
import type { NotificationType } from './NotificationsMenu.types';

export const getActionHash = ({
  type,
  data,
  idAction,
}: {
  type?: NotificationType;
  data?: {
    actionType?: string | null;
    checkItem?: {
      id?: string | null;
    } | null;
  };
  idAction?: string | null;
}) => {
  if (isCheckItemNotification({ type, data })) {
    return `checkitem-${data?.checkItem?.id}`;
  } else if (idAction) {
    if (isCommentLike({ type, data })) {
      return `comment-${idAction}`;
    }

    return `action-${idAction}`;
  }

  return '';
};
