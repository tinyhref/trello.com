import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ATLASSIAN_PROFILE_URL,
  TRELLO_AA_HELP_URL,
  TWO_FACTOR_SETUP_URL,
} from '@trello/aa-migration';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { isTouch } from '@trello/browser';
import { Button } from '@trello/nachos/button';
import type { PIIString } from '@trello/privacy';

import { ExternalLink } from './ExternalLink';
import { ListItem } from './ListItem';

// eslint-disable-next-line @trello/less-matches-component
import * as styles from './AtlassianAccountMigrationConfirmationDialog.module.less';

interface AaInactiveMigrationContentProps {
  email: PIIString;
  onDismiss: () => void;
  analyticsSource: SourceType;
  analyticsContext: Parameters<typeof Analytics.sendUIEvent>[0]['attributes'];
}

export const AaInactiveMigrationContent: FunctionComponent<
  AaInactiveMigrationContentProps
> = ({ email, onDismiss, analyticsSource, analyticsContext }) => {
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
        <FormattedMessage
          id="aa migration confirmation.email-login-message"
          defaultMessage="From now on, you’ll use {aaEmail} to log in to Trello."
          description="Email login message"
          values={{
            aaEmail: <strong key="email">{email}</strong>,
          }}
        />
      </ListItem>
      <ListItem>
        <FormattedMessage
          id="aa migration confirmation.setup-2fa-message"
          defaultMessage="Trello two-step verification will no longer be available. {setup2faLink} for your Atlassian account."
          description="Setup 2FA message"
          values={{
            setup2faLink: (
              <ExternalLink
                href={TWO_FACTOR_SETUP_URL}
                key="setup-2fa-link"
                linkName={'setup2faLink'}
                analyticsContext={analyticsContext}
                analyticsSource={analyticsSource}
              >
                <FormattedMessage
                  id="aa migration confirmation.setup-2fa-link"
                  defaultMessage="Enable two-step verification"
                  description="Setup 2FA link"
                />
              </ExternalLink>
            ),
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
        <Button appearance="primary" size="wide" onClick={onClickGotItButton}>
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
      </div>
    </div>
  );
};
