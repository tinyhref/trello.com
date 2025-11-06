import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsRovoIslandEnabled = () => {
  const { value: isRovoIslandEnabled } = useFeatureGate('phx_rovo_island');
  return isRovoIslandEnabled;
};
