import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { LocationIcon } from '@trello/nachos/icons/location';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useIsLocationEnabled } from 'app/src/components/CardBackLocation/useIsLocationEnabled';
import { Badge } from './Badge';

interface LocationBadgeProps {
  location?: boolean;
}

export const LocationBadge: FunctionComponent<LocationBadgeProps> = ({
  location,
}) => {
  const isLocationEnabled = useIsLocationEnabled();

  if (!location || !isLocationEnabled) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.location',
        defaultMessage: 'This card has a location.',
        description: 'Badge that indicates that a card has a location.',
      })}
      Icon={LocationIcon}
      testId={getTestId<BadgesTestIds>('badge-card-location')}
    />
  );
};
