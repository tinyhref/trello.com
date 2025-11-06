import { useFeatureGate } from '@trello/feature-gate-client';

export const useIsRovoDragAndDropToContextEnabled = () => {
  const { value: isRovoDragAndDropToContextEnabled } = useFeatureGate(
    'phx_drag_and_drop_to_rovo_context',
  );
  return isRovoDragAndDropToContextEnabled;
};
