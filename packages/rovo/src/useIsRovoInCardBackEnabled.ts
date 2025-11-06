import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsRovoInCardBackEnabled = () => {
  const { value: isRovoInCardBackEnabled } =
    useFeatureGate('phx_rovo_card_back');
  return isRovoInCardBackEnabled;
};
