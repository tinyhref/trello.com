import { useEffect } from 'react';
import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { WindowSize } from 'app/scripts/lib/window-size';

const debouncedOnResize = _.debounce(function () {
  WindowSize.calc();
}, 300);

export const useWindowSizeClass = () => {
  useEffect(() => {
    $(window).on('resize.windowEvent', debouncedOnResize);

    return () => {
      $(window).off('resize.windowEvent', debouncedOnResize);
    };
  }, []);
};
