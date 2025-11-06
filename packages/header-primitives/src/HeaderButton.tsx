import classNames from 'classnames';
import type { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import { cloneElement, forwardRef } from 'react';

import { DynamicButton } from '@trello/dynamic-tokens';
import type { TestId } from '@trello/test-ids';

import * as styles from './HeaderButton.module.less';

interface HeaderButtonProps {
  appearance?: 'default' | 'primary';
  ariaLabel?: string;
  ariaOwns?: string;
  ariaLabelledBy?: string;
  children?: ReactNode;
  className?: string;
  icon?: JSX.Element;
  onClick: MouseEventHandler;
  onKeyDown?: KeyboardEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  testId?: TestId;
  title?: string;
}

export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  (
    {
      appearance,
      ariaLabel,
      ariaOwns,
      ariaLabelledBy,
      children,
      className,
      icon,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      testId,
      title,
    },
    ref,
  ) => {
    return (
      <DynamicButton
        appearance={appearance}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-owns={ariaOwns}
        className={classNames(styles.headerButton, className)}
        data-testid={testId}
        ref={ref}
        title={title}
        onClick={onClick}
        iconBefore={
          icon &&
          // eslint-disable-next-line @eslint-react/no-clone-element
          cloneElement(icon, {
            dangerous_className: classNames(
              styles.headerButtonIcon,
              icon.props.dangerous_className,
            ),
          })
        }
        onKeyDown={onKeyDown}
      >
        {children}
      </DynamicButton>
    );
  },
);
