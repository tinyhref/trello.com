import { useEffect } from 'react';

import { getLocation, removeSearchParamsFromLocation } from '@trello/router';
import { navigate } from '@trello/router/navigate';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { openListComposer } from 'app/src/components/ListComposer';

/**
 * Will check for the presence of the openListComposer search param
 * in the URL and if present open the list composer in the first list.
 */
export const usePossiblyOpenListComposer = () => {
  const canEditBoard = useCanEditBoard();

  useEffect(() => {
    if (!canEditBoard) {
      return;
    }

    let location = getLocation();
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('openListComposer') === 'true') {
      openListComposer({ position: 0 });
      location = removeSearchParamsFromLocation(location, ['openListComposer']);
      navigate(`${location.pathname}${location.search}`, {
        trigger: false,
        replace: true,
      });
    }
  }, [canEditBoard]);
};
