import type { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ArchiveIcon } from '@trello/nachos/icons/archive';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface ArchivedBadgeProps {
  closed?: boolean;
}

export const ArchivedBadge: FunctionComponent<ArchivedBadgeProps> = ({
  closed,
}) => {
  const intl = useIntl();

  if (!closed) {
    return null;
  }

  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.archivedtitle',
        defaultMessage: 'This card is archived.',
        description:
          'Tooltip text that indicates that a card has been archived.',
      })}
      Icon={ArchiveIcon}
      testId={getTestId<BadgesTestIds>('badge-card-archived')}
    >
      <FormattedMessage
        id="templates.badge.archivedtext"
        defaultMessage="Archived"
        description="Badge that indicates that a card has been archived."
      />
    </Badge>
  );
};
