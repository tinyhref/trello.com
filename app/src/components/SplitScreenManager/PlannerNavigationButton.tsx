import { useCallback, type FunctionComponent } from 'react';

import CalendarIcon from '@atlaskit/icon/core/calendar';
import { intl } from '@trello/i18n';
import type { PlannerTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { IslandNavButton } from 'app/src/components/IslandNav';
import {
  ConditionalNewInviteeSpotlightWrapper,
  PLANNER_BUTTON_SPOTLIGHT,
  useNewInviteeCombinedPPDiscoverySpotlightTour,
  useNewInviteeStaggeredPPDiscoverySpotlightTour,
} from 'app/src/components/NewInviteePpDiscoverySpotlight';
import {
  PLANNER_DISCOVERY_SPOTLIGHT_TARGET,
  PlannerDiscoverySpotlight,
  useIsEligibleForExistingUserPlannerSpotlight,
  useIsEligibleForPlannerDiscoverySpotlight,
} from 'app/src/components/PlannerDiscoverySpotlight';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';

interface PlannerNavigationButtonProps {
  showLabels?: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}
export const PlannerNavigationButton: FunctionComponent<
  PlannerNavigationButtonProps
> = ({ showLabels, isSelected, isDisabled, onClick }) => {
  const { isEligible: isEligibleNewUser } =
    useIsEligibleForPlannerDiscoverySpotlight();
  const { isEligible: isEligibleExistingUser } =
    useIsEligibleForExistingUserPlannerSpotlight();
  const isPlannerDiscoverySpotlightEnabled =
    isEligibleNewUser || isEligibleExistingUser;
  const {
    renderActiveSpotlight: NewInviteeCombinedPPDiscoverySpotlight,
    activeSpotlight: newInviteeActiveSpotlight,
  } = useNewInviteeCombinedPPDiscoverySpotlightTour();

  const {
    renderActiveSpotlight: NewInviteeStaggeredPPDiscoverySpotlight,
    activeSpotlight: newInviteeStaggeredActiveSpotlight,
  } = useNewInviteeStaggeredPPDiscoverySpotlightTour();

  const plannerLabel = intl.formatMessage({
    id: 'templates.split_screen.planner',
    defaultMessage: 'Planner',
    description: 'Planner',
  });

  const shouldWrapWithSpotlight =
    isPlannerDiscoverySpotlightEnabled ||
    newInviteeActiveSpotlight === PLANNER_BUTTON_SPOTLIGHT ||
    newInviteeStaggeredActiveSpotlight === PLANNER_BUTTON_SPOTLIGHT;

  const renderSpotlight = useCallback(() => {
    if (newInviteeActiveSpotlight === PLANNER_BUTTON_SPOTLIGHT) {
      return <NewInviteeCombinedPPDiscoverySpotlight />;
    }
    if (newInviteeStaggeredActiveSpotlight === PLANNER_BUTTON_SPOTLIGHT) {
      return <NewInviteeStaggeredPPDiscoverySpotlight />;
    }
    if (isPlannerDiscoverySpotlightEnabled) {
      return <PlannerDiscoverySpotlight />;
    }
    return null;
  }, [
    newInviteeActiveSpotlight,
    newInviteeStaggeredActiveSpotlight,
    isPlannerDiscoverySpotlightEnabled,
    NewInviteeCombinedPPDiscoverySpotlight,
    NewInviteeStaggeredPPDiscoverySpotlight,
  ]);

  const plannerNavButton = (
    <IslandNavButton
      icon={<CalendarIcon label="" />}
      isSelected={isSelected}
      isDisabled={isDisabled}
      onClick={onClick}
      role="checkbox"
      testId={getTestId<PlannerTestIds>('panel-nav-planner-button')}
      showLabels={showLabels}
      label={plannerLabel}
      aria-label={plannerLabel}
    />
  );

  return (
    <>
      {shouldWrapWithSpotlight ? (
        <ConditionalNewInviteeSpotlightWrapper
          shouldWrap={true}
          hasTintedBlanket={true}
          renderSpotlight={renderSpotlight}
          spotlightTargetName={PLANNER_DISCOVERY_SPOTLIGHT_TARGET}
        >
          {plannerNavButton}
        </ConditionalNewInviteeSpotlightWrapper>
      ) : (
        <ShortcutTooltip
          shortcutText={plannerLabel}
          shortcutKey="g+p"
          position="top"
        >
          {plannerNavButton}
        </ShortcutTooltip>
      )}
    </>
  );
};
