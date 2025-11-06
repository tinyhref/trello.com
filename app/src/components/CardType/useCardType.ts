import { useContextSelector } from 'use-context-selector';

import {
  hasMaliciousCoverAttachment,
  useAtlassianIntelligenceInProgress,
} from '@trello/business-logic-react/card';
import { hasCover } from '@trello/business-logic/card';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId } from '@trello/id-context';

import { BoardPreferencesContext } from 'app/src/components/BoardPreferencesContext/BoardPreferencesContext';
import { useCardCoverBoardFragment } from 'app/src/components/CardCover';
import { usePlannerDiscoveryCardEligibility } from 'app/src/components/CardFront/usePlannerDiscoveryCardEligibility';
import type { CardType } from './CardType.types';
import { useCardTypeFragment } from './CardTypeFragment.generated';

/**
 * Determines the type of a card, based on given inputs. Types include:
 * - Default card: the default card front, with metadata
 * - Cover card: a full image or color cover that takes up the whole card front
 * - Board card: a board preview
 * - Link card: a name that acts as a clickable URL, or a smart card
 * - Separator card: a horizontal rule
 * - Mirror card: a card that shows info from another card
 */
export const useCardType = (cardId: string): CardType => {
  const boardId = useBoardId();
  const { value: useContextForCardCoverPref } = useFeatureGate(
    'ghost_use_context_for_card_cover_pref',
  );

  const showCardCovers = useContextSelector(
    BoardPreferencesContext,
    (value) => value.showCardCovers,
  );

  const { data: boardPrefs } = useCardCoverBoardFragment({
    from: useContextForCardCoverPref ? null : { id: boardId },
    optimistic: true,
  });

  const { data: card } = useCardTypeFragment({
    from: { id: cardId },
    returnPartialData: true,
    optimistic: true,
  });

  const isAIInProgress = useAtlassianIntelligenceInProgress(card);

  const isCoverAttachmentMalicious = hasMaliciousCoverAttachment(card);

  const plannerDiscoveryEligibility = usePlannerDiscoveryCardEligibility({
    cardId,
  });

  const { cardRole, cover } = card || {};

  if (cardRole) {
    return cardRole;
  }

  if (isAIInProgress) {
    return 'loading';
  }

  const isCardCoversPrefEnabled = useContextForCardCoverPref
    ? showCardCovers
    : (boardPrefs?.prefs?.cardCovers ?? true);
  if (
    hasCover(cover) &&
    cover?.size === 'full' &&
    isCardCoversPrefEnabled &&
    !isCoverAttachmentMalicious
  ) {
    return 'cover';
  }

  // Check if this is a planner discovery card
  if (plannerDiscoveryEligibility.isEligible) {
    return 'planner-discovery';
  }

  return 'default';
};
