import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useContext, useRef } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';

import { useCardStickerCountAndLimitFragment } from 'app/src/components/CardCover';
import { CardFrontBadges } from 'app/src/components/CardFrontBadges';
import { CardAgingUpdater } from './CardAgingUpdater';
import { CardFrontAttachmentDropTarget } from './CardFrontAttachmentDropTarget';
import { CardFrontBoardChip } from './CardFrontBoardChip';
import { CardFrontBoardHint } from './CardFrontBoardHint';
import { CardFrontContext } from './CardFrontContext';
import { CardFrontCover } from './CardFrontCover';
import { CardFrontExternalLink } from './CardFrontExternalLink';
import { CardFrontLabels } from './CardFrontLabels';
import { CardFrontMembers } from './CardFrontMembers';
import { CardFrontNameWithStatusControl } from './CardFrontNameWithStatusControl';
import { useCardAsDropTarget } from './useCardAsDropTarget';

import * as styles from './TrelloCard.module.less';

export interface TrelloCardProps {
  name: string;
  url: string;
}

export const TrelloCard: FunctionComponent<TrelloCardProps> = ({
  name,
  url,
}) => {
  const boardId = useBoardId();
  const cardId = useCardId();
  const cardFrontDetailsRef = useRef<HTMLDivElement>(null);

  const { data } = useCardStickerCountAndLimitFragment({
    from: { id: cardId },
    optimistic: true,
  });
  const stickerCount = data?.stickers?.length ?? 0;
  const stickerLimit = data?.limits?.stickers?.perCard?.disableAt ?? 70; // default to 70 stickers on a card
  useCardAsDropTarget(stickerCount, stickerLimit, cardFrontDetailsRef);

  const { showBoardInfo } = useContext(CardFrontContext);

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
        {showBoardInfo && (
          <CardFrontBoardChip showListName={false} isCompact={true} />
        )}

        <CardFrontLabels />
        <CardFrontNameWithStatusControl name={name} url={url} />
        <CardFrontBadges />
        <CardFrontMembers />
        {isQuickCaptureExternalLinkEnabled && <CardFrontExternalLink />}
      </div>
      {showBoardInfo && <CardFrontBoardHint boardId={boardId} />}
      <CardAgingUpdater />
    </>
  );
};
