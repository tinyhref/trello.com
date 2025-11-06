import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { isMemberLoggedIn } from '@trello/authentication';
import { ErrorBoundary } from '@trello/error-boundaries';
import { TrelloIntlProvider } from '@trello/i18n';
import { getInvitationCookieData } from '@trello/invitation-links';
import { EMPTY_PII_STRING } from '@trello/privacy';
import { useRouteId } from '@trello/router';
import { RouteId } from '@trello/router/routes';

// eslint-disable-next-line no-restricted-imports
import { Controller } from 'app/scripts/controller';
import { focusContent } from 'app/scripts/controller/focusContent';
import { setDocumentTitle } from 'app/src/components/DocumentTitle';
import {
  RequestAccessErrorHandler,
  RequestAccessLoggedOutPage,
  RequestAccessPage,
  useRequestAccessPage,
} from 'app/src/components/RequestAccess';
import type { ErrorProps } from './Error.types';
import { useErrorQuery } from './ErrorQuery.generated';
import { InviteLinkErrorMessage } from './InviteLinkErrorMessage';
import { MessageKeys } from './MessageKeys';
import { NormalError } from './NormalError';
import { ServerError } from './ServerError';
import { UnconfirmedModelError } from './UnconfirmedModelError';

import * as styles from './Error.module.less';

export const Error: FunctionComponent<ErrorProps> = ({
  errorType = 'notFound',
  reason,
}) => {
  const { data } = useErrorQuery({ waitOn: ['MemberHeader'] });
  const isLoggedIn = isMemberLoggedIn();
  const fullName = data?.member?.fullName || EMPTY_PII_STRING;
  const email = data?.member?.email || EMPTY_PII_STRING;
  const routeId = useRouteId();
  const intl = useIntl();

  const { adjustedErrorType } = useRequestAccessPage({
    isLoggedIn,
    errorType,
    reason,
  });

  useEffect(() => {
    Controller.setViewType('error');
    focusContent();
    setDocumentTitle(
      intl.formatMessage({
        id: 'error',
        defaultMessage: 'Error',
        description: 'Error page title',
      }),
    );
  }, [intl]);

  switch (adjustedErrorType) {
    case 'requestAccess':
      return (
        <ErrorBoundary
          errorHandlerComponent={RequestAccessErrorHandler}
          tags={{ ownershipArea: 'trello-web-eng' }}
        >
          <RequestAccessPage />
        </ErrorBoundary>
      );
    case 'requestAccessLoggedout':
      return (
        <ErrorBoundary
          errorHandlerComponent={RequestAccessErrorHandler}
          tags={{
            ownershipArea: 'trello-web-eng',
            feature: 'Request Access when Blocked Phase 2',
          }}
        >
          <RequestAccessLoggedOutPage
            title={intl.formatMessage({
              id: 'templates.error.request-access-logged-out-page-title',
              defaultMessage: 'Sign up to see this board',
              description: 'Request access logged out page title',
            })}
            subtitle={intl.formatMessage({
              id: 'templates.error.request-access-logged-out-page-subtitle',
              defaultMessage:
                'You’re almost there! The board you are trying to access requires a Trello account.',
              description: 'Request access logged out page subtitle',
            })}
          />
        </ErrorBoundary>
      );

    case 'serverError': {
      const messageKey =
        routeId === RouteId.BOARD
          ? MessageKeys[errorType][0]
          : MessageKeys[errorType][1];
      return <ServerError messageKey={messageKey} />;
    }

    case 'notFound':
    case 'boardNotFound':
    case 'notPermissionsToSeeBoard':
    case 'cardNotFound':
    case 'malformedUrl': {
      const [headerKey, loggedOutMessageKey, loggedInMessageKey] =
        MessageKeys[errorType];
      return (
        <NormalError
          headerKey={headerKey}
          loggedOutMessageKey={loggedOutMessageKey}
          loggedInMessageKey={loggedInMessageKey}
          isLoggedIn={isLoggedIn}
          fullName={fullName}
        />
      );
    }
    case 'noPermissionToSeeSearch':
      return (
        <ErrorBoundary tags={{ ownershipArea: 'trello-web-eng' }}>
          <RequestAccessLoggedOutPage
            title={intl.formatMessage({
              id: 'templates.error.request-access-logged-out-page-title-search',
              defaultMessage: 'Sign up to complete your search',
              description: 'Request access logged out cannot search page title',
            })}
            subtitle={intl.formatMessage({
              id: 'templates.error.request-access-logged-out-page-subtitle-search',
              defaultMessage:
                'Looks like you need to be logged into your Trello account to complete this search',
              description:
                'Request access logged out cannot search page subtitle',
            })}
          />
        </ErrorBoundary>
      );
    case 'invalidBoardInvite':
    case 'invalidWorkspaceInvite': {
      const { type: modelType, orgOrBoardId: modelId } =
        getInvitationCookieData();

      const hasValidInvitationCookie =
        ['board', 'organization'].includes(modelType ?? '') && modelId;

      if (!hasValidInvitationCookie) {
        return <ServerError messageKey="trouble-loading-trello" />;
      }

      return (
        <TrelloIntlProvider>
          <InviteLinkErrorMessage
            modelType={modelType === 'organization' ? 'workspace' : 'board'}
            modelId={modelId}
          />
        </TrelloIntlProvider>
      );
    }
    case 'unconfirmedOrgNotFound':
    case 'unconfirmedBoardNotFound':
    case 'unconfirmedEnterpriseNotFound':
      return (
        <UnconfirmedModelError
          messageKey={MessageKeys[errorType][0]}
          email={email}
        />
      );
    default:
      return (
        <div className={cx(styles.bigMessage, styles.quiet)}>
          <h1>
            <FormattedMessage
              id="templates.error.page-not-found"
              defaultMessage="Page not found."
              description="Page not found error message"
            />
          </h1>
        </div>
      );
  }
};
