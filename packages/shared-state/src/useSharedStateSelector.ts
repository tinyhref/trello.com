import { useCallback, useEffect, useRef, useState } from 'react';

import { deepEqual } from '@trello/objects';

import type { SharedState } from './SharedState';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type UseCallback<T extends Function> = typeof useCallback<T>;

export interface SharedStateSelectorOptions {
  onlyUpdateIfChanged?: boolean;
}

/**
 * This is a layer built on top of {@link useSharedState} that allows consumers
 * to pass in a `selector` to narrow down the subscription mechanism.
 *
 * For example, given a state object with many different keys and values,
 * a consumer could "select" a specific value to subscribe to, and only rerender
 * when that value has changed, ignoring the rest of the state.
 *
 * Since selectors are totally flexible, the subscribed value can even be a
 * comprehension of the original state in some way; for example, if a state
 * contains an array value, consumers could "select" the length of that value,
 * and only rerender when the length has changed, ignoring all other changes
 * internal to the values within the array.
 *
 * Inspired by the ongoing [proposal](https://github.com/reactjs/rfcs/pull/119)
 * to add the `useContextSelector` API to React.
 *
 * See [TRELLOFE - Sharing state between architectures](https://hello.atlassian.net/wiki/spaces/TRELLOFE/blog/2020/10/06/900192334/Sharing+state+between+architectures)
 *
 * @param state SharedState value
 * @param selector callback that takes a SharedState value and returns a selected value from it
 * @returns the result of the selector called on current state
 *
 * @example
 * interface ActiveCardSharedState {
 *   activeCardId: string | null;
 * }
 *
 * const activeCardSharedState = new SharedState({ activeCardId: null });
 *
 * export const useIsActiveCard = (cardId: string): boolean => {
 *   const isActiveCardSelector = useCallback(
 *     ({ activeCardId }: ActiveCardSharedState) => activeCardId === cardId,
 *     [cardId],
 *   );
 *   return useSharedState(activeCardSharedState, isActiveCardSelector);
 * };
 */
export function useSharedStateSelector<TState, TSelectedValue>(
  state: SharedState<TState>,
  selector: ReturnType<UseCallback<(value: TState) => TSelectedValue>>,
  options: SharedStateSelectorOptions = {},
): TSelectedValue {
  const [value, setValue] = useState(() => selector(state.value));
  const previousValueRef = useRef(value);
  const isSubscribedRef = useRef(false);

  const handleStateUpdate = useCallback(
    (updatedState: TState, previousState?: TState) => {
      isSubscribedRef.current =
        isSubscribedRef.current || typeof previousState !== 'undefined';

      const selectedValue = selector(updatedState);

      if (deepEqual(selectedValue, previousValueRef.current)) {
        return;
      }

      previousValueRef.current = selectedValue;
      setValue(selectedValue);
    },
    [selector],
  );

  // Re-evaluate state when the selector updates, as well:
  useEffect(() => {
    if (isSubscribedRef.current) {
      handleStateUpdate(state.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleStateUpdate]);

  const { onlyUpdateIfChanged } = options;
  useEffect(() => {
    const unsubscribe = state.subscribe(handleStateUpdate, {
      onlyUpdateIfChanged,
    });

    // Sync value in case another effect changes the value before the hook can
    // finish setting up the subscription.
    if (!isSubscribedRef.current) {
      handleStateUpdate(state.value);
    }

    return () => {
      // Reset isSubscribedRef so that values can still be synced while the
      // subscription is being set up.
      isSubscribedRef.current = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [state, onlyUpdateIfChanged, handleStateUpdate]);

  return value;
}
