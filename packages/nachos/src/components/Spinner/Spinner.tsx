import classNames from 'classnames';
import type { FunctionComponent } from 'react';

import type { TestId } from '@trello/test-ids';

import * as styles from './Spinner.module.less';

export interface SpinnerProps {
  inline?: boolean;
  centered?: boolean;
  small?: boolean;
  modLeft?: boolean;
  text?: string;
  wrapperClassName?: string;
  testId?: TestId;
  isAi?: boolean;
}

export const Spinner: FunctionComponent<SpinnerProps> = ({
  inline,
  centered,
  small,
  modLeft,
  text,
  wrapperClassName,
  testId,
  isAi,
}) => {
  const wrapperClasses = {
    [styles.inline]: !!inline,
    [styles.centered]: !!centered,
  };
  const iconClasses = {
    [styles.small]: !!small,
    [styles.modLeft]: !!modLeft,
  };

  return (
    <div
      className={classNames(styles.wrapper, wrapperClasses, wrapperClassName)}
      data-testid={testId}
    >
      <span
        className={classNames(styles.spinner, iconClasses, {
          [styles.aiSpinner]: !!isAi,
        })}
      />
      {text}
    </div>
  );
};
