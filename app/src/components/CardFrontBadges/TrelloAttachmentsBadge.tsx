import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { BoardIcon } from '@trello/nachos/icons/board';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface TrelloAttachmentsBadgeProps {
  attachments?: number;
}

export const TrelloAttachmentsBadge: FunctionComponent<
  TrelloAttachmentsBadgeProps
> = ({ attachments }) => {
  if (!attachments) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.trelloattachments',
        defaultMessage: 'Trello attachments',
        description: 'Badge that indicates that a card has Trello attachments.',
      })}
      Icon={BoardIcon}
      testId={getTestId<BadgesTestIds>('badge-card-trello-attachments-count')}
    >
      {attachments}
    </Badge>
  );
};
