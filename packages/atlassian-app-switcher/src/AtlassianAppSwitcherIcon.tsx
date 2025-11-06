import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';

import NewApplicationSwitcherIcon from '@atlaskit/icon/core/app-switcher';
import { useFeatureGate } from '@trello/feature-gate-client';
import { ApplicationSwitcherIcon } from '@trello/nachos/icons/application-switcher';

interface Props {
  dangerous_className?: string;
}

export const AtlassianAppSwitcherIcon: FunctionComponent<Props> = ({
  dangerous_className,
}) => {
  const intl = useIntl();
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  if (!isSplitScreenEnabled) {
    return (
      <ApplicationSwitcherIcon
        color="currentColor"
        label={intl.formatMessage({
          id: 'templates.cross_flow.switch to',
          defaultMessage: 'Switch to…',
          description: 'Aria label for the Atlassian App Switcher button',
        })}
        size="medium"
        dangerous_className={dangerous_className}
      />
    );
  }

  return (
    <span className={dangerous_className}>
      <NewApplicationSwitcherIcon
        color="currentColor"
        label={intl.formatMessage({
          id: 'templates.cross_flow.switch to',
          defaultMessage: 'Switch to…',
          description: 'Aria label for the Atlassian App Switcher button',
        })}
        spacing="spacious"
        testId="NewApplicationSwitcherIcon"
      />
    </span>
  );
};
