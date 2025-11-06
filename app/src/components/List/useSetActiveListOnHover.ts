import type { RefObject } from 'react';
import { useEffect } from 'react';

import { activeListIdSharedState } from 'app/src/components/BoardListView/activeListIdSharedState';

export function useSetActiveListOnHover({
  ref,
  idList,
}: {
  ref: RefObject<HTMLDivElement> | RefObject<HTMLLIElement>;
  idList: string;
}) {
  useEffect(() => {
    const listWrapper = ref.current;
    if (!listWrapper) {
      return;
    }

    function setActiveListOnHover() {
      activeListIdSharedState.setValue(idList);
    }
    function resetActiveListId() {
      activeListIdSharedState.setValue('');
    }
    listWrapper?.addEventListener('mouseenter', setActiveListOnHover);
    listWrapper?.addEventListener('mouseleave', resetActiveListId);
    return () => {
      listWrapper?.removeEventListener('mouseenter', setActiveListOnHover);
      listWrapper?.removeEventListener('mouseleave', resetActiveListId);
    };
  }, [ref, idList]);
}
