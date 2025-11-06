import { useCallback, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import SectionMessage, {
  SectionMessageAction,
} from '@atlaskit/section-message';
import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';

import * as styles from './PlanSelectionModalWarning.module.less';

interface WarningDescriptionProps {
  boldText: string;
  normalText: string;
  onClickDowngrade: () => void;
}

interface PlanSelectionModalWarningProps {
  isAtBoardLimitWithClosedBoards: boolean;
  isOverUserLimit: boolean;
  onSelectDowngradeToFree: () => void;
}
const WarningDescription: FunctionComponent<WarningDescriptionProps> = ({
  boldText,
  normalText,
  onClickDowngrade,
}) => {
  return (
    <div>
      <SectionMessage
        appearance="warning"
        actions={[
          <SectionMessageAction key={0} onClick={onClickDowngrade}>
            <FormattedMessage
              id="templates.end_of_trial_friction.plan-selection-modal.downgrade-to-free"
              defaultMessage="Downgrade to free"
              description="plan selection option"
            />
          </SectionMessageAction>,
        ]}
      >
        <p>
          <b>
            {
              <FormattedMessage
                id={boldText}
                defaultMessage="Downgrade to free"
                description="plan selection option"
              />
            }
          </b>{' '}
          {
            <FormattedMessage
              id={normalText}
              defaultMessage="Downgrade to free"
              description="plan selection option"
            />
          }
        </p>
      </SectionMessage>
    </div>
  );
};

export const PlanSelectionModalWarning: FunctionComponent<
  PlanSelectionModalWarningProps
> = ({
  isAtBoardLimitWithClosedBoards,
  isOverUserLimit,
  onSelectDowngradeToFree,
}) => {
  const isOverBothLimits = isAtBoardLimitWithClosedBoards && isOverUserLimit;
  const isOverJustBoardLimit =
    isAtBoardLimitWithClosedBoards && !isOverUserLimit;

  const onClickDowngrade = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'chooseFreeLink',
      source: 'announceEndOfTrialFreeSelectionModal',
    });
    onSelectDowngradeToFree();
  }, [onSelectDowngradeToFree]);

  if (isOverBothLimits) {
    return (
      <WarningDescription
        boldText={
          'templates.end_of_trial_friction.plan-selection-modal.over-both-limits-title'
        }
        normalText={
          'templates.end_of_trial_friction.plan-selection-modal.over-both-limits-message'
        }
        onClickDowngrade={onClickDowngrade}
      />
    );
  } else if (isOverJustBoardLimit) {
    return (
      <WarningDescription
        boldText={
          'templates.end_of_trial_friction.plan-selection-modal.over-board-limit-title'
        }
        normalText={
          'templates.end_of_trial_friction.plan-selection-modal.over-board-limit-message'
        }
        onClickDowngrade={onClickDowngrade}
      />
    );
  } else if (isOverUserLimit) {
    return (
      <WarningDescription
        boldText={
          'templates.end_of_trial_friction.plan-selection-modal.over-user-limit-title'
        }
        normalText={
          'templates.end_of_trial_friction.plan-selection-modal.over-user-limit-message'
        }
        onClickDowngrade={onClickDowngrade}
      />
    );
  } else {
    return (
      <div className={styles.noWarning}>
        <p>
          <b>
            <FormattedMessage
              id="templates.end_of_trial_friction.plan-selection-modal.downgrade-to-trello-free"
              defaultMessage="Downgrade to Trello free"
              description="plan selection option"
            />
          </b>
        </p>
        <p>
          <FormattedMessage
            id="templates.end_of_trial_friction.free-selection-modal-description"
            defaultMessage="The free version of Trello has limited features. You can upgrade at anytime."
            description="free version description"
          />
        </p>
        <Button onClick={onClickDowngrade}>
          <FormattedMessage
            id="templates.end_of_trial_friction.plan-selection-modal.downgrade-to-free"
            defaultMessage="Downgrade to free"
            description="plan selection option"
          />
        </Button>
      </div>
    );
  }
};
