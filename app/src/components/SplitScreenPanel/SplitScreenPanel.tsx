import cx from 'classnames';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import useResizeObserver from 'use-resize-observer';

import { smartScheduledCardsSharedState } from '@trello/business-logic/planner';
import { useGpuAcceleratedFeatures } from '@trello/gpu';
import { useSharedStateSelector } from '@trello/shared-state';
import type { PanelNames } from '@trello/split-screen';
import { useSplitScreenSharedState } from '@trello/split-screen';
import { getTestId } from '@trello/test-ids';
import type { SplitScreenTestIds } from '@trello/test-ids';

import { useIsSmartScheduleM2Enabled } from 'app/src/components/SmartSchedule';

import * as styles from './SplitScreenPanel.module.less';

interface SplitScreenPanelProps {
  children?: ReactNode;
  panelName: PanelNames;
  isHidden?: boolean;
  panelWidth?: number;
  enableTransitions?: boolean;
  isCollapsed?: boolean;
  shouldGrow?: boolean;
  onResize: () => void;
}

export const SplitScreenPanel = forwardRef<
  HTMLDivElement,
  SplitScreenPanelProps
>(
  (
    {
      children,
      isHidden,
      panelName,
      panelWidth,
      enableTransitions,
      isCollapsed,
      shouldGrow = false,
      onResize,
    },
    ref,
  ) => {
    const isGpuAcceleratedFeaturesEnabled = useGpuAcceleratedFeatures();
    const { areMultiplePanelsOpen } = useSplitScreenSharedState();
    const isSmartScheduleM2Enabled = useIsSmartScheduleM2Enabled();

    const [showAiBorder, setShowAiBorder] = useState(false);

    const { hasProposedEvents } = useSharedStateSelector(
      smartScheduledCardsSharedState,
      useCallback(
        (state) => ({
          hasProposedEvents: state.proposedEvents.length > 0,
        }),
        [],
      ),
    );

    const shouldShowAiBorder = useMemo(() => {
      return (
        isSmartScheduleM2Enabled &&
        panelName === 'planner' &&
        hasProposedEvents &&
        isGpuAcceleratedFeaturesEnabled &&
        !isHidden &&
        !isCollapsed
      );
    }, [
      panelName,
      isSmartScheduleM2Enabled,
      hasProposedEvents,
      isHidden,
      isCollapsed,
      isGpuAcceleratedFeaturesEnabled,
    ]);

    useEffect(() => {
      if (shouldShowAiBorder) {
        // Delay showing the AI border to allow panel animation to complete
        const timer = setTimeout(() => {
          setShowAiBorder(true);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setShowAiBorder(false);
      }
    }, [shouldShowAiBorder]);

    useResizeObserver({
      ref: ref as RefObject<HTMLDivElement> | null,
      onResize,
    });

    const panelFlexValue = useMemo(() => {
      const width = `${panelWidth ?? 0}px`;

      if (isHidden || panelWidth === 0) {
        return '0 0 0px';
      }

      if (!areMultiplePanelsOpen || shouldGrow) {
        return `1 1 ${width}`;
      }

      return `0 0 ${width}`;
    }, [isHidden, panelWidth, areMultiplePanelsOpen, shouldGrow]);

    if (isSmartScheduleM2Enabled && panelName === 'planner') {
      return (
        <div
          className={cx(styles.panel, {
            [styles.singlePanel]: !areMultiplePanelsOpen,
            [styles.panelTransitions]: enableTransitions,
            [styles.hidden]: isHidden,
            [styles.collapsed]: isCollapsed,
            [styles.plannerAiBorder]: showAiBorder,
          })}
          data-testid={getTestId<SplitScreenTestIds>('split-screen-panel')}
          style={{
            flex: panelFlexValue,
          }}
          ref={ref}
          aria-hidden={isHidden}
        >
          <div
            className={cx(styles.panelContent, {
              [styles.singlePanel]: !areMultiplePanelsOpen,
            })}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        className={cx(styles.panel, {
          [styles.singlePanel]: !areMultiplePanelsOpen,
          [styles.panelTransitions]: enableTransitions,
          [styles.hidden]: isHidden,
          [styles.collapsed]: isCollapsed,
          [styles.plannerPanel]: panelName === 'planner',
        })}
        data-testid={getTestId<SplitScreenTestIds>('split-screen-panel')}
        style={{
          flex: panelFlexValue,
        }}
        ref={ref}
        aria-hidden={isHidden}
      >
        {children}
      </div>
    );
  },
);
