import { useEffect, useMemo, useState } from 'react';

import type { SharedState, SharedStateOptions } from './SharedState';

type SetValue<TValue> = SharedState<TValue>['setValue'];

/**
 * This "React-ifies" a {@link SharedState} value, wrapping the state and
 * providing similar functionality as the {@link useState} React hook.
 *
 * In other words, this provides a way to get alerted of updates on the passed
 * SharedState object and also make changes (which alert other listeners of the
 * value) in a React safe way.
 *
 * See [TRELLOFE - Sharing state between architectures](https://hello.atlassian.net/wiki/spaces/TRELLOFE/blog/2020/10/06/900192334/Sharing+state+between+architectures)
 *
 * @param state value to be wrapped with React state concepts
 * @returns a tuple - [value, setValue]. Very similar to {@link useState}.
 * Setting a new value will alert other listeners.
 */
export function useSharedState<TValue>(
  state: SharedState<TValue>,
  options: SharedStateOptions = {},
): [TValue, SetValue<TValue>] {
  const [value, setValue] = useState(state.value);
  const previousValue = useMemo(() => state.value, [state.value]);

  useEffect(() => {
    const unsubscribe = state.subscribe(setValue, options);

    if (previousValue !== state.value) {
      setValue(state.value);
    }

    return unsubscribe;
  }, [previousValue, state, setValue, options]);

  const boundSetValue = useMemo<SetValue<TValue>>(
    () => state.setValue.bind(state),
    [state],
  );

  return [value, boundSetValue];
}
