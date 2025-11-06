import type { FunctionComponent } from 'react';

import NotificationIcon from '@atlaskit/icon/core/notification';
import { intl } from '@trello/i18n';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface NotificationsBadgeProps {
  unreadNotifications?: number;
}

export const NotificationsBadge: FunctionComponent<NotificationsBadgeProps> = ({
  unreadNotifications,
}) => {
  if (!unreadNotifications) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.notifications',
        defaultMessage: 'Unread notifications',
        description:
          'Badge that indicates that a card has unread notifications.',
      })}
      Icon={(props) => (
        <NotificationIcon
          {...props}
          label=""
          color="currentColor"
          size="small"
        />
      )}
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      color={'red'}
      isBold={true}
      testId={getTestId<BadgesTestIds>('badge-card-notifications-count')}
    >
      {unreadNotifications}
    </Badge>
  );
};
