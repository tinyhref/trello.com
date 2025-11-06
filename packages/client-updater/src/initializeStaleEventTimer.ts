import { tenMinutesInMs } from './constants';
import { sendAppStaleEventOnce } from './sendAppStaleEventOnce';

export const initializeStaleEventTimer = () => {
  const timer = setInterval(() => {
    const clearTimer = () => {
      clearInterval(timer);
    };
    sendAppStaleEventOnce(clearTimer);
  }, tenMinutesInMs);
};
