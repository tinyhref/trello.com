import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsSmartScheduleM1Enabled = () => {
  const { value: isSmartScheduleM1Enabled } = useFeatureGate(
    'phx_smart_schedule_m1',
  );
  return isSmartScheduleM1Enabled;
};
