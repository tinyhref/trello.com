import { useContext } from 'react';

import { WorkspaceIdContext } from './WorkspaceIdContext';

export const useWorkspaceId = () => {
  const workspaceId = useContext(WorkspaceIdContext);

  if (workspaceId === undefined) {
    throw new Error(
      'Could not find workspace ID in the React context. Did you forget to wrap the root component in a <WorkspaceIdProvider>?',
    );
  }

  return workspaceId;
};
