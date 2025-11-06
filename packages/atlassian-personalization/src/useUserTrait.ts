import { useCallback } from 'react';

import { getAaId } from '@trello/authentication';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';

import type { TraitName, TraitValue } from './traits';
import { traitsOverrideState } from './traitsOverrideState';
import { useCachedUserTraits } from './useCachedUserTraits';
import { userTraitsSharedState } from './userTraitsSharedState';

export const useUserTrait: (traitName: TraitName) => {
  value: TraitValue | undefined;
  loading: boolean;
} = (traitName: TraitName) => {
  const aaId = getAaId();

  const { value: isTraitOverrideEnabled } = useFeatureGate(
    'ghost_internal_traits_override',
  );

  useCachedUserTraits();

  const overrideValue = useSharedStateSelector(
    traitsOverrideState,
    useCallback(
      (overrides) => {
        if (isTraitOverrideEnabled && overrides[traitName] !== undefined) {
          return { value: overrides[traitName], loading: false };
        }
        return null;
      },
      [isTraitOverrideEnabled, traitName],
    ),
  );

  const traitValue = useSharedStateSelector(
    userTraitsSharedState,
    useCallback(
      (traits) => {
        if (!aaId) {
          return { value: undefined, loading: false };
        }

        // if its loading or undefined for the user, we need to indicate that we are waiting for data to load
        // and not giving a false positive that the user just doesn't have any traits
        if (traits[aaId]?.loading || !traits[aaId]) {
          return { value: undefined, loading: true };
        }

        if (traits[aaId]?.attributes.length === 0) {
          return { value: undefined, loading: false };
        }

        return {
          value: traits[aaId]?.attributes.find(
            (trait) => trait.name === traitName,
          )?.value,
          loading: false,
        };
      },
      [aaId, traitName],
    ),
  );

  // Return override value if available
  if (overrideValue) {
    return overrideValue;
  }

  return traitValue;
};
