import { useCallback, useEffect, useMemo, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useRecentBoards } from '@trello/recent-boards';
import { useSharedStateSelector } from '@trello/shared-state';

import { usePersonalProductivityLocalOverride } from 'app/src/components/PersonalProductivityBeta';
import { useIsGASpotlightTourOpen } from 'app/src/components/PersonalProductivityBeta/betaGASharedState';
import { useBoardWorkspaceFragment } from './BoardWorkspaceFragment.generated';
import existingUserBoardSwitcherImage from './existing-user-board-switcher.gif';
import newUserInboxSpotlightImage from './inbox-spotlight.gif';
import { useNewUserCohortFragment } from './NewUserCohortFragment.generated';
import { newUserShowInboxSpotlightSharedState } from './newUserShowInboxSpotlightSharedState';
import { newUserShowListSpotlightSharedState } from './newUserShowListSpotlightSharedState';
import newUserOnboardingListSpotlightImage from './onboarding-list-spotlight.gif';
import newUserPanelSpotlightImage from './panels-spotlight.gif';
import {
  ISLAND_NAV_SPOTLIGHT_MESSAGE_ID,
  NEW_USER_DEFAULT_BOARD_PREFIX,
  NEW_USER_ONBOARDING_LIST_PREFIX,
  NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID,
  PREMIUM_TRIAL_MODAL_MESSAGE_DISMISSED_KEY_PREFIX,
} from './PersonalProductivityOnboarding.constants';
import type {
  ExistingUserSpotlightSource,
  NewUserSpotlightSource,
} from './PersonalProductivityOnboarding.types';
import { personalProductivityOnboardingStepSharedState } from './personalProductivityOnboardingStepSharedState';
import { useExistingUserSpotlightTour } from './useExistingUserSpotlightTour';
import { useNewUserSpotlightTour } from './useNewUserSpotlightTour';

interface PersonalProductivitySpotlightTourProps {
  hideSpotlight?: boolean;
  boardId: string | null;
  listId?: string;
  source?: ExistingUserSpotlightSource | NewUserSpotlightSource;
  onDismissSpotlight?: () => void;
}

export const usePersonalProductivitySpotlightTour = ({
  hideSpotlight,
  boardId,
  listId,
  source,
  onDismissSpotlight,
}: PersonalProductivitySpotlightTourProps) => {
  const memberId = useMemberId();
  const [hasStartedTour, setHasStartedTour] = useState(false);

  const { data: board } = useBoardWorkspaceFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const workspaceId = board?.idOrganization;

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const { data } = useNewUserCohortFragment({
    from: { id: memberId },
  });

  const activeSpotlight = useSharedStateSelector(
    personalProductivityOnboardingStepSharedState,
    useCallback((state) => state.step, []),
  );

  const showInboxSpotlightState = useSharedStateSelector(
    newUserShowInboxSpotlightSharedState,
    useCallback((state) => state, []),
  );

  const showListSpotlightState = useSharedStateSelector(
    newUserShowListSpotlightSharedState,
    useCallback((state) => state, []),
  );

  const showExistingUserSpotlightTourForGA = useIsGASpotlightTourOpen();

  // This will return undefined if no overrides are set
  const personalProductivityLocalOverride =
    usePersonalProductivityLocalOverride();

  const userCohort =
    personalProductivityLocalOverride ||
    data?.cohorts?.userCohortPersonalProductivity;
  const isPremiumTrialModalDismissed = workspaceId
    ? isOneTimeMessageDismissed(
        `${PREMIUM_TRIAL_MODAL_MESSAGE_DISMISSED_KEY_PREFIX}-${workspaceId}`,
      )
    : false;

  const showNewUserSpotlightTour =
    userCohort === 'ga' &&
    !isOneTimeMessageDismissed(NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID) &&
    isOneTimeMessageDismissed(`${NEW_USER_DEFAULT_BOARD_PREFIX}-${boardId}`) &&
    isPremiumTrialModalDismissed;

  const showExistingUserSpotlightTour =
    (userCohort === 'opted_in' || showExistingUserSpotlightTourForGA) &&
    !hideSpotlight &&
    !isOneTimeMessageDismissed(ISLAND_NAV_SPOTLIGHT_MESSAGE_ID);

  const canOpen = showExistingUserSpotlightTour || showNewUserSpotlightTour;

  // Preload recent boards as the first spotlight opens
  useRecentBoards({
    skip: !(showExistingUserSpotlightTour && activeSpotlight === 0),
  });

  const onNextFrame = (func: () => void, delay = 0): number => {
    const nextFrameTimeoutId = window.setTimeout(() => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(func));
    }, delay);
    return nextFrameTimeoutId;
  };

  // should send this as a prop to the new user spotlight tour
  const next = useCallback(() => {
    const nextFrameTimeoutId = onNextFrame(() => {
      personalProductivityOnboardingStepSharedState.setValue({
        step: (activeSpotlight || 0) + 1,
      });
    }, 200);
    return () => window.clearTimeout(nextFrameTimeoutId);
  }, [activeSpotlight]);

  const startIslandNavSpotlightTour = useCallback(() => {
    personalProductivityOnboardingStepSharedState.setValue({
      step: activeSpotlight || 0,
    });
    if (!hasStartedTour && source === 'panelNavigation') {
      // setting state here to prevent the event from being sent multiple times
      setHasStartedTour(true);

      Analytics.sendViewedComponentEvent({
        componentType: 'spotlight',
        componentName: 'islandNavigationSpotlight',
        source: 'islandNavigationSpotlight',
      });
    }
  }, [activeSpotlight, hasStartedTour, source]);

  useEffect(() => {
    if (!canOpen) {
      return;
    }
    const nextFrameTimeoutId = onNextFrame(() => {
      startIslandNavSpotlightTour();
    }, 1000);
    return () => window.clearTimeout(nextFrameTimeoutId);
  }, [canOpen, startIslandNavSpotlightTour]);

  // Preloading the big gif images so that they are ready to be displayed
  // when the spotlight is shown
  useEffect(() => {
    const shouldPrefetchImages =
      userCohort === 'ga' &&
      !isOneTimeMessageDismissed(NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID) &&
      isOneTimeMessageDismissed(`${NEW_USER_DEFAULT_BOARD_PREFIX}-${boardId}`);
    const preloadImages = (paths: string[]) => {
      if (!shouldPrefetchImages) {
        return;
      }
      paths.forEach((path) => {
        const img = new Image();
        img.src = path;
      });
    };

    preloadImages([
      newUserInboxSpotlightImage,
      newUserOnboardingListSpotlightImage,
      newUserPanelSpotlightImage,
      existingUserBoardSwitcherImage,
    ]);
  }, [
    boardId,
    isOneTimeMessageDismissed,
    showNewUserSpotlightTour,
    userCohort,
  ]);
  const { newUserPanelSpotlight, newUserInboxSpotlight, newUserListSpotlight } =
    useNewUserSpotlightTour({
      onDismissSpotlight,
      next,
      showListSpotlightState,
      showInboxSpotlightState,
    });

  const newUserSpotlights = useMemo(() => {
    const spotlightsToShow = [
      newUserPanelSpotlight,
      ...(showInboxSpotlightState ? [newUserInboxSpotlight] : []),
      ...(showListSpotlightState ? [newUserListSpotlight] : []),
    ];
    return spotlightsToShow;
  }, [
    newUserPanelSpotlight,
    newUserInboxSpotlight,
    newUserListSpotlight,
    showInboxSpotlightState,
    showListSpotlightState,
  ]);

  const { existingUserSpotlights } = useExistingUserSpotlightTour({
    next,
  });

  const renderActiveSpotlight = useCallback(() => {
    const sourceToNewUserSpotlightMap: Record<NewUserSpotlightSource, number> =
      {
        panelNavigation: 0,
        inbox: showInboxSpotlightState ? 1 : -1,
        list: showListSpotlightState ? (showInboxSpotlightState ? 2 : 1) : -1,
      };

    if (activeSpotlight === null) {
      personalProductivityOnboardingStepSharedState.setValue({
        activeTarget: null,
      });
      return null;
    }

    if (showExistingUserSpotlightTour) {
      const spotlightTarget = existingUserSpotlights[activeSpotlight];

      personalProductivityOnboardingStepSharedState.setValue({
        activeTarget: spotlightTarget.key,
      });
      return spotlightTarget;
    }

    if (
      !showNewUserSpotlightTour ||
      !source ||
      source === 'boardSwitcherModal' ||
      activeSpotlight !== sourceToNewUserSpotlightMap[source]
    ) {
      return null;
    }

    const spotlightTarget = newUserSpotlights[activeSpotlight];
    personalProductivityOnboardingStepSharedState.setValue({
      activeTarget: spotlightTarget.key,
    });
    return spotlightTarget;
  }, [
    activeSpotlight,
    showExistingUserSpotlightTour,
    showNewUserSpotlightTour,
    source,
    existingUserSpotlights,
    newUserSpotlights,
    showInboxSpotlightState,
    showListSpotlightState,
  ]);

  /*
   * This is here specifically because we only show the spotlight on the specific "Getting Started" list
   * In the list wrapper we call this function & show the spotight ONLY if the list is the "Getting Started" list
   */
  const showListSpotlight = useCallback(() => {
    // Only show the spotlight if the list is the onboarding list
    // and the user has not dismissed the spotlight
    if (!listId || !showNewUserSpotlightTour) {
      return false;
    }
    const isTargetList = isOneTimeMessageDismissed(
      `${NEW_USER_ONBOARDING_LIST_PREFIX}-${listId}`,
    );
    if (isTargetList) {
      newUserShowListSpotlightSharedState.setValue(true);
    }
    return isTargetList;
  }, [listId, showNewUserSpotlightTour, isOneTimeMessageDismissed]);

  return {
    renderActiveSpotlight,
    showListSpotlight,
  };
};
