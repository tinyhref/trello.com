import type FullCalendar from '@fullcalendar/react';
import {
  useMemo,
  type FunctionComponent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createContext } from 'use-context-selector';

export interface PlannerRefContextValue {
  plannerRef: RefObject<FullCalendar>;
}

export const PlannerRefContext = createContext<PlannerRefContextValue>({
  plannerRef: { current: null },
});

/**
 * Provides access to the Planner FullCalendar ref via context.
 *
 * @param plannerRef a ref to the underlying FullCalendar instance.
 * @param children the subtree to wrap.
 * @returns a context provider element that supplies the planner ref when enabled.
 */
export const PlannerRefProvider: FunctionComponent<{
  plannerRef: RefObject<FullCalendar>;
  children: ReactNode;
}> = ({ plannerRef, children }) => {
  const value = useMemo(() => ({ plannerRef }), [plannerRef]);

  return (
    <PlannerRefContext.Provider value={value}>
      {children}
    </PlannerRefContext.Provider>
  );
};
