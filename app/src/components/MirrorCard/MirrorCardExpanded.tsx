import type { FunctionComponent } from 'react';

import { useCardId } from '@trello/id-context';

import { CardFrontBoardChip } from 'app/src/components/CardFront/CardFrontBoardChip';
import { CardFrontCover } from 'app/src/components/CardFront/CardFrontCover';
import { CardFrontLabels } from 'app/src/components/CardFront/CardFrontLabels';
import { CardFrontNameWithStatusControl } from 'app/src/components/CardFront/CardFrontNameWithStatusControl';
import { CardFrontBadges } from 'app/src/components/CardFrontBadges';
import { ArchivedBadge } from 'app/src/components/CardFrontBadges/ArchivedBadge';
import { useMirrorCardFragment } from './MirrorCardFragment.generated';
import { MirrorCardMembers } from './MirrorCardMembers';

import * as styles from './MirrorCardExpanded.module.less';

export interface MirrorCardExpandedProps {
  name: string;
  url: string;
  isArchived: boolean;
}
export const MirrorCardExpanded: FunctionComponent<MirrorCardExpandedProps> = ({
  name,
  url,
  isArchived,
}) => {
  const cardId = useCardId();
  const { data: card } = useMirrorCardFragment({
    from: { id: cardId },
  });

  const isSourceBoardClosed = card?.board.closed ?? false;
  const isSourceListClosed = card?.list.closed ?? false;

  return (
    <>
      <CardFrontCover />
      <div className={styles.details}>
        <CardFrontBoardChip showListName={true} isCompact={false} />
        <CardFrontLabels />
        <CardFrontNameWithStatusControl name={name} url={url} />
        <CardFrontBadges />
        <MirrorCardMembers />
        {/* This archive badge will only be displayed when the source card list is archived or the source board is archived.
        The case of the card being archived is handled in the CardFrontBadges component above. */}
        {!isArchived && (isSourceBoardClosed || isSourceListClosed) && (
          <ArchivedBadge closed={true} />
        )}
      </div>
    </>
  );
};
