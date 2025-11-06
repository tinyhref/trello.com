import { useMemo } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';

export interface PlannerFeatureGates {
  isZenModeEnabled: boolean;
  isAutoUpdatingDateEnabled: boolean;
  isCalendarFilteringEnabled: boolean;
  isSingleCardEventEnabled: boolean;
  isUseLoginHintEnabled: boolean;
  isMultiAccountM2Enabled: boolean;
  isInPlaceMessageEventPreviewEnabled: boolean;
  isClientSideAllDayTransformEnabled: boolean;
  isPlannerPrivacyEnabled: boolean;
}

/**
 * Hook to determine access to various planner features.
 *
 * @returns {PlannerFeatureGates} An object containing boolean flags for different planner features
 */
export function usePlannerFeatureGate(): PlannerFeatureGates {
  const { value: useLoginHint } = useFeatureGate(
    'trello_electric_use_login_hint',
  );
  const { value: autoUpdatingDateGate } = useFeatureGate(
    'xf_planner_auto_updating_date',
  );
  const { value: singleCardEventGate } = useFeatureGate(
    'xf_planner_single_card_event',
  );
  const { value: zenModeGate } = useFeatureGate('phx_zen_mode');
  const { value: isMultiAccountM2Enabled } = useFeatureGate(
    'electric_planner_multi_account_m2',
  );
  const { value: isInPlaceMessageEventPreviewEnabled } = useFeatureGate(
    'ghost_is_in_place_message_event_preview_enabled',
  );
  const { value: isClientSideAllDayTransformEnabled } = useFeatureGate(
    'electric_client_side_all_day_transform',
  );
  const { value: isCalendarFilteringEnabled } = useFeatureGate(
    'electric_calendar_filtering',
  );
  const { value: isPlannerPrivacyEnabled } = useFeatureGate(
    'billplat_planner_privacy',
  );

  return useMemo(
    () => ({
      isZenModeEnabled: zenModeGate,
      isSingleCardEventEnabled: singleCardEventGate,
      isAutoUpdatingDateEnabled: autoUpdatingDateGate,
      isUseLoginHintEnabled: useLoginHint,
      isCalendarFilteringEnabled,
      isMultiAccountM2Enabled,
      isInPlaceMessageEventPreviewEnabled,
      isClientSideAllDayTransformEnabled,
      isPlannerPrivacyEnabled,
    }),
    [
      zenModeGate,
      singleCardEventGate,
      autoUpdatingDateGate,
      useLoginHint,
      isCalendarFilteringEnabled,
      isMultiAccountM2Enabled,
      isInPlaceMessageEventPreviewEnabled,
      isClientSideAllDayTransformEnabled,
      isPlannerPrivacyEnabled,
    ],
  );
}
