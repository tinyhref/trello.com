import { useEffect } from 'react';
import _ from 'underscore';

// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { PopOver } from 'app/scripts/views/lib/PopOver';

const debouncedOnResize = _.debounce(function () {
  PopOver.onWindowResize();
}, 300);

export const usePopoverPositioner = () => {
  useEffect(() => {
    $(window).on('resize.windowEvent', debouncedOnResize);

    return () => {
      $(window).off('resize.windowEvent', debouncedOnResize);
    };
  }, []);
};
