import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { getUnconfirmedErrorMessage } from './MessageKeys';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Error.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import tacoBouncerPng from 'resources/images/TacoBouncer.png';

interface UnconfirmedModelErrorProps {
  messageKey: string;
  email: PIIString;
}

export const UnconfirmedModelError: FunctionComponent<
  UnconfirmedModelErrorProps
> = ({ messageKey, email }) => {
  return (
    <div className={cx(styles.bigMessage, styles.withPicture, styles.quiet)}>
      <img src={tacoBouncerPng} width="459" height="238" alt="" />
      <h1>
        <FormattedMessage
          id="templates.error.roooooo-are-you"
          defaultMessage="Roooooo are you?"
          description="Roooooo are you? error message"
        />
      </h1>
      <p>{getUnconfirmedErrorMessage(messageKey)}</p>
      <div className="callout">
        <ol>
          <li>
            <FormattedMessage
              id="templates.error.check-your-email-at-email"
              defaultMessage="Check your email at <strong>{email}</strong>."
              description="Check your email at email error message"
              values={{
                email: dangerouslyConvertPrivacyString(email),
                strong: (chunks) => <strong>{chunks}</strong>,
              }}
            />
          </li>
          <li>
            <FormattedMessage
              id="templates.error.look-for-an-email-with-the-subject-trello-account-confirmation"
              defaultMessage='Look for an email with the subject "Trello Account Confirmation."'
              description="Look for an email with the subject trello account confirmation error message"
            />
          </li>
          <li>
            <FormattedMessage
              id="templates.error.click-on-the-confirmation-link-done"
              defaultMessage="Click on the confirmation link. Done!"
              description="Click on the confirmation link done error message"
            />
          </li>
        </ol>
      </div>
      <p>
        <FormattedMessage
          id="templates.error.dont-see-anything-from-us"
          defaultMessage="Don't see anything from us?"
          description="Don't see anything from us error message"
        />{' '}
        <a
          href="#"
          className={cx(styles.quiet, 'js-resend-confirmation-email')}
        >
          <FormattedMessage
            id="templates.error.resend-confirmation-link"
            defaultMessage="Resend confirmation link."
            description="Resend confirmation link error message"
          />
        </a>
      </p>
    </div>
  );
};
