import type { NotificationType } from './NotificationsMenu.types';

const checkItemTypes: NotificationType[] = [
  'addedToCheckItem',
  'changeCheckItemDue',
  'checkItemDueSoon',
];

export const isCheckItemNotification = ({
  type,
  data,
}: {
  type?: NotificationType;
  data?: {
    checkItem?: {
      id?: string | null;
    } | null;
  };
}): boolean => {
  if (!type || !data?.checkItem?.id) {
    return false;
  }

  return checkItemTypes.includes(type);
};
