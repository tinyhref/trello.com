import cx from 'classnames';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FunctionComponent,
} from 'react';
import { useIntl } from 'react-intl';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { useGpuAcceleratedFeatures } from '@trello/gpu';
import {
  getProposedPanelWidth,
  useSplitScreenResize,
  useSplitScreenSharedState,
  type PanelNames,
} from '@trello/split-screen';
import type { SplitScreenTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import * as styles from './SplitScreenResizeDivider.module.less';

interface SplitScreenResizeDividerProps {
  shouldHideDivider: boolean;
  isRightMostDivider: boolean;
  leftPanelName: PanelNames;
  rightPanelName: PanelNames;
  leftPreviousWidth: number;
  rightPreviousWidth: number;
  handleSetWidthCallback: (panelName: PanelNames, width: number) => void;
  handleDoubleClick: () => void;
  enableTransitionsCallback: (enable: boolean) => void;
}

export const SplitScreenResizeDivider: FunctionComponent<
  SplitScreenResizeDividerProps
> = ({
  shouldHideDivider,
  isRightMostDivider,
  leftPanelName,
  rightPanelName,
  leftPreviousWidth,
  rightPreviousWidth,
  handleSetWidthCallback,
  handleDoubleClick,
  enableTransitionsCallback,
}) => {
  const intl = useIntl();
  const dividerRef = useRef<HTMLDivElement>(null);

  const isGpuAcceleratedFeaturesEnabled = useGpuAcceleratedFeatures();

  const { getMaxWidth, getMinWidth, collapsePanel, sendResizeAnalyticsEvent } =
    useSplitScreenResize();

  const { resizeAllPanelsToDefault, updateResizedPanelWidth } =
    useSplitScreenSharedState();

  const leftMaxWidth = getMaxWidth(leftPanelName);
  const leftMinWidth = getMinWidth(leftPanelName);
  const rightMaxWidth = getMaxWidth(rightPanelName);
  const rightMinWidth = getMinWidth(rightPanelName);
  const [isDragging, setIsDragging] = useState(false);

  const handleDividerDoubleClick = useCallback(() => {
    resizeAllPanelsToDefault();
    handleDoubleClick();
  }, [handleDoubleClick, resizeAllPanelsToDefault]);

  useEffect(() => {
    const divider = dividerRef.current;

    if (!divider) {
      return;
    }

    return draggable({
      element: divider,
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
        preventUnhandled.start();
      },
      onDragStart() {
        enableTransitionsCallback(false);
        setIsDragging(true);
      },
      onDrag({ location }) {
        const leftNewWidth = getProposedPanelWidth({
          location,
          maxWidth: leftMaxWidth,
          minWidth: leftMinWidth,
          previousWidth: leftPreviousWidth,
          isRighthandPanel: false,
        });

        const rightNewWidth = getProposedPanelWidth({
          location,
          maxWidth: rightMaxWidth,
          minWidth: rightMinWidth,
          previousWidth: rightPreviousWidth,
          isRighthandPanel: isRightMostDivider,
        });

        const shouldEnableTransitions =
          isGpuAcceleratedFeaturesEnabled &&
          (leftNewWidth === 0 || rightNewWidth === 0);

        enableTransitionsCallback(shouldEnableTransitions);

        handleSetWidthCallback(leftPanelName, leftNewWidth);

        if (isRightMostDivider) {
          handleSetWidthCallback(rightPanelName, rightNewWidth);
        }
      },
      onDrop({ location }) {
        preventUnhandled.stop();
        const leftNewWidth = getProposedPanelWidth({
          location,
          maxWidth: leftMaxWidth,
          minWidth: leftMinWidth,
          previousWidth: leftPreviousWidth,
          isRighthandPanel: false,
        });

        const rightNewWidth = getProposedPanelWidth({
          location,
          maxWidth: rightMaxWidth,
          minWidth: rightMinWidth,
          previousWidth: rightPreviousWidth,
          isRighthandPanel: true,
        });

        if (leftNewWidth === 0) {
          collapsePanel(leftPanelName);
          handleSetWidthCallback(leftPanelName, leftPreviousWidth);
        } else if (leftNewWidth !== leftPreviousWidth) {
          updateResizedPanelWidth(leftPanelName, leftNewWidth);
          handleSetWidthCallback(leftPanelName, leftNewWidth);
          sendResizeAnalyticsEvent(leftPanelName, leftNewWidth);
        }

        if (isRightMostDivider && rightNewWidth === 0) {
          collapsePanel(rightPanelName);
          handleSetWidthCallback(rightPanelName, rightPreviousWidth);
        } else if (isRightMostDivider && rightNewWidth !== rightPreviousWidth) {
          updateResizedPanelWidth(rightPanelName, rightNewWidth);
          handleSetWidthCallback(rightPanelName, rightNewWidth);
          sendResizeAnalyticsEvent(rightPanelName, rightNewWidth);
        }

        enableTransitionsCallback(isGpuAcceleratedFeaturesEnabled);
        setIsDragging(false);
      },
    });
  }, [
    collapsePanel,
    leftMaxWidth,
    leftMinWidth,
    leftPanelName,
    rightMaxWidth,
    rightMinWidth,
    rightPanelName,
    enableTransitionsCallback,
    leftPreviousWidth,
    rightPreviousWidth,
    handleSetWidthCallback,
    updateResizedPanelWidth,
    sendResizeAnalyticsEvent,
    isRightMostDivider,
    isGpuAcceleratedFeaturesEnabled,
  ]);

  return (
    <div className={styles.dragAndDropDividerContainer}>
      <div
        className={cx(styles.dragAndDropDivider, {
          [styles.dragging]: isDragging,
          [styles.hidden]: shouldHideDivider,
          [styles.animate]: isGpuAcceleratedFeaturesEnabled,
          [styles.noAnimation]: !isGpuAcceleratedFeaturesEnabled,
        })}
        aria-label={intl.formatMessage({
          id: 'templates.split-screen-resize.drag-to-resize',
          defaultMessage: 'Drag to resize',
          description: 'Aria label for the resize divider',
        })}
        role="slider"
        aria-valuenow={
          rightPanelName === 'board' ? rightPreviousWidth : leftPreviousWidth
        }
        aria-valuemin={
          rightPanelName === 'board' ? rightMinWidth : leftMinWidth
        }
        aria-valuemax={
          rightPanelName === 'board' ? rightMaxWidth : leftMaxWidth
        }
        ref={dividerRef}
        data-testid={getTestId<SplitScreenTestIds>('resize-divider')}
        onDoubleClick={handleDividerDoubleClick}
      />
    </div>
  );
};
