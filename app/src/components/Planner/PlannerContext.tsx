import type FullCalendar from '@fullcalendar/react';
import {
  useMemo,
  type FunctionComponent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createContext } from 'use-context-selector';

import type { UpsellCohortType } from '@trello/planner';

import { UpsellCohort } from './useUpsellData';

export interface PlannerContextValue {
  plannerRef: RefObject<FullCalendar | null>;
  plannerWrapperRef: RefObject<HTMLDivElement>;
  screenManagerRef: RefObject<HTMLDivElement>;
  upsellCohort: UpsellCohortType;
}

export const emptyPlannerContext: PlannerContextValue = {
  plannerRef: { current: null },
  plannerWrapperRef: { current: null },
  screenManagerRef: { current: null },
  upsellCohort: UpsellCohort.PaidUser,
};

export const PlannerContext =
  createContext<PlannerContextValue>(emptyPlannerContext);

/**
 * A bit hard to get this right: the FullCalendar component allows us to plug in
 * a ref object to gain access to the underlying FullCalendar instance.
 * This instance is the sanctioned way to access the FullCalendar API, but it's
 * a little awkward because we want to access this API in sibling components of
 * the calendar itself, like the header and width observer.
 *
 * This context provider is connected to the FullCalendar component and should
 * wrap it along with any sibling elements that also need access to the API.
 * However, because of render order, we cannot guarantee that the FullCalendar
 * instance is available on initial render; as a workaround, we _persist_ the
 * instance as a ref object, so consumers can continue to access it on demand.
 *
 * Note that the `getApi()` method simply returns an instance property, so it's
 * extremely lightweight, and consumers need not be concerned about calling it.
 *
 * @example
 * ```ts
 * const { plannerRef } = usePlannerRef();
 *
 * const doSomethingWithCalendarApi = useCallback(() => {
 *   const calendarApi = plannerRef.current?.getApi();
 *   calendarApi?.doSomething();
 * }, [plannerRef]);
 * ```
 */
export const PlannerContextProvider: FunctionComponent<{
  plannerRef: RefObject<FullCalendar | null>;
  plannerWrapperRef: RefObject<HTMLDivElement>;
  screenManagerRef: RefObject<HTMLDivElement>;
  upsellCohort: UpsellCohortType;
  children: ReactNode;
}> = ({
  plannerRef,
  plannerWrapperRef,
  screenManagerRef,
  upsellCohort,
  children,
}) => {
  const value = useMemo(
    () => ({
      plannerRef,
      plannerWrapperRef,
      screenManagerRef,
      upsellCohort,
    }),
    [plannerRef, plannerWrapperRef, screenManagerRef, upsellCohort],
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
};
