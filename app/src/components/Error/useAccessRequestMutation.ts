import { useCallback, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';

import { useInviteLinkErrorSendAccessRequestMutation } from './InviteLinkErrorSendAccessRequestMutation.generated';

interface AccessRequestMutationConfig {
  modelType?: 'board' | 'workspace';
  modelId?: string;
}

export const useAccessRequestMutation = ({
  modelType,
  modelId,
}: AccessRequestMutationConfig) => {
  const [sendAccessRequestMutation] =
    useInviteLinkErrorSendAccessRequestMutation();
  const [status, setStatus] = useState<'access-requested' | 'idle' | 'loading'>(
    'idle',
  );

  const sendAccessRequest = useCallback(async () => {
    if (!modelType || !modelId) {
      return;
    }

    setStatus('loading');

    Analytics.sendClickedButtonEvent({
      buttonName: 'requestToJoinButton',
      source: 'invitationLinkErrorScreenV2',
      attributes: {
        type: modelType,
      },
      // formatContainers handles filtering out the falsy values.
      containers: formatContainers({
        boardId: modelType === 'board' ? modelId : undefined,
        workspaceId: modelType === 'workspace' ? modelId : undefined,
      }),
    });

    const traceId = Analytics.startTask({
      taskName: `create-requestAccess/${modelType}`,
      source: 'invitationLinkErrorScreenV2',
    });

    try {
      const res = await sendAccessRequestMutation({
        variables: {
          modelId,
          modelType: modelType === 'workspace' ? 'organization' : modelType,
          traceId,
        },
      });

      if (!res.data?.sendAccessRequest?.success) {
        throw new Error('Access request failed');
      }

      Analytics.taskSucceeded({
        taskName: `create-requestAccess/${modelType}`,
        source: 'invitationLinkErrorScreenV2',
        traceId,
      });

      setStatus('access-requested');
    } catch (error) {
      Analytics.taskFailed({
        taskName: `create-requestAccess/${modelType}`,
        source: 'invitationLinkErrorScreenV2',
        error,
        traceId,
      });

      const hasAlreadyRequestedAccess =
        error instanceof ApolloError &&
        error.message === 'REQUEST_ACCESS_MEMBER_LIMIT_EXCEEDED';

      // This should never happen as we should have already checked for this
      // before trying to call the mutation so even though the request has been
      // created we should still log this as an error for vitalstats so that
      // it can be investigated.
      if (hasAlreadyRequestedAccess) {
        setStatus('access-requested');
        return;
      }

      showFlag({
        id: 'invitationLinkErrorSendAccessRequestError',
        title: intl.formatMessage({
          id: 'templates.app_management.something-went-wrong',
          defaultMessage: 'Something went wrong. Please try again later.',
          description:
            'Generic error message shown when requesting access to a workspace fails.',
        }),
        appearance: 'error',
        isAutoDismiss: true,
      });

      setStatus('idle');
    }
  }, [sendAccessRequestMutation, modelType, modelId]);

  return {
    sendAccessRequest,
    status,
  };
};
