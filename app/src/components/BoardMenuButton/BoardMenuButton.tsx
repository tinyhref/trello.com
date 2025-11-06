import cx from 'classnames';
import type { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { forwardRef } from 'react';

import { Button } from '@trello/nachos/button';
import type { TestId } from '@trello/test-ids';

import * as styles from './BoardMenuButton.module.less';

interface BoardMenuButtonProps {
  iconBefore?: JSX.Element;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  testId?: TestId;
  disabled?: boolean;
  children?: ReactNode;
}

export const BoardMenuButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<BoardMenuButtonProps>
>(
  (
    { iconBefore, className, onClick, testId, disabled, children, ...props },
    ref,
  ) => {
    return (
      <Button
        className={cx(styles.boardMenuButton, className, styles.buttonIcon)}
        iconBefore={iconBefore}
        onClick={onClick}
        testId={testId}
        isDisabled={disabled}
        ref={ref}
        {...props}
      >
        <div className={styles.buttonContents}>{children}</div>
      </Button>
    );
  },
);
