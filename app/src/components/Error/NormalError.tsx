import cx from 'classnames';
import type { FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';

import { isEmbeddedDocument } from '@trello/browser';
import { identityBaseUrl, siteDomain } from '@trello/config';
import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { PopUpWindow } from 'app/scripts/views/lib/PopUpWindow';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import {
  getHeaderMessage,
  getLoggedInMessage,
  getLoggedOutMessage,
} from './MessageKeys';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Error.module.less';

interface NormalErrorProps {
  headerKey: string;
  loggedOutMessageKey: string;
  loggedInMessageKey: string;
  isLoggedIn: boolean;
  fullName: PIIString;
}

export const NormalError: FunctionComponent<NormalErrorProps> = ({
  headerKey,
  loggedOutMessageKey,
  loggedInMessageKey,
  isLoggedIn,
  fullName,
}) => {
  const returnUrl = window.location.pathname;
  const params = new URLSearchParams({
    prompt: 'select_account',
    continue: `${siteDomain}/auth/atlassian/callback?returnUrl=${returnUrl}`,
    application: 'trello',
  }).toString();

  const login = function (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) {
    stopPropagationAndPreventDefault(e);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const returnUrl: string = isEmbeddedDocument()
      ? '/embed/login'
      : location.pathname + location.search;
    const loginUrl: string =
      '/login?' + new URLSearchParams({ returnUrl }).toString();

    if (isEmbeddedDocument()) {
      new PopUpWindow(loginUrl).open();
    } else {
      window.location.href = loginUrl;
    }
  };

  const logInLink = (
    <a href="#" className="js-login" onClick={login}>
      <FormattedMessage
        id="templates.error.log-in-link-text"
        defaultMessage="logging in"
        description="Log in link text"
      />
    </a>
  );

  return (
    <div className={cx(styles.bigMessage, styles.quiet)}>
      <style>
        {/* If the board background got already set, text will look ugly.
        Let's unset it */}
        {`#trello-root {
          background-image: none !important;
          background-color: transparent !important;
        }`}
      </style>
      <h1>{getHeaderMessage(headerKey)}</h1>
      {isLoggedIn ? (
        <>
          <p>{getLoggedInMessage(loggedInMessageKey)}</p>
          <div className={styles.littleMessage}>
            {
              <span>
                <FormattedMessage
                  id="templates.error.different-current-user"
                  defaultMessage="Not <strong>{currentUserName}</strong>? "
                  description="Different current user message"
                  values={{
                    currentUserName: dangerouslyConvertPrivacyString(fullName),
                    strong: (chunks) => <strong>{chunks}</strong>,
                  }}
                />
              </span>
            }
            <a href={`${identityBaseUrl}/login?${params}`}>
              <FormattedMessage
                id="templates.error.switch-accounts"
                defaultMessage="Switch accounts"
                description="Switch accounts link text"
              />
            </a>
          </div>
        </>
      ) : (
        <p>{getLoggedOutMessage(loggedOutMessageKey, logInLink)}</p>
      )}
    </div>
  );
};
