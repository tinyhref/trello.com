import type { FunctionComponent } from 'react';

import ErrorIcon from '@atlaskit/icon/core/status-error';
import { intl } from '@trello/i18n';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { Badge } from './Badge';

interface MaliciousAttachmentsBadgeProps {
  maliciousAttachments?: number;
}

export const MaliciousAttachmentsBadge: FunctionComponent<
  MaliciousAttachmentsBadgeProps
> = ({ maliciousAttachments }) => {
  if (!maliciousAttachments) {
    return null;
  }

  return (
    <Badge
      title={intl.formatMessage({
        id: 'templates.badge.malicious-attachments',
        defaultMessage: 'Malicious attachments',
        description: 'Displays the number of malicious attachments on a card.',
      })}
      Icon={(props) => (
        <ErrorIcon
          {...props}
          label={intl.formatMessage({
            id: 'templates.badge.malicious-attachments',
            defaultMessage: 'Malicious attachments',
            description:
              'Displays the number of malicious attachments on a card.',
          })}
          color={token('color.icon.danger', '#C9372C')}
          size="small"
        />
      )}
      testId={getTestId<BadgesTestIds>('card-malicious-attachments-count')}
    >
      {maliciousAttachments}
    </Badge>
  );
};
