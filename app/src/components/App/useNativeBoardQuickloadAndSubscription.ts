import { useMemo } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';

import { isNativeCurrentBoardInfoEnabled } from './isNativeCurrentBoardInfoEnabled';

const defaultGateValue = false;

/**
 * Custom hook to check if the feature gate `'gql_client_subscriptions'`
 * and `'trello_web_native_current_board_info'` are on.
 * @returns true if the feature gate is enabled, false otherwise.
 */
export const useNativeBoardQuickloadAndSubscription = () => {
  const quickloadFlagEnabled = isNativeCurrentBoardInfoEnabled();
  const { value: subscriptionsGateEnabled } = useFeatureGate(
    'gql_client_subscriptions',
  );

  return useMemo(
    () =>
      (quickloadFlagEnabled && subscriptionsGateEnabled) ?? defaultGateValue,
    [quickloadFlagEnabled, subscriptionsGateEnabled],
  );
};
