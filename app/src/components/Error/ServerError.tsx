import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';

import { getServerErrorMessage } from './MessageKeys';

import * as styles from './ServerError.module.less';

interface ServerErrorProps {
  messageKey: string;
}

export const ServerError: FunctionComponent<ServerErrorProps> = ({
  messageKey,
}) => {
  const reload = useCallback(() => window.location.reload(), []);

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
      <h1>{getServerErrorMessage(messageKey)}</h1>
      <p>
        <FormattedMessage
          id="templates.error.check-connection-and-refresh-the-page"
          defaultMessage="Check your connection and try refreshing the page."
          description="Check connection and refresh the page error message"
        />
      </p>
      <div className={cx(styles.tryAgainButton)}>
        <Button onClick={reload} appearance="primary">
          <FormattedMessage
            id="templates.error.try-again"
            defaultMessage="Try again"
            description="Try again error message"
          />
        </Button>
      </div>
    </div>
  );
};
