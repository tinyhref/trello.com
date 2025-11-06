import { useMemo, type FunctionComponent } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedState } from '@trello/shared-state';

import { MirrorCardBoardSubscription } from './MirrorCardBoardSubscription';
import { mirrorCardsBySourceBoardState } from './mirrorCardsBySourceBoardState';
import { useGetMirrorCardPaidStatus } from './useGetMirrorCardPaidStatus';

export const MirrorCardSubscriptions: FunctionComponent = () => {
  const hasPremiumMirrorCards = useGetMirrorCardPaidStatus();
  const { value: mirrorCardSubscriptionsEnabled } = useFeatureGate(
    'ghost_use_mirror_card_subscriptions',
  );

  const { value: oneSubscriptionPerCard, loading: oneSubGateLoading } =
    useFeatureGate('ghost_one_subscription_per_mirror');

  const [mirrorCardsBySourceBoard] = useSharedState(
    mirrorCardsBySourceBoardState,
  );
  const cardArisByBoard = useMemo(() => {
    return Object.entries(mirrorCardsBySourceBoard).reduce(
      (acc, [cardId, boardId]) => {
        if (acc[boardId]) {
          acc[boardId].push(cardId);
        } else {
          acc[boardId] = [cardId];
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, [mirrorCardsBySourceBoard]);

  if (
    !hasPremiumMirrorCards ||
    !mirrorCardSubscriptionsEnabled ||
    oneSubGateLoading
  ) {
    return null;
  }

  if (oneSubscriptionPerCard) {
    return Object.entries(cardArisByBoard).map(([boardId, cardIds]) =>
      cardIds.map((cardId) => (
        <MirrorCardBoardSubscription
          key={cardId}
          boardShortLink={boardId}
          cardShortLinks={[cardId]}
        />
      )),
    );
  } else {
    return Object.entries(cardArisByBoard).map(([boardId, cardIds]) => (
      <MirrorCardBoardSubscription
        key={boardId}
        boardShortLink={boardId}
        cardShortLinks={cardIds}
      />
    ));
  }
};
