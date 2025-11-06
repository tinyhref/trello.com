import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useCallbackRef } from '@trello/dom-hooks';
import { intl } from '@trello/i18n';
import {
  ELEVATION_ATTR,
  getHighestVisibleElevation,
  useClickOutsideHandler,
} from '@trello/layer-manager';
import type { HeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { AnalyticsAttributesProvider } from './AnalyticsAttributesProvider';
import { Buttons } from './Buttons';
import { DesktopPlaceholder } from './DesktopPlaceholder';
import { Logo } from './Logo';
import { TabDetail } from './TabDetail';
import { TabId } from './TabId';
import { Tabs } from './Tabs';
import { UiBanner } from './UiBanner';
import { UiNavLink } from './UiNavLink';

import * as styles from './BigNav.module.less';

const analyticsAttributes = { eventContainer: 'globalNav' };

interface BigNavProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const BigNav: FunctionComponent<BigNavProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  const [activeTab, setActiveTab] = useState<number | undefined>();
  const hasActiveTab = activeTab !== undefined;

  function escPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setActiveTab(undefined);
    }
  }

  useEffect(() => {
    if (activeTab !== undefined) {
      window.addEventListener('keydown', escPress);
      document.body.classList.add('prevent-scroll');
    }
    return () => {
      window.removeEventListener('keydown', escPress);
      document.body.classList.remove('prevent-scroll');
    };
  }, [activeTab]);

  useEffect(() => {
    const indexedLibrary = new Map();
    indexedLibrary.set(0, 'anonymousHeaderFeaturesInlineDialog');
    indexedLibrary.set(1, 'anonymousHeaderSolutionsInlineDialog');
    indexedLibrary.set(2, 'anonymousHeaderPlansInlineDialog');
    indexedLibrary.set(4, 'anonymousHeaderResourcesInlineDialog');
    if (indexedLibrary.get(activeTab)) {
      Analytics.sendScreenEvent({
        name: indexedLibrary.get(activeTab),
      });
    }
  }, [activeTab]);

  // close tab detail when clicks occur outside of it
  const [headerContentsElement, headerContentsRef] =
    useCallbackRef<HTMLDivElement>();

  const elevationAttribute = useMemo(
    () =>
      hasActiveTab
        ? { [ELEVATION_ATTR]: getHighestVisibleElevation() + 1 }
        : {},
    [hasActiveTab],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }
      setActiveTab(undefined);
    },
    [setActiveTab],
  );

  useClickOutsideHandler({
    element: headerContentsElement,
    handleClickOutside,
    skip: !hasActiveTab,
  });

  return (
    <AnalyticsAttributesProvider value={analyticsAttributes}>
      <header
        className={classNames(styles.header, styles.noPrint)}
        data-open={activeTab !== undefined}
        data-testid={getTestId<HeaderTestIds>('logged-out-header-wide')}
      >
        <div
          className={styles.innerHeader}
          ref={headerContentsRef}
          {...elevationAttribute}
        >
          <div
            className={styles.navBar}
            data-testid={getTestId<HeaderTestIds>(
              'logged-out-header-wide-tabs',
            )}
          >
            <Logo navSize="big" />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <Buttons
              onLoginClick={onLoginClick}
              onSignupClick={onSignupClick}
            />
            <DesktopPlaceholder />
          </div>
          <div className={styles.detailWrapper}>
            {activeTab === TabId.Features && (
              <TabDetail
                active={activeTab === TabId.Features}
                primaryLinks={[
                  <UiNavLink
                    key={`${TabId.Features}-0`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-views',
                      defaultMessage: 'Views',
                      description: 'Title for the views tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-views',
                      defaultMessage:
                        "View your team's projects from every angle.",
                      description: 'Description for the views tab',
                    })}
                    icon="New"
                    url="/views"
                    analyticsLinkName="viewsLink"
                    analyticsSource="anonymousHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Features}-1`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-automation',
                      defaultMessage: 'Automation',
                      description: 'Title for the automation tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-automation',
                      defaultMessage:
                        'Automate tasks and workflows with automation.',
                      description: 'Description for the automation tab',
                    })}
                    icon="ButlerAutomationHead"
                    url="/butler-automation"
                    analyticsLinkName="automationLink"
                    analyticsSource="anonymousHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Features}-2`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-power-ups',
                      defaultMessage: 'Power-Ups',
                      description: 'Title for the power-ups tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-power-ups',
                      defaultMessage:
                        'Power up your teams by linking their favorite tools with Trello plugins.',
                      description: 'Description for the power-ups tab',
                    })}
                    icon="RocketInclined"
                    url="/power-ups"
                    analyticsLinkName="powerupsLink"
                    analyticsSource="anonymousHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Features}-3`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-templates',
                      defaultMessage: 'Templates',
                      description: 'Title for the templates tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-templates',
                      defaultMessage:
                        'Give your team a blueprint for success with easy-to-use templates from industry leaders and the Trello community.',
                      description: 'Description for the templates tab',
                    })}
                    icon="TrelloCardTemplates"
                    url="/templates"
                    analyticsLinkName="templatesLink"
                    analyticsSource="anonymousHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Features}-4`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-integrations',
                      defaultMessage: 'Integrations',
                      description: 'Title for the integrations tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-integrations',
                      defaultMessage:
                        'Find the apps your team is already using or discover new ways to get work done in Trello.',
                      description: 'Description for the integrations tab',
                    })}
                    icon="TrelloIntegrations"
                    url="/integrations"
                    analyticsLinkName="integrationsLink"
                    analyticsSource="anonymousHeaderFeaturesInlineDialog"
                  />,
                ]}
                primaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-heading',
                  defaultMessage:
                    'Explore the features that help your team succeed',
                  description: 'Heading for the features tab',
                })}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-secondary-button-text',
                  defaultMessage: 'Check out Trello',
                  description:
                    'Text for the secondary button on the features tab',
                })}
                secondaryButtonUrl="/tour"
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-secondary-description',
                  defaultMessage:
                    "Trello makes it easy for your team to get work done. No matter the project, workflow, or type of team, Trello can help keep things organized. It's simple - sign-up, create a board, and you're off! Productivity awaits.",
                  description:
                    'Description for the secondary button on the features tab',
                })}
                secondaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-secondary-heading',
                  defaultMessage: 'Meet Trello',
                  description:
                    'Heading for the secondary button on the features tab',
                })}
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-label',
                  defaultMessage: 'Features',
                  description: 'Label for the features tab',
                })}
                secondaryButtonAnalyticsLinkName="checkOutTrelloLink"
                analyticsSource="anonymousHeaderFeaturesInlineDialog"
              />
            )}
            {activeTab === TabId.Solutions && (
              <TabDetail
                active={activeTab === TabId.Solutions}
                primaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-heading',
                  defaultMessage:
                    'Take a page out of these pre-built Trello playbooks designed for all teams',
                  description: 'Heading for the solutions tab',
                })}
                primaryLinks={[
                  <UiNavLink
                    key={`${TabId.Solutions}-0`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-marketing',
                      defaultMessage: 'Marketing teams',
                      description: 'Title for the marketing tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-marketing',
                      defaultMessage:
                        'Whether launching a new product, campaign, or creating content, Trello helps marketing teams succeed.',
                      description: 'Description for the marketing tab',
                    })}
                    icon="Megaphone"
                    url="/teams/marketing"
                    analyticsLinkName="marketingTeamsLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-1`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-product',
                      defaultMessage: 'Product management',
                      description: 'Title for the product management tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-product',
                      defaultMessage:
                        "Use Trello's management boards and roadmap features to simplify complex projects and processes.",
                      description: 'Description for the product management tab',
                    })}
                    icon="Box"
                    url="/teams/product"
                    analyticsLinkName="productManagementLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-2`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-engineering',
                      defaultMessage: 'Engineering teams',
                      description: 'Title for the engineering tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-engineering',
                      defaultMessage:
                        'Ship more code, faster, and give your developers the freedom to be more agile with Trello.',
                      description: 'Description for the engineering tab',
                    })}
                    icon="BrowserCode"
                    url="/teams/engineering"
                    analyticsLinkName="engineeringTeamsLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-3`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-design',
                      defaultMessage: 'Design teams',
                      description: 'Title for the design tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-design',
                      defaultMessage:
                        'Empower your design teams by using Trello to streamline creative requests and promote more fluid cross-team collaboration.',
                      description: 'Description for the design tab',
                    })}
                    icon="Pencil"
                    url="/teams/design"
                    analyticsLinkName="designTeamLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-4`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-startups',
                      defaultMessage: 'Startups',
                      description: 'Title for the startups tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-startups',
                      defaultMessage:
                        'From hitting revenue goals to managing workflows, small businesses thrive with Trello.',
                      description: 'Description for the startups tab',
                    })}
                    icon="Lego"
                    url="/teams/startups"
                    analyticsLinkName="startupsLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-5`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-remote',
                      defaultMessage: 'Remote teams',
                      description: 'Title for the remote teams tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-remote',
                      defaultMessage:
                        "Keep your remote team connected and motivated, no matter where they're located around the world.",
                      description: 'Description for the remote teams tab',
                    })}
                    icon="GlobeNetworkLocation"
                    url="/teams/remote-team-management"
                    analyticsLinkName="remoteTeamsLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                ]}
                primaryLinkText={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-primary-link-text',
                  defaultMessage: 'See all teams',
                  description: 'Text for the primary link on the solutions tab',
                })}
                primaryLinkUrl="/teams"
                secondaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-secondary-heading',
                  defaultMessage: 'Our app in action',
                  description:
                    'Heading for the secondary button on the solutions tab',
                })}
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-secondary-description',
                  defaultMessage:
                    'Read through our use cases to make the most of Trello on your team.',
                  description:
                    'Description for the secondary button on the solutions tab',
                })}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-secondary-button-text',
                  defaultMessage: 'See all use cases',
                  description:
                    'Text for the secondary button on the solutions tab',
                })}
                secondaryButtonUrl="/use-cases"
                secondaryLinks={[
                  <UiNavLink
                    key={`${TabId.Solutions}-6`}
                    addBackgroundColorOnHover={false}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-secondary-link-heading-project-management',
                      defaultMessage: 'Use case: Project management',
                      description: 'Title for the project management tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-secondary-link-description-project-management',
                      defaultMessage:
                        'Keep tasks in order, deadlines on track, and team members aligned with Trello.',
                      description: 'Description for the project management tab',
                    })}
                    url="/use-cases/project-management"
                    decorator="Arrow Right"
                    analyticsLinkName="useCaseProjectManagementLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-7`}
                    addBackgroundColorOnHover={false}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-secondary-link-heading-brainstorming',
                      defaultMessage: 'Use case: Brainstorming',
                      description: 'Title for the brainstorming tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-secondary-link-description-brainstorming',
                      defaultMessage:
                        "Unleash your team's creativity and keep ideas visible, collaborative, and actionable.",
                      description: 'Description for the brainstorming tab',
                    })}
                    url="/use-cases/brainstorming"
                    decorator="Arrow Right"
                    analyticsLinkName="useCaseBrainstormingLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Solutions}-8`}
                    addBackgroundColorOnHover={false}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-secondary-link-heading-meetings',
                      defaultMessage: 'Use case: Meetings',
                      description: 'Title for the meetings tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-secondary-link-description-meetings',
                      defaultMessage:
                        'Empower your team meetings to be more productive, empowering, and dare we say—fun.',
                      description: 'Description for the meetings tab',
                    })}
                    url="/use-cases/meetings"
                    decorator="Arrow Right"
                    analyticsLinkName="useCaseMeetingsLink"
                    analyticsSource="anonymousHeaderSolutionsInlineDialog"
                  />,
                ]}
                primaryLinkAnalyticsName="seeAllTeamsLink"
                secondaryButtonAnalyticsLinkName="seeAllUseCasesLink"
                analyticsSource="anonymousHeaderSolutionsInlineDialog"
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-label',
                  defaultMessage: 'Solutions',
                  description: 'Label for the solutions tab',
                })}
              />
            )}
            {activeTab === TabId.Plans && (
              <TabDetail
                active={activeTab === TabId.Plans}
                primaryBanner={
                  <UiBanner
                    type="uiBanner"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-banner-header-free',
                      defaultMessage: 'Free plan',
                      description: 'Title for the free plan',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-banner-description-free',
                      defaultMessage:
                        'For individuals or small teams looking to keep work organized.',
                      description: 'Description for the free plan',
                    })}
                    buttonText={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-banner-button-text-free',
                      defaultMessage: 'Take a tour of Trello',
                      description: 'Text for the button on the free plan',
                    })}
                    buttonUrl="/tour"
                    analyticsLinkName="takeATourOfTrelloLink"
                    analyticsSource="anonymousHeaderPlansInlineDialog"
                  />
                }
                primaryLinks={[
                  <UiNavLink
                    key={`${TabId.Plans}-0`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-header-standard',
                      defaultMessage: 'Standard',
                      description: 'Title for the standard plan',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-description-standard',
                      defaultMessage:
                        'For teams that need to manage more work and scale collaboration.',
                      description: 'Description for the standard plan',
                    })}
                    icon="Lightbulb"
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION
                    iconColor="Teal"
                    url="/standard"
                    analyticsLinkName="standardLink"
                    analyticsSource="anonymousHeaderPlansInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Plans}-1`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-header-premium',
                      defaultMessage: 'Premium',
                      description: 'Title for the premium plan',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-description-premium',
                      defaultMessage:
                        'Best for teams up to 100 that need to track multiple projects and visualize work in a variety of ways.',
                      description: 'Description for the premium plan',
                    })}
                    icon="Star"
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION
                    iconColor="Magenta"
                    url="/premium"
                    analyticsLinkName="premiumLink"
                    analyticsSource="anonymousHeaderPlansInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Plans}-2`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-header-enterprise',
                      defaultMessage: 'Enterprise',
                      description: 'Title for the enterprise plan',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-description-enterprise',
                      defaultMessage:
                        'Everything your enterprise teams and admins need to manage projects.',
                      description: 'Description for the enterprise plan',
                    })}
                    icon="Building"
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION
                    iconColor="Blue"
                    url="/enterprise"
                    analyticsLinkName="enterpriseLink"
                    analyticsSource="anonymousHeaderPlansInlineDialog"
                  />,
                ]}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.plans-tab-detail-secondary-button-text',
                  defaultMessage: 'View Trello pricing',
                  description: 'Text for the secondary button on the plans tab',
                })}
                secondaryButtonUrl="/pricing"
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.plans-tab-detail-secondary-description',
                  defaultMessage:
                    "Whether you're a team of 2 or 2,000, Trello's flexible pricing model means you only pay for what you need.",
                  description:
                    'Description for the secondary button on the plans tab',
                })}
                secondaryTitle={intl
                  .formatMessage({
                    id: 'templates.logged_out_header.plans-tab-detail-secondary-heading',
                    defaultMessage: 'Compare plans &amp; pricing',
                    description:
                      'Heading for the secondary button on the plans tab',
                  })
                  .replace(/&amp;/g, '&')}
                secondaryButtonAnalyticsLinkName="viewTrelloPricingLink"
                analyticsSource="anonymousHeaderPlansInlineDialog"
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.plans-tab-label',
                  defaultMessage: 'Plans',
                  description: 'Label for the plans tab',
                })}
              />
            )}
            {activeTab === TabId.Resources && (
              <TabDetail
                active={activeTab === TabId.Resources}
                primaryLinks={[
                  <UiNavLink
                    key={`${TabId.Resources}-0`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-trello-guide',
                      defaultMessage: 'Trello guide',
                      description: 'Title for the trello guide',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-trello-guide',
                      defaultMessage:
                        'Our easy to follow workflow guide will take you from project set-up to Trello expert in no time.',
                      description: 'Description for the trello guide',
                    })}
                    url="/guide"
                    analyticsLinkName="trelloGuideLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Resources}-1`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-remote-guide',
                      defaultMessage: 'Remote work guide',
                      description: 'Title for the remote work guide',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-remote-guide',
                      defaultMessage:
                        'The complete guide to setting up your team for remote work success.',
                      description: 'Description for the remote work guide',
                    })}
                    url="/guide/remote-work"
                    analyticsLinkName="remoteWorkGuideLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Resources}-2`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-webinars',
                      defaultMessage: 'Webinars',
                      description: 'Title for the webinars',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-webinars',
                      defaultMessage:
                        'Enjoy our free Trello webinars and become a productivity professional.',
                      description: 'Description for the webinars',
                    })}
                    url="/webinars"
                    analyticsLinkName="webinarsLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Resources}-3`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-stories',
                      defaultMessage: 'Customer stories',
                      description: 'Title for the customer stories',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-stories',
                      defaultMessage:
                        'See how businesses have adopted Trello as a vital part of their workflow.',
                      description: 'Description for the customer stories',
                    })}
                    url="/customers"
                    analyticsLinkName="storiesLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Resources}-4`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-developers',
                      defaultMessage: 'Developers',
                      description: 'Title for the developers',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-developers',
                      defaultMessage:
                        "The sky's the limit in what you can deliver to Trello users in your Power-Up!",
                      description: 'Description for the developers',
                    })}
                    url="https://developer.atlassian.com/cloud/trello"
                    analyticsLinkName="developersLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={`${TabId.Resources}-5`}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-help',
                      defaultMessage: 'Help resources',
                      description: 'Title for the help resources',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-help',
                      defaultMessage:
                        'Need Help? Articles and FAQs to get you unstuck.',
                      description: 'Description for the help resources',
                    })}
                    url="https://support.atlassian.com/trello/"
                    analyticsLinkName="helpResourcesLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={'tab-legal'}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-legal',
                      defaultMessage: 'Legal',
                      description: 'Title for the legal',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-legal',
                      defaultMessage: "View Atlassian's Cloud Terms of Service",
                      description: 'Description for the legal',
                    })}
                    url="/legal"
                    analyticsLinkName="viewLegalLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key={'tab-privacy'}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-privacy',
                      defaultMessage: 'Privacy',
                      description: 'Title for the privacy',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-privacy',
                      defaultMessage: "View Atlassian's Privacy Policy",
                      description: 'Description for the privacy',
                    })}
                    url="/privacy"
                    analyticsLinkName="viewPrivacyLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                ]}
                primaryTitle={intl
                  .formatMessage({
                    id: 'templates.logged_out_header.resources-tab-detail-heading',
                    defaultMessage: 'Learn &amp; connect',
                    description: 'Heading for the resources tab',
                  })
                  .replace(/&amp;/g, '&')}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-detail-secondary-button-text',
                  defaultMessage: 'Check out the Trello blog',
                  description:
                    'Text for the secondary button on the resources tab',
                })}
                secondaryButtonUrl="https://blog.trello.com"
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-detail-secondary-description',
                  defaultMessage:
                    'Discover Trello use cases, productivity tips, best practices for team collaboration, and expert remote work advice.',
                  description:
                    'Description for the secondary button on the resources tab',
                })}
                secondaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-detail-secondary-heading',
                  defaultMessage: 'Helping teams work better, together',
                  description:
                    'Heading for the secondary button on the resources tab',
                })}
                secondaryButtonAnalyticsLinkName="checkOutTheTrelloBlogLink"
                analyticsSource="anonymousHeaderResourcesInlineDialog"
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-label',
                  defaultMessage: 'Resources',
                  description: 'Label for the resources tab',
                })}
              />
            )}
          </div>
        </div>
      </header>
    </AnalyticsAttributesProvider>
  );
};
