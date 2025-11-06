import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { intl } from '@trello/i18n';
import { Spinner } from '@trello/nachos/spinner';

import { useDocumentTitle } from 'app/src/components/DocumentTitle';
import { InviteLinkErrorAccessRequestSentMessage } from './InviteLinkErrorAccessRequestSentMessage';
import { InviteLinkErrorLoggedOutMessage } from './InviteLinkErrorLoggedOutMessage';
import { useInviteLinkErrorMessageAccessRequestQuery } from './InviteLinkErrorMessageAccessRequestQuery.generated';
import { InviteLinkErrorSendAccessRequestMessage } from './InviteLinkErrorSendAccessRequestMessage';
import { useAccessRequestMutation } from './useAccessRequestMutation';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Error.module.less';

interface InviteLinkErrorMessageProps {
  modelType: 'board' | 'workspace';
  modelId: string;
}

export const InviteLinkErrorMessage: FunctionComponent<
  InviteLinkErrorMessageProps
> = ({ modelType, modelId }) => {
  const isLoggedIn = isMemberLoggedIn();

  const { data, loading } = useInviteLinkErrorMessageAccessRequestQuery({
    variables: {
      modelId,
      modelType: modelType === 'workspace' ? 'organization' : modelType,
    },
    waitOn: ['None'],
    skip: !isLoggedIn,
  });

  const { sendAccessRequest, status } = useAccessRequestMutation({
    modelType,
    modelId,
  });

  const hasAlreadyRequestedAccess =
    !data?.accessRequest.allowed &&
    data?.accessRequest.reason === 'REQUEST_ACCESS_MEMBER_LIMIT_EXCEEDED';

  useDocumentTitle(
    hasAlreadyRequestedAccess || status === 'access-requested'
      ? intl.formatMessage({
          id: 'templates.error.request-sent',
          defaultMessage: 'Request sent',
          description: 'Access request sent page title',
        })
      : intl.formatMessage({
          id: 'error',
          defaultMessage: 'Error',
          description: 'Error page title',
        }),
  );

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'invitationLinkErrorScreenV2',
      attributes: {
        type: modelType,
      },
      // formatContainers handles filtering out the falsy values.
      containers: formatContainers({
        boardId: modelType === 'board' ? modelId : undefined,
        workspaceId: modelType === 'workspace' ? modelId : undefined,
      }),
    });
  }, [modelType, modelId]);

  if (!isLoggedIn) {
    return <InviteLinkErrorLoggedOutMessage modelType={modelType} />;
  }

  if (loading) {
    return <Spinner centered wrapperClassName={styles.bigMessage} />;
  }

  if (hasAlreadyRequestedAccess || status === 'access-requested') {
    return <InviteLinkErrorAccessRequestSentMessage modelType={modelType} />;
  }

  return (
    <InviteLinkErrorSendAccessRequestMessage
      modelType={modelType}
      sendAccessRequest={sendAccessRequest}
      isLoading={status === 'loading'}
    />
  );
};
