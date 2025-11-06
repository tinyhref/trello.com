import type { FunctionComponent, PropsWithChildren } from 'react';
import { createContext } from 'react';

/**
 * There remains the possibility of some board not belonging to a workspace.
 * So null is a valid value for workspaceId. To account for this, we init
 * this context to undefined. Anything other than undefined can be used to
 * infer that the workspaceId has been set in the React context.
 */
export const WorkspaceIdContext = createContext<string | null | undefined>(
  undefined,
);

export const WorkspaceIdProvider: FunctionComponent<
  PropsWithChildren<{ value: string | null }>
> = ({ children, value }) => (
  <WorkspaceIdContext.Provider value={value}>
    {children}
  </WorkspaceIdContext.Provider>
);
