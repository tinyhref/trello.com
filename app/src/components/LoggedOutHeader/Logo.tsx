import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';

import { useAnalyticsAttributes } from './AnalyticsAttributesProvider';
import { LogoTrello } from './LogoTrello';

import * as styles from './Logo.module.less';

interface LogoProps {
  navSize: 'big' | 'small';
  tabIndex?: number;
}

export const Logo: FunctionComponent<LogoProps> = ({ navSize, tabIndex }) => {
  const analyticsAttributes = useAnalyticsAttributes();

  const onClick = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: 'trelloLogoLink',
        source: navSize === 'big' ? 'anonymousHeader' : 'anonymousMobileHeader',
        attributes: {
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'logo',
          label: 'Trello logo',
          href: '/home',
          isMarketingEvent: true,
        },
      }),
    [analyticsAttributes, navSize],
  );

  return (
    <a
      className={styles.logoLink}
      data-testid="logo_link"
      href="/home"
      onClick={onClick}
      rel="noopener"
      target="_blank"
      tabIndex={tabIndex}
    >
      <LogoTrello height={22.5} navSize={navSize} />
    </a>
  );
};
