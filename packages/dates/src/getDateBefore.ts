import { getMilliseconds } from '@trello/time';

export function getDateBefore(
  options: { date?: Date } & Parameters<typeof getMilliseconds>[0],
) {
  const { date, ...rest } = options;

  return new Date((date || new Date()).getTime() - getMilliseconds(rest));
}
