import classNames from 'classnames';
import type { FunctionComponent, ReactNode } from 'react';

import { dontUpsell } from '@trello/browser';
import { ComponentWrapper } from '@trello/component-wrapper';
import type { GlyphProps } from '@trello/nachos/icon';
import { RouterLink } from '@trello/router/router-link';

import { WithEnterpriseManagedOverride } from './WithEnterpriseManagedOverride';

import * as styles from './UpgradePromptButton.module.less';

type Theme = 'dark' | 'gradient' | 'light';
type Justify = 'center' | 'left';

interface UpgradePromptButtonProps {
  /** Call-to-action content of the prompt */
  cta: ReactNode;
  /** Optional link for the call-to-action. If not provided, renders as a button. */
  ctaLink?: string;
  /** Callback function to fire side-effects (e.g., tracking events) when the CTA is clicked */
  ctaOnClick?: () => void;
  /** Optional icon component from `@trello/nachos` to display in the button */
  Icon?: FunctionComponent<GlyphProps>;
  /** Theme style for the button: 'dark', 'light', or 'gradient'. Defaults to 'light'. */
  theme?: Theme;
  /** Text justification within the button: 'center' or 'left'. Defaults to 'center'. */
  justify?: Justify;
  /** Whether the button should expand to fit its container */
  shouldFitContainer?: boolean;
  /** Whether to open the CTA link in a new tab */
  openInNewTab?: boolean;
  /** Whether upselling is allowed for this prompt */
  allowUpsell?: boolean;
  /** Test ID for the component */
  testId?: string;
}

const getTheme = (theme?: Theme) => {
  switch (theme) {
    case 'dark':
      return styles.upgradePromptButtonDarkTheme;
    case 'light':
      return styles.upgradePromptButtonLightTheme;
    case 'gradient':
      return styles.upgradePromptButtonGradientTheme;
    default:
      return styles.upgradePromptButtonLightTheme;
  }
};

const getJustification = (justify?: Justify) => {
  switch (justify) {
    case 'left':
      return styles.upgradePromptJustifyLeft;
    case 'center':
      return styles.upgradePromptJustifyCenter;
    default:
      return styles.upgradePromptJustifyCenter;
  }
};

export const UpgradePromptButton: FunctionComponent<
  UpgradePromptButtonProps
> = ({
  cta,
  ctaLink,
  ctaOnClick,
  Icon,
  theme,
  justify,
  shouldFitContainer,
  openInNewTab,
  allowUpsell,
  testId,
}) => {
  if (dontUpsell() && !allowUpsell) {
    return null;
  }

  // eslint-disable-next-line @trello/enforce-variable-case
  const onClickCTA = () => {
    if (ctaOnClick) {
      ctaOnClick();
    }
  };

  const promptClasses = classNames(
    styles.upgradePromptButton,
    getTheme(theme),
    shouldFitContainer && styles.upgradePromptFitContainer,
    getJustification(justify),
  );

  let ClickableComponent = ctaLink === '/business-class' ? 'a' : RouterLink;

  const isButton = !ctaLink;

  if (isButton) {
    ClickableComponent = 'button';
  }

  return (
    <ClickableComponent
      data-testid={testId}
      href={ctaLink}
      className={promptClasses}
      onClick={onClickCTA}
      {...(openInNewTab ? { target: '_blank' } : {})}
    >
      {Icon && (
        <div className={styles.upgradePromptButtonIconBackground}>
          <Icon
            size="small"
            dangerous_className={styles.upgradePromptButtonIcon}
          />
        </div>
      )}
      <div className={styles.upgradePromptButtonCTA}>
        {isButton && (
          <WithEnterpriseManagedOverride>{cta}</WithEnterpriseManagedOverride>
        )}

        {!isButton && cta}
      </div>
    </ClickableComponent>
  );
};

export const UpgradePromptButtonConnected: FunctionComponent<
  UpgradePromptButtonProps
> = (props) => (
  <ComponentWrapper>
    <UpgradePromptButton {...props} />
  </ComponentWrapper>
);
