import type {
  Dispatch,
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  RefObject,
  SetStateAction,
} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import type { HeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { ChevronDown } from './icons/ChevronDown';
import { useAnalyticsAttributes } from './AnalyticsAttributesProvider';
import type { TabIdValue } from './TabId';
import { TabId } from './TabId';

import * as styles from './Tabs.module.less';

interface TabLinkProps {
  href?: string;
  index: TabIdValue;
  label?: string;
  analyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

const TabLink: FunctionComponent<TabLinkProps> = ({
  href,
  label,
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
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'globalNavLink',
          label,
          href,
          isMarketingEvent: true,
        },
      }),
    [analyticsAttributes, href, label, analyticsLinkName, analyticsSource],
  );

  return (
    <a className={styles.tabLink} href={href} onClick={onClick}>
      {label}
    </a>
  );
};

interface TabButtonProps {
  activeTabRef: RefObject<HTMLButtonElement>;
  index: TabIdValue;
  isActive: boolean;
  setActiveTab: Dispatch<SetStateAction<number | undefined>>;
  title: string;
}

const TabButton: FunctionComponent<TabButtonProps> = ({
  activeTabRef,
  index,
  isActive,
  setActiveTab,
  title,
}) => {
  const analyticsAttributes = useAnalyticsAttributes();

  const onClickButton = useCallback(
    (e: ReactMouseEvent) => {
      if (isActive) {
        setActiveTab(undefined);
      } else {
        const indexList: Array<ActionSubjectIdType> = [
          'featuresButton',
          'solutionsButton',
          'plansButton',
          'pricingLink',
          'resourcesButton',
        ];
        Analytics.sendClickedButtonEvent({
          buttonName: indexList[index],
          source: 'anonymousHeader',
          attributes: {
            ...analyticsAttributes,
            event: 'clicked',
            eventComponent: 'globalNavTab',
            label: title,
            isMarketingEvent: true,
          },
        });
        setActiveTab(index);
      }
      e.stopPropagation();
    },
    [analyticsAttributes, index, isActive, setActiveTab, title],
  );

  return (
    <Button
      appearance="subtle"
      iconAfter={<ChevronDown />}
      aria-expanded={isActive}
      className={styles.tabButton}
      data-active={isActive}
      data-testid={getTestId<HeaderTestIds>('logged-out-header-wide-tab')}
      onClick={onClickButton}
      ref={isActive ? activeTabRef : null}
    >
      {title}
    </Button>
  );
};

interface TabsProps {
  activeTab?: number;
  setActiveTab: Dispatch<SetStateAction<number | undefined>>;
}

export const Tabs: FunctionComponent<TabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [activeTabStyle, setActiveTabStyle] = useState<{
    left?: number;
    width: number;
  }>({ width: 0 });

  useEffect(() => {
    if (activeTabRef.current) {
      setActiveTabStyle({
        left: activeTabRef.current.offsetLeft + 14,
        width: activeTabRef.current.clientWidth - 28,
      });
    } else if (activeTabStyle?.left) {
      setActiveTabStyle({
        left: activeTabStyle.left,
        width: 0,
      });
      const timeoutId = setTimeout(() => {
        setActiveTabStyle({ width: 0 });
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    // While activeTab isn't referenced in the effect, it is a valid value
    // to trigger a re-run of it. The ref essentially shadows & is controlled
    // by activeTab, but refs don’t work as hook dependencies, so disabling the rule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeTabRef]);

  return (
    <div className={styles.tabGroup}>
      <TabButton
        activeTabRef={activeTabRef}
        index={TabId.Features}
        isActive={activeTab === TabId.Features}
        setActiveTab={setActiveTab}
        title={intl.formatMessage({
          id: 'templates.logged_out_header.features-tab-label',
          defaultMessage: 'Features',
          description: 'Label for the Features tab in logged-out header.',
        })}
      />
      <TabButton
        activeTabRef={activeTabRef}
        index={TabId.Solutions}
        isActive={activeTab === TabId.Solutions}
        setActiveTab={setActiveTab}
        title={intl.formatMessage({
          id: 'templates.logged_out_header.solutions-tab-label',
          defaultMessage: 'Solutions',
          description: 'Label for solutions tab in logged-out header section.',
        })}
      />
      <TabButton
        activeTabRef={activeTabRef}
        index={TabId.Plans}
        isActive={activeTab === TabId.Plans}
        setActiveTab={setActiveTab}
        title={intl.formatMessage({
          id: 'templates.logged_out_header.plans-tab-label',
          defaultMessage: 'Plans',
          description: 'Label for the Plans tab in logged-out header.',
        })}
      />
      <TabLink
        href="/pricing"
        index={TabId.Pricing}
        label={intl.formatMessage({
          id: 'templates.logged_out_header.pricing-tab-label',
          defaultMessage: 'Pricing',
          description: 'Label for the pricing tab in logged-out header.',
        })}
        analyticsLinkName="pricingLink"
        analyticsSource="anonymousHeader"
      />
      <TabButton
        activeTabRef={activeTabRef}
        index={TabId.Resources}
        isActive={activeTab === TabId.Resources}
        setActiveTab={setActiveTab}
        title={intl.formatMessage({
          id: 'templates.logged_out_header.resources-tab-label',
          defaultMessage: 'Resources',
          description: 'Label for the Resources tab in logged-out header.',
        })}
      />
      <div className={styles.underline} style={activeTabStyle} />
    </div>
  );
};
