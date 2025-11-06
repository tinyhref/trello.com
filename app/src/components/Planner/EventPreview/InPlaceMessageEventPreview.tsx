import { useCallback, useEffect, useMemo, type FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import CalendarIcon from '@atlaskit/icon/core/calendar';
import { Analytics } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { Button } from '@trello/nachos/button';
import { Popover, PopoverPlacement, usePopover } from '@trello/nachos/popover';
import { token } from '@trello/theme';

import { MaybePremiumLozenge } from 'app/src/components/FreeTrial/PremiumLozenge';
import { OfferingLozenge } from 'app/src/components/OfferingLozenge';
import { ADSUpgradePromptButton } from 'app/src/components/UpgradePrompts/ADSUpgradePromptButton';
import { WithEnterpriseManagedOverride } from 'app/src/components/UpgradePrompts/WithEnterpriseManagedOverride';
import { usePlannerDiscovery } from '../usePlannerDiscovery';
import { UpsellCohort, useUpsellData } from '../useUpsellData';
import { hasAdvancedPlanner } from '../utils/hasAdvancedPlanner';

import * as styles from './InPlaceMessageEventPreview.module.less';

export const PLANNER_FEATURE_DISCOVERY_MESSAGE_ID =
  'planner-feature-discovery-message';

export interface InPlaceMessageEventPreviewProps {
  onCtaClick: () => void;
}

/**
 * This component is used by EventContentRenderer to display a message in the planner.
 * It occupies a time-block in the calendar, but is not a real, saved event.
 */
export const InPlaceMessageEventPreview: FunctionComponent<
  InPlaceMessageEventPreviewProps
> = ({ onCtaClick }) => {
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();
  const { upsellCohort } = useUpsellData();
  const { discoveryStep, setDiscoveryStep } = usePlannerDiscovery();
  const { targetRef, popoverProps, show, hide } = usePopover<HTMLDivElement>({
    placement: PopoverPlacement.BOTTOM_START,
    onHide: () => {
      dismissOneTimeMessage(PLANNER_FEATURE_DISCOVERY_MESSAGE_ID);
      Analytics.sendClosedComponentEvent({
        componentName: 'plannerFeatureDiscoveryPopover',
        componentType: 'inlineDialog',
        source: 'plannerScreen',
      });
    },
  });

  const onNextClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'plannerFeatureDiscoveryPopoverNextButton',
      source: 'plannerScreen',
    });
    setDiscoveryStep({
      currentStep: 2,
      totalSteps: 2,
    });
    dismissOneTimeMessage(PLANNER_FEATURE_DISCOVERY_MESSAGE_ID);
  }, [setDiscoveryStep, dismissOneTimeMessage]);

  useEffect(() => {
    if (popoverProps.isVisible && upsellCohort !== UpsellCohort.CohortLoading) {
      Analytics.sendViewedComponentEvent({
        componentName: 'plannerFeatureDiscoveryPopover',
        componentType: 'inlineDialog',
        source: 'plannerScreen',
        attributes: {
          cohort: upsellCohort,
          awarenessElement: 'planner',
        },
      });
    }
  }, [popoverProps.isVisible, upsellCohort]);

  useEffect(() => {
    show();
  }, [show]);

  const premiumLabel = useMemo(() => {
    if (upsellCohort === UpsellCohort.CohortLoading) {
      return null;
    }

    // paidUser includes reverse trial users, to whom we show the lozenge.
    if (hasAdvancedPlanner(upsellCohort)) {
      return <MaybePremiumLozenge className={styles.premiumLozenge} />;
    }

    return (
      <OfferingLozenge
        offering="trello.premium"
        className={styles.premiumLozenge}
      />
    );
  }, [upsellCohort]);

  const upsellCta = useMemo(() => {
    if (
      upsellCohort === UpsellCohort.CohortLoading ||
      (upsellCohort !== UpsellCohort.TrialAvailable &&
        upsellCohort !== UpsellCohort.UpgradeAvailable)
    ) {
      return null;
    }

    return (
      <ADSUpgradePromptButton
        gradientBackground={true}
        onClick={() => {
          Analytics.sendClickedButtonEvent({
            buttonName: 'plannerFeatureDiscoveryUpsellButton',
            source: 'plannerScreen',
            attributes: {
              cohort: upsellCohort,
            },
          });
          hide();
          onCtaClick();
        }}
      >
        <WithEnterpriseManagedOverride>
          {upsellCohort === UpsellCohort.TrialAvailable ? (
            <FormattedMessage
              id="templates.planner.try-premium-free"
              defaultMessage="Try Premium free"
              description="Button call-to-action to try Premium free"
            />
          ) : (
            <FormattedMessage
              id="templates.planner.upgrade-to-premium"
              defaultMessage="Upgrade to Premium"
              description="Button call-to-action to upgrade to Premium"
            />
          )}
        </WithEnterpriseManagedOverride>
      </ADSUpgradePromptButton>
    );
  }, [hide, upsellCohort, onCtaClick]);

  useEffect(() => {
    Analytics.sendUIEvent({
      action: 'viewed',
      actionSubject: 'eventPreview',
      actionSubjectId: 'inPlaceMessageEventPreview',
      source: 'plannerScreen',
      attributes: {
        message: PLANNER_FEATURE_DISCOVERY_MESSAGE_ID,
      },
    });
  }, []);

  return (
    <>
      <div ref={targetRef} className={styles.messageEvent}>
        <FormattedMessage
          id="templates.planner.drag-and-drop-a-card-here"
          defaultMessage="Drag and drop a card here"
          description="Message to user explaining that they can drag and drop a card here to create a focus time"
        />
      </div>
      <Popover
        {...popoverProps}
        title={
          <div className={styles.popoverTitleIconContainer}>
            <CalendarIcon
              label=""
              color={token('color.icon.accent.purple', '#8270DB')}
            />
          </div>
        }
        size="large"
      >
        {premiumLabel}
        <h3>
          <FormattedMessage
            id="templates.planner.protect-your-time-to-get-things-done"
            defaultMessage="Protect your time to get things done"
            description="Heading for message explaining that Planner is a tool to help you get things done"
          />
        </h3>
        <p className={styles.popoverBodyText}>
          <FormattedMessage
            id="templates.planner.set-aside-time-for-real-work"
            defaultMessage="Set aside time for real work — not just meetings. Simply drag a card to Planner to create focus time and block out distractions."
            description="Message explaining that Planner is a tool to help you get things done"
          />
        </p>
        {upsellCta}
        {discoveryStep.totalSteps === 2 && (
          <div className={styles.footer}>
            <p className={styles.stepCount}>
              <FormattedMessage
                id="templates.planner.feature-discovery-step"
                defaultMessage="{currentStep} of {totalSteps}"
                description="Description for step 1 of multiple account discovery"
                values={{
                  currentStep: 1,
                  totalSteps: 2,
                }}
              />
            </p>
            <Button
              appearance="default"
              className={styles.cta}
              onClick={onNextClick}
            >
              <FormattedMessage
                id="templates.planner.next"
                defaultMessage="Next"
                description="Button to go to the next step of the feature discovery"
              />
            </Button>
          </div>
        )}
      </Popover>
    </>
  );
};
