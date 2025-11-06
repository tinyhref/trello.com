import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

import {
  AnalyticsAttributesProvider,
  useAnalyticsAttributes,
} from './AnalyticsAttributesProvider';
import { PrimaryLink } from './PrimaryLink';
import { SecondaryButton } from './SecondaryButton';

import * as styles from './SmallNavTabPage.module.less';

interface TabPrimaryLinkProps {
  tabIndex?: number;
  text: string;
  url: string;
  primaryLinkAnalyticsName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

const TabPrimaryLink: FunctionComponent<TabPrimaryLinkProps> = ({
  tabIndex,
  text,
  url,
  primaryLinkAnalyticsName,
  analyticsSource,
}) => {
  const analyticsAttributes = useAnalyticsAttributes();

  const onClick = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: primaryLinkAnalyticsName,
        source: analyticsSource,
        attributes: {
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'mobileNavPrimaryLink',
          href: url,
          label: text,
          isMarketingEvent: true,
        },
      }),
    [analyticsAttributes, text, url, primaryLinkAnalyticsName, analyticsSource],
  );

  return (
    <PrimaryLink url={url} text={text} onClick={onClick} tabIndex={tabIndex} />
  );
};

interface TabSecondaryButtonProps {
  tabIndex?: number;
  text: string;
  url: string;
  secondaryButtonAnalyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

const TabSecondaryButton: FunctionComponent<TabSecondaryButtonProps> = ({
  tabIndex,
  text,
  url,
  secondaryButtonAnalyticsLinkName,
  analyticsSource,
}) => {
  const analyticsAttributes = useAnalyticsAttributes();

  const onClick = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: secondaryButtonAnalyticsLinkName,
        source: analyticsSource,
        attributes: {
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'mobileNavSecondaryButton',
          href: url,
          label: text,
          isMarketingEvent: true,
        },
      }),
    [
      analyticsAttributes,
      text,
      url,
      secondaryButtonAnalyticsLinkName,
      analyticsSource,
    ],
  );

  return (
    <SecondaryButton
      url={url}
      text={text}
      onClick={onClick}
      tabIndex={tabIndex}
    />
  );
};

interface SmallNavTabPageProps {
  isActiveTab: boolean;
  isOpen: boolean;
  primaryTitle?: string;
  primaryLinks?: JSX.Element[];
  primaryLinkUrl?: string;
  primaryLinkText?: string;
  primaryBanner?: JSX.Element;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryDescription?: string;
  secondaryTitle?: string;
  parentLabel: string;
  analyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

export const SmallNavTabPage: FunctionComponent<SmallNavTabPageProps> = ({
  isActiveTab,
  isOpen,
  primaryTitle,
  primaryLinks,
  primaryLinkUrl,
  primaryLinkText,
  primaryBanner,
  secondaryButtonText,
  secondaryButtonUrl,
  secondaryDescription,
  secondaryTitle,
  parentLabel,
  analyticsLinkName,
  analyticsSource,
}) => {
  const baseAnalyticsAttributes = useAnalyticsAttributes();

  const analyticsAttributes = useMemo(
    () => ({
      ...baseAnalyticsAttributes,
      parentLabel,
    }),
    [baseAnalyticsAttributes, parentLabel],
  );

  return (
    <div
      className={styles.page}
      aria-hidden={!isOpen || !isActiveTab}
      data-offscreen={isActiveTab ? undefined : 'right'}
    >
      <AnalyticsAttributesProvider value={analyticsAttributes}>
        <div className={styles.tabList}>
          {primaryTitle && <h2>{primaryTitle}</h2>}
          {primaryLinks?.map((primaryLink, linkIndex) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <div className={styles.navLinkContainer} key={linkIndex}>
              {primaryLink}
            </div>
          ))}
          {primaryLinkUrl && primaryLinkText && (
            <TabPrimaryLink
              tabIndex={isActiveTab ? undefined : -1}
              text={primaryLinkText}
              url={primaryLinkUrl}
              primaryLinkAnalyticsName="seeAllTeamsLink"
              analyticsSource={analyticsSource}
            />
          )}
        </div>
        {primaryBanner && primaryBanner}
        <div className={styles.secondary}>
          {secondaryTitle && <h3>{secondaryTitle}</h3>}
          {secondaryDescription && <p>{secondaryDescription}</p>}
          {secondaryButtonText && secondaryButtonUrl && (
            <TabSecondaryButton
              tabIndex={isActiveTab ? undefined : -1}
              text={secondaryButtonText}
              url={secondaryButtonUrl}
              secondaryButtonAnalyticsLinkName={analyticsLinkName}
              analyticsSource={analyticsSource}
            />
          )}
        </div>
      </AnalyticsAttributesProvider>
    </div>
  );
};
