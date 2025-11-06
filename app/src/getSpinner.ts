// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

import { navigationState } from '@trello/router/router-link';

export const getSpinner = () => {
  navigationState.setValue({
    isNavigating: true,
  });

  return Bluebird.resolve().disposer(function () {
    navigationState.setValue({
      isNavigating: false,
    });
  });
};
