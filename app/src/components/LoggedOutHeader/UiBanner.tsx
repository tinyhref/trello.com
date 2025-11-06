import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

import { getIcon } from './icons/getIcon';
import { useAnalyticsAttributes } from './AnalyticsAttributesProvider';

import * as styles from './UiBanner.module.less';

interface UiBannerProps {
  type: string;
  titleHeading: string;
  description: string;
  buttonText: string;
  buttonUrl?: string;
  tabIndex?: number;
  analyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

export const UiBanner: FunctionComponent<UiBannerProps> = ({
  type,
  titleHeading,
  description,
  buttonText,
  buttonUrl,
  tabIndex,
  analyticsLinkName,
  analyticsSource,
}) => {
  const analyticsAttributes = useAnalyticsAttributes();

  const onClick = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: analyticsLinkName,
        source: analyticsSource,
        attributes: {
          eventContainer: type,
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'button',
          label: titleHeading,
          href: buttonUrl,
          isMarketingEvent: true,
        },
      }),
    [
      analyticsAttributes,
      buttonUrl,
      titleHeading,
      type,
      analyticsLinkName,
      analyticsSource,
    ],
  );

  return (
    <div className={styles.banner}>
      <div>
        <div className={styles.bannerTitleContainer}>
          <div className={styles.bannerIcon}>{getIcon('Bolt')}</div>
          <h4 className={styles.bannerTitle}>{titleHeading}</h4>
        </div>
        <p className={styles.bannerDescription}>{description}</p>
      </div>
      <div>
        <div className={styles.linkButton} data-testid="ui-banner-button">
          <a
            href={buttonUrl}
            onClick={onClick}
            rel="noopener"
            tabIndex={tabIndex}
            target="_blank"
          >
            <span>{buttonText}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
