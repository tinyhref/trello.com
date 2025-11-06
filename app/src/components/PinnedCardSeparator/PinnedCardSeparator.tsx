import { useFeatureGate } from '@trello/feature-gate-client';
import { getTestId, type ListTestIds } from '@trello/test-ids';

import type { ListCard } from 'app/src/components/BoardListsContext/BoardListsContext';

import * as styles from './PinnedCardSeparator.module.less';

type PinnedCardSeparatorProps = {
  listCards: ListCard[];
  currentCard: ListCard;
  index: number;
  filtered: boolean;
};

export const PinnedCardSeparator = ({
  listCards,
  currentCard,
  index,
  filtered,
}: PinnedCardSeparatorProps) => {
  const { value: isPinnedCardsEnabled } = useFeatureGate(
    'trello_web_pinned_cards',
  );
  if (!isPinnedCardsEnabled) {
    return null;
  }
  // If the current card is not pinned, don't render a divider
  if (!currentCard.pinned) {
    return null;
  }
  // if the card is invisible due to filtering, don't render a divider
  if (!filtered) {
    return null;
  }

  // If the current card is the last pinned card, don't render a divider
  if (index + 1 >= listCards.length) {
    return null;
  }

  // If the next card is pinned, don't render a divider
  if (listCards[index + 1].pinned) {
    return null;
  }

  return (
    <div
      className={styles.pinnedCardDivider}
      data-testid={getTestId<ListTestIds>('list-pinned-card-divider')}
    />
  );
};
