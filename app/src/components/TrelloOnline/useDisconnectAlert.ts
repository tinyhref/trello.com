import { useEffect } from 'react';

import { dynamicConfigClient } from '@trello/dynamic-config';
import { intl } from '@trello/i18n';

import { Alerts } from 'app/scripts/views/lib/Alerts';

const onDisconnectActiveClients = (blockPollingRequests?: boolean) => {
  if (blockPollingRequests) {
    Alerts.showLiteralText(
      intl.formatMessage({
        id: 'somethings wrong.disconnected-from-trello',
        defaultMessage:
          'You have been disconnected from Trello. Please reload to reconnect.',
        description: 'Error message when disconnected from Trello.',
      }),
      'warning',
      'alert',
    );
  }
};

export const useDisconnectAlert = () => {
  useEffect(() => {
    dynamicConfigClient.on(
      'trello_web_disconnect_active_clients',
      onDisconnectActiveClients,
    );
    return () => {
      dynamicConfigClient.off(
        'trello_web_disconnect_active_clients',
        onDisconnectActiveClients,
      );
    };
  }, []);
};
