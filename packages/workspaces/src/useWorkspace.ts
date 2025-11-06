import { useSharedState } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

export function useWorkspace() {
  const [workspace] = useSharedState(workspaceState);
  return workspace;
}
