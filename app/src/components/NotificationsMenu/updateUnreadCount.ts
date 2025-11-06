import type { NotificationsCountModel } from './NotificationsMenu.types';

export const updateUnreadCount = (
  state: NotificationsCountModel,
  idGroup: string,
  direction: number,
) => {
  const { [idGroup]: count, ...rest } = state;
  const newCount = (count || 0) + direction;
  const newCountGroup =
    newCount > 0
      ? {
          ...rest,
          [idGroup]: newCount,
        }
      : rest;

  return newCountGroup;
};
