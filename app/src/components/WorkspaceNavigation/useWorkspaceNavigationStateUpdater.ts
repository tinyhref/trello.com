import { useEffect, useRef } from 'react';

import { useSharedState } from '@trello/shared-state';
import { workspaceNavigationState } from '@trello/workspace-navigation';

export function useWorkspaceNavigationStateUpdater() {
  const [navState, setNavState] = useSharedState(workspaceNavigationState);

  const { expanded } = navState;

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      // on first render, initalize to complete
      setNavState({
        expandedViewStatus: navState.expanded
          ? 'visible-transition-complete'
          : 'hidden-transition-complete',
      });
      firstUpdate.current = false;
      return;
    }

    setNavState({
      expandedViewStatus: navState.expanded
        ? 'visible-in-transition'
        : 'hidden-in-transition',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]); // we only want this to fire whenever expanded/collapse state changes
}
