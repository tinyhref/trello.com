import { useEffect } from 'react';

import { getMemberId, isMemberLoggedIn } from '@trello/authentication';
import { realtimeUpdaterEvents } from '@trello/realtime-updater';
import { clearCookie } from '@trello/session-cookie';

export const useInvalidModelHandler = () => {
  useEffect(() => {
    // If we're unable to subscribe to our own member channel, something
    // has gone wrong (possibly we deleted our account or our session was
    // invalidated from another browser)
    if (isMemberLoggedIn()) {
      realtimeUpdaterEvents.on(
        'invalidModel',
        (typeName: string, id: string) => {
          if (typeName === 'Member' && id === getMemberId()) {
            clearCookie();
            window.location.reload();
          }
        },
      );
    }
  }, []);
};
