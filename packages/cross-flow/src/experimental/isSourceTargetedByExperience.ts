import type { TouchpointSourceType } from '@trello/cross-flow';

export type CrossFlowExperience =
  | 'allUsersExperience'
  | 'freeExistingUserExperience'
  | 'newUserExperience'
  | 'onboardingUserExperience'
  | 'paidUsersExperience';

const experiencePlacements: Record<
  CrossFlowExperience,
  TouchpointSourceType[]
> = {
  allUsersExperience: ['memberBoardsHomeScreen', 'workspaceBoardsHomeScreen'],
  newUserExperience: [
    'currentWorkspaceNavigationDrawer',
    'memberBoardsHomeScreen',
    'workspaceBoardsHomeScreen',
  ],
  freeExistingUserExperience: [
    'boardScreen',
    'memberBoardsHomeScreen',
    'workspaceBoardsHomeScreen',
  ],
  onboardingUserExperience: ['welcomeTaskSelectionScreen'],
  paidUsersExperience: [
    'cardBackDatePicker',
    'boardDirectory',
    'boardsHomeCarouselAd',
    'boardScreen',
    'memberBoardsHomeScreen',
    'workspaceBoardsHomeScreen',
  ],
};

export const isSourceTargetedByExperience = (
  experience: CrossFlowExperience,
  source: TouchpointSourceType,
): boolean => {
  return experiencePlacements[experience].includes(source);
};
