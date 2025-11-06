import cx from 'classnames';
import { useRef, type FunctionComponent } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useCardId } from '@trello/id-context';

import { useCardStickerCountAndLimitFragment } from 'app/src/components/CardCover';
import { CardFrontBadges } from 'app/src/components/CardFrontBadges';
import { CardFrontAttachmentDropTarget } from './CardFrontAttachmentDropTarget';
import { CardFrontCover } from './CardFrontCover';
import { CardFrontExternalLink } from './CardFrontExternalLink';
import { CardFrontLabels } from './CardFrontLabels';
import { CardFrontMembers } from './CardFrontMembers';
import { CardFrontNameWithStatusControl } from './CardFrontNameWithStatusControl';
import { CardFrontPlannerButton } from './CardFrontPlannerButton';
import { useCardAsDropTarget } from './useCardAsDropTarget';
import { usePlannerDiscoveryCardEligibility } from './usePlannerDiscoveryCardEligibility';

import * as styles from './PlannerDiscoveryCard.module.less';

export interface PlannerDiscoveryCardProps {
  name: string;
  url: string;
}

export const PlannerDiscoveryCard: FunctionComponent<
  PlannerDiscoveryCardProps
> = ({ name, url }) => {
  const cardId = useCardId();
  const cardFrontDetailsRef = useRef<HTMLDivElement>(null);
  const plannerDiscoveryEligibility = usePlannerDiscoveryCardEligibility({
    cardId,
  });

  const { data } = useCardStickerCountAndLimitFragment({
    from: { id: cardId },
    optimistic: true,
  });
  const stickerCount = data?.stickers?.length ?? 0;
  const stickerLimit = data?.limits?.stickers?.perCard?.disableAt ?? 70; // default to 70 stickers on a card
  useCardAsDropTarget(stickerCount, stickerLimit, cardFrontDetailsRef);

  const { value: isQuickCaptureExternalLinkEnabled } = useFeatureGate(
    'goo_quick_capture_card_front_external_link',
  );

  return (
    <>
      <CardFrontAttachmentDropTarget />
      <CardFrontCover cardFrontDetailsRef={cardFrontDetailsRef} />
      <div
        className={cx(styles.details, {
          [styles.stickersBackdrop]: stickerCount > 0,
        })}
        ref={cardFrontDetailsRef}
      >
        <div className={styles.cardContent}>
          <CardFrontLabels />
          <CardFrontNameWithStatusControl name={name} url={url} />
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.cardFooterContent}>
            <CardFrontBadges />
            <CardFrontMembers />
            {isQuickCaptureExternalLinkEnabled && <CardFrontExternalLink />}
          </div>
          {plannerDiscoveryEligibility.variation === 'with-cta' && (
            <div className={styles.plannerCta}>
              <CardFrontPlannerButton cardFrontSource="Board" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
