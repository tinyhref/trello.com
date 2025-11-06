import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@trello/nachos/button';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Error.module.less';

interface InviteLinkErrorCopyProps {
  modelType: 'board' | 'workspace';
}

const HeadingCopy: FunctionComponent<InviteLinkErrorCopyProps> = ({
  modelType,
}) => {
  switch (modelType) {
    case 'workspace':
      return (
        <FormattedMessage
          id="templates.error.you-cant-join-this-workspace"
          description="Heading informing the user they are not allowed to join the workspace"
          defaultMessage="You can't join this Workspace"
        />
      );
    case 'board':
      return (
        <FormattedMessage
          id="templates.error.you-cant-join-this-board"
          description="Heading informing the user they are not allowed to join the board"
          defaultMessage="You can't join this board"
        />
      );
    default:
      throw new Error('Invalid invite type');
  }
};

const DescriptionCopy: FunctionComponent<InviteLinkErrorCopyProps> = ({
  modelType,
}) => {
  switch (modelType) {
    case 'workspace':
      return (
        <FormattedMessage
          id="templates.error.cant-join-this-workspace-description"
          description="Message informing the user they are not allowed to join a workspace using an invitation link"
          defaultMessage=" The invitation link may have been disabled or this free Workspace may have reached the 10 collaborator limit. You can request to join the Workspace or try contacting the person who sent you the link."
        />
      );
    case 'board':
      return (
        <FormattedMessage
          id="templates.error.cant-join-this-board-description"
          description="Message informing the user they are not allowed to join a board using an invitation link"
          defaultMessage="The invitation link may have been disabled or this free Workspace may have reached the 10 collaborator limit. You can request to join the board or try contacting the person who sent you the link."
        />
      );
    default:
      throw new Error('Invalid invite type');
  }
};

const CtaCopy: FunctionComponent<InviteLinkErrorCopyProps> = ({
  modelType,
}) => {
  switch (modelType) {
    case 'workspace':
      return (
        <FormattedMessage
          id="templates.error.request-to-join-workspace"
          description="Title for the button to request to join a workspace"
          defaultMessage="Request to join Workspace"
        />
      );
    case 'board':
      return (
        <FormattedMessage
          id="templates.error.request-to-join-board"
          description="Title for the button to request to join a board"
          defaultMessage="Request to join board"
        />
      );
    default:
      throw new Error('Invalid invite type');
  }
};

interface InviteLinkErrorSendAccessRequestMessageProps {
  modelType: 'board' | 'workspace';
  isLoading: boolean;
  sendAccessRequest: () => void;
}

export const InviteLinkErrorSendAccessRequestMessage: FunctionComponent<
  InviteLinkErrorSendAccessRequestMessageProps
> = ({ modelType, isLoading, sendAccessRequest }) => {
  return (
    <div className={cx(styles.bigMessage, styles.quiet)}>
      <h1>
        <HeadingCopy modelType={modelType} />
      </h1>
      <p>
        <DescriptionCopy modelType={modelType} />
      </p>
      <div className={styles.ctaContainer}>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          appearance="primary"
          onClick={sendAccessRequest}
        >
          <CtaCopy modelType={modelType} />
        </Button>
      </div>
    </div>
  );
};
