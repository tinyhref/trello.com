import { useCallback, useState } from 'react';
import { ApolloError } from '@apollo/client';

import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { showFlag } from '@trello/nachos/experimental-flags';

import { useMirrorCardSendAccessRequestMutation } from './MirrorCardSendAccessRequestMutation.generated';

interface AccessRequestMutationConfig {
  modelId?: string;
}

export const useMirrorCardSendAccessRequest = ({
  modelId,
}: AccessRequestMutationConfig) => {
  const [sendAccessRequestMutation] = useMirrorCardSendAccessRequestMutation();
  const [status, setStatus] = useState<'access-requested' | 'idle' | 'loading'>(
    'idle',
  );

  const sendAccessRequest = useCallback(async () => {
    if (!modelId) {
      return;
    }

    setStatus('loading');

    const traceId = Analytics.startTask({
      taskName: 'create-requestAccess/card',
      source: 'boardScreen',
    });

    try {
      const res = await sendAccessRequestMutation({
        variables: {
          modelId,
          modelType: 'card',
          traceId,
        },
      });

      if (!res.data?.sendAccessRequest?.success) {
        throw new Error('Access request failed');
      }

      Analytics.taskSucceeded({
        taskName: 'create-requestAccess/card',
        source: 'boardScreen',
        traceId,
      });

      showFlag({
        id: 'mirrorCardRequestAccessSubmitted',
        title: intl.formatMessage({
          id: 'templates.mirror_card.request-access-submitted-success-title',
          defaultMessage: 'You requested access to this card.',
          description:
            'Message for the restricted access submitted flag on a mirror card',
        }),
        description: intl.formatMessage({
          id: 'templates.mirror_card.request-access-submitted-success-description',
          defaultMessage:
            'If approved, you will be able to view and edit this card.',
          description:
            'Message for the restricted access submitted flag on a mirror card',
        }),
        appearance: 'success',
        isAutoDismiss: true,
      });
      setStatus('access-requested');
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'create-requestAccess/card',
        source: 'boardScreen',
        error,
        traceId,
      });

      showFlag({
        id: 'mirrorCardRequestAccessError',
        title: intl.formatMessage({
          id: 'templates.mirror_card.request-access-submitted-error-title',
          defaultMessage: 'Your request was not submitted.',
          description:
            'Error message for the restricted access submitted flag on a mirror card',
        }),
        description: intl.formatMessage({
          id: 'templates.mirror_card.request-access-submitted-error-description',
          defaultMessage: 'Check your connection or try again later.',
          description:
            'Error message for the restricted access submitted flag on a mirror card',
        }),
        appearance: 'error',
        isAutoDismiss: true,
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

      setStatus('idle');
    }
  }, [sendAccessRequestMutation, modelId]);

  return {
    sendAccessRequest,
    status,
  };
};
