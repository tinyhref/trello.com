import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import type { CaughtError } from '@trello/error-boundaries';
import { ErrorDetails } from '@trello/error-boundaries';
import { Button } from '@trello/nachos/button';

import * as styles from './RuntimeError.module.less';

interface RuntimeErrorProps {
  caughtError: CaughtError;
}

export const RuntimeError: FunctionComponent<RuntimeErrorProps> = ({
  caughtError,
}) => {
  const reload = useCallback(() => window.location.reload(), []);

  const intl = useIntl();

  return (
    <div className={cx(styles.bigMessage, styles.quiet)}>
      <img
        alt="Taco Error"
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        src={require('resources/images/error-pages/taco-sleeping@2x.png')}
        srcSet={
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('resources/images/error-pages/taco-sleeping.png') +
          ', ' +
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('resources/images/error-pages/taco-sleeping@2x.png')
        }
      />
      <h1>
        {intl.formatMessage({
          id: 'templates.runtime_error.an-error-occurred',
          description: 'Displays when there is an error on the page.',
          defaultMessage: 'An error occurred on this page',
        })}
      </h1>
      <p>
        {intl.formatMessage({
          id: 'templates.runtime_error.we-have-been-notified',
          description: 'Displays when there is an error on the page.',
          defaultMessage: 'Our team has been notified.',
        })}
      </p>
      <div className={cx(styles.tryAgainButton)}>
        <Button onClick={reload} appearance="primary">
          {intl.formatMessage({
            id: 'templates.runtime_error.reload',
            description: 'Button to reload page',
            defaultMessage: 'Reload Page',
          })}
        </Button>
      </div>
      <ErrorDetails caughtError={caughtError} />
    </div>
  );
};
