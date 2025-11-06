import classNames from 'classnames';
import type { FunctionComponent, ReactNode } from 'react';

import type { GlyphProps } from '@trello/nachos/icon';
import { CloseIcon } from '@trello/nachos/icons/close';
import { token } from '@trello/theme';

import * as styles from './UpgradePromptFullBase.module.less';

export interface UpgradePromptFullBaseProps {
  /** Additional CSS class name to apply to the prompt container */
  className?: string;
  /** Prompt copy content, optionally rendered */
  content?: ReactNode;
  /** Call-to-action content of the prompt */
  cta: ReactNode;
  /** Prompt header text */
  headline?: ReactNode;
  /** Icon element to display in the prompt */
  Icon: FunctionComponent<GlyphProps>;
  /** Whether to use dark theme styling */
  isDarkTheme?: boolean;
  /** Callback function to unmount the prompt and make dismissal persistent for the user */
  onDismiss?: () => void;
  /** Whether to show a loading state */
  loading?: boolean;
  /** Whether upselling is allowed for this prompt */
  allowUpsell?: boolean;
}

export const UpgradePromptFullBase: FunctionComponent<
  UpgradePromptFullBaseProps
> = ({
  loading,
  className,
  content,
  cta,
  headline,
  Icon,
  isDarkTheme,
  onDismiss,
}) => {
  const promptClasses = classNames(
    styles.upgradePromptFull,
    isDarkTheme
      ? styles.upgradePromptFullDarkTheme
      : styles.upgradePromptFullLightTheme,
    className,
  );

  if (loading) {
    return <div className={styles.animation}></div>;
  }

  return (
    <div className={promptClasses}>
      <div className={styles.upgradePromptFullHeadline}>{headline}</div>
      <div className={styles.upgradePromptFullContent}>{content}</div>
      {cta}
      <div className={styles.upgradePromptFullIconBackground}>
        <Icon dangerous_className={styles.upgradePromptFullIcon} />
      </div>
      <div className={styles.upgradePromptFullIconClippedBackground} />
      {onDismiss && (
        <button
          className={styles.upgradePromptFullCloseButtonWrapper}
          onClick={onDismiss}
        >
          <CloseIcon
            color={
              isDarkTheme
                ? token('color.icon.inverse', '#FFFFFF')
                : token('color.icon.subtle', '#626F86')
            }
            size="small"
            dangerous_className={styles.upgradePromptFullCloseButton}
          />
        </button>
      )}
    </div>
  );
};
