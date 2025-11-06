import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface SubscribedBadgeProps {
  subscribed?: boolean;
}

export const SubscribedBadge: FunctionComponent<SubscribedBadgeProps> = ({
  subscribed,
}) => {
  if (!subscribed) {
    return null;
  }

  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.watch',
        defaultMessage: 'You are watching this card.',
        description:
          'Badge that indicates that a user is subscribed to a card.',
      })}
      Icon={SubscribeIcon}
      testId={getTestId<BadgesTestIds>('badge-card-subscribed')}
    />
  );
};
