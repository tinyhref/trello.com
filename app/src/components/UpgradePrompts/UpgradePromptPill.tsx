import classNames from 'classnames';
import type { FunctionComponent, RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { dontUpsell } from '@trello/browser';
import { ComponentWrapper } from '@trello/component-wrapper';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import { RouterLink } from '@trello/router/router-link';

import { WithEnterpriseManagedOverride } from './WithEnterpriseManagedOverride';

import * as styles from './UpgradePromptPill.module.less';

/**
 * UpgradePromptPillProps props
 * isDarkTheme: For dark theme
 * cta: call to action of prompt, navigates user within the page
 * ctaLink: link for call to action
 * ctaLinkOpenNewTab: opens the link for call to action in a new tab
 * ctaOnClick: function expected to fire side-effects like a trackUe event,
 *             fired on click of cta
 */
interface UpgradePromptPillProps {
  isDarkTheme?: boolean;
  allowUpsell?: boolean;
  cta: string;
  ctaLink?: string;
  ctaLinkOpenNewTab?: boolean;
  ctaOnClick?: () => void;
  testId?: string;
}

export const UpgradePromptPill: FunctionComponent<UpgradePromptPillProps> = ({
  isDarkTheme,
  cta,
  ctaLink,
  ctaLinkOpenNewTab,
  ctaOnClick,
  allowUpsell,
  testId,
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  // This component is used inside atlaskit DropdownItem components which are also buttons
  // and can get disabled, preventing the onClick handler on this component from firing.
  // We should refactor how we use DropdownItems to pass a custom component that isn't
  // a button when we need to disable it as having a button inside a button is invalid HTML.
  useEffect(() => {
    const callback = () => {
      ctaOnClick?.();
    };

    const button = buttonRef.current;

    button?.addEventListener('click', callback);

    return () => {
      button?.removeEventListener('click', callback);
    };
  }, [ctaOnClick]);

  if (dontUpsell() && !allowUpsell) {
    return null;
  }

  const upgradePromptPillClasses = classNames(
    styles.upgradePromptPill,
    isDarkTheme ? styles.upgradeDarkTheme : styles.upgradeLightTheme,
  );

  const LinkComponent =
    ctaLink === '/business-class' || ctaLink === '/enterprise'
      ? 'a'
      : RouterLink;

  const pillContent = (
    <>
      <BusinessClassIcon
        size="small"
        dangerous_className={styles.upgradePromptPillIcon}
      />
      <div>
        <WithEnterpriseManagedOverride>{cta}</WithEnterpriseManagedOverride>
      </div>
    </>
  );

  if (!ctaLink) {
    return (
      <button
        className={upgradePromptPillClasses}
        ref={buttonRef as RefObject<HTMLButtonElement>}
        data-testid={testId}
      >
        {pillContent}
      </button>
    );
  }

  return (
    <LinkComponent
      href={ctaLink}
      {...(ctaLinkOpenNewTab
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={upgradePromptPillClasses}
      ref={buttonRef as RefObject<HTMLAnchorElement>}
      data-testid={testId}
    >
      {pillContent}
    </LinkComponent>
  );
};

export const UpgradePromptPillConnected: FunctionComponent<
  UpgradePromptPillProps
> = (props) => (
  <ComponentWrapper>
    <UpgradePromptPill {...props} />
  </ComponentWrapper>
);
