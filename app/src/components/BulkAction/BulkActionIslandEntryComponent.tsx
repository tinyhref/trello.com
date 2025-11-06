import type { FunctionComponent } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';

import { BulkActionIsland } from './BulkActionIsland';
import { BulkActionIslandV2 } from './BulkActionIslandV2';

interface BulkActionIslandEntryComponentProps {
  isVisible?: boolean;
}

export const BulkActionIslandEntryComponent: FunctionComponent<
  BulkActionIslandEntryComponentProps
> = ({ isVisible = false }) => {
  const { value: isBulkActionV2Enabled } = useFeatureGate(
    'phx_bulk_actions_v2',
  );

  if (isBulkActionV2Enabled) {
    return <BulkActionIslandV2 isVisible={isVisible} />;
  }

  return <BulkActionIsland isVisible={isVisible} />;
};
