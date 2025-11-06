import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import * as styles from './PageError.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import tacoSleepSvg from 'resources/images/taco-sleep.svg';

export const PageError: FunctionComponent = () => (
  <div className={styles.errorMessage}>
    <img alt="Taco" src={tacoSleepSvg} />
    <h1>
      <FormattedMessage
        id="templates.error.global-unhandled"
        description="Error message for global unhandled errors"
        defaultMessage="Something's gone wrong"
      />
    </h1>
    <p>
      <FormattedMessage
        id="templates.error.reload-call-to-action"
        description="Call to action message suggesting the user to reload the page"
        defaultMessage="You may want to try reloading this page."
      />
    </p>
    <p>
      <FormattedMessage
        id="templates.error.contact-us"
        description="Message suggesting the user to contact support if the problem persists"
        defaultMessage="Please contact us if the problem persists."
      />
    </p>
  </div>
);
