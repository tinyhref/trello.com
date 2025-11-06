import { getMemberId } from '@trello/authentication';
import {
  PersistentSharedState,
  useSharedStateSelector,
} from '@trello/shared-state';

export interface PersonalProductivityLocalOverrideState {
  personalProductivityEnabled:
    | 'default'
    | 'ga'
    | 'new_user_holdout'
    | 'opted_in'
    | 'opted_out';
}

const personalProductivityLocalOverrideInitialValue: PersonalProductivityLocalOverrideState =
  {
    personalProductivityEnabled: 'default',
  };

export const personalProductivityLocalOverrideState =
  new PersistentSharedState<PersonalProductivityLocalOverrideState>(
    personalProductivityLocalOverrideInitialValue,
    {
      storageKey: () =>
        `personalProductivityLocalOverride-${getMemberId() ?? 'anonymous'}`,
    },
  );

export const usePersonalProductivityLocalOverride = ():
  | 'ga'
  | 'new_user_holdout'
  | 'opted_in'
  | 'opted_out'
  | undefined => {
  const personalProductivityEnabled = useSharedStateSelector(
    personalProductivityLocalOverrideState,
    (state) => state.personalProductivityEnabled,
  );

  if (personalProductivityEnabled === 'default') {
    return undefined;
  }

  return personalProductivityEnabled;
};
