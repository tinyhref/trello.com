import classNames from 'classnames';
import { useCallback, useEffect, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';

import { data as planFeatures } from './data';
import { PlanSelectionModalWarning } from './PlanSelectionModalWarning';

import * as styles from './PremiumTrialEndedPlanSelectionModal.module.less';

export interface PremiumTrialEndedPlanSelectionModalProps {
  isAtBoardLimitWithClosedBoards: boolean;
  isOverUserLimit: boolean;
  onSelectStandardPlan: () => void;
  onSelectPremiumPlan: () => void;
  onSelectDowngradeToFree: () => void;
}

const renderTooltip = (tooltip: string | undefined, feature: string) =>
  tooltip ? (
    <Tooltip content={tooltip} component={TooltipPrimitiveLight} tag="span">
      <span className={styles.tooltipTarget}>{feature}</span>
    </Tooltip>
  ) : (
    <span>{feature}</span>
  );

export const PremiumTrialEndedPlanSelectionModal: FunctionComponent<
  PremiumTrialEndedPlanSelectionModalProps
> = ({
  onSelectStandardPlan,
  onSelectPremiumPlan,
  onSelectDowngradeToFree,
  isAtBoardLimitWithClosedBoards,
  isOverUserLimit,
}) => {
  const isBoardPage = useIsActiveRoute(RouteId.BOARD);

  const onSelectStandardPlanWithAnalytics = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'chooseStandardButton',
      source: 'announceEndOfTrialFreeSelectionModal',
    });
    onSelectStandardPlan();
  }, [onSelectStandardPlan]);

  const _onSelectPremiumPlanWithAnalytics = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'choosePremiumButton',
      source: 'announceEndOfTrialFreeSelectionModal',
    });
    onSelectPremiumPlan();
  }, [onSelectPremiumPlan]);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'announceEndOfTrialFreeSelectionModal',
      attributes: {
        userViewedFrom: isBoardPage ? 'boards-page' : 'workspaces-boards-page',
        atBoardLimitWithClosedBoards: isAtBoardLimitWithClosedBoards,
        overUserLimit: isOverUserLimit,
      },
    });
  }, [isAtBoardLimitWithClosedBoards, isBoardPage, isOverUserLimit]);

  return (
    <div>
      <div className={styles.modalHeader}>
        <h1>
          <FormattedMessage
            id="templates.end_of_trial_friction.plan-selection-modal.title"
            defaultMessage="Your Premium free trial has ended"
            description="plan selection modal title"
          />
        </h1>
        <p>
          <FormattedMessage
            id="templates.end_of_trial_friction.plan-selection-modal.description"
            defaultMessage="Keep the productivity-boosting features you’ve been using by starting a subscription. Select which plan works for you."
            description="plan selection modal description"
          />
        </p>
      </div>
      <div className={styles.featureSelectionContainer}>
        <div className={styles.plansContainer}>
          <fieldset
            className={classNames(styles.standardPlanFieldSet, styles.fieldSet)}
          >
            <div className={styles.standardHeader}>
              <h2>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal-standard.title"
                  defaultMessage="Standard"
                  description="plan selection modal standard title"
                />
              </h2>
              <div className={styles.pricingSection}>
                <p className={styles.pricingLable}>
                  <FormattedMessage
                    id="templates.choose_plan.dollar-amount"
                    defaultMessage="${amount}"
                    values={{
                      amount: 5,
                    }}
                    description="plan selection modal standard amount"
                  />
                </p>{' '}
                <p>
                  <FormattedMessage
                    id="templates.choose_plan.usd"
                    defaultMessage="USD"
                    description="plan selection modal standard usd"
                  />
                </p>
              </div>

              <p className={styles.billingPeriodLable}>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal.amount-description"
                  defaultMessage="Per user/month billed annually"
                  description="plan selection modal billing"
                />
              </p>
              <Button onClick={onSelectStandardPlanWithAnalytics}>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal-standard.choose-standard"
                  defaultMessage="Choose Standard"
                  description="plan selection modal standard choice cta"
                />
              </Button>
            </div>

            <ul className={styles.featureList}>
              <li className={styles.featureListTitle}>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal-standard.everything-in-free-plus"
                  defaultMessage="Everything in Free plus:"
                  description="plan selection modal standard choice included features title"
                />
              </li>
              {planFeatures.standardPersonalProductivity.map(
                ({ icon, feature, tooltip }) => (
                  <li key={feature} className={styles.featureListItem}>
                    <div className={styles.featureIcon}>{icon}</div>
                    {renderTooltip(tooltip, feature)}
                  </li>
                ),
              )}
            </ul>
          </fieldset>

          <fieldset
            className={classNames(styles.premiumPlanFieldSet, styles.fieldSet)}
          >
            <legend>
              <FormattedMessage
                id="templates.billing_page_one.best-value"
                defaultMessage="BEST VALUE"
                description="exciting sell"
              />
            </legend>
            <div className={styles.premiumHeader}>
              <h2>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal-premium.title"
                  defaultMessage="Premium"
                  description="plan selection modal premium title"
                />
              </h2>
              <div className={styles.pricingSection}>
                <p className={styles.pricingLable}>
                  <FormattedMessage
                    id="templates.choose_plan.dollar-amount"
                    defaultMessage="${amount}"
                    values={{
                      amount: 10,
                    }}
                    description="plan selection modal premium amount"
                  />
                </p>{' '}
                <p>
                  <FormattedMessage
                    id="templates.choose_plan.usd"
                    defaultMessage="USD"
                    description="plan selection modal premium usd"
                  />
                </p>
              </div>
              <p className={styles.billingPeriodLable}>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal.amount-description"
                  defaultMessage="Per user/month billed annually"
                  description="plan selection modal billing"
                />
              </p>
              <Button
                appearance="primary"
                onClick={_onSelectPremiumPlanWithAnalytics}
              >
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal-premium.keep-premium"
                  defaultMessage="Keep Premium"
                  description="plan selection modal billing premium choice cta"
                />
              </Button>
            </div>
            <ul className={styles.featureList}>
              <li className={styles.featureListTitle}>
                <FormattedMessage
                  id="templates.end_of_trial_friction.plan-selection-modal-premium.everything-in-standard-plus"
                  defaultMessage="Everything in Standard plus:"
                  description="plan selection modal billing premium choice included features title"
                />
              </li>
              {planFeatures.premiumPersonalProductivity.map(
                ({ icon, feature, tooltip }) => (
                  <li key={feature} className={styles.featureListItem}>
                    <div className={styles.featureIcon}>{icon}</div>
                    {renderTooltip(tooltip, feature)}
                  </li>
                ),
              )}
            </ul>
          </fieldset>
        </div>
      </div>
      <div className={styles.warning}>
        <PlanSelectionModalWarning
          isAtBoardLimitWithClosedBoards={isAtBoardLimitWithClosedBoards}
          isOverUserLimit={isOverUserLimit}
          onSelectDowngradeToFree={onSelectDowngradeToFree}
        />
      </div>
    </div>
  );
};
