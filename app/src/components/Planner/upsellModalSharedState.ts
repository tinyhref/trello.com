import type { FlagId } from '@trello/analytics-types';
import { SharedState } from '@trello/shared-state';

interface UpsellModalSharedState {
  /**
   * Whether the upsell modal should be visible.
   * @default false
   */
  showUpsellModal: boolean;

  /**
   * The flag ID associated with the upsell action, if any.
   * @default undefined
   */
  flagId?: FlagId;
}

/**
 * Shared state for managing the upsell modal visibility and associated flag ID
 * across Planner components.
 */
export const upsellModalSharedState = new SharedState<UpsellModalSharedState>({
  showUpsellModal: false,
  flagId: undefined,
});
