import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsSmartScheduleM2Enabled = () => {
  const { value: isSmartScheduleM2Enabled } = useFeatureGate(
    'phx_smart_schedule_m2',
  );
  return isSmartScheduleM2Enabled;
};
