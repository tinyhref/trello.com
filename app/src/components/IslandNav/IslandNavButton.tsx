import cx from 'classnames';
import { forwardRef } from 'react';
import type { MouseEventHandler, ReactElement } from 'react';

import { Button } from '@trello/nachos/button';
import type { TestId } from '@trello/test-ids';

import * as styles from './IslandNavButton.module.less';

interface IslandNavButtonProps {
  className?: string;
  icon: ReactElement<{ label?: string }>;
  isDisabled?: boolean;
  isPrimary?: boolean;
  isSelected?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  testId?: TestId;
  title?: string;
  label?: JSX.Element | string;
  showLabels?: boolean;
  role?: 'button' | 'checkbox';
  'aria-label'?: string;
}

export const IslandNavButton = forwardRef<
  HTMLButtonElement,
  IslandNavButtonProps
>(
  (
    {
      className,
      icon,
      isDisabled = false,
      isPrimary = false,
      isSelected = false,
      onClick,
      onMouseEnter,
      testId,
      title,
      label,
      showLabels = false,
      role = 'button',
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    return (
      <Button
        className={cx(styles.button, className, {
          [styles.primary]: isPrimary,
          [styles.selected]: isSelected,
          [styles.withLabel]: showLabels,
        })}
        appearance="subtle"
        shouldFitContainer
        isDisabled={isDisabled}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        ref={ref}
        title={title}
        testId={testId}
        iconBefore={
          showLabels ? <span className={styles.icon}>{icon}</span> : undefined
        }
        role={role}
        aria-label={ariaLabel}
        aria-checked={isSelected}
      >
        {!showLabels ? icon : null}
        {isSelected && <span className={styles.indicator}></span>}
        {showLabels && <span className={styles.label}>{label}</span>}
      </Button>
    );
  },
);
