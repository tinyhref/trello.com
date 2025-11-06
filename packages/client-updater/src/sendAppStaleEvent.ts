import { Analytics } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';

import { oneDayInMs } from './constants';
import { startTime } from './shouldReloadToUpdate';

export const getStaleTime = () => {
  return startTime + oneDayInMs * 4;
};

export const sendAppStaleEvent = () => {
  Analytics.sendOperationalEvent({
    action: 'exceeded',
    actionSubject: 'app',
    attributes: {
      reason: '96 hour uptime exceeded',
    },
    source: getScreenFromUrl(),
  });
};
