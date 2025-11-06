import classNames from 'classnames';
import type { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';

import type { ActionSubjectIdType, SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { usePathname } from '@trello/router';
import type { HeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { escapeReturnUrl } from '@trello/urls';

import { ChevronLeft } from './icons/ChevronLeft';
import { ChevronRight } from './icons/ChevronRight';
import { AnalyticsAttributesProvider } from './AnalyticsAttributesProvider';
import { DesktopPlaceholder } from './DesktopPlaceholder';
import { Logo } from './Logo';
import { MenuIcon } from './MenuIcon';
import { SmallNavTabPage } from './SmallNavTabPage';
import type { TabIdValue } from './TabId';
import { TabId } from './TabId';
import { UiBanner } from './UiBanner';
import { UiNavLink } from './UiNavLink';

import * as styles from './SmallNav.module.less';

const analyticsAttributes = { eventContainer: 'mobileNav' };
interface TabLinkProps {
  href?: string;
  index: TabIdValue;
  label?: string;
  tabIndex?: number;
  analyticsLinkName: ActionSubjectIdType;
  analyticsSource: SourceType;
}

const TabLink: FunctionComponent<TabLinkProps> = ({
  href,
  label,
  tabIndex,
  analyticsLinkName,
  analyticsSource,
}) => {
  const onClick = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: analyticsLinkName,
        source: analyticsSource,
        attributes: {
          ...analyticsAttributes,
          event: 'clicked',
          eventComponent: 'mobileNavLink',
          eventContainer: 'mobileNav',
          label,
          href,
          isMarketingEvent: true,
        },
      }),
    [href, label, analyticsLinkName, analyticsSource],
  );

  return (
    <a
      className={styles.tabLink}
      href={href}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {label}
    </a>
  );
};

interface TabButtonProps {
  index: TabIdValue;
  setActiveTab: Dispatch<SetStateAction<number | undefined>>;
  tabIndex?: number;
  title: string;
}

const TabButton: FunctionComponent<TabButtonProps> = ({
  index,
  setActiveTab,
  tabIndex,
  title,
}) => {
  const onClick = useCallback(() => {
    const indexedLibrary = new Map();
    indexedLibrary.set(0, 'featuresMenuItem');
    indexedLibrary.set(1, 'solutionsMenuItem');
    indexedLibrary.set(2, 'plansMenuItem');
    indexedLibrary.set(4, 'resourcesMenuItem');

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'menuItem',
      actionSubjectId: indexedLibrary.get(index),
      source: 'anonymousMobileHeaderInlineDialog',
      attributes: {
        event: 'clicked',
        eventComponent: 'mobileNavTab',
        eventContainer: 'mobileNav',
        label: title,
        isMarketingEvent: true,
      },
    });
    setActiveTab(index);
  }, [index, setActiveTab, title]);

  return (
    <Button
      appearance="subtle"
      iconAfter={<ChevronRight />}
      className={styles.tabButton}
      data-testid={getTestId<HeaderTestIds>('logged-out-header-narrow-tab')}
      onClick={onClick}
      tabIndex={tabIndex}
      size="fullwidth"
    >
      {title}
    </Button>
  );
};

interface SmallNavProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const SmallNav: FunctionComponent<SmallNavProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number | undefined>();
  const headerRef = useRef<HTMLDivElement>(null);
  const logInText = intl.formatMessage({
    id: 'templates.logged_out_header.log-in',
    defaultMessage: 'Log in',
    description: 'Text for the log in button',
  });
  const signUpText = intl.formatMessage({
    id: 'templates.logged_out_header.sign-up',
    defaultMessage: 'Get Trello for free',
    description: 'Text for the sign up button',
  });
  const goBackText = intl.formatMessage({
    id: 'templates.logged_out_header.go-back-button-label',
    defaultMessage: 'Back',
    description: 'Text for the go back button',
  });

  const pathname = usePathname();
  const returnUrl = escapeReturnUrl(pathname);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setActiveTab(undefined), 300);
  }, []);

  const open = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'mobileMenuOpenButton',
      source: 'anonymousMobileHeader',
      attributes: {
        ...analyticsAttributes,
        event: 'clicked',
        eventComponent: 'mobileNavMenu',
        label: 'menu open',
        isMarketingEvent: true,
      },
    });
    setIsOpen(true);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [close, isOpen, open]);

  useEffect(() => {
    function escPress(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', escPress);
      document.body.classList.add('prevent-scroll');
    }
    return () => {
      window.removeEventListener('keydown', escPress);
      document.body.classList.remove('prevent-scroll');
    };
  }, [close, isOpen]);

  const onClickBack = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'mobileNavBackButton',
      source: 'anonymousMobileHeaderInlineDialog',
      attributes: {
        label: goBackText,
        eventComponent: 'mobileNavBackButton',
        eventContainer: 'mobileNav',
        isMarketingEvent: true,
        event: 'clicked',
      },
    });
    setActiveTab(undefined);
  }, [goBackText, setActiveTab]);

  const onClickSignup = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'getTrelloForFreeLinkV2',
      source: 'anonymousMobileHeaderInlineDialog',
      attributes: {
        event: 'clicked',
        eventComponent: 'mobileNavButton',
        eventContainer: 'mobileNav',
        href: '/signup',
        label: signUpText,
      },
    });
    if (onSignupClick) {
      onSignupClick();
    }
  }, [onSignupClick, signUpText]);

  const onClickLogin = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'logInLinkV2',
      source: 'anonymousMobileHeaderInlineDialog',
      attributes: {
        label: logInText,
        href: '/login',
        event: 'clicked',
        eventComponent: 'mobileNavButton',
        eventContainer: 'mobileNav',
      },
    });
    if (onLoginClick) {
      onLoginClick();
    }
  }, [logInText, onLoginClick]);

  useEffect(() => {
    if (isOpen) {
      Analytics.sendScreenEvent({
        name: 'anonymousMobileHeaderInlineDialog',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const indexedLibrary = new Map();
    indexedLibrary.set(0, 'anonymousMobileHeaderFeaturesInlineDialog');
    indexedLibrary.set(1, 'anonymousMobileHeaderSolutionsInlineDialog');
    indexedLibrary.set(2, 'anonymousMobileHeaderPlansInlineDialog');
    indexedLibrary.set(4, 'anonymousMobileHeaderResourcesInlineDialog');

    if (indexedLibrary.get(activeTab)) {
      Analytics.sendScreenEvent({
        name: indexedLibrary.get(activeTab),
      });
    }
  }, [activeTab]);

  const smallNavTabIndex = !isOpen || activeTab !== undefined ? -1 : undefined;

  return (
    <FocusLock disabled={!isOpen} autoFocus={true} returnFocus={true}>
      <AnalyticsAttributesProvider value={analyticsAttributes}>
        <header
          className={classNames(styles.header, styles.noPrint)}
          data-open={isOpen}
          data-testid={getTestId<HeaderTestIds>('logged-out-header-narrow')}
        >
          <div className={styles.navBar} ref={headerRef}>
            <div
              className={styles.logoWrapper}
              data-hidden={activeTab !== undefined}
            >
              <Logo navSize="small" tabIndex={isOpen ? -1 : undefined} />
            </div>
            <Button
              appearance="subtle"
              iconBefore={<ChevronLeft />}
              className={styles.backButton}
              data-hidden={activeTab === undefined || !isOpen}
              onClick={onClickBack}
              tabIndex={activeTab === undefined || !isOpen ? -1 : undefined}
            >
              {goBackText}
            </Button>
            <Button
              appearance="subtle"
              aria-expanded={isOpen}
              aria-label={intl.formatMessage({
                id: 'templates.logged_out_header.navigation-button-label',
                defaultMessage: 'Navigation menu',
                description: 'Label for the navigation menu button',
              })}
              className={styles.menuButton}
              iconBefore={<MenuIcon isOpen={isOpen} />}
              onClick={toggle}
              data-testid={getTestId<HeaderTestIds>(
                'logged-out-header-menu-button',
              )}
            />
            <DesktopPlaceholder />
          </div>
          <div className={styles.pageContainer} data-open={isOpen}>
            {isOpen && activeTab === undefined ? (
              <FocusLock autoFocus={true} returnFocus={true}>
                <div
                  className={styles.page}
                  aria-hidden={!isOpen || activeTab !== undefined}
                  data-offscreen={activeTab !== undefined ? 'left' : undefined}
                  data-testid={getTestId<HeaderTestIds>(
                    'logged-out-header-narrow-tabs',
                  )}
                >
                  <div className={styles.tabList}>
                    <TabButton
                      index={TabId.Features}
                      setActiveTab={setActiveTab}
                      tabIndex={smallNavTabIndex}
                      title={intl.formatMessage({
                        id: 'templates.logged_out_header.features-tab-label',
                        defaultMessage: 'Features',
                        description: 'Label for the features tab',
                      })}
                    />
                    <TabButton
                      index={TabId.Solutions}
                      setActiveTab={setActiveTab}
                      tabIndex={smallNavTabIndex}
                      title={intl.formatMessage({
                        id: 'templates.logged_out_header.solutions-tab-label',
                        defaultMessage: 'Solutions',
                        description: 'Label for the solutions tab',
                      })}
                    />
                    <TabButton
                      index={TabId.Plans}
                      setActiveTab={setActiveTab}
                      tabIndex={smallNavTabIndex}
                      title={intl.formatMessage({
                        id: 'templates.logged_out_header.plans-tab-label',
                        defaultMessage: 'Plans',
                        description: 'Label for the plans tab',
                      })}
                    />
                    <TabLink
                      href="/pricing"
                      index={TabId.Pricing}
                      label={intl.formatMessage({
                        id: 'templates.logged_out_header.pricing-tab-label',
                        defaultMessage: 'Pricing',
                        description: 'Label for the pricing tab',
                      })}
                      tabIndex={smallNavTabIndex}
                      analyticsLinkName="pricingLink"
                      analyticsSource="anonymousMobileHeaderInlineDialog"
                    />
                    <TabButton
                      index={TabId.Resources}
                      setActiveTab={setActiveTab}
                      tabIndex={smallNavTabIndex}
                      title={intl.formatMessage({
                        id: 'templates.logged_out_header.resources-tab-label',
                        defaultMessage: 'Resources',
                        description: 'Label for the resources tab',
                      })}
                    />
                  </div>
                  <div className={styles.buttons}>
                    <a
                      className={styles.buttonLinkPrimary}
                      href={`/signup?returnUrl=${returnUrl}`}
                      onClick={onClickSignup}
                      tabIndex={smallNavTabIndex}
                    >
                      {signUpText}
                    </a>
                    <a
                      className={styles.buttonLink}
                      href={`/login?returnUrl=${returnUrl}`}
                      onClick={onClickLogin}
                      tabIndex={smallNavTabIndex}
                    >
                      {logInText}
                    </a>
                  </div>
                </div>
              </FocusLock>
            ) : null}
            {activeTab === TabId.Features && (
              <SmallNavTabPage
                isActiveTab={activeTab === TabId.Features}
                isOpen={isOpen}
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-label',
                  defaultMessage: 'Features',
                  description: 'Label for the features tab',
                })}
                primaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-heading',
                  defaultMessage:
                    'Explore the features that help your team succeed',
                  description: 'Heading for the features tab',
                })}
                primaryLinks={[
                  <UiNavLink
                    key={'views'}
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-views',
                      defaultMessage: 'Views',
                      description:
                        'Heading for the views link on the features tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-views',
                      defaultMessage:
                        "View your team's projects from every angle.",
                      description:
                        'Description for the views link on the features tab',
                    })}
                    icon="New"
                    url="/views"
                    tabIndex={activeTab === TabId.Features ? undefined : -1}
                    analyticsLinkName="viewsLink"
                    analyticsSource="anonymousMobileHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key="butler-automation"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-automation',
                      defaultMessage: 'Automation',
                      description:
                        'Heading for the automation link on the features tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-automation',
                      defaultMessage:
                        'Automate tasks and workflows with automation.',
                      description:
                        'Description for the automation link on the features tab',
                    })}
                    icon="ButlerAutomationHead"
                    url="/butler-automation"
                    tabIndex={activeTab === TabId.Features ? undefined : -1}
                    analyticsLinkName="automationLink"
                    analyticsSource="anonymousMobileHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key="power-ups"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-power-ups',
                      defaultMessage: 'Power-Ups',
                      description:
                        'Heading for the power-ups link on the features tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-power-ups',
                      defaultMessage:
                        'Power up your teams by linking their favorite tools with Trello plugins.',
                      description:
                        'Description for the power-ups link on the features tab',
                    })}
                    icon="RocketInclined"
                    url="/power-ups"
                    tabIndex={activeTab === TabId.Features ? undefined : -1}
                    analyticsLinkName="powerupsLink"
                    analyticsSource="anonymousMobileHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key="templates"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-templates',
                      defaultMessage: 'Templates',
                      description:
                        'Heading for the templates link on the features tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-templates',
                      defaultMessage:
                        'Give your team a blueprint for success with easy-to-use templates from industry leaders and the Trello community.',
                      description:
                        'Description for the templates link on the features tab',
                    })}
                    icon="TrelloCardTemplates"
                    url="/templates"
                    tabIndex={activeTab === TabId.Features ? undefined : -1}
                    analyticsLinkName="templatesLink"
                    analyticsSource="anonymousMobileHeaderFeaturesInlineDialog"
                  />,
                  <UiNavLink
                    key="integrations"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-heading-integrations',
                      defaultMessage: 'Integrations',
                      description:
                        'Heading for the integrations link on the features tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.features-primary-link-description-integrations',
                      defaultMessage:
                        'Find the apps your team is already using or discover new ways to get work done in Trello.',
                      description:
                        'Description for the integrations link on the features tab',
                    })}
                    tabIndex={activeTab === TabId.Features ? undefined : -1}
                    icon="TrelloIntegrations"
                    url="/integrations"
                    analyticsLinkName="integrationsLink"
                    analyticsSource="anonymousMobileHeaderFeaturesInlineDialog"
                  />,
                ]}
                secondaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-secondary-heading',
                  defaultMessage: 'Meet Trello',
                  description:
                    'Heading for the secondary section of the features tab',
                })}
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-secondary-description',
                  defaultMessage:
                    "Trello makes it easy for your team to get work done. No matter the project, workflow, or type of team, Trello can help keep things organized. It's simple - sign-up, create a board, and you're off! Productivity awaits.",
                  description:
                    'Description for the secondary section of the features tab',
                })}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.features-tab-detail-secondary-button-text',
                  defaultMessage: 'Check out Trello',
                  description:
                    'Text for the secondary button on the features tab',
                })}
                secondaryButtonUrl="/tour"
                analyticsLinkName="takeATourOfTrelloLink"
                analyticsSource="anonymousMobileHeaderFeaturesInlineDialog"
              />
            )}
            {activeTab === TabId.Solutions && (
              <SmallNavTabPage
                isActiveTab={activeTab === TabId.Solutions}
                isOpen={isOpen}
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-label',
                  defaultMessage: 'Solutions',
                  description: 'Label for the solutions tab',
                })}
                primaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-heading',
                  defaultMessage:
                    'Take a page out of these pre-built Trello playbooks designed for all teams',
                  description:
                    'Heading for the primary section of the solutions tab',
                })}
                primaryLinks={[
                  <UiNavLink
                    key="teams-marketing"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-marketing',
                      defaultMessage: 'Marketing teams',
                      description:
                        'Heading for the marketing teams link on the solutions tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-marketing',
                      defaultMessage:
                        'Whether launching a new product, campaign, or creating content, Trello helps marketing teams succeed.',
                      description:
                        'Description for the marketing teams link on the solutions tab',
                    })}
                    icon="Megaphone"
                    url="/teams/marketing"
                    tabIndex={activeTab === TabId.Solutions ? undefined : -1}
                    analyticsLinkName="marketingTeamsLink"
                    analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key="teams-product"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-product',
                      defaultMessage: 'Product management',
                      description:
                        'Heading for the product management link on the solutions tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-product',
                      defaultMessage:
                        "Use Trello's management boards and roadmap features to simplify complex projects and processes.",
                      description:
                        'Description for the product management link on the solutions tab',
                    })}
                    icon="Box"
                    url="/teams/product"
                    tabIndex={activeTab === TabId.Solutions ? undefined : -1}
                    analyticsLinkName="productManagementLink"
                    analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key="teams-engineering"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-engineering',
                      defaultMessage: 'Engineering teams',
                      description:
                        'Heading for the engineering teams link on the solutions tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-engineering',
                      defaultMessage:
                        'Ship more code, faster, and give your developers the freedom to be more agile with Trello.',
                      description:
                        'Description for the engineering teams link on the solutions tab',
                    })}
                    icon="BrowserCode"
                    url="/teams/engineering"
                    tabIndex={activeTab === TabId.Solutions ? undefined : -1}
                    analyticsLinkName="engineeringTeamsLink"
                    analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key="teams-design"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-design',
                      defaultMessage: 'Design teams',
                      description:
                        'Heading for the design teams link on the solutions tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-design',
                      defaultMessage:
                        'Empower your design teams by using Trello to streamline creative requests and promote more fluid cross-team collaboration.',
                      description:
                        'Description for the design teams link on the solutions tab',
                    })}
                    icon="Pencil"
                    url="/teams/design"
                    tabIndex={activeTab === TabId.Solutions ? undefined : -1}
                    analyticsLinkName="designTeamLink"
                    analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key="teams-startups"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-startups',
                      defaultMessage: 'Startups',
                      description:
                        'Heading for the startups link on the solutions tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-startups',
                      defaultMessage:
                        'From hitting revenue goals to managing workflows, small businesses thrive with Trello.',
                      description:
                        'Description for the startups link on the solutions tab',
                    })}
                    icon="Lego"
                    url="/teams/startups"
                    tabIndex={activeTab === TabId.Solutions ? undefined : -1}
                    analyticsLinkName="startupsLink"
                    analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
                  />,
                  <UiNavLink
                    key="teams-remote-team-management"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-heading-remote',
                      defaultMessage: 'Remote teams',
                      description:
                        'Heading for the remote teams link on the solutions tab',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.solutions-primary-link-description-remote',
                      defaultMessage:
                        "Keep your remote team connected and motivated, no matter where they're located around the world.",
                      description:
                        'Description for the remote teams link on the solutions tab',
                    })}
                    icon="GlobeNetworkLocation"
                    url="/teams/remote-team-management"
                    tabIndex={activeTab === TabId.Solutions ? undefined : -1}
                    analyticsLinkName="remoteTeamsLink"
                    analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
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
                    'Heading for the secondary section of the solutions tab',
                })}
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-secondary-description',
                  defaultMessage:
                    'Read through our use cases to make the most of Trello on your team.',
                  description:
                    'Description for the secondary section of the solutions tab',
                })}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.solutions-tab-detail-secondary-button-text',
                  defaultMessage: 'See all use cases',
                  description:
                    'Text for the secondary button on the solutions tab',
                })}
                secondaryButtonUrl="/use-cases"
                analyticsLinkName="seeAllUseCasesLink"
                analyticsSource="anonymousMobileHeaderSolutionsInlineDialog"
              />
            )}
            {activeTab === TabId.Plans && (
              <SmallNavTabPage
                isActiveTab={activeTab === TabId.Plans}
                isOpen={isOpen}
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.plans-tab-label',
                  defaultMessage: 'Plans',
                  description: 'Label for the plans tab',
                })}
                primaryBanner={
                  <UiBanner
                    type="uiBanner"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-banner-header-free',
                      defaultMessage: 'Free plan',
                      description: 'Free plan',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-banner-description-free',
                      defaultMessage:
                        'For individuals or small teams looking to keep work organized.',
                      description: 'Description for the free plan banner',
                    })}
                    buttonText={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-banner-button-text-free',
                      defaultMessage: 'Take a tour of Trello',
                      description:
                        'Text for the button on the free plan banner',
                    })}
                    buttonUrl="/tour"
                    tabIndex={activeTab === TabId.Plans ? undefined : -1}
                    analyticsLinkName="takeATourOfTrelloLink"
                    analyticsSource="anonymousMobileHeaderPlansInlineDialog"
                  />
                }
                primaryLinks={[
                  <UiNavLink
                    key="standard"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-header-standard',
                      defaultMessage: 'Standard',
                      description: 'Standard',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-description-standard',
                      defaultMessage:
                        'For teams that need to manage more work and scale collaboration.',
                      description:
                        'Description for the standard link on the plans tab',
                    })}
                    icon="Lightbulb"
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION
                    iconColor="Teal"
                    url="/standard"
                    tabIndex={activeTab === TabId.Plans ? undefined : -1}
                    analyticsLinkName="standardLink"
                    analyticsSource="anonymousMobileHeaderPlansInlineDialog"
                  />,
                  <UiNavLink
                    key="premium"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-header-premium',
                      defaultMessage: 'Premium',
                      description: 'Premium',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-description-premium',
                      defaultMessage:
                        'Best for teams up to 100 that need to track multiple projects and visualize work in a variety of ways.',
                      description:
                        'Description for the premium link on the plans tab',
                    })}
                    icon="Star"
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION
                    iconColor="Magenta"
                    url="/premium"
                    tabIndex={activeTab === TabId.Plans ? undefined : -1}
                    analyticsLinkName="premiumLink"
                    analyticsSource="anonymousMobileHeaderPlansInlineDialog"
                  />,
                  <UiNavLink
                    key="enterprise"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-header-enterprise',
                      defaultMessage: 'Enterprise',
                      description: 'Enterprise',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.plans-primary-link-description-enterprise',
                      defaultMessage:
                        'Everything your enterprise teams and admins need to manage projects.',
                      description:
                        'Description for the enterprise link on the plans tab',
                    })}
                    icon="Building"
                    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage -- EXCEPTION
                    iconColor="Blue"
                    url="/enterprise"
                    tabIndex={activeTab === TabId.Plans ? undefined : -1}
                    analyticsLinkName="enterpriseLink"
                    analyticsSource="anonymousMobileHeaderPlansInlineDialog"
                  />,
                ]}
                secondaryTitle={intl
                  .formatMessage({
                    id: 'templates.logged_out_header.plans-tab-detail-secondary-heading',
                    defaultMessage: 'Compare plans &amp; pricing',
                    description:
                      'Heading for the secondary section of the plans tab',
                  })
                  .replace(/&amp;/g, '&')}
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.plans-tab-detail-secondary-description',
                  defaultMessage:
                    "Whether you're a team of 2 or 2,000, Trello's flexible pricing model means you only pay for what you need.",
                  description:
                    'Description for the secondary section of the plans tab',
                })}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.plans-tab-detail-secondary-button-text',
                  defaultMessage: 'View Trello pricing',
                  description: 'Text for the secondary button on the plans tab',
                })}
                secondaryButtonUrl="/pricing"
                analyticsLinkName="viewTrelloPricingLink"
                analyticsSource="anonymousMobileHeaderPlansInlineDialog"
              />
            )}
            {activeTab === TabId.Resources && (
              <SmallNavTabPage
                isActiveTab={activeTab === TabId.Resources}
                isOpen={isOpen}
                parentLabel={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-label',
                  defaultMessage: 'Resources',
                  description: 'Label for the resources tab',
                })}
                primaryLinks={[
                  <UiNavLink
                    key="tab-guide"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-trello-guide',
                      defaultMessage: 'Trello guide',
                      description: 'Trello guide',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-trello-guide',
                      defaultMessage:
                        'Our easy to follow workflow guide will take you from project set-up to Trello expert in no time.',
                      description:
                        'Description for the Trello guide link on the resources tab',
                    })}
                    url="/guide"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="trelloGuideLink"
                    analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-remote-work"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-remote-guide',
                      defaultMessage: 'Remote work guide',
                      description: 'Remote work guide',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-remote-guide',
                      defaultMessage:
                        'The complete guide to setting up your team for remote work success.',
                      description:
                        'The complete guide to setting up your team for remote work success.',
                    })}
                    url="/guide/remote-work"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="remoteWorkGuideLink"
                    analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-webinars"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-webinars',
                      defaultMessage: 'Webinars',
                      description: 'Webinars',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-webinars',
                      defaultMessage:
                        'Enjoy our free Trello webinars and become a productivity professional.',
                      description:
                        'Enjoy our free Trello webinars and become a productivity professional.',
                    })}
                    url="/webinars"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="webinarsLink"
                    analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-customers"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-stories',
                      defaultMessage: 'Customer stories',
                      description: 'Customer stories',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-stories',
                      defaultMessage:
                        'See how businesses have adopted Trello as a vital part of their workflow.',
                      description:
                        'See how businesses have adopted Trello as a vital part of their workflow.',
                    })}
                    url="/customers"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="storiesLink"
                    analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-developer"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-developers',
                      defaultMessage: 'Developers',
                      description: 'Developers',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-developers',
                      defaultMessage:
                        "The sky's the limit in what you can deliver to Trello users in your Power-Up!",
                      description:
                        "The sky's the limit in what you can deliver to Trello users in your Power-Up!",
                    })}
                    url="https://developer.atlassian.com/cloud/trello"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="developersLink"
                    analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-support"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-help',
                      defaultMessage: 'Help resources',
                      description: 'Help resources',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-help',
                      defaultMessage:
                        'Need Help? Articles and FAQs to get you unstuck.',
                      description:
                        'Need Help? Articles and FAQs to get you unstuck.',
                    })}
                    url="https://support.atlassian.com/trello/"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="helpResourcesLink"
                    analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-legal"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-legal',
                      defaultMessage: 'Legal',
                      description: 'Legal',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-legal',
                      defaultMessage: "View Atlassian's Cloud Terms of Service",
                      description: "View Atlassian's Cloud Terms of Service",
                    })}
                    url="/legal"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="viewLegalLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                  <UiNavLink
                    key="tab-privacy"
                    titleHeading={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-header-privacy',
                      defaultMessage: 'Privacy',
                      description: 'Privacy',
                    })}
                    description={intl.formatMessage({
                      id: 'templates.logged_out_header.resources-primary-link-description-privacy',
                      defaultMessage: "View Atlassian's Privacy Policy",
                      description: "View Atlassian's Privacy Policy",
                    })}
                    url="/privacy"
                    tabIndex={activeTab === TabId.Resources ? undefined : -1}
                    analyticsLinkName="viewPrivacyLink"
                    analyticsSource="anonymousHeaderResourcesInlineDialog"
                  />,
                ]}
                primaryTitle={intl
                  .formatMessage({
                    id: 'templates.logged_out_header.resources-tab-detail-heading',
                    defaultMessage: 'Learn &amp; connect',
                    description: 'Learn &amp; connect',
                  })
                  .replace(/&amp;/g, '&')}
                secondaryTitle={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-detail-secondary-heading',
                  defaultMessage: 'Helping teams work better, together',
                  description: 'Helping teams work better, together',
                })}
                secondaryDescription={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-detail-secondary-description',
                  defaultMessage:
                    'Discover Trello use cases, productivity tips, best practices for team collaboration, and expert remote work advice.',
                  description:
                    'Discover Trello use cases, productivity tips, best practices for team collaboration, and expert remote work advice.',
                })}
                secondaryButtonText={intl.formatMessage({
                  id: 'templates.logged_out_header.resources-tab-detail-secondary-button-text',
                  defaultMessage: 'Check out the Trello blog',
                  description: 'Check out the Trello blog',
                })}
                secondaryButtonUrl="https://blog.trello.com"
                analyticsLinkName="checkOutTheTrelloBlogLink"
                analyticsSource="anonymousMobileHeaderResourcesInlineDialog"
              />
            )}
          </div>
        </header>
      </AnalyticsAttributesProvider>
    </FocusLock>
  );
};
