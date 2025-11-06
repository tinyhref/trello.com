import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import type { ActionSubjectIdType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { isEmbeddedDocument } from '@trello/browser';
import { Button } from '@trello/nachos/button';
import {
  useBoardShortLink,
  useCardShortLink,
  usePathname,
} from '@trello/router';
import { requestStorageAccess, useStorageAccess } from '@trello/storage-access';
import type { RequestAccessWhenBlockedTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { PopUpWindow } from 'app/scripts/views/lib/PopUpWindow';

import * as styles from './RequestAccessLoggedOutPageContent.module.less';

export const RequestAccessLoggedOutPageContent: FunctionComponent<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  const pathname = usePathname();
  const returnUrl = pathname;
  const boardShortLink = useBoardShortLink();
  const cardShortLink = useCardShortLink();
  const hasStorageAccess = useStorageAccess();
  const [hasOpenedAuthPopup, setHasOpenedAuthPopup] = useState(false);
  const modelId = boardShortLink || cardShortLink || '';

  const sendClickedButtonEvent = (
    buttonName: ActionSubjectIdType,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    modelId: string,
  ): void => {
    Analytics.sendClickedButtonEvent({
      buttonName,
      source: 'requestAccessLoggedOutErrorScreen',
      attributes: {
        shortlink: modelId,
        source: 'body',
      },
    });
  };

  const onSignUpClick = useCallback(() => {
    sendClickedButtonEvent('loggedOutPageSignUpButton', modelId);
    const params = new URLSearchParams({
      returnUrl: isEmbeddedDocument() ? '/embed/signup' : returnUrl,
      confirmReturnUrl: returnUrl,
    });
    const signUpUrl = '/signup?' + params.toString();
    if (isEmbeddedDocument()) {
      new PopUpWindow(signUpUrl).open();
      setHasOpenedAuthPopup(true);
    } else {
      window.location.href = signUpUrl;
    }
  }, [modelId, returnUrl]);

  const onLoginClick = useCallback(() => {
    sendClickedButtonEvent('loggedOutPageLoginButton', modelId);
    const params = new URLSearchParams({
      returnUrl: isEmbeddedDocument() ? '/embed/login' : returnUrl,
    });
    const loginUrl = '/login?' + params.toString();
    if (isEmbeddedDocument()) {
      new PopUpWindow(loginUrl).open();
      setHasOpenedAuthPopup(true);
    } else {
      window.location.href = loginUrl;
    }
  }, [modelId, returnUrl]);

  // If we don't have first-party storage access and the auth popup has been opened,
  // prompt the user to grant storage access
  const shouldDisplayStorageAccessPrompt = useCallback(() => {
    return !hasStorageAccess && hasOpenedAuthPopup;
  }, [hasOpenedAuthPopup, hasStorageAccess]);

  const onPromptStorageAccessClick = useCallback(() => {
    sendClickedButtonEvent('loggedOutPagePromptStorageAccessButton', modelId);
    requestStorageAccess((error) => {
      Analytics.sendOperationalEvent({
        action: 'failed',
        actionSubject: 'requestStorageAccess',
        source: 'requestAccessLoggedOutErrorScreen',
        attributes: {
          shortlink: modelId,
          errorMessage: error instanceof Error ? error.message : '',
        },
      });
    });
  }, [modelId]);

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.loggedOutPageSignupButtonWrapper}>
        <Button
          appearance={
            shouldDisplayStorageAccessPrompt() ? 'default' : 'primary'
          }
          onClick={onSignUpClick}
          className={styles.loggedOutPageSignupButton}
          data-testid={getTestId<RequestAccessWhenBlockedTestIds>(
            'request-access-signup-button',
          )}
        >
          <FormattedMessage
            id="templates.request_access.request-access-logged-out-page-signup"
            defaultMessage="Sign up for free"
            description="Sign up button"
          />
        </Button>
      </div>
      <div>
        <Button
          appearance="subtle-link"
          className={styles.loggedOutPageLoginButton}
          onClick={onLoginClick}
          data-testid={getTestId<RequestAccessWhenBlockedTestIds>(
            'request-access-login-button',
          )}
        >
          <FormattedMessage
            id="templates.request_access.request-access-logged-out-page-login"
            defaultMessage="Already have an account? Log in"
            description="Login button"
          />
        </Button>
      </div>
      {shouldDisplayStorageAccessPrompt() && (
        <div className={styles.requestStorageAccessWrapper}>
          <p>
            <FormattedMessage
              id="templates.request_access.request-access-logged-out-page-storage-access-context"
              defaultMessage="Once you've logged in, you'll need to allow cookies. When you do, you'll be taken to Trello."
              description="Storage access context"
            />
          </p>
          <Button appearance="primary" onClick={onPromptStorageAccessClick}>
            <FormattedMessage
              id="templates.request_access.request-access-logged-out-page-storage-access-prompt"
              defaultMessage="Allow cookies and continue to Trello"
              description="Storage access prompt"
            />
          </Button>
        </div>
      )}
    </div>
  );
};
