import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { usePathname } from '@trello/router';
import { escapeReturnUrl } from '@trello/urls';

import { useAnalyticsAttributes } from './AnalyticsAttributesProvider';

import * as styles from './Buttons.module.less';

interface ButtonsProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export const Buttons: FunctionComponent<ButtonsProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  const pathname = usePathname();
  const returnUrl = escapeReturnUrl(pathname);
  const analyticsAttributes = useAnalyticsAttributes();

  const logInText = intl.formatMessage({
    id: 'templates.logged_out_header.log-in',
    defaultMessage: 'Log in',
    description: 'Log in button text for logged-out header component.',
  });
  const signUpText = intl.formatMessage({
    id: 'templates.logged_out_header.sign-up',
    defaultMessage: 'Get Trello for free',
    description: 'Prompt to sign up for free Trello account',
  });

  const onClickLogin = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'logInLinkV2',
      source: 'anonymousHeader',
      attributes: {
        ...analyticsAttributes,
        event: 'clicked',
        eventComponent: 'globalNavButton',
        label: logInText,
        href: '/login',
        isMarketingEvent: true,
      },
    });
    if (onLoginClick) {
      onLoginClick();
    }
  }, [analyticsAttributes, logInText, onLoginClick]);

  const onClickSignup = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'getTrelloForFreeLinkV2',
      source: 'anonymousHeader',
      attributes: {
        ...analyticsAttributes,
        event: 'clicked',
        eventComponent: 'globalNavButton',
        label: signUpText,
        href: '/signup',
        isMarketingEvent: true,
      },
    });
    if (onSignupClick) {
      onSignupClick();
    }
  }, [analyticsAttributes, signUpText, onSignupClick]);

  return (
    <div className={styles.buttonGroup}>
      <a
        className={styles.buttonLink}
        href={`/login?returnUrl=${returnUrl}`}
        onClick={onClickLogin}
      >
        {logInText}
      </a>
      <a
        className={classNames(styles.buttonLink, styles.primaryButtonLink)}
        href={`/signup?returnUrl=${returnUrl}`}
        onClick={onClickSignup}
      >
        {signUpText}
      </a>
    </div>
  );
};
