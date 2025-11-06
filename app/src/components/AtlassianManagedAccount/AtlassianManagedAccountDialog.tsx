import type { FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { NEWLY_MANAGED_MESSAGE_ID } from '@trello/aa-migration';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { Dialog, DialogCloseButton, useDialog } from '@trello/nachos/dialog';
import { showFlag } from '@trello/nachos/experimental-flags';

import { useDismissNewlyManagedMessageMutation } from './DismissNewlyManagedMessageMutation.generated';

import * as styles from './AtlassianManagedAccountDialog.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import managedDesktopSvg from 'resources/images/aa-migration/managed-desktop.svg';
// eslint-disable-next-line @trello/assets-alongside-implementation
import managedMobileSvg from 'resources/images/aa-migration/managed-mobile.svg';

const TRANSFER_BOARDS_URL = 'https://trello.com/support/transfer-boards';

const illustrations = {
  main: {
    full: managedDesktopSvg,
    mobile: managedMobileSvg,
  },
};

export interface AtlassianManagedAccountDialogProps {
  id: string;
  hasBoards: boolean;
  orgName?: string;
  analyticsContext: Parameters<
    typeof Analytics.sendScreenEvent
  >[0]['attributes'];
  analyticsContainers: object;
}

export const AtlassianManagedAccountDialog: FunctionComponent<
  AtlassianManagedAccountDialogProps
> = ({ id, hasBoards, orgName, analyticsContext, analyticsContainers }) => {
  const [dismissNewlyManagedMessage] = useDismissNewlyManagedMessageMutation();
  const markAsDismissed = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'complete-onboarding/managed-account',
      source: 'atlassianManagedAccountModal',
    });

    try {
      await dismissNewlyManagedMessage({
        variables: {
          memberId: id,
          messageId: NEWLY_MANAGED_MESSAGE_ID,
        },
      });
      Analytics.taskSucceeded({
        taskName: 'complete-onboarding/managed-account',
        source: 'atlassianManagedAccountModal',
        traceId,
      });
    } catch (err) {
      showFlag({
        id: 'ManagedAccount',
        title: intl.formatMessage({
          id: 'templates.app_management.something-went-wrong',
          defaultMessage: 'Something went wrong. Please try again later.',
          description: 'Message alerting the user that something went wrong',
        }),
        appearance: 'error',
        isAutoDismiss: true,
      });
      Analytics.taskFailed({
        taskName: 'complete-onboarding/managed-account',
        source: 'atlassianManagedAccountModal',
        traceId,
        error: err,
      });
    }
  }, [dismissNewlyManagedMessage, id]);

  const { hide, show, dialogProps } = useDialog({
    onHide: () => {
      Analytics.sendClosedComponentEvent({
        componentType: 'overlay',
        componentName: 'atlassianManagedAccountOverlay',
        source: 'atlassianManagedAccountBanner',
        attributes: analyticsContext,
        containers: analyticsContainers,
      });
    },
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'atlassianManagedAccountModal',
        attributes: analyticsContext,
        containers: analyticsContainers,
      });
    },
  });

  const onGotIt = useCallback(async () => {
    await markAsDismissed();
    Analytics.sendClickedButtonEvent({
      buttonName: 'atlassianManagedAccountOverlayGotItButton',
      source: 'atlassianManagedAccountModal',
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
    hide();
  }, [analyticsContainers, analyticsContext, hide, markAsDismissed]);

  const onClose = useCallback(async () => {
    await markAsDismissed();
    Analytics.sendClickedButtonEvent({
      buttonName: 'atlassianManagedAccountOverlayCloseButton',
      source: 'atlassianManagedAccountModal',
      attributes: analyticsContext,
      containers: analyticsContainers,
    });
    hide();
  }, [analyticsContainers, analyticsContext, hide, markAsDismissed]);

  useEffect(() => {
    show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      {...dialogProps}
      alignment="top"
      size="large"
      closeOnEscape={false}
      closeOnOutsideClick={false}
      className={styles.dialog}
    >
      <div className={styles.illustrationMobile}>
        <img alt="" role="presentation" src={illustrations.main.mobile} />
      </div>
      <div className={styles.controls}>
        <DialogCloseButton onClick={onClose} className={styles.closeButton} />
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            <FormattedMessage
              id="aa onboarding.dialog.managed account title"
              defaultMessage="Heads up! Your account is managed."
              description="Title for the managed account dialog"
            />
          </h2>
        </header>
        <div>
          <ul className={styles.managedAccountContent}>
            <li>
              <FormattedMessage
                id="aa onboarding.dialog.managed account main message"
                defaultMessage="Because your account uses a {orgName} email, your account is managed by {orgName}."
                description="Message explaining that the account is managed by the organization"
                values={{ orgName }}
              />
            </li>
            <li>
              <FormattedMessage
                id="aa onboarding.dialog.managed account secondary message"
                defaultMessage="This means that {orgName} admins can make changes to your account, including deactivating or deleting it."
                description="Message explaining that the organization can make changes to the account"
                values={{ orgName }}
              />
            </li>
            <li>
              <FormattedMessage
                id="aa onboarding.dialog.managed account tertiary message"
                defaultMessage="This account should only be used for {orgName}."
                description="Message explaining that the account should only be used for the organization"
                values={{ orgName }}
              />
              {
                ' ' // This space is intentional to ensure there is whitespace between the two sentences.
              }
              {hasBoards && (
                <FormattedMessage
                  id="aa onboarding.dialog.managed account transfer boards message"
                  defaultMessage="If you have personal boards in this account, {managedAccountTransferLink}"
                  description="Message explaining that the user should transfer their personal boards to a different account"
                  values={{
                    managedAccountTransferLink: (
                      <a
                        href={TRANSFER_BOARDS_URL}
                        target="_blank"
                        key="transfer-link"
                      >
                        <FormattedMessage
                          id="aa onboarding.dialog.managed account transfer link"
                          defaultMessage="be sure to transfer them to a different account."
                          description="Link text for the managed account dialog"
                        />
                      </a>
                    ),
                  }}
                />
              )}
            </li>
          </ul>
          <div>
            <Button appearance="primary" size="wide" onClick={onGotIt}>
              <FormattedMessage
                id="aa onboarding.dialog.got it"
                defaultMessage="Got it"
                description="Button text for the managed account dialog"
              />
            </Button>
          </div>
          <div className={styles.illustrationFull}>
            <img alt="" role="presentation" src={illustrations.main.full} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
