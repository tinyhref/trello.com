import cx from 'classnames';
import type { FunctionComponent, RefObject } from 'react';
import { Suspense, useCallback, useContext, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AtlasKitFilterIcon from '@atlaskit/icon/core/filter';
import { Analytics } from '@trello/atlassian-analytics';
import { BoardPremiumFeaturesProvider } from '@trello/business-logic-react/board';
import { mergeRefs } from '@trello/dom-hooks';
import { DynamicButton } from '@trello/dynamic-tokens';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { Button } from '@trello/nachos/button';
import { dismissFlag } from '@trello/nachos/experimental-flags';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Popover, PopoverPlacement, usePopover } from '@trello/nachos/popover';
import { useRecentlyUsedFeaturePreloader } from '@trello/recently-used-feature-preloader';
import type { FilterPopoverTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { resetMapViewSharedState } from 'app/src/components/MapView/mapViewSharedState';
import { useIsKeyboardShortcutsEnabled } from 'app/src/components/Shortcuts/useIsKeyboardShortcutsEnabled';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip';
import type { CountableViewFilterParams } from 'app/src/components/ViewFilters';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import { FilterPopoverSkeleton } from './FilterPopoverSections/FilterPopoverSkeleton';
import { useFilterPopoverAnalytics } from './useFilterPopoverAnalytics';

import * as styles from './FilterPopoverButton.module.less';

export const FILTERS_TO_SKIP_IN_CLEAR_ON_CLICK: CountableViewFilterParams = [
  'boards',
  'sort',
];
export const FILTERS_TO_SKIP_COUNTING_IN_WORKSPACE_VIEWS: CountableViewFilterParams =
  [...FILTERS_TO_SKIP_IN_CLEAR_ON_CLICK, 'title'];

export interface FilterPopoverButtonProps {
  /**
   * State styling is manually applied within this component, as it's considered
   * "active" when any filters are applied. Appearance is referenced directly in
   * our LESS styles as a result.
   * @default 'default'
   */
  appearance?: 'default' | 'transparent-dark' | 'transparent';
  isDisabled?: boolean;
  isCollapsed?: boolean;
  isFiltering: () => boolean;
  isLoading?: boolean;
  filteredCardsCount?: number;
  boardId?: string;
  className?: string;
}

export const FilterPopoverButton: FunctionComponent<
  FilterPopoverButtonProps
> = ({
  appearance = 'default',
  isDisabled,
  isCollapsed,
  isFiltering,
  isLoading,
  filteredCardsCount,
  boardId,
  className,
}) => {
  const FilterPopoverAnalytics = useFilterPopoverAnalytics();
  const { viewFilters } = useContext(ViewFiltersContext);
  const isKeyboardShortcutsEnabled = useIsKeyboardShortcutsEnabled();

  const [FilterPopover, trackFeatureUsage] = useRecentlyUsedFeaturePreloader({
    featureName: 'FilterPopover',
    useLazyComponentArgs: [
      () => import(/* webpackChunkName: "filter-popover" */ './FilterPopover'),
      { namedImport: 'FilterPopover' },
    ],
  });

  const intl = useIntl();

  const popoverResult = usePopover<HTMLButtonElement>({
    size: 'large',
    onShow: () => {
      FilterPopoverAnalytics.sendScreenEvent({
        name: 'filterPopoverInlineDialog',
        attributes: viewFilters.getCommonAttributes?.(),
      });
    },
    onHide: () => {
      FilterPopoverAnalytics.sendClosedComponentEvent({
        componentType: 'inlineDialog',
        componentName: 'filterPopoverInlineDialog',
        source: getScreenFromUrl(),
        attributes: viewFilters.getCommonAttributes?.(),
      });
    },
    placement: PopoverPlacement.BOTTOM_END,
  });

  useEffect(() => {
    viewFilters.setFilterPopoverResult?.(popoverResult);

    return () => {
      viewFilters.setFilterPopoverResult?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { toggle, triggerRef, popoverProps } = popoverResult;

  const onClickFilterCardsTooltipRef = useRef<() => void>();
  const togglePopover = useCallback(() => {
    onClickFilterCardsTooltipRef.current?.();
    trackFeatureUsage();
    // We only want open clicks; close clicks aren't very interesting.
    if (!popoverProps.isVisible) {
      FilterPopoverAnalytics.sendClickedButtonEvent({
        buttonName: 'filterPopoverButton',
        source: getScreenFromUrl(),
        attributes: viewFilters.getCommonAttributes?.(),
      });
    }
    resetMapViewSharedState();
    toggle();
  }, [
    FilterPopoverAnalytics,
    popoverProps.isVisible,
    toggle,
    trackFeatureUsage,
    viewFilters,
  ]);

  useShortcut(togglePopover, {
    scope: Scope.BoardView,
    key: Key.f,
    enabled: isKeyboardShortcutsEnabled,
  });

  const onClickClearFiltersTooltipRef = useRef<() => void>();
  const onClickClearFiltersButton = useCallback(async () => {
    const traceId = Analytics.startTask({
      taskName: 'remove-boardFilter',
      source: 'filterPopoverButton',
    });

    try {
      FilterPopoverAnalytics.sendClickedButtonEvent({
        buttonName: 'clearFiltersButton',
        source: getScreenFromUrl(),
        attributes: viewFilters.getCommonAttributes?.(),
      });

      viewFilters.resetFilters(FILTERS_TO_SKIP_IN_CLEAR_ON_CLICK);
      onClickClearFiltersTooltipRef.current?.();
      resetMapViewSharedState();
      dismissFlag({ id: 'board-filters' });
      dismissFlag({ id: 'staleFilterPopoverButton' });

      Analytics.taskSucceeded({
        taskName: 'remove-boardFilter',
        source: 'filterPopoverButton',
        traceId,
      });
    } catch (error) {
      Analytics.taskFailed({
        taskName: 'remove-boardFilter',
        source: 'filterPopoverButton',
        traceId,
        error,
      });
    }
  }, [FilterPopoverAnalytics, viewFilters]);

  const isSingleBoardView = viewFilters.contextType === 'singleBoard';
  const isFilteringEnabled = isFiltering();
  const isActive = popoverProps.isVisible || isFilteringEnabled;
  const ButtonComponent = isSingleBoardView ? DynamicButton : Button;
  const highLightedProps = isSingleBoardView
    ? { isHighlighted: isActive }
    : null;

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Filter Popover',
      }}
    >
      <span
        className={cx(
          styles.buttonGroup,
          isFilteringEnabled && styles.isFiltering,
          className,
        )}
        data-appearance={appearance}
      >
        <ShortcutTooltip
          shortcutText={intl.formatMessage({
            id: 'filter popover.filter cards',
            defaultMessage: 'Filter cards',
            description:
              'A tooltip indicating a user can filter by cards with the shortcut F',
          })}
          shortcutKey="F"
        >
          {({ ref: tooltipRef, onClick: onClickTooltip, ...tooltipProps }) => {
            const mergedRefs = mergeRefs(triggerRef, tooltipRef);
            onClickFilterCardsTooltipRef.current =
              onClickTooltip as typeof onClickFilterCardsTooltipRef.current;

            return (
              <ButtonComponent
                className={cx(
                  styles.filterButton,
                  styles[appearance],
                  isFilteringEnabled && styles.isFiltering,
                  isCollapsed && styles.isCollapsed,
                )}
                iconBefore={
                  <AtlasKitFilterIcon
                    label={intl.formatMessage({
                      id: 'filter popover.filter cards',
                      defaultMessage: 'Filter cards',
                      description: 'A filter icon',
                    })}
                    color="currentColor"
                  />
                }
                isDisabled={isDisabled}
                onClick={togglePopover}
                ref={mergedRefs as RefObject<HTMLButtonElement>}
                testId={getTestId<FilterPopoverTestIds>(
                  'filter-popover-button',
                )}
                {...highLightedProps}
                {...tooltipProps}
              >
                {isFilteringEnabled && (
                  <div
                    data-testid={getTestId<FilterPopoverTestIds>(
                      'filter-popover-button-filter-count',
                    )}
                    className={cx(
                      styles.filtersCount,
                      isLoading && styles.isLoadingCards,
                      isCollapsed && styles.isCollapsed,
                    )}
                  >
                    <span>{filteredCardsCount}</span>
                  </div>
                )}
              </ButtonComponent>
            );
          }}
        </ShortcutTooltip>
        {isFilteringEnabled ? (
          <ShortcutTooltip
            shortcutText={intl.formatMessage({
              id: 'filter popover.clear filters',
              defaultMessage: 'Clear filters',
              description:
                'A tooltip indicating the user can clear filters with the x key',
            })}
            shortcutKey="x"
          >
            {({ onClick: onClickTooltip, ...tooltipProps }) => {
              onClickClearFiltersTooltipRef.current =
                onClickTooltip as typeof onClickFilterCardsTooltipRef.current;
              return (
                <ButtonComponent
                  data-testid={getTestId<FilterPopoverTestIds>(
                    'filter-popover-button-x',
                  )}
                  className={cx(
                    styles.clearFiltersButton,
                    isCollapsed && styles.isCollapsed,
                    styles[appearance],
                  )}
                  iconBefore={
                    <CloseIcon
                      size="small"
                      dangerous_className={styles.buttonIcon}
                    />
                  }
                  isDisabled={isDisabled}
                  onClick={onClickClearFiltersButton}
                  {...highLightedProps}
                  {...tooltipProps}
                >
                  <div className={cx(styles.buttonText)}>
                    <FormattedMessage
                      id="filter popover.clear all"
                      defaultMessage="Clear all"
                      description="A button that clears all the filters"
                    />
                  </div>
                </ButtonComponent>
              );
            }}
          </ShortcutTooltip>
        ) : null}
      </span>
      {popoverProps.isVisible && (
        <Popover
          title={intl.formatMessage({
            id: 'filter popover.filter',
            defaultMessage: 'Filter',
            description: 'The header title for the filter popover',
          })}
          dontOverlapAnchorElement
          {...popoverProps}
          data-testid={getTestId<FilterPopoverTestIds>(
            'filter-popover-contents',
          )}
        >
          <ChunkLoadErrorBoundary fallback={null} retryAfter={15000}>
            <Suspense fallback={<FilterPopoverSkeleton />}>
              <BoardPremiumFeaturesProvider boardId={boardId}>
                <FilterPopover viewFilters={viewFilters} boardId={boardId} />
              </BoardPremiumFeaturesProvider>
            </Suspense>
          </ChunkLoadErrorBoundary>
        </Popover>
      )}
    </ErrorBoundary>
  );
};
