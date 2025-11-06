import { useCallback } from 'react';

import { SharedState, useSharedStateSelector } from '@trello/shared-state';

interface BetaGASharedState {
  shouldShowOnboarding: boolean;
  shouldShowSpotlightTour: boolean;
}

export const defaultValue: BetaGASharedState = {
  shouldShowOnboarding: false,
  shouldShowSpotlightTour: false,
};

export const betaGASharedState = new SharedState<BetaGASharedState>(
  defaultValue,
);

export const openGAOnboarding = () =>
  betaGASharedState.setValue({
    shouldShowOnboarding: true,
  });

export const openGASpotlightTour = () =>
  betaGASharedState.setValue({
    shouldShowSpotlightTour: true,
    shouldShowOnboarding: false,
  });

export const closeGASpotlightTour = () =>
  betaGASharedState.setValue({
    shouldShowSpotlightTour: false,
  });

export const useIsGAOnboardingOpen = () =>
  useSharedStateSelector(
    betaGASharedState,
    useCallback((state) => state.shouldShowOnboarding, []),
  );

export const useIsGASpotlightTourOpen = () =>
  useSharedStateSelector(
    betaGASharedState,
    useCallback((state) => state.shouldShowSpotlightTour, []),
  );
