import { differenceInCalendarDays } from 'date-fns';
import { useEffect, useState } from 'react';

import {
  TRELLO_GA_MODAL_DATE,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { getAaId } from '@trello/authentication';
import type { TouchpointSourceType } from '@trello/cross-flow';
import { useFeatureGate } from '@trello/feature-gate-client';

const DELAY_IN_DAYS = 21;

export const useIsNotProductivityUserOrIsEligible = (
  source: TouchpointSourceType,
) => {
  const [isEligible, setIsEligible] = useState(false);

  const { value: gaModalTraitValue, loading: loadingGaModalTrait } =
    useUserTrait(TRELLO_GA_MODAL_DATE);

  const aaId = getAaId();

  const { value: isNewUserEligible } = useFeatureGate(
    'ghost_fix_board_screen_ad_new_user',
  );

  const { value: isInPersonalProductivity, loading: loadingProductivityGate } =
    useFeatureGate('trello_personal_productivity_release');

  useEffect(() => {
    // The gate returns true for new users who signed up with personal
    // productivity already assigned to them using their signup date
    // in rules
    if (isNewUserEligible && isInPersonalProductivity) {
      setIsEligible(true);
      return;
    }

    if (loadingGaModalTrait) {
      return;
    }
    // if the user is not in personal productivity, this eligibility check passes
    if (!isInPersonalProductivity && !loadingProductivityGate) {
      setIsEligible(true);
      return;
    }

    if (!aaId || !gaModalTraitValue) {
      setIsEligible(false);
      return;
    }
    const gaModalDate = new Date(gaModalTraitValue as string);

    const currentDate = new Date();
    if (
      differenceInCalendarDays(currentDate, gaModalDate) > DELAY_IN_DAYS &&
      source === 'boardScreen'
    ) {
      setIsEligible(true);
    } else {
      setIsEligible(false);
    }
  }, [
    aaId,
    source,
    isInPersonalProductivity,
    loadingProductivityGate,
    loadingGaModalTrait,
    gaModalTraitValue,
    isNewUserEligible,
  ]);

  return { isEligible };
};
