import { useCallback, useEffect } from 'react';

import { getLocation, removeSearchParamsFromLocation } from '@trello/router';
import { navigate } from '@trello/router/navigate';

import { useBoardListsContext } from 'app/src/components/BoardListsContext';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { openCardComposer } from 'app/src/components/CardComposer';

/**
 * Will check for the presence of the openCardComposerInFirstList search param
 * in the URL and if present open the card composer in the first list.
 */
export const usePossiblyOpenCardComposerInFirstList = () => {
  const lists = useBoardListsContext(useCallback((value) => value.lists, []));
  const canEditBoard = useCanEditBoard();

  useEffect(() => {
    if (!canEditBoard) {
      return;
    }

    let location = getLocation();
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('openCardComposerInFirstList') === 'true') {
      const firstList = lists?.[0];
      if (firstList) {
        openCardComposer({ listId: firstList.id, position: 0 });
        location = removeSearchParamsFromLocation(location, [
          'openCardComposerInFirstList',
        ]);
        navigate(`${location.pathname}${location.search}`, {
          trigger: false,
          replace: true,
        });
      }
    }
  }, [lists, canEditBoard]);
};
