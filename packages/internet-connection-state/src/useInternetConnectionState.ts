import { useCallback, useEffect, useRef } from 'react';

import { useSharedState } from '@trello/shared-state';

import {
  internetConnectionState,
  verifyAndUpdateInternetHealth,
} from './internetConnectionState';

export const useInternetConnectionState = () => {
  const [state, setInternetConnectionState] = useSharedState(
    internetConnectionState,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onOnline = useCallback(async () => {
    await verifyAndUpdateInternetHealth();
    if (internetConnectionState.value === 'healthy') {
      setInternetConnectionState('healthy');
    } else {
      timerRef.current = setTimeout(onOnline, 500);
    }
  }, [setInternetConnectionState]);

  const onOffline = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setInternetConnectionState('unhealthy');
  }, [setInternetConnectionState]);

  useEffect(() => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [onOnline, onOffline]);

  return state;
};
