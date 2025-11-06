import { useCallback, useEffect, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';

import * as styles from './FreeSelectionInformationModal.module.less';

interface FreeSelectionInformationModalProps {
  onBackToPlans: () => void;
  onContinue: () => void;
  onComparePlans: () => void;
}

export const FreeSelectionInformationModal: FunctionComponent<
  FreeSelectionInformationModalProps
> = ({ onBackToPlans, onContinue, onComparePlans }) => {
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'endOfTrialFreeSelectionInformationModal',
    });
  });

  const onBackToPlansClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'backToPlansButton',
      source: 'endOfTrialFreeSelectionInformationModal',
    });
    onBackToPlans();
  }, [onBackToPlans]);

  const onContinueClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'continueWithFreeButton',
      source: 'endOfTrialFreeSelectionInformationModal',
    });
    onContinue();
  }, [onContinue]);

  const onComparePlansClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'compareAllPlans',
      source: 'endOfTrialFreeSelectionInformationModal',
    });
    onComparePlans();
  }, [onComparePlans]);

  return (
    <div className={styles.freeSelectionInformationModal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>
          <FormattedMessage
            id="templates.end_of_trial_friction.free-selection-modal-title"
            description="Title for the free selection modal which describes the features and limits of Trello free"
            defaultMessage="Things to know about Trello free"
          />
        </h2>
        <p className={styles.modalDescription}>
          <FormattedMessage
            id="templates.end_of_trial_friction.free-selection-modal-description-refresh"
            description="Description for the free selection modal which describes the features and limits of Trello free"
            defaultMessage="The free plan of Trello has limited features. You can upgrade at anytime."
          />
        </p>
      </div>
      <div className={styles.freeLimitsAndUnavailableFeatures}>
        <div>
          <p className={styles.subheading}>
            <FormattedMessage
              id="templates.end_of_trial_friction.free-selection-modal-workspace-limits-refresh"
              description="Subheading for the free selection modal which describes the features and limits of Trello free"
              defaultMessage="Free plan limits"
            />
          </p>
          <ul>
            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-workspace-limits-boards-refresh"
                description="Trello free has a 10 board limit"
                defaultMessage="10 boards max"
              />
            </li>

            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-view-only-planner"
                description="Trello free has view-only Planner"
                defaultMessage="View-only Planner"
              />
            </li>

            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-workspace-limits-automation"
                description="Trello free has a 250 automation command runs per month limit"
                defaultMessage="250 automation command runs per month"
              />
            </li>
          </ul>
        </div>
        <div>
          <p className={styles.subheading}>
            <FormattedMessage
              id="templates.end_of_trial_friction.free-selection-modal-unavailable-features-refresh"
              description="Subheading for the free selection modal which describes the features and limits of Trello free"
              // eslint-disable-next-line formatjs/no-emoji
              defaultMessage="Unavailable paid features 💸"
            />
          </p>
          <ul>
            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-unavailable-features-advanced-planner"
                description="Trello free does not have Planner (full access)"
                defaultMessage="Planner (full access)"
              />
            </li>

            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-unavailable-features-custom-fields"
                description="Trello free does not have custom fields"
                defaultMessage="Custom Fields"
              />
            </li>
            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-unavailable-features-checklist"
                description="Trello free does not have checklist assignees and due dates"
                defaultMessage="Checklist assignees and due dates"
              />
            </li>
            <li>
              <FormattedMessage
                id="templates.end_of_trial_friction.free-selection-modal-unavailable-features-lists"
                description="Trello free does not have collapsible lists, list colors, and more"
                defaultMessage="Collapsible lists, list colors, and more"
              />
            </li>
          </ul>
        </div>
      </div>
      <Button appearance="link" onClick={onComparePlansClick}>
        <FormattedMessage
          id="templates.end_of_trial_friction.free-selection-modal-compare-all-plans"
          description="Button to open compare all plans modal"
          defaultMessage="Compare all plans"
        />
      </Button>
      <div className={styles.modalFooter}>
        <Button appearance="default" onClick={onBackToPlansClick}>
          <FormattedMessage
            id="templates.end_of_trial_friction.back-to-plans"
            description="Button to go back to plan selection modal"
            defaultMessage="Back to plans"
          />
        </Button>
        <Button appearance="primary" onClick={onContinueClick}>
          <FormattedMessage
            id="templates.end_of_trial_friction.continue-with-free"
            description="Button to continue with free plan"
            defaultMessage="Continue with free"
          />
        </Button>
      </div>
    </div>
  );
};
