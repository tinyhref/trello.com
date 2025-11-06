import { useEffect } from 'react';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { TrelloStorage } from '@trello/storage';

import { useMemberLocalePrefQuery } from './MemberLocalePrefQuery.generated';

export function useMemberLocaleCache() {
  const memberId = useMemberId();
  const { data } = useMemberLocalePrefQuery({
    variables: { memberId },
    skip: !isMemberLoggedIn(),
    waitOn: ['MemberHeader'],
  });

  useEffect(() => {
    const locale = data?.member?.prefs?.locale;

    if (!locale) {
      return;
    }

    TrelloStorage.set(`locale-${memberId}`, locale);
  }, [data?.member?.prefs?.locale, memberId]);
}
