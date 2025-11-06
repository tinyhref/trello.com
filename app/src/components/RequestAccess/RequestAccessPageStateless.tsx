import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { identityBaseUrl, siteDomain } from '@trello/config';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import { Spinner } from '@trello/nachos/spinner';
import type { PIIString } from '@trello/privacy';
import { token } from '@trello/theme';

import { RequestAccess } from './RequestAccess';
import { RequestAccessPageSkeleton } from './RequestAccessPageSkeleton';

import * as styles from './RequestAccessPageStateless.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import headerImageSvg from 'resources/images/request-access/header-image.svg';

export type RequestAccessScreen =
  | 'loading'
  | 'request-access-allowed'
  | 'request-access-board-not-found'
  | 'request-access-contact-admin'
  | 'request-access-generic-error'
  | 'request-access-rate-limited'
  | 'request-access-submitted';

export interface RequestAccessPageStatelessProps {
  member: {
    id: string;
    fullName: PIIString;
    email: PIIString;
  };
  model: {
    modelType: string;
    modelId: string;
  };
  screen: RequestAccessScreen;
  onSubmit: () => void;
  disabled: boolean;
}

export const RequestAccessPageStateless = ({
  disabled,
  member,
  model,
  screen,
  onSubmit,
}: RequestAccessPageStatelessProps) => {
  const returnUrl = window.location.pathname;
  const loginParams = new URLSearchParams({
    prompt: 'select_account',
    continue: `${siteDomain}/auth/atlassian/callback?returnUrl=${returnUrl}`,
    application: 'trello',
  }).toString();

  const switchAccountUrl = `${identityBaseUrl}/login?${loginParams}`;

  const switchAccountOnClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'switchAccountButton',
      source: 'requestAccessScreen',
      attributes: {
        reason: 'Unauthorized',
        cohort: 'experiment',
        flow: model.modelType,
        shortlink: model.modelId,
      },
    });
  }, [model.modelId, model.modelType]);

  const onRequestAccessSubmit = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'requestAccessButton',
      source: 'requestAccessScreen',
      attributes: {
        reason: 'Unauthorized',
        cohort: 'experiment',
        flow: model.modelType,
        shortlink: model.modelId,
      },
    });

    onSubmit();
  }, [model.modelType, model.modelId, onSubmit]);

  useEffect(() => {
    if (screen === 'request-access-allowed') {
      Analytics.sendScreenEvent({
        name: 'requestAccessScreen',
        attributes: {
          reason: 'Unauthorized',
          cohort: 'experiment',
          screen,
          flow: model.modelType,
          shortlink: model.modelId,
        },
      });
    }

    if (screen === 'request-access-rate-limited') {
      Analytics.sendScreenEvent({
        name: 'requestAccessSuccessScreen',
        attributes: {
          reason: 'Unauthorized',
          cohort: 'experiment',
          screen,
          flow: model.modelType,
          shortlink: model.modelId,
        },
      });
    }

    if (screen === 'request-access-submitted') {
      Analytics.sendScreenEvent({
        name: 'requestAccessSuccessScreen',
        attributes: {
          reason: 'Unauthorized',
          cohort: 'experiment',
          screen,
          flow: model.modelType,
          shortlink: model.modelId,
        },
      });
    }

    if (screen === 'request-access-contact-admin') {
      Analytics.sendScreenEvent({
        name: 'requestAccessContactAdminScreen',
        attributes: {
          reason: 'Unauthorized',
          cohort: 'experiment',
          screen,
          flow: model.modelType,
          shortlink: model.modelId,
        },
      });
    }

    if (screen === 'request-access-board-not-found') {
      Analytics.sendScreenEvent({
        name: 'requestAccessBoardNotFoundScreen',
        attributes: {
          reason: 'Unauthorized',
          cohort: 'experiment',
          screen,
          flow: model.modelType,
          shortlink: model.modelId,
        },
      });
    }

    if (screen === 'request-access-generic-error') {
      Analytics.sendScreenEvent({
        name: 'requestAccessGenericErrorScreen',
        attributes: {
          reason: 'Unauthorized',
          cohort: 'experiment',
          screen,
          flow: model.modelType,
          shortlink: model.modelId,
        },
      });
    }
  }, [screen, model.modelType, model.modelId]);

  return (
    <RequestAccessPageSkeleton>
      {screen === 'loading' && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      {(screen === 'request-access-submitted' ||
        screen === 'request-access-rate-limited') && (
        <>
          <img src={headerImageSvg} alt="" className={styles.headerImage} />
          <h1 className={styles.title}>
            <FormattedMessage
              id="templates.request_access.request-access-submitted-title"
              defaultMessage="Request sent"
              description="Request sent title"
            />
          </h1>
          <p className={styles.description}>
            <CheckCircleIcon
              size="large"
              color={token('color.icon.accent.green', '#22A06B')}
            />
            <FormattedMessage
              id="templates.request_access.request-access-submitted-description"
              defaultMessage="You’ll get an email if you’re approved to join."
              description="Request sent description"
            />
          </p>
        </>
      )}
      {screen === 'request-access-allowed' && (
        <>
          <img src={headerImageSvg} alt="" className={styles.headerImage} />
          <h1 className={styles.title}>
            <FormattedMessage
              id="templates.request_access.request-access-title"
              defaultMessage="This board is private"
              description="Request access title"
            />
          </h1>
          <RequestAccess
            {...member}
            onSubmit={onRequestAccessSubmit}
            description={
              <FormattedMessage
                id="templates.request_access.request-access-description"
                defaultMessage="Send a request to this board’s admins to get access. If you’re approved to join, you'll receive an email."
                description="Request access description"
              />
            }
            switchAccountUrl={switchAccountUrl}
            switchAccountOnClick={switchAccountOnClick}
            disabled={disabled}
          />
        </>
      )}
      {screen === 'request-access-contact-admin' && (
        <h1 className={styles.title}>
          <FormattedMessage
            id="templates.request_access.request-access-contact-admin"
            defaultMessage="To access this board, contact a Workspace admin."
            description="Request access contact admin title"
          />
        </h1>
      )}
      {screen === 'request-access-board-not-found' && (
        <>
          <h1 className={styles.title} data-testid="board-not-found-title">
            <FormattedMessage
              id="templates.request_access.request-access-page-board-not-found-title"
              defaultMessage="Board not found"
              description="Board not found title"
            />
          </h1>
          <p className={styles.title}>
            <FormattedMessage
              id="templates.request_access.request-access-page-board-not-found-description"
              defaultMessage="The board you're looking for may have been deleted or the URL might have a typo. Check that you have the correct link or contact the board admin for help."
              description="Board not found description"
            />
          </p>
        </>
      )}
      {screen === 'request-access-generic-error' && (
        <>
          <h1 className={styles.title} data-testid="generic-error-title">
            <FormattedMessage
              id="templates.request_access.request-access-page-error-title"
              defaultMessage="Something went wrong"
              description="Generic error title"
            />
          </h1>
          <p className={styles.title}>
            <FormattedMessage
              id="templates.request_access.request-access-page-error-description"
              defaultMessage="We’re having trouble sending your access request. Please refresh the page and try again."
              description="Generic error description"
            />
          </p>
        </>
      )}
    </RequestAccessPageSkeleton>
  );
};
