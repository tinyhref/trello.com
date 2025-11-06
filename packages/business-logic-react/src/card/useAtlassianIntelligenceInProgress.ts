import { useFeatureGate } from '@trello/feature-gate-client';

import type { AtlassianIntelligenceInProgressFragment } from './AtlassianIntelligenceInProgressFragment.generated';

const LOADING_TIMEOUT_MS = 60 * 1000;

/**
 * Determines if a card is currently being generated/updated by AI
 *
 * @param card - The card data to check
 * @returns boolean indicating if the card is currently loading from AI
 */
export const useAtlassianIntelligenceInProgress = (
  card: AtlassianIntelligenceInProgressFragment | undefined,
): boolean => {
  const { value: isCardLoadingEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  if (!isCardLoadingEnabled || !card) {
    return false;
  }

  const {
    creationMethodError,
    creationMethod,
    badges,
    creationMethodLoadingStartedAt,
  } = card;

  if (
    creationMethodError ||
    creationMethod !== 'ai' ||
    !badges?.lastUpdatedByAi ||
    !creationMethodLoadingStartedAt
  ) {
    return false;
  }

  const loadingStartedAt = new Date(creationMethodLoadingStartedAt).getTime();
  const sixtySecondsAgo = new Date().getTime() - LOADING_TIMEOUT_MS;

  return loadingStartedAt >= sixtySecondsAgo;
};
