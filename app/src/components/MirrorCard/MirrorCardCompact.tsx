import { type FunctionComponent } from 'react';

import { useCardId } from '@trello/id-context';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';

import { CardFrontBoardChip } from 'app/src/components/CardFront/CardFrontBoardChip';
import { CardFrontName } from 'app/src/components/CardFront/CardFrontName';
import { CardFrontNameWithStatusControl } from 'app/src/components/CardFront/CardFrontNameWithStatusControl';
import { ArchivedBadge } from 'app/src/components/CardFrontBadges/ArchivedBadge';
import { useMirrorCardFragment } from './MirrorCardFragment.generated';

import * as styles from './MirrorCardCompact.module.less';

interface MirrorCardCompactProps {
  name: string;
  url: string;
  isArchived: boolean;
  isPaid: boolean;
}
export const MirrorCardCompact: FunctionComponent<MirrorCardCompactProps> = ({
  name,
  url,
  isArchived,
  isPaid,
}) => {
  const cardId = useCardId();
  const { data: card } = useMirrorCardFragment({
    from: { id: cardId },
  });

  const isSourceBoardClosed = card?.board.closed ?? false;
  const isSourceListClosed = card?.list.closed ?? false;

  return (
    <div className={styles.details}>
      <CardFrontBoardChip showListName={isPaid} isCompact={true} />
      <div className={styles.cardName}>
        {isPaid ? (
          <CardFrontNameWithStatusControl name={name} url={url} />
        ) : (
          <CardFrontName name={name} url={url} />
        )}
        {!isPaid && (
          <span className={styles.externalLinkIcon}>
            <ExternalLinkIcon />
          </span>
        )}
      </div>
      <ArchivedBadge
        closed={isArchived || isSourceBoardClosed || isSourceListClosed}
      />
    </div>
  );
};
