import { useEffect, useState } from 'react';

import { dynamicConfigClient } from '@trello/dynamic-config';

export const useOfflineState = () => {
  const defaultOfflineState = dynamicConfigClient.get(
    'trello_web_take_trello_offline',
  );
  const [isOffline, setIsOffline] = useState(defaultOfflineState as boolean);

  useEffect(() => {
    const onFlagChanged = (newValue?: boolean) => {
      // This value can only ever switch states to true.
      if (newValue === true) {
        setIsOffline(newValue);
      }
      dynamicConfigClient.off('trello_web_take_trello_offline', onFlagChanged);
    };
    dynamicConfigClient.on('trello_web_take_trello_offline', onFlagChanged);

    return () =>
      dynamicConfigClient.off('trello_web_take_trello_offline', onFlagChanged);
  }, [defaultOfflineState, isOffline]);

  return isOffline;
};
