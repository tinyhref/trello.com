import { Suspense, useCallback, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { getNetworkError } from '@trello/graphql-error-handling';
// eslint-disable-next-line no-restricted-imports
import type { RequestAccessModelType } from '@trello/graphql/generated';
import { intl } from '@trello/i18n';
import { EMPTY_PII_STRING } from '@trello/privacy';
import {
  useBoardShortLink,
  useCardShortLink,
  useRouteId,
} from '@trello/router';
import { RouteId } from '@trello/router/routes';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useDocumentTitle } from 'app/src/components/DocumentTitle';
import { useRequestAccessPageQuery } from './RequestAccessPageQuery.generated';
import { useSendRequestAccessMutation } from './SendRequestAccessMutation.generated';

import type { RequestAccessScreen } from './RequestAccessPageStateless';
import { RequestAccessPageStateless } from './RequestAccessPageStateless';

export const RequestAccessPage = () => {
  const routeId = useRouteId();
  const boardShortLink = useBoardShortLink();
  const cardShortLink = useCardShortLink();
  const modelType = routeId as RequestAccessModelType;
  const modelId = boardShortLink || cardShortLink || '';
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] =
    useState(false);

  const dismissEmailVerificationDialog = useCallback(() => {
    setShowEmailVerificationDialog(false);
  }, []);

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useRequestAccessPageQuery({
    skip: routeId !== RouteId.BOARD && routeId !== RouteId.CARD,
    variables: {
      memberId: 'me',
      modelType,
      modelId,
    },
    waitOn: ['MemberHeader'],
  });

  const [
    sendRequest,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useSendRequestAccessMutation();

  const member = {
    id: queryData?.member?.id || '',
    email: queryData?.member?.email || EMPTY_PII_STRING,
    fullName: queryData?.member?.fullName || EMPTY_PII_STRING,
    confirmed: queryData?.member?.confirmed || false,
    primaryEmailLoginId:
      queryData?.member?.logins?.find((login) => login.primary)?.id ?? '',
  };

  const EmailVerificationOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "request-access-page-email-verification-overlay" */ 'app/src/components/EmailVerificationOverlay'
      ),
    {
      namedImport: 'EmailVerificationOverlay',
      preload: !queryLoading && !member?.confirmed,
    },
  );

  const createRequest = useCallback(
    (traceId: string) => {
      return sendRequest({
        variables: {
          modelId,
          modelType,
          traceId,
        },
      });
    },
    [modelId, modelType, sendRequest],
  );

  const submitRequest = useCallback(async () => {
    if (!member.confirmed) {
      setShowEmailVerificationDialog(true);
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'create-requestAccess/board',
      source: 'requestAccessScreen',
      attributes: {
        modelType,
      },
    });

    try {
      await createRequest(traceId);

      Analytics.taskSucceeded({
        taskName: 'create-requestAccess/board',
        source: 'requestAccessScreen',
        traceId,
        attributes: {
          modelType,
        },
      });
    } catch (error) {
      throw Analytics.taskFailed({
        taskName: 'create-requestAccess/board',
        source: 'requestAccessScreen',
        error,
        traceId,
        attributes: {
          modelType,
        },
      });
    }
  }, [createRequest, member.confirmed, modelType]);

  useDocumentTitle(
    intl.formatMessage({
      id: 'templates.request_access.request-access-document-title',
      defaultMessage: 'Request access',
      description:
        'Localization key for document title in Request Access page.',
    }),
  );

  let screen: RequestAccessScreen;
  if (queryError) {
    const networkError = getNetworkError(queryError);

    if (networkError?.message === 'BOARD_NOT_FOUND') {
      screen = 'request-access-board-not-found';
    } else {
      screen = 'request-access-generic-error';
    }
  } else if (mutationError) {
    const networkError = getNetworkError(mutationError);

    if (networkError?.message === 'BOARD_NOT_FOUND') {
      screen = 'request-access-board-not-found';
    } else {
      screen = 'request-access-generic-error';
    }
  } else if (queryLoading) {
    screen = 'loading';
  } else if (
    !queryData?.accessRequest.allowed &&
    queryData?.accessRequest.reason === 'REQUEST_ACCESS_MEMBER_LIMIT_EXCEEDED'
  ) {
    screen = 'request-access-rate-limited';
  } else if (mutationData?.sendAccessRequest?.success) {
    screen = 'request-access-submitted';
  } else if (queryData?.accessRequest.allowed) {
    screen = 'request-access-allowed';
  } else {
    screen = 'request-access-contact-admin';
  }

  return (
    <>
      <RequestAccessPageStateless
        screen={screen}
        member={member}
        model={{ modelType, modelId }}
        onSubmit={submitRequest}
        disabled={mutationLoading}
      />
      {showEmailVerificationDialog && (
        <Suspense fallback={null}>
          <ChunkLoadErrorBoundary fallback={null}>
            <EmailVerificationOverlay
              email={member?.email}
              loginId={member?.primaryEmailLoginId}
              upgradeText={intl.formatMessage({
                id: 'templates.request_access.request-access-verify-email-modal-upgrade-text',
                defaultMessage: 'To request access, click the link we sent to:',
                description:
                  'Prompt to verify email by clicking the sent link.',
              })}
              onDismiss={dismissEmailVerificationDialog}
              isDismissible
            />
          </ChunkLoadErrorBoundary>
        </Suspense>
      )}
    </>
  );
};
