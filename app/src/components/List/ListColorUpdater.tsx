import type { FunctionComponent, RefObject } from 'react';
import { useMemo } from 'react';

import { useListId } from '@trello/id-context';
import type { AccentTokenOptions } from '@trello/theme/accent-tokens';
import { useAccentTokens } from '@trello/theme/accent-tokens';

import {
  DEFAULT_LIST_COLOR,
  useListColor,
} from 'app/src/components/ListColorPicker';
import { useListLimitsPowerUp } from './useListLimitsPowerUp';

/**
 * Some list fields can conditionally affect the colors of the list: namely
 * `color`, which is a forthcoming paid feature, and `softLimit`, which is set
 * by the List Limits Power-Up.
 *
 * Subscribing to the List Limits Power-Up at the List component level would be
 * destructive for performance. In order to determine whether the list exceeds
 * its limits, we have to compare the number of cards in the list against its
 * softLimit. Ordinarily, this would mean that the List component has to
 * rerender _every_ time the number of cards within it changes.
 *
 * As a performance optimization, the logic to update the colors for a list
 * has been extracted into this updater component, which can be rendered as a
 * leaf node within the List component. It will subscribe to these otherwise
 * expensive updates and conditionally apply the list colors directly to the
 * List element as CSS variables (using {@link useAccentTokens}), without
 * ever requiring the full List component to rerender.
 */
export const ListColorUpdater: FunctionComponent<{
  listRef: RefObject<HTMLElement>;
}> = ({ listRef }) => {
  const listId = useListId();
  const { isListLimitExceeded, isEnabled: isListLimitsEnabled } =
    useListLimitsPowerUp();
  const listColor = useListColor(listId);

  const accentTokenOptions = useMemo<AccentTokenOptions>(() => {
    if (listColor !== DEFAULT_LIST_COLOR) {
      return { color: listColor, modifier: 'subtler' };
    }
    if (isListLimitsEnabled && isListLimitExceeded) {
      return { color: 'warning' };
    }
    return { color: null };
  }, [listColor, isListLimitExceeded, isListLimitsEnabled]);

  useAccentTokens({ ref: listRef, ...accentTokenOptions });

  return null;
};
