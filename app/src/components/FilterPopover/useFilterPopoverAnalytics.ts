import { useContext, useMemo } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { getScreenFromUrl } from '@trello/marketing-screens';

import { BoardViewContext } from 'app/src/components/BoardViewContext';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import { useCurrentView } from 'app/src/components/ViewSwitcher/useCurrentView';

// Most usages set source to `filterPopoverInlineDialog`, so make it optional.
type OptionalSource<T extends { source: SourceType }> = Omit<T, 'source'> &
  Partial<Pick<T, 'source'>>;

/**
 * Convenience hook for FilterPopover events; wraps Analytics helper functions
 * with common values derived from BoardViewContext and ViewFiltersContext.
 *
 * @example
 * const Analytics = useFilterPopoverAnalytics();
 * Analytics.sendScreenEvent({ name: 'filterPopoverInlineDialog' });
 */
export const useFilterPopoverAnalytics = () => {
  const { idBoard, idOrg: idOrganization } = useContext(BoardViewContext);
  const { viewFilters } = useContext(ViewFiltersContext);
  const currentView = useCurrentView();
  const viewType =
    viewFilters.contextType === 'singleBoard' ? currentView : null;

  return useMemo<{
    startTask: typeof Analytics.startTask;
    taskSucceeded: typeof Analytics.taskSucceeded;
    taskFailed: typeof Analytics.taskFailed;
    sendScreenEvent: typeof Analytics.sendScreenEvent;
    sendClosedComponentEvent: typeof Analytics.sendClosedComponentEvent;
    sendClickedButtonEvent: (
      e: OptionalSource<Parameters<typeof Analytics.sendClickedButtonEvent>[0]>,
    ) => void;
    sendToggledFilterEvent: (
      e: {
        filterType:
          | 'autoCollapseListFilter'
          | 'boardsFilter'
          | 'completeFilter'
          | 'dateLastActivity'
          | 'dueFilter'
          | 'labelsFilter'
          | 'listFilter'
          | 'membersFilter';
        isChecked: boolean;
      } & Pick<Parameters<typeof Analytics.sendUIEvent>[0], 'attributes'>,
    ) => void;
    sendSelectedModeEvent: (
      e: Pick<Parameters<typeof Analytics.sendUIEvent>[0], 'attributes'>,
    ) => void;
  }>(() => {
    const commonAttributes = {
      screen: getScreenFromUrl(),
      viewFiltersContextType: viewFilters.contextType,
      filterMode: viewFilters.filters.mode.getMode(),
      viewType,
    };
    const containers = formatContainers({ idBoard, idOrganization });
    return {
      startTask: ({ taskName, source }) =>
        Analytics.startTask({ taskName, source }),
      taskSucceeded: ({ taskName, source, traceId }) =>
        Analytics.taskSucceeded({ taskName, source, traceId }),
      taskFailed: ({ taskName, source, traceId, error }) =>
        Analytics.taskFailed({ taskName, source, traceId, error }),
      sendScreenEvent: ({ attributes, ...props }) =>
        Analytics.sendScreenEvent({
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendClosedComponentEvent: ({ attributes, ...props }) =>
        Analytics.sendClosedComponentEvent({
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendClickedButtonEvent: ({ attributes, ...props }) =>
        Analytics.sendClickedButtonEvent({
          source: 'filterPopoverInlineDialog',
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendToggledFilterEvent: ({
        filterType,
        isChecked,
        attributes,
        ...props
      }) =>
        Analytics.sendUIEvent({
          action: isChecked ? 'checked' : 'unchecked',
          actionSubject: 'filter',
          actionSubjectId: filterType,
          source: 'filterPopoverInlineDialog',
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
      sendSelectedModeEvent: ({ attributes, ...props }) =>
        Analytics.sendUIEvent({
          action: 'selected',
          actionSubject: 'filter',
          actionSubjectId: 'modeFilter',
          source: 'filterPopoverInlineDialog',
          attributes: { ...commonAttributes, ...attributes },
          containers,
          ...props,
        }),
    };
  }, [
    idBoard,
    idOrganization,
    viewFilters.contextType,
    viewFilters.filters.mode,
    viewType,
  ]);
};
