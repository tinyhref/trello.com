import { DEFAULT_LIST_COLOR } from './ListColor.constants';
import type { ListColor } from './ListColor.types';
import { useListColorFragment } from './ListColorFragment.generated';

/**
 * Returns the color attribute for a list.
 *
 * @default gray
 */
export const useListColor = (listId: string): ListColor => {
  const { data } = useListColorFragment({
    from: { id: listId },
    optimistic: true,
  });
  return data?.color ?? DEFAULT_LIST_COLOR;
};
