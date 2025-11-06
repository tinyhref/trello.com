import type { NotificationType } from './NotificationsMenu.types';

const commentTypes: NotificationType[] = [
  'commentCard',
  'copyCommentCard',
  'mentionedOnCard',
];

export const isCommentLike = ({
  type,
  data,
}: {
  type?: NotificationType;
  data?: {
    actionType?: string | null;
  } | null;
}): boolean => {
  if (!type) {
    return false;
  }

  return (
    commentTypes.includes(type) ||
    (type === 'reactionAdded' && !!data && data.actionType === 'commentCard')
  );
};
