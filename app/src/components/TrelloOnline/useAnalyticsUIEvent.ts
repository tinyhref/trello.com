import { useEffect } from 'react';

import { Analytics, getQueryParamOrHash } from '@trello/atlassian-analytics';
import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { isEmbeddedDocument } from '@trello/browser';

/*
 * list populated from bitbucket names in server at
 * https://bitbucket.org/trello/server/src/b899043498abd922d9a633a7fce88bcf3362ba3f/conf/trellis.defaults.js?fileviewer=file-view-default#trellis.defaults.js-449:465
 */
const emauEmbeddedAllowlist = ['bb', 'bb-staging', 'bb-bello', 'bb-bello-dev'];

export const useAnalyticsUIEvent = (): void => {
  const memberId = useMemberId();
  useEffect(() => {
    if (!isMemberLoggedIn()) {
      return;
    }

    const emauEmbeddable = emauEmbeddedAllowlist.includes(
      getQueryParamOrHash('iframeSource') || '',
    );

    if (!isEmbeddedDocument() || emauEmbeddable) {
      Analytics.setTrelloMemberId(memberId);
      Analytics.startUIViewedEvent();
    }
  }, [memberId]);
};
