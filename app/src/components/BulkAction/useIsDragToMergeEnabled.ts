import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsDragToMergeEnabled = () => {
  const { value: isEnabled } = useFeatureGate('phx_drag_to_merge');

  return isEnabled;
};
