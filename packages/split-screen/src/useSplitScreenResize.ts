import { useCallback } from 'react';

import type { ActionSubjectIdType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';

import type { PanelNames } from './Panels';
import { useSplitScreenSharedState } from './useSplitScreenSharedState';

const getActionSubjectId = (panelName: PanelNames): ActionSubjectIdType => {
  return panelName === 'switcher' ? 'boardSwitcherPanel' : `${panelName}Panel`;
};

interface UseSplitScreenResizeReturn {
  collapsePanel: (panelName: PanelNames) => void;
  getAnalyticsAttributes: (
    panelName: PanelNames,
    newWidth: number,
    isToggled: boolean,
  ) => Record<string, unknown>;
  getMaxWidth: (panelName: PanelNames) => number;
  getMinWidth: (panelName: PanelNames) => number;
  sendResizeAnalyticsEvent: (panelName: PanelNames, newWidth: number) => void;
}

export const useSplitScreenResize = (): UseSplitScreenResizeReturn => {
  const { panels, togglePanel } = useSplitScreenSharedState();

  const getAnalyticsAttributes = useCallback(
    (panelName: PanelNames, newWidth: number, isToggled: boolean) => {
      if (isToggled) {
        return {
          isInboxOpen: panelName !== 'inbox' && panels.inbox,
          isPlannerOpen: panelName !== 'planner' && panels.planner,
          isBoardOpen: panelName !== 'board' && panels.board,
          isSwitcherOpen: panelName !== 'switcher' && panels.switcher,
        };
      }

      return {
        isInboxOpen: panels.inbox,
        isPlannerOpen: panels.planner,
        isBoardOpen: panels.board,
        isSwitcherOpen: panels.switcher,
        newPanelSize: newWidth,
      };
    },
    [panels],
  );

  const sendResizeAnalyticsEvent = useCallback(
    (panelName: PanelNames, newWidth: number) => {
      Analytics.sendUIEvent({
        action: 'resized',
        actionSubject: 'panel',
        actionSubjectId: getActionSubjectId(panelName),
        source: 'personalProductivitySplitScreenResizingDivider',
        attributes: getAnalyticsAttributes(panelName, newWidth, false),
      });
    },
    [getAnalyticsAttributes],
  );

  const sendCollapseAnalyticsEvent = useCallback(
    (panelName: PanelNames) => {
      Analytics.sendUIEvent({
        action: 'collapsed',
        actionSubject: 'panel',
        actionSubjectId: getActionSubjectId(panelName),
        source: 'personalProductivitySplitScreenResizingDivider',
        attributes: getAnalyticsAttributes(panelName, 0, true),
      });
    },
    [getAnalyticsAttributes],
  );
  const collapsePanel = useCallback(
    (panelName: PanelNames) => {
      togglePanel(panelName);
      sendCollapseAnalyticsEvent(panelName);
    },
    [togglePanel, sendCollapseAnalyticsEvent],
  );

  const getMaxWidth = useCallback(
    (panelName: PanelNames) => {
      return panels.panelWidths[panelName].maxWidth;
    },
    [panels.panelWidths],
  );

  const getMinWidth = useCallback(
    (panelName: PanelNames) => {
      return panels.panelWidths[panelName].minWidth;
    },
    [panels.panelWidths],
  );

  return {
    collapsePanel,
    getMaxWidth,
    getMinWidth,
    getAnalyticsAttributes,
    sendResizeAnalyticsEvent,
  };
};
