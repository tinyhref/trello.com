import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { CommentIcon } from '@trello/nachos/icons/comment';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface CommentsBadgeProps {
  comments?: number;
  isBoardTemplate?: boolean;
}

export const CommentsBadge: FunctionComponent<CommentsBadgeProps> = ({
  comments,
  isBoardTemplate,
}) => {
  // comments badge shouldn't render on board templates
  if (isBoardTemplate || !comments) {
    return null;
  }
  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.comments',
        defaultMessage: 'Comments',
        description: 'Badge that indicates that a card has comments.',
      })}
      Icon={CommentIcon}
      testId={getTestId<BadgesTestIds>('badge-card-comments')}
    >
      {comments}
    </Badge>
  );
};
