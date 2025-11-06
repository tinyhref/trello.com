import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Error.module.less';

interface InviteLinkErrorAccessRequestSentMessageProps {
  modelType: 'board' | 'workspace';
}

const DescriptionCopy: FunctionComponent<
  InviteLinkErrorAccessRequestSentMessageProps
> = ({ modelType }) => {
  switch (modelType) {
    case 'workspace':
      return (
        <FormattedMessage
          id="templates.error.request-to-join-workspace-sent-description"
          description="Message shown after a user requests to join a workspace"
          defaultMessage=" Your request to join the Workspace was sent. You’ll get a notification if it’s approved."
        />
      );
    case 'board':
      return (
        <FormattedMessage
          id="templates.error.request-to-join-board-sent-description"
          description="Message shown after a user requests to join a board"
          defaultMessage="Your request to join the board was sent. You’ll get a notification if it’s approved."
        />
      );
    default:
      throw new Error('Invalid invite type');
  }
};

export const InviteLinkErrorAccessRequestSentMessage: FunctionComponent<
  InviteLinkErrorAccessRequestSentMessageProps
> = ({ modelType }) => {
  const trackLearnMoreLinkClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'invitationLinkErrorScreenV2',
      attributes: {
        type: modelType,
      },
    });
  }, [modelType]);

  return (
    <div className={cx(styles.bigMessage, styles.quiet)}>
      <h1>
        <FormattedMessage
          id="templates.error.request-sent"
          description="Title shown after a user requests to join a board or workspace"
          defaultMessage="Request sent"
        />
      </h1>
      <p>
        <DescriptionCopy modelType={modelType} />
      </p>
      <div className={styles.ctaContainer}>
        <a
          href="https://support.atlassian.com/trello/docs/workspace-user-limit/"
          target="_blank"
          onClick={trackLearnMoreLinkClick}
        >
          <FormattedMessage
            id="templates.error.learn-more"
            description="Title for a link to a help article"
            defaultMessage="Learn more"
          />
        </a>
      </div>
    </div>
  );
};
