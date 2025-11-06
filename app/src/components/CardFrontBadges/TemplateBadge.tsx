import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { TemplateCardIcon } from '@trello/nachos/icons/template-card';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface TemplateBadgeProps {
  isTemplate?: boolean;
}

export const TemplateBadge: FunctionComponent<TemplateBadgeProps> = ({
  isTemplate,
}) => {
  if (!isTemplate) {
    return null;
  }
  return (
    <Badge
      Icon={TemplateCardIcon}
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      color={'blue'}
      testId={getTestId<BadgesTestIds>('badge-card-template')}
    >
      {intl.formatMessage({
        id: 'templates.badge.template',
        defaultMessage: 'This card is a template.',
        description: 'Badge that indicates that this card is a template.',
      })}
    </Badge>
  );
};
