import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './Error.module.less';

interface InviteLinkErrorLoggedOutMessageProps {
  modelType: 'board' | 'workspace';
}

const HeadingCopy: FunctionComponent<InviteLinkErrorLoggedOutMessageProps> = ({
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

export const InviteLinkErrorLoggedOutMessage: FunctionComponent<
  InviteLinkErrorLoggedOutMessageProps
> = ({ modelType }) => {
  return (
    <div className={cx(styles.bigMessage, styles.quiet)}>
      <h1>
        <HeadingCopy modelType={modelType} />
      </h1>
      <p>
        <FormattedMessage
          id="templates.error.the-invitation-link-may-have-been-disabled"
          description="Message informing the user they are not allowed to join a board / Workspace using an invitation link"
          defaultMessage="The invitation link may have been disabled or this free Workspace may have reached the 10 collaborator limit. Try contacting the person who sent you the link for more info."
        />
      </p>
    </div>
  );
};
