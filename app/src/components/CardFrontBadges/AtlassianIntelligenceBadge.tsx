import type { FunctionComponent } from 'react';

import { intl } from '@trello/i18n';
import { InformationIcon } from '@trello/nachos/icons/information';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { Badge } from './Badge';

interface AtlassianIntelligenceBadgeProps {
  lastUpdatedByAi?: boolean;
  externalSource?:
    | 'BROWSER_EXTENSION'
    | 'EMAIL'
    | 'MSTEAMS'
    | 'SIRI'
    | 'SLACK'
    | null;
}

export const AtlassianIntelligenceBadge: FunctionComponent<
  AtlassianIntelligenceBadgeProps
> = ({ lastUpdatedByAi, externalSource }) => {
  // Quick capture cards created via Siri do not go through AI
  // so we can safely assume that these cards won't have the AI Badge
  if (!lastUpdatedByAi || externalSource === 'SIRI') {
    return null;
  }

  let tooltipText;
  switch (externalSource) {
    case 'EMAIL': {
      tooltipText = intl.formatMessage({
        id: 'templates.badge.ai.email',
        defaultMessage: 'This card was created from an email by AI',
        description:
          "Badge that indicates that the card's current content was created by AI from an email.",
      });
      break;
    }
    case 'SLACK': {
      tooltipText = intl.formatMessage({
        id: 'templates.badge.ai.slack',
        defaultMessage: 'This card was created from a Slack message by AI',
        description:
          "Badge that indicates that the card's current content was created by AI from a Slack message.",
      });
      break;
    }
    case 'MSTEAMS': {
      tooltipText = intl.formatMessage({
        id: 'templates.badge.ai.ms-teams',
        defaultMessage:
          'This card was created from a Microsoft Teams message by AI',
        description:
          "Badge that indicates that the card's current content was created by AI from a Microsoft Teams message.",
      });
      break;
    }
    case 'BROWSER_EXTENSION': {
      tooltipText = intl.formatMessage({
        id: 'templates.badge.ai.browser-extension',
        defaultMessage: 'This card was created from a webpage using AI',
        description:
          "Badge that indicates that the card's current content was created by AI from a webpage.",
      });
      break;
    }
    default:
      tooltipText = '';
  }
  return (
    <Badge
      title={tooltipText}
      Icon={InformationIcon}
      testId={getTestId<BadgesTestIds>('badge-atlassian-intelligence')}
    />
  );
};
