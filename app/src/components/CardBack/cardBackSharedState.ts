import { getMemberId } from '@trello/authentication';
import { PersistentSharedState } from '@trello/shared-state';

export type Panel = 'activity' | 'planner' | 'rovo';

const DEFAULT_PANEL_WIDTH = 460;

interface CardBackSharedState {
  activePanel: Panel | null;
  isPanelOpen: boolean;
  panelWidth?: number; // Optional for backward compatibility
  shouldScrollIntoView: boolean;
}

// TODO: Change when comments wrapping is implemented
const shouldOpenPanel = window.innerWidth > 600;

export const defaultCardBackSharedState: CardBackSharedState = {
  activePanel: 'activity',
  isPanelOpen: shouldOpenPanel,
  panelWidth: DEFAULT_PANEL_WIDTH,
  shouldScrollIntoView: false,
};

export const cardBackSharedState = new PersistentSharedState(
  defaultCardBackSharedState,
  { storageKey: () => `cardBackState-${getMemberId() ?? 'anonymous'}` },
);
