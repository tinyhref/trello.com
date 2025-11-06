import classNames from 'classnames';
import type { FunctionComponent } from 'react';

import { Spinner } from '@trello/nachos/spinner';

import * as styles from './LoadingSpinner.module.less';

export const LoadingSpinner: FunctionComponent<{
  className?: string;
  message?: string;
}> = ({ className, message }) => (
  <div className={classNames(className || '', styles.spinnerContainer)}>
    {message ? (
      <>
        <p className={styles.spinnerMessage}>{message}</p>
        <Spinner testId="loading-spinner" />
      </>
    ) : (
      <Spinner testId="loading-spinner" />
    )}
  </div>
);
