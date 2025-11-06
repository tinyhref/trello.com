import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { VoteIcon } from '@trello/nachos/icons/vote';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface VotesBadgeProps {
  votes?: number;
  isTemplate?: boolean;
  viewingMemberVoted?: boolean;
  hideVotes?: boolean;
}

export const VotesBadge: FunctionComponent<VotesBadgeProps> = ({
  votes,
  isTemplate,
  viewingMemberVoted,
  hideVotes,
}) => {
  // votes badges shouldn't render on card templates, or if the hide
  // votes setting for the board is on and the current member hasn't
  // voted for the card
  if (isTemplate || !votes || (hideVotes && !viewingMemberVoted)) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.votes',
        defaultMessage: 'Votes',
        description: 'Badge that indicates that a card has votes.',
      })}
      Icon={VoteIcon}
      color={viewingMemberVoted ? 'blue' : undefined}
      testId={getTestId<BadgesTestIds>('badge-card-votes-count')}
    >
      {!hideVotes && votes}
    </Badge>
  );
};
