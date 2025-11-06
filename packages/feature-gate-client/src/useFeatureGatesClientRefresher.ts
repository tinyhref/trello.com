import { useEffect, useRef, useState } from 'react';

import { environment } from '@trello/config';

import { useFeatureGate } from './useFeatureGate';
import { useIsFeatureGateClientInitializeCompleted } from './useIsFeatureGateClientInitializeCompleted';
import { usePageVisibilityListener } from './usePageVisibilityListener';

const BASE_REFRESH_INTERVAL_IN_MS_STG = 60_000; // 60 seconds (the endpoint proxy only fetches at most every 60 seconds)
const BASE_REFRESH_INTERVAL_IN_MS_PROD = 300_000; // 300 seconds = 5 mins

const INACTIVE_REFRESH_POLLING_FACTOR = 12; // decreased polling rate for hidden tabs

const BASE_REFRESH_INTERVAL_IN_MS =
  environment === 'prod'
    ? BASE_REFRESH_INTERVAL_IN_MS_PROD
    : BASE_REFRESH_INTERVAL_IN_MS_STG;

let intervalId: NodeJS.Timeout | undefined;

export const useFeatureGatesClientRefresher = (
  refresh: () => Promise<void>,
) => {
  const { value: isStatsigFeatureGatesRefresherEnabled } = useFeatureGate(
    'xf_statsig_feature_gates_refresher',
  );
  const isFeatureGateClientInitializeCompleted =
    useIsFeatureGateClientInitializeCompleted();

  const [isRefreshEnabled, setIsRefreshEnabled] = useState(
    isFeatureGateClientInitializeCompleted &&
      isStatsigFeatureGatesRefresherEnabled,
  );

  const { isPageVisible } = usePageVisibilityListener();
  const prevIsPageVisible = useRef(isPageVisible);

  const { value: isRefreshOnVisibilityChangeEnabled } = useFeatureGate(
    'ghost_refresh_feature_gates_on_visibility_change',
  );

  const [intervalInMs, setIntervalInMs] = useState(BASE_REFRESH_INTERVAL_IN_MS);

  useEffect(() => {
    setIsRefreshEnabled(
      isFeatureGateClientInitializeCompleted &&
        isStatsigFeatureGatesRefresherEnabled,
    );
  }, [
    isFeatureGateClientInitializeCompleted,
    isStatsigFeatureGatesRefresherEnabled,
  ]);

  useEffect(() => {
    if (!isRefreshOnVisibilityChangeEnabled) {
      return;
    }

    // Only when the page transitions from hidden to visible, refresh the feature gates
    if (isPageVisible && !prevIsPageVisible.current) {
      refresh();
    }

    prevIsPageVisible.current = isPageVisible;
  }, [isPageVisible, isRefreshOnVisibilityChangeEnabled, refresh]);

  useEffect(() => {
    // When the tab is inactive, decrease the polling rate
    if (!isPageVisible) {
      setIntervalInMs(
        BASE_REFRESH_INTERVAL_IN_MS * INACTIVE_REFRESH_POLLING_FACTOR, // 1 hour in prod, 12 min in stg
      );
    } else {
      setIntervalInMs(
        BASE_REFRESH_INTERVAL_IN_MS, // 5 minutes in prod, 60 seconds in stg
      );
    }
  }, [isPageVisible]);

  useEffect(() => {
    clearInterval(intervalId);
    if (!isRefreshEnabled) {
      return;
    }
    intervalId = setInterval(async () => {
      await refresh();
    }, intervalInMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [intervalInMs, isRefreshEnabled, refresh]);
};
