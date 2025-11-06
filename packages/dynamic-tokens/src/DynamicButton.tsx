import cx from 'classnames';
import { cloneElement, forwardRef } from 'react';

import type { ButtonProps } from '@trello/nachos/button';
import { Button } from '@trello/nachos/button';

import { dynamicToken } from './dynamicToken';

import * as styles from './DynamicButton.module.less';

/**
 * Thin utility to set icons to default to the `dynamic.icon` color token.
 * If we ever remove the default icon color in Nachos Button and use
 * `currentColor` by default instead, this can probably be removed.
 */
const cloneDynamicIcon = (icon: JSX.Element | undefined) => {
  if (!icon) return undefined;
  // eslint-disable-next-line @eslint-react/no-clone-element
  return cloneElement(icon, {
    color: icon.props.color || dynamicToken('dynamic.icon'),
  });
};

export interface DynamicButtonProps extends Omit<ButtonProps, 'appearance'> {
  appearance?: 'default' | 'primary';
  isHighlighted?: boolean;
}

/**
 * A Nachos button that has been styled to use dynamic button, text, and icon
 * color tokens. This used to represent the "transparent" and "transparent-dark"
 * appearance presets for Nachos buttons, but this should now be able to remove
 * all instances of both of those.
 */
export const DynamicButton = forwardRef<HTMLButtonElement, DynamicButtonProps>(
  (
    { appearance, className, iconBefore, iconAfter, isHighlighted, ...props },
    ref,
  ) => {
    return (
      <Button
        appearance={appearance}
        className={cx(className, {
          [styles.dynamicButton]: true,
          [styles.highlighted]: isHighlighted,
          [styles.primary]: appearance === 'primary',
        })}
        iconBefore={cloneDynamicIcon(iconBefore)}
        iconAfter={cloneDynamicIcon(iconAfter)}
        ref={ref}
        {...props}
      />
    );
  },
);
