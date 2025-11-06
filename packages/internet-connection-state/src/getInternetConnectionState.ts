import '../images.d';

import { v4 as uuidv4 } from 'uuid';

// a 1x1 pixel image. Small to make the request fast
import testPixel from 'resources/images/internet-connection/test-pixel.png';

const PROBABLY_OFFLINE_TIMEOUT = 5000;

export const getInternetConnectionState = async (): Promise<
  'healthy' | 'unhealthy'
> => {
  // we can early run unhealthy if offline for navigator, but we cant if onLine.
  // That's because you can be online, but be waiting for VPN connection or something
  // else that blocks actually allowing internet.
  if (!navigator.onLine) {
    return 'unhealthy';
  }

  for (let i = 0; i < 3; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        PROBABLY_OFFLINE_TIMEOUT,
      );
      // eslint-disable-next-line @trello/fetch-includes-client-version
      const response = await fetch(`${testPixel}?x=${uuidv4()}`, {
        cache: 'no-cache',
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (response.status >= 500 || response.status < 200) {
        return 'unhealthy';
      }
    } catch (err) {
      return 'unhealthy';
    }

    // stagger it a little because of flakey VPN's and firewalls
    await new Promise((res) => setTimeout(res, 500));
  }

  // we got 3 good attempts, safe to say healthy
  return 'healthy';
};
