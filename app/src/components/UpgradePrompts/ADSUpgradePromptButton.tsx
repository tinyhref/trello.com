import cx from 'classnames';

import PremiumIcon from '@atlaskit/icon/core/premium';
import { Button, type ButtonProps } from '@trello/nachos/button';
import { token } from '@trello/theme';

import * as styles from './ADSUpgradePromptButton.module.less';

type ADSUpgradePromptButtonProps = Omit<ButtonProps, 'iconBefore'> & {
  gradientBackground?: boolean;
};

export const ADSUpgradePromptButton = ({
  children,
  className,
  gradientBackground,
  ...props
}: ADSUpgradePromptButtonProps) => {
  return (
    <Button
      className={cx(className, styles.upgradePromptButton, {
        [styles.gradientBackground]: gradientBackground,
      })}
      iconBefore={
        <div className={styles.upgradePromptButtonIcon}>
          <PremiumIcon
            label=""
            spacing="spacious"
            color={token('color.icon.inverse', '#FFFFFF')}
          />
        </div>
      }
      {...props}
    >
      {children}
    </Button>
  );
};
