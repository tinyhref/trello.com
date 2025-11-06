import {
  TRELLO_HAS_USED_PAID_PLANNER_ACTIONS_CHANGED,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useFeatureGate } from '@trello/feature-gate-client';

import { PLANNER_FEATURE_DISCOVERY_MESSAGE_ID } from './EventPreview/InPlaceMessageEventPreview';

export const useIsEligibleForPlannerFeaturesDiscovery = () => {
  const { value: hasUsedPaidPlannerActions } = useUserTrait(
    TRELLO_HAS_USED_PAID_PLANNER_ACTIONS_CHANGED,
  );

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const { value: isPlannerFeatureDiscoveryUiEnabled } = useFeatureGate(
    'ghost_planner_feature_discovery_ui',
  );

  return Boolean(
    isPlannerFeatureDiscoveryUiEnabled &&
      !hasUsedPaidPlannerActions &&
      !isOneTimeMessageDismissed(PLANNER_FEATURE_DISCOVERY_MESSAGE_ID),
  );
};
