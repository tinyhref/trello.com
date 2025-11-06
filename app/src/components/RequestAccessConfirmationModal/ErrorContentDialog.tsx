import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import type { ErrorHandlerProps } from '@trello/error-boundaries';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';

import { AutoInviteDialogBackgroundStateless } from './AutoInviteDialogBackgroundStateless';

export interface ErrorContentDialog extends ErrorHandlerProps {
  handleClick: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ErrorContentDialog: FunctionComponent<ErrorContentDialog> = ({
  handleClick,
}) => {
  const handleErrorClick = useCallback(() => {
    Analytics.sendScreenEvent({
      name: 'requestAccessAutoInviteModal',
      attributes: {
        modalScreen: 'auto-invite-error-boundary',
      },
    });
    Analytics.sendClickedButtonEvent({
      buttonName: 'confirmSomethingWentWrongButton',
      source: 'requestAccessAutoInviteModal',
    });
    handleClick();
  }, [handleClick]);

  return (
    <AutoInviteDialogBackgroundStateless
      title={intl.formatMessage({
        id: 'templates.request_access.request-access-page-error-title',
        defaultMessage: 'Something went wrong',
        description: 'Error message displayed when access request fails.',
      })}
      description={
        <FormattedMessage
          id="templates.request_access.request-access-page-error-title"
          defaultMessage="Something went wrong"
          description="Error message displayed when access request fails."
          tagName="p"
        />
      }
      imagePath="generic-error.svg"
      buttons={
        <Button
          size="fullwidth"
          appearance="primary"
          onClick={handleErrorClick}
        >
          <FormattedMessage
            id="templates.request_access.request-access-invite-error-modal-text"
            defaultMessage="We're having trouble adding your teammate. Go back to the request access email, and select Add to board to try again."
            description="Error message when adding teammate asking the user to retry."
          />
        </Button>
      }
    />
  );
};
