import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';

import {
  PlannerRefContext,
  type PlannerRefContextValue,
} from './plannerRefContext';

/**
 * Get access to the Planner ref from within any split screen panel.
 *
 * @example
 * ```tsx
 * const { plannerRef } = usePlannerRef();
 * const calendarApi = plannerRef.current?.getApi();
 * calendarApi?.changeView('dayGridMonth');
 * ```
 * @returns the Planner context value containing the `plannerRef`
 */
export const usePlannerRef = (): PlannerRefContextValue => {
  const plannerRef = useContextSelector(
    PlannerRefContext,
    useCallback((value: PlannerRefContextValue) => value.plannerRef, []),
  );

  return { plannerRef };
};
