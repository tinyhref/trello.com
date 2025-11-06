import { getRealtimeUpdaterClient } from '@trello/realtime-updater-client';

import { Subscriber } from 'app/src/Subscriber';

const realtimeUpdaterClient = getRealtimeUpdaterClient();

export const subscriber = new Subscriber(realtimeUpdaterClient);
