import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FocusLock from 'react-focus-lock';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

import {
  AnalyticsAttributesProvider,
  useAnalyticsAttributes,
} from './AnalyticsAttributesProvider';
import { PrimaryLink } from './PrimaryLink';
import { SecondaryButton } from './SecondaryButton';

import * as styles from './TabDetail.module.less';

interface TabDetailProps {
  active: boolean;
  primaryBanner?: JSX.Element;
  primaryLinkText?: string;
  primaryLinkUrl?: string;
  primaryLinks?: JSX.Element[];
  primaryTitle?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryDescription?: string;
  secondaryLinks?: JSX.Element[];
  secondaryTitle?: string;
  parentLabel: string;
  primaryLinkAnalyticsName?: ActionSubjectIdType;
  secondaryButtonAnalyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

export const TabDetail: FunctionComponent<TabDetailProps> = ({
  active,
  primaryBanner,
  primaryLinkText,
  primaryLinkUrl,
  primaryLinks,
  primaryTitle,
  secondaryButtonText,
  secondaryButtonUrl,
  secondaryDescription,
  secondaryLinks,
  secondaryTitle,
  parentLabel,
  primaryLinkAnalyticsName,
  secondaryButtonAnalyticsLinkName,
  analyticsSource,
}) => {
  const analyticsAttributes = useAnalyticsAttributes();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(active ? 1 : 0);
  }, [active]);

  const tabAttributes = useMemo(
    () => ({
      ...analyticsAttributes,
      parentLabel,
    }),
    [analyticsAttributes, parentLabel],
  );

  const onClickPrimaryLink = useCallback(
    () =>
      primaryLinkAnalyticsName &&
      Analytics.sendClickedLinkEvent({
        linkName: primaryLinkAnalyticsName,
        source: analyticsSource,
        attributes: {
          ...tabAttributes,
          event: 'clicked',
          eventComponent: 'globalNavPrimaryLink',
          label: primaryLinkText,
          href: primaryLinkUrl,
          isMarketingEvent: true,
        },
      }),
    [
      primaryLinkText,
      primaryLinkUrl,
      tabAttributes,
      primaryLinkAnalyticsName,
      analyticsSource,
    ],
  );

  const onClickSecondaryButton = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: secondaryButtonAnalyticsLinkName,
        source: analyticsSource,
        attributes: {
          ...tabAttributes,
          event: 'clicked',
          eventComponent: 'globalNavSecondaryButton',
          label: secondaryButtonText,
          href: secondaryButtonUrl,
          isMarketingEvent: true,
        },
      }),
    [
      secondaryButtonText,
      secondaryButtonUrl,
      tabAttributes,
      secondaryButtonAnalyticsLinkName,
      analyticsSource,
    ],
  );

  return (
    <FocusLock autoFocus={true} returnFocus={true}>
      <AnalyticsAttributesProvider value={tabAttributes}>
        <div className={active ? styles.detailVisible : styles.detailHidden}>
          <div className={styles.detail}>
            <div className={styles.detailPrimary}>
              <div className={styles.detailInner} style={{ opacity }}>
                {primaryTitle && <h3>{primaryTitle}</h3>}
                {primaryLinks && (
                  <nav
                    className={styles.detailPrimaryLinks}
                    aria-label={parentLabel}
                  >
                    {primaryLinks.map((primaryLink) => primaryLink)}
                  </nav>
                )}
                {primaryBanner && primaryBanner}
                {primaryLinkText && primaryLinkUrl && (
                  <PrimaryLink
                    url={primaryLinkUrl}
                    text={primaryLinkText}
                    onClick={onClickPrimaryLink}
                  />
                )}
              </div>
            </div>
            <div className={styles.detailSecondary}>
              <div className={styles.detailInner} style={{ opacity }}>
                {secondaryTitle && <h3>{secondaryTitle}</h3>}
                {secondaryDescription && !secondaryLinks && (
                  <p>{secondaryDescription}</p>
                )}
                {secondaryLinks && (
                  <div className={styles.detailSecondaryLinks}>
                    {secondaryLinks.map((secondaryLink) => secondaryLink)}
                  </div>
                )}
                {secondaryButtonText && secondaryButtonUrl && (
                  <SecondaryButton
                    url={secondaryButtonUrl}
                    text={secondaryButtonText}
                    onClick={onClickSecondaryButton}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </AnalyticsAttributesProvider>
    </FocusLock>
  );
};
