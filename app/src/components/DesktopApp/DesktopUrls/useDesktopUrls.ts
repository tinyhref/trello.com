import { useEffect, useMemo } from 'react';

import { isDesktop } from '@trello/browser';
import { desktopIpc } from '@trello/desktop';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { useDesktopUrlsMemberQuery } from './DesktopUrlsMemberQuery.generated';

export const useDesktopUrls = () => {
  const isEnabled = useMemo(
    () => isDesktop() && desktopIpc?.isChannelSupported('urls'),
    [],
  );

  const { data: memberData } = useDesktopUrlsMemberQuery({
    variables: {
      memberId: 'me',
    },
    skip: !isEnabled,
    waitOn: ['MemberHeader'],
  });

  const username = memberData?.member?.username;

  useEffect(() => {
    if (isEnabled && username) {
      const baseUrl = `${location.protocol}//${location.host}`;

      desktopIpc.send('urls', {
        boardsPage: baseUrl,
        myCardsPage: `${baseUrl}/u/${dangerouslyConvertPrivacyString(
          username,
        )}/cards`,
      });
    }
  }, [isEnabled, username]);
};
