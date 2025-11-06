/**
 * Checks if the date that the last activity occured on the board (dateLastActivity) was before than the date that the current member last viewed the board (dateLastView).
 */
export function hasUnreadActivity(board: {
  dateLastActivity: Date | string | null;
  dateLastView: Date | string | null;
}): boolean;

export function hasUnreadActivity(board: {
  dateLastActivity?: Date | string | null;
  dateLastView?: Date | string | null;
}): boolean | undefined;

export function hasUnreadActivity(board: {
  dateLastActivity?: Date | string | null;
  dateLastView?: Date | string | null;
}): boolean | undefined {
  const { dateLastActivity, dateLastView } = board;
  if (dateLastActivity && dateLastView) {
    const _dateLastActivity =
      dateLastActivity instanceof Date
        ? dateLastActivity
        : new Date(dateLastActivity);
    const _dateLastView =
      dateLastView instanceof Date ? dateLastView : new Date(dateLastView);

    return _dateLastActivity > _dateLastView;
  } else {
    return undefined;
  }
}
