import type { FunctionComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { isEmbeddedInAtlassian } from '@trello/browser';
import { MemberAvatar } from '@trello/member-avatar';
import { Button } from '@trello/nachos/button';
import type { PIIString } from '@trello/privacy';
import type { RequestAccessWhenBlockedTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './RequestAccess.module.less';

interface RequestAccessProps {
  description: ReactNode;
  disabled?: boolean;
  email: PIIString;
  fullName: PIIString;
  id: string;
  onSubmit: () => void;
  switchAccountUrl: string;
  switchAccountOnClick: () => void;
}

export const RequestAccess: FunctionComponent<RequestAccessProps> = ({
  description,
  disabled = false,
  email,
  fullName,
  id,
  onSubmit,
  switchAccountUrl,
  switchAccountOnClick,
}) => {
  return (
    <div>
      <p className={styles.description}>{description}</p>
      <div className={styles.displayFlex}>
        <span className={styles.loginAsTitle}>
          <FormattedMessage
            id="templates.request_access.request-access-page-logged-in"
            defaultMessage="You are logged in as"
            description="Main message for request access page"
          />
        </span>
        {!isEmbeddedInAtlassian() && (
          <a
            className={styles.switchAccountLink}
            href={switchAccountUrl}
            onClick={switchAccountOnClick}
            data-testid={getTestId<RequestAccessWhenBlockedTestIds>(
              'request-access-switch-account-button',
            )}
          >
            <FormattedMessage
              id="templates.request_access.request-access-page-switch-account"
              defaultMessage="Switch account"
              description="Button for switching account"
            />
          </a>
        )}
      </div>
      <div className={styles.memberInfoContainer}>
        <MemberAvatar
          idMember={id}
          className={styles.memberAvatar}
          size={32}
          testId={getTestId<RequestAccessWhenBlockedTestIds>(
            'request-access-member-avatar',
          )}
        />
        <div>
          <div className={styles.fullName}>{fullName}</div>
          <div className={styles.email}>{email}</div>
        </div>
      </div>
      <p className={styles.footerText}>
        <FormattedMessage
          id="templates.request_access.request-access-page-disclaimer"
          defaultMessage="By requesting access, you agree to share your Atlassian account information, including your email address, with the board admins."
          description="Disclaimer message for request access"
        />
      </p>
      <Button
        appearance="primary"
        size="fullwidth"
        onClick={onSubmit}
        isDisabled={disabled}
        data-testid={getTestId<RequestAccessWhenBlockedTestIds>(
          'request-access-button',
        )}
      >
        <FormattedMessage
          id="templates.request_access.request-access-page-send-request"
          defaultMessage="Send request"
          description="Button for sending request"
        />
      </Button>
    </div>
  );
};
