import { useCallback, useEffect, useState } from 'react';

import {
  getLocation,
  removeSearchParamsFromLocation,
  useSearchParams,
} from '@trello/router';
import { navigate } from '@trello/router/navigate';

export const useShowShortcutsOverlayByUrl = () => {
  const searchParams = useSearchParams();
  const [showShortcutsOverlay, setShowShortcutsOverlay] = useState(false);

  const onCloseShortcutsOverlay = useCallback(
    (location: ReturnType<typeof getLocation> = getLocation()) => {
      location = removeSearchParamsFromLocation(location, ['overlay']);
      navigate(`${location.pathname}${location.search}`, { trigger: false });
    },
    [],
  );
  useEffect(() => {
    setShowShortcutsOverlay(searchParams.get('overlay') === 'shortcuts');
  }, [searchParams]);

  return { showShortcutsOverlay, onCloseShortcutsOverlay };
};
