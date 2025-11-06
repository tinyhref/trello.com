import { useCallback, useEffect, useState } from 'react';

import { TrelloStorage, type StorageKey } from './StorageProxy';

export const usePersistedState = <T extends boolean | number | object | string>(
  key: StorageKey<'localStorage'>,
  initialValue: T | null,
): [T | null, (newValue: T | null) => void] => {
  const [value, setValue] = useState<T | null>(initialValue);

  const updater = useCallback(
    (newValue: T | null) => {
      setValue(newValue);
      if (newValue === null) {
        TrelloStorage.unset(key);
      } else {
        TrelloStorage.set(key, newValue);
      }
    },
    [key],
  );

  useEffect(() => {
    const storedValue = TrelloStorage.get(key);
    setValue(storedValue ?? value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, updater];
};
