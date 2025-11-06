import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';

import CheckboxCheckedIcon from '@atlaskit/icon/core/checkbox-checked';
import CheckboxUncheckedIcon from '@atlaskit/icon/core/checkbox-unchecked';
import { Analytics } from '@trello/atlassian-analytics';
import { useDynamicConfig } from '@trello/dynamic-config';
import { Button } from '@trello/nachos/button';

import type { FeatureNames } from './featuresInfo';
import { useFeedbackCollector } from './useFeedbackCollector';

import * as styles from './NegativeFeedbackDetail.module.less';

interface NegativeFeedbackDetailProps {
  featureName: FeatureNames;
  feedbackSubmissionCallback?: () => void;
  traceId?: string;
  flagTreatment?: boolean;
}

export const NegativeFeedbackDetail: FunctionComponent<
  NegativeFeedbackDetailProps
> = ({ featureName, feedbackSubmissionCallback, traceId, flagTreatment }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const { negativeFacets, getAnalyticsAttributes } = useFeedbackCollector({
    featureName,
  });

  const isInternalAtlassian = useDynamicConfig('trello_web_atlassian_team');

  const submitFeedback = useCallback(() => {
    setSelectedReasons([]);

    //TODO: wire up Jira feedback collector to gather the freeform feedback
    Analytics.sendClickedButtonEvent({
      buttonName: 'aiLabsFeedbackCollectorSubmitFeedbackButton',
      source: 'aiLabsFeedbackCollector',
      attributes: {
        ...getAnalyticsAttributes({
          numNegativeFacets: selectedReasons.length,
        }),
        reason: selectedReasons,
        taskId: traceId,
      },
    });

    feedbackSubmissionCallback?.();
  }, [
    feedbackSubmissionCallback,
    getAnalyticsAttributes,
    selectedReasons,
    traceId,
  ]);

  const handleReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked && !selectedReasons.includes(e.target.value)) {
        setSelectedReasons((prev) => [...prev, e.target.value]);
      } else if (
        !e.target.checked &&
        selectedReasons.includes(e.target.value)
      ) {
        setSelectedReasons((prev) =>
          prev.filter((reason) => reason !== e.target.value),
        );
      }
    },
    [selectedReasons],
  );

  if (!isInternalAtlassian) {
    return null;
  }

  return (
    <div
      className={cx(styles.feedbackDetailContainer, {
        [styles.flagTreatment]: flagTreatment,
      })}
    >
      <fieldset>
        <div className={styles.contentContainer}>
          <div className={styles.reasonsContainer}>
            {negativeFacets.map((facet) => (
              <label className={styles.reason} key={facet.name}>
                <input
                  type="checkbox"
                  name={facet.name}
                  value={facet.name}
                  onChange={handleReasonChange}
                  checked={selectedReasons.includes(facet.name)}
                />
                {!selectedReasons.includes(facet.name) && (
                  <CheckboxUncheckedIcon label="" size="small" aria-hidden />
                )}
                {selectedReasons.includes(facet.name) && (
                  <CheckboxCheckedIcon label="" size="small" aria-hidden />
                )}
                {facet.buttonText}
              </label>
            ))}
          </div>
        </div>

        <Button
          className={styles.submitButton}
          onClick={submitFeedback}
          appearance="primary"
        >
          Submit feedback
        </Button>
      </fieldset>
    </div>
  );
};
