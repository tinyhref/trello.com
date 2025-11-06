import type { ChangeEventHandler, FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { intl } from '@trello/i18n';
import { Checkbox } from '@trello/nachos/checkbox';
import { useSharedState } from '@trello/shared-state';

import { atlassianIntelligenceFeedbackConsentState } from './atlassianIntelligenceFeedbackConsentState';

import * as styles from './AtlassianIntelligenceCustomFeedbackContent.module.less';

export const AtlassianIntelligenceCustomFeedbackContent: FunctionComponent =
  () => {
    const [hasUserConsent, setUserConsent] = useSharedState(
      atlassianIntelligenceFeedbackConsentState,
    );

    const onChangeConsent: ChangeEventHandler = useCallback(() => {
      setUserConsent(!hasUserConsent);
    }, [setUserConsent, hasUserConsent]);

    return (
      <>
        <Checkbox
          label={intl.formatMessage({
            id: 'templates.editor_ai_feedback.feedback-consent-label',
            defaultMessage:
              'Include my last prompt and response in the feedback.',
            description:
              'Label for checkbox for user consent to inlcude prompt and repsonse in feedback',
          })}
          onChange={onChangeConsent}
          isChecked={hasUserConsent}
          className={styles.checkbox}
        />
        <div className={styles.label}>
          <FormattedMessage
            id="templates.editor_ai_feedback.feedback-modal-label"
            defaultMessage="What's on your mind?"
            description="Label for textbox where teh user provides their feedback on the AI experience"
          />
          <i className={styles.required}>*</i>
        </div>
      </>
    );
  };
