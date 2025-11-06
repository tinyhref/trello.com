import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ATLASSIAN_PROFILE_URL,
  TRELLO_AA_HELP_URL,
} from '@trello/aa-migration';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { isTouch } from '@trello/browser';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';

import { ExternalLink } from './ExternalLink';
import { ListItem } from './ListItem';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './AtlassianAccountMigrationConfirmationDialog.module.less';

interface AaEnterpriseMigrationContentProps {
  enterpriseName: string;
  isLoading: boolean;
  isSsoEnforced: boolean;
  onDismiss: () => void;
  analyticsSource: SourceType;
  analyticsContext: Parameters<typeof Analytics.sendUIEvent>[0]['attributes'];
}

export const AaEnterpriseMigrationContent: FunctionComponent<
  AaEnterpriseMigrationContentProps
> = ({
  enterpriseName,
  isSsoEnforced,
  isLoading,
  onDismiss,
  analyticsSource,
  analyticsContext,
}) => {
  const onClickGotItButton = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissButton',
      source: analyticsSource,
      attributes: analyticsContext,
    });
    onDismiss();
  }, [analyticsContext, analyticsSource, onDismiss]);

  return (
    <div className={styles.description}>
      <ListItem>
        {isSsoEnforced ? (
          <FormattedMessage
            id="aa migration confirmation.enterprise-login-message-sso"
            defaultMessage="From now on, when you log into Trello with SSO, you'll also need to login with your Atlassian account."
            description="Enterprise login message for SSO enforced"
          />
        ) : (
          <FormattedMessage
            id="aa migration confirmation.enterprise-login-message-atl"
            defaultMessage="From now on, you'll log into Trello with your Atlassian account."
            description="Enterprise login message for Atlassian account"
          />
        )}
      </ListItem>
      <ListItem>
        <FormattedMessage
          id="aa migration confirmation.enterprise-managed-account-message"
          defaultMessage="Your account is managed by {enterpriseName}. Make sure you're only using this account for work related to {enterpriseName} so you don't lose access to your boards."
          description="Enterprise managed account message"
          values={{
            enterpriseName,
          }}
        />
      </ListItem>
      <ListItem>
        <FormattedMessage
          id="aa migration confirmation.review-profile-message"
          defaultMessage="{reviewProfileLink} within 1 day to make sure your information is correct."
          description="Review profile message"
          values={{
            reviewProfileLink: (
              <ExternalLink
                href={ATLASSIAN_PROFILE_URL}
                key="review-profile-link"
                linkName={'manageProfileLink'}
                analyticsContext={analyticsContext}
                analyticsSource={analyticsSource}
              >
                <FormattedMessage
                  id="aa migration confirmation.review-profile-link"
                  defaultMessage="Review your Trello + Atlassian profile"
                  description="Review profile link"
                />
              </ExternalLink>
            ),
          }}
        />
      </ListItem>
      {isTouch() && (
        <ListItem>
          <FormattedMessage
            id="aa migration confirmation.mobile-login-message"
            defaultMessage="You can now return to the Trello mobile app and log in with your Atlassian account."
            description="Mobile login message"
          />
        </ListItem>
      )}
      <div className={styles.buttonSection}>
        <Button
          appearance="primary"
          size="wide"
          onClick={onClickGotItButton}
          isDisabled={isLoading}
        >
          <FormattedMessage
            id="aa migration confirmation.got it"
            defaultMessage="Got it"
            description="Got it button"
          />
        </Button>
        <ExternalLink
          href={TRELLO_AA_HELP_URL}
          linkName={'learnMoreLink'}
          analyticsContext={analyticsContext}
          analyticsSource={analyticsSource}
        >
          <FormattedMessage
            id="aa migration confirmation.learn more"
            defaultMessage="Learn more"
            description="Learn more link"
          />
        </ExternalLink>
        {isLoading && (
          <Spinner
            small
            inline={true}
            wrapperClassName={classNames(styles.spinner)}
          />
        )}
      </div>
    </div>
  );
};
