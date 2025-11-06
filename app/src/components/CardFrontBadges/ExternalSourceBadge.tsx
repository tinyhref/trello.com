import type { FunctionComponent } from 'react';

import DeviceMobileIcon from '@atlaskit/icon/core/device-mobile';
import { intl } from '@trello/i18n';
import { EmailIcon } from '@trello/nachos/icons/email';
import type { BadgesTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { MicrosoftTeamsIcon } from 'app/src/components/Planner/EventDetailPopover/ConferencingIcons/MicrosoftTeamsIcon';
import { Badge } from './Badge';
import { LoomBlueColorIcon } from './LoomBlueColorIcon';
import { SlackColorIcon } from './SlackColorIcon';

interface ExternalSourceBadgeProps {
  externalSource?:
    | 'BROWSER_EXTENSION'
    | 'EMAIL'
    | 'LOOM'
    | 'MSTEAMS'
    | 'SIRI'
    | 'SLACK'
    | null;
}

export const ExternalSourceBadge: FunctionComponent<
  ExternalSourceBadgeProps
> = ({ externalSource }) => {
  if (externalSource === 'EMAIL') {
    return (
      <Badge
        title={intl.formatMessage({
          id: 'templates.badge.externalSource.email',
          defaultMessage: 'From email',
          description: 'Badge that indicates external source of card',
        })}
        Icon={EmailIcon}
        testId={getTestId<BadgesTestIds>('badge-external-source')}
      />
    );
  }

  if (externalSource === 'SLACK') {
    return (
      <Badge
        title={intl.formatMessage({
          id: 'templates.badge.externalSource.slack',
          defaultMessage: 'From Slack',
          description: 'Badge that indicates external source of card',
        })}
        Icon={() => <SlackColorIcon />}
        testId={getTestId<BadgesTestIds>('badge-external-source')}
      />
    );
  }

  if (externalSource === 'SIRI') {
    return (
      <Badge
        title={intl.formatMessage({
          id: 'templates.badge.externalSource.siri',
          defaultMessage: 'From Siri',
          description: 'Badge that indicates external source of card',
        })}
        Icon={(props) => (
          <DeviceMobileIcon
            {...props}
            label=""
            size="small"
            color="currentColor"
            testId="DeviceMobileIcon"
          />
        )}
        testId={getTestId<BadgesTestIds>('badge-external-source')}
      />
    );
  }

  if (externalSource === 'MSTEAMS') {
    return (
      <Badge
        title={intl.formatMessage({
          id: 'templates.badge.externalSource.ms-teams',
          defaultMessage: 'From Microsoft Teams',
          description: 'Badge that indicates external source of card',
        })}
        Icon={() => <MicrosoftTeamsIcon />}
        testId={getTestId<BadgesTestIds>('badge-external-source')}
      />
    );
  }

  if (externalSource === 'LOOM') {
    return (
      <Badge
        title={intl.formatMessage({
          id: 'templates.badge.externalSource.loom',
          defaultMessage: 'From Loom',
          description: 'Badge that indicates external source of card',
        })}
        Icon={(props) => (
          <LoomBlueColorIcon {...props} width={20} height={20} />
        )}
        testId={getTestId<BadgesTestIds>('badge-external-source')}
      />
    );
  }

  return null;
};
