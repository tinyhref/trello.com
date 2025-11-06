import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { DescriptionIcon } from '@trello/nachos/icons/description';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface DescriptionBadgeProps {
  description?: boolean;
}

export const DescriptionBadge: FunctionComponent<DescriptionBadgeProps> = ({
  description,
}) => {
  if (!description) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.description',
        defaultMessage: 'This card has a description.',
        description: 'Badge that indicates that a card has a description.',
      })}
      Icon={DescriptionIcon}
      testId={getTestId<BadgesTestIds>('badge-card-description')}
    />
  );
};
