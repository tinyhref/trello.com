import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

import { Null } from 'app/src/components/Null';
import { workspaceNavigationErrorState } from './workspaceNavigationErrorState';

/*
	Top level error handler component for workspace nav
	The component sets nav to errored, and then returns Null
	error=true will trigger hidden=true, no sidebar will be shown,
  and since hidden=true, other components will
  set their styles accordingly
*/

export const WorkspaceNavigationError: FunctionComponent = () => {
  useEffect(() => {
    workspaceNavigationErrorState.setValue({ hasError: true });

    return () => {
      workspaceNavigationErrorState.setValue({ hasError: false });
    };
  }, []);

  return <Null />;
};
