import { SharedState } from '@trello/shared-state';

export interface OverlayContext {
  orgId?: string;
  source?: string;
  redirect?: boolean;
  boardLeftHandNavButtonClicked?: boolean;
  callback?: () => void;
}

interface BaseOverlayState {
  overlayType: null;
  context: OverlayContext;
}

interface PlanSelectionOverlayContext extends Omit<OverlayContext, 'callback'> {
  // This should be kept in sync with the OnCloseEvent types in
  // /packages/billing/src/FreeTrial/PlanSelectionOverlay.tsx
  // We're not importing them here to avoid a circular dependency between the
  // nachos and billing packages.
  callback?: (event: {
    trigger:
      | 'closeButton'
      | 'premiumPlanDetailsLink'
      | 'startFreeTrialButton'
      | 'unknown'
      | 'upgradeLink';
  }) => void;
}

interface PlanSelectionOverlayState {
  overlayType: 'plan-selection';
  context: PlanSelectionOverlayContext;
}

export type OverlayState = BaseOverlayState | PlanSelectionOverlayState;

const initialState: OverlayState = {
  overlayType: null,
  context: {},
};

export const overlayState = new SharedState<OverlayState>(initialState);

export type OverlaysActiveState = {
  _activeOverlays: React.RefObject<HTMLDivElement>[];
  areOverlaysActive: boolean;
};

const initialOverlaysActiveState: OverlaysActiveState = {
  _activeOverlays: [],
  areOverlaysActive: false,
};

export const overlaysActiveState = new SharedState<OverlaysActiveState>(
  initialOverlaysActiveState,
);

export const addActiveOverlay = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current !== null) {
    overlaysActiveState.setValue((prevState) => {
      const length = prevState._activeOverlays.push(ref);

      return {
        _activeOverlays: prevState._activeOverlays,
        areOverlaysActive: length > 0,
      };
    });
  }
};

export const removeActiveOverlay = (ref: React.RefObject<HTMLDivElement>) => {
  overlaysActiveState.setValue((prevState) => {
    const activeOverlays = prevState._activeOverlays.filter(
      (overlayRef) => overlayRef !== ref,
    );

    return {
      _activeOverlays: activeOverlays,
      areOverlaysActive: activeOverlays.length > 0,
    };
  });
};
