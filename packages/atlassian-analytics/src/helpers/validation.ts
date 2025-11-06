// ^ To use Function type; otherwise we'd have to define params

import type { ScreenEvent } from '../AnalyticsWebClient';
import {
  sendViewedBannerEvent,
  sendViewedComponentEvent,
} from './helperFunctions';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const sendScreenError = (e: ScreenEvent, helperFunction: Function): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `The <viewed ${e.name}> screen event must be replaced by the Analytics.${helperFunction.name} helper, as it is not a screen, modal, drawer, or inline dialog. Analytics.${helperFunction.name} will correctly fire a UI event (instead of a screen event). See packages/atlassian-analytics/src/helpers for more information.`,
    );
  }
};

export const checkForScreenHelper = (e: ScreenEvent): string | undefined => {
  // Return boolean to prevent invalid screen events from firing
  const screenName = e.name.toLowerCase();
  if (screenName.includes('banner')) {
    sendScreenError(e, sendViewedBannerEvent);
    return sendViewedBannerEvent.name;
  } else if (!/screen|modal|drawer|inlinedialog/.test(screenName)) {
    sendScreenError(e, sendViewedComponentEvent);
    return sendViewedComponentEvent.name;
  }
};
