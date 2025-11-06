import type { FunctionComponent } from 'react';

import { TrelloIcon } from '@atlaskit/logo';
import { intl } from '@trello/i18n';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

const TrelloBrandIcon = () => <TrelloIcon size="small" appearance="brand" />;

interface PlannerDiscoveryBadgeProps {
  isPlannerDiscoveryCard: boolean;
}

export const PlannerDiscoveryBadge: FunctionComponent<
  PlannerDiscoveryBadgeProps
> = ({ isPlannerDiscoveryCard }) => {
  if (!isPlannerDiscoveryCard) {
    return null;
  }

  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.card_front.discovery.badge',
        defaultMessage: 'From Trello',
        description: 'Badge indicating how the card was added to Inbox',
      })}
      Icon={TrelloBrandIcon}
      testId={getTestId<BadgesTestIds>('badge-card-planner-discovery')}
    />
  );
};
