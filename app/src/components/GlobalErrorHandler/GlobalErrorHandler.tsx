import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import type { ErrorHandlerProps } from '@trello/error-boundaries';
import { ErrorDetails } from '@trello/error-boundaries';
import { token } from '@trello/theme';

import { HeaderSkeleton } from 'app/src/components/HeaderSkeleton';

import * as styles from './GlobalErrorHandler.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import tacoSleepSvg from 'resources/images/taco-sleep.svg';

export const GlobalErrorHandler: FunctionComponent<ErrorHandlerProps> = ({
  caughtError,
}) => {
  useEffect(() => {
    const trelloRoot = document.getElementById('trello-root');
    if (trelloRoot) {
      // Change the background color back to "inherit" to avoid contrast
      // problems on boards with a background color.
      trelloRoot.style.backgroundColor = 'inherit';
      trelloRoot.style.backgroundImage = 'inherit';
    }
  });

  return (
    <>
      <HeaderSkeleton backgroundColor={token('color.skeleton', '#091E420F')} />
      <div className={classNames(styles.errorMessage)}>
        <img alt="Taco" src={tacoSleepSvg} />
        <FormattedMessage
          tagName="h1"
          id="templates.error.global-unhandled"
          defaultMessage="Something's gone wrong"
          description="Error message when an unhandled error occurs"
        />
        <FormattedMessage
          tagName="p"
          id="templates.error.reload-call-to-action"
          defaultMessage="You may want to try reloading this page."
          description="Call to action to refresh the browser"
        />
        <FormattedMessage
          tagName="p"
          id="templates.error.contact-us"
          defaultMessage="Please contact us if the problem persists."
          description="Message to contact support"
        />
        <ErrorDetails caughtError={caughtError} />
      </div>
    </>
  );
};
