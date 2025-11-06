import { useBoardShowCompleteStatusPrefFragment } from './BoardShowCompleteStatusPrefFragment.generated';

/**
 * Return true if the board showCompleteStatus pref is true
 *
 * @remarks
 * This hook checks if the board showCompleteStatus pref is true, based on the board id.
 *
 * @param boardId - The board id
 * @returns true if the board showCompleteStatus pref is true, false otherwise
 *
 */
export const useBoardShowCompleteStatusPref = ({
  boardId,
}: {
  boardId: string;
}) => {
  const { data } = useBoardShowCompleteStatusPrefFragment({
    from: { id: boardId },
  });

  return data?.prefs?.showCompleteStatus ?? true;
};
