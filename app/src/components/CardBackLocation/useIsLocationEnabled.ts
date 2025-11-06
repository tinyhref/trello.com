import { mapPowerUpId } from '@trello/config';
import {
  PremiumFeatures,
  useBoardHasPremiumFeature,
} from '@trello/entitlements';
import { useBoardId } from '@trello/id-context';

import { useIsPluginEnabled } from 'app/src/components/BoardPluginsContext';

/**
 * Determine whether the location feature is enabled.
 *
 * Location was originally part of the Map Power-Up, which was sunset in favor
 * of the Map View. We still support legacy boards that have the Power-Up from
 * before it was sunset, so we need to check for both.
 */
export const useIsLocationEnabled = (): boolean => {
  const boardId = useBoardId();
  const isViewsEnabled = useBoardHasPremiumFeature(
    boardId,
    PremiumFeatures.views,
  );
  const isMapPluginEnabled = useIsPluginEnabled(mapPowerUpId);

  return isViewsEnabled || isMapPluginEnabled;
};
