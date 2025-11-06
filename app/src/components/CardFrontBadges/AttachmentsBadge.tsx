import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { AttachmentIcon } from '@trello/nachos/icons/attachment';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface AttachmentsBadgeProps {
  attachments?: number;
}

export const AttachmentsBadge: FunctionComponent<AttachmentsBadgeProps> = ({
  attachments,
}) => {
  if (!attachments) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.attachments',
        defaultMessage: 'Attachments',
        description: 'Displays the number of attachments on a card.',
      })}
      Icon={AttachmentIcon}
      testId={getTestId<BadgesTestIds>('card-attachments-count')}
    >
      {attachments}
    </Badge>
  );
};
