import type { CardFrontTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import type { CardType } from 'app/src/components/CardType';

const CARD_TYPE_TO_TEST_ID: Record<CardType, CardFrontTestIds> = {
  board: 'board-card',
  cover: 'full-cover-card',
  default: 'trello-card',
  loading: 'loading-card',
  link: 'link-card',
  mirror: 'mirror-card',
  'planner-discovery': 'planner-discovery-card',
  separator: 'separator-card',
};

export const getCardFrontTestIdForCardType = (
  cardType: CardType,
  isMinimal = false,
) => {
  const testId = isMinimal ? 'minimal-card' : CARD_TYPE_TO_TEST_ID[cardType];
  return getTestId<CardFrontTestIds>(testId);
};
