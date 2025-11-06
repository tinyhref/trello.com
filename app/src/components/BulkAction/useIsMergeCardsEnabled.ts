import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsMergeCardsEnabled = () => {
  const { value: isEnabled } = useFeatureGate('phx_merge_cards');

  return isEnabled;
};
