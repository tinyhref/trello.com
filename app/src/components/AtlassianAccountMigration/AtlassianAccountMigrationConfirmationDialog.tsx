import type { FunctionComponent } from 'react';
import { useCallback, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Avatar as CanonicalAvatar } from '@atlassian/trello-canonical-components';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { intl } from '@trello/i18n';
import { Dialog, DialogCloseButton, useDialog } from '@trello/nachos/dialog';
import { showFlag } from '@trello/nachos/experimental-flags';
import type { PIIString } from '@trello/privacy';
import {
  dangerouslyConvertPrivacyString,
  EMPTY_PII_STRING,
} from '@trello/privacy';

import { AaEnterpriseMigrationContent } from './AaEnterpriseMigrationContent';
import { AaInactiveMigrationContent } from './AaInactiveMigrationContent';
import { useUnblockMemberProfileSyncMutation } from './UnblockMemberProfileSyncMutation.generated';

import * as styles from './AtlassianAccountMigrationConfirmationDialog.module.less';

// eslint-disable-next-line @trello/assets-alongside-implementation
import illustrationProfileMobileSvg from 'resources/images/aa-migration/illustration-profile-mobile.svg';
// eslint-disable-next-line @trello/assets-alongside-implementation
import illustrationProfileSvg from 'resources/images/aa-migration/illustration-profile.svg';

const illustrations = {
  main: {
    full: illustrationProfileSvg,
    mobile: illustrationProfileMobileSvg,
  },
};

export interface AtlassianAccountMigrationConfirmationDialogProps {
  id: string;
  enterpriseName?: string;
  atlassianProfileName?: PIIString;
  atlassianProfileEmail?: PIIString;
  atlassianProfileAvatar?: string;
  isSsoEnforced?: boolean;
  wasInactiveMigration: boolean;
  wasEnterpriseMigration: boolean;
  onDismiss: () => void;
  analyticsSource: SourceType;
  analyticsContext: Parameters<typeof Analytics.sendUIEvent>[0]['attributes'];
  analyticsContainers: object;
}

export const AtlassianAccountMigrationConfirmationDialog: FunctionComponent<
  AtlassianAccountMigrationConfirmationDialogProps
> = ({
  id,
  enterpriseName = '',
  atlassianProfileName = EMPTY_PII_STRING,
  atlassianProfileEmail = EMPTY_PII_STRING,
  atlassianProfileAvatar = '',
  isSsoEnforced = false,
  wasInactiveMigration,
  wasEnterpriseMigration,
  onDismiss,
  analyticsSource,
  analyticsContext,
  analyticsContainers,
}) => {
  const [performUnblock, unblockStatus] = useUnblockMemberProfileSyncMutation();

  const { hide, show, dialogProps } = useDialog({
    onHide: () => {
      Analytics.sendClosedComponentEvent({
        componentType: 'overlay',
        componentName: 'atlassianAccountMigrationOverlay',
        source: analyticsSource,
        attributes: analyticsContext,
        // containers: analyticsContainers,
      });
      onDismiss();
    },
    onShow: () => {
      Analytics.sendScreenEvent({
        name: analyticsSource,
        attributes: analyticsContext,
        containers: analyticsContainers,
      });
    },
  });

  const onDismissDialog = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'complete-onboarding/atlassian-account',
      source: analyticsSource,
    });

    try {
      await performUnblock({
        variables: {
          memberId: id,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'complete-onboarding/atlassian-account',
        source: analyticsSource,
        traceId,
        attributes: analyticsContext,
      });
    } catch (err) {
      Analytics.taskFailed({
        taskName: 'complete-onboarding/atlassian-account',
        source: analyticsSource,
        traceId,
        error: err,
      });
      showFlag({
        id: 'aaProfileSync',
        title: intl.formatMessage({
          id: 'templates.app_management.something-went-wrong',
          defaultMessage: 'Something went wrong. Please try again later.',
          description: 'Error message when something went wrong',
        }),
        appearance: 'error',
        isAutoDismiss: true,
      });
    }
    hide();
  }, [analyticsContext, analyticsSource, id, hide, performUnblock]);

  const renderEnterpriseMigrationContent = () => {
    return (
      <AaEnterpriseMigrationContent
        enterpriseName={enterpriseName}
        isLoading={unblockStatus.loading}
        isSsoEnforced={isSsoEnforced}
        onDismiss={onDismissDialog}
        analyticsSource={analyticsSource}
        analyticsContext={analyticsContext}
      />
    );
  };

  const renderInactiveMigrationContent = () => {
    return (
      <AaInactiveMigrationContent
        email={atlassianProfileEmail}
        onDismiss={onDismissDialog}
        analyticsSource={analyticsSource}
        analyticsContext={analyticsContext}
      />
    );
  };

  const title = wasEnterpriseMigration ? (
    <FormattedMessage
      id="aa migration confirmation.your accounts are connected"
      defaultMessage="Your accounts are connected"
      description="Title for the enterprise migration confirmation dialog"
    />
  ) : (
    <FormattedMessage
      id="aa migration confirmation.youre all set"
      // eslint-disable-next-line @trello/strict-react-intl, formatjs/no-emoji
      defaultMessage="🎉 You’re all set!"
      description="Title for the inactive migration confirmation dialog"
    />
  );

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
        <DialogCloseButton
          onClick={onDismissDialog}
          className={styles.closeButton}
        />
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
        <div>
          {wasEnterpriseMigration
            ? renderEnterpriseMigrationContent()
            : renderInactiveMigrationContent()}
          <div className={styles.profileInformation}>
            <span className={styles.avatar}>
              <CanonicalAvatar
                img={atlassianProfileAvatar}
                size={56}
                className={styles.atlassianProfileAvatar}
              />
            </span>
            <p
              title={dangerouslyConvertPrivacyString(atlassianProfileName)}
              className={styles.atlassianProfileName}
            >
              {atlassianProfileName}
            </p>
            <span
              title={dangerouslyConvertPrivacyString(atlassianProfileEmail)}
              className={styles.atlassianProfileEmail}
            >
              {atlassianProfileEmail}
            </span>
          </div>
          <div className={styles.illustrationFull}>
            <img alt="" role="presentation" src={illustrations.main.full} />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
