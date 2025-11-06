import { useEffect, useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { getEmailDomain } from '@trello/business-logic/member';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { Cookies } from '@trello/cookies';
import { idToDate } from '@trello/dates';
import type { PIIString } from '@trello/privacy';
import { SharedState, useSharedState } from '@trello/shared-state';

import { useMemberEmailQuery } from './MemberEmailQuery.generated';

export interface GtmSharedState {
  userHasConsented: boolean; // A user must consent by opting into marketing cookies via OneTrust or @trello/cookies
  userIsEligible: boolean; // A user is eligible for GTM if they are logged out or if it is their first logged-in session
  userEmailDomain: PIIString | null; // Users in their first session need to provide their email domain to GTM
  userAaId: string | null; // Users in their first session need to provide their AAID to OneTrust
  loadedInDocument: boolean; // Whether the GTM script has been loaded in the document or not
}

export const gtmSharedState = new SharedState<GtmSharedState>({
  userHasConsented: false,
  userIsEligible: false,
  userEmailDomain: null,
  userAaId: null,
  loadedInDocument: false,
});

export const checkForGtmConsent = (): void => {
  Cookies.checkThirdParty('google-tag-manager', async () =>
    gtmSharedState.setValue((previousValue) => ({
      ...previousValue,
      userHasConsented: true,
    })),
  );
};

export const useGtmSharedState = () => {
  const [, setGtmState] = useSharedState(gtmSharedState);

  const memberId = useMemberId();

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const { data } = useMemberEmailQuery({
    variables: {
      memberId,
    },
    skip: !isMemberLoggedIn(),
    waitOn: ['MemberHeader'],
  });

  const aaId = data?.member?.aaId ?? null;
  const email = data?.member?.email ?? undefined;

  // Consider this the user's first session if:
  // * "sent-possible-new-signup-event" has not been dismissed and
  // * their account is no more than 3 minutes old
  const isFirstSession = useMemo(() => {
    return (
      email &&
      isMemberLoggedIn() &&
      !isOneTimeMessageDismissed('sent-possible-new-signup-event') &&
      differenceInMinutes(new Date(), idToDate(memberId)) <= 3
    );
  }, [email, isOneTimeMessageDismissed, memberId]);

  useEffect(() => {
    // User is eligible for GTM if they are not logged in or
    // it is their very first session
    if (!isMemberLoggedIn() || isFirstSession) {
      setGtmState((previousValue) => ({
        ...previousValue,
        userIsEligible: true,
        userEmailDomain: getEmailDomain(email),
        userAaId: aaId,
      }));
    }
  }, [isFirstSession, setGtmState, email, aaId]);
};
