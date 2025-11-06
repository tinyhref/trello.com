import type { Account } from '@trello/planner';
import { SharedState } from '@trello/shared-state';

import type { PlannerPopoverScreenType } from './PlannerHeaderToolbar/CalendarsPopover/PlannerPopoverScreen';

interface OpenSettingsPopoverStateProps {
  screen: PlannerPopoverScreenType | null;
  account?: Account | null;
}

// Shared state that holds the screen to navigate to,
// null when no screen is to be navigated to.
// Can also hold the account to navigate to the account details screen.
export const openSettingsPopoverState =
  new SharedState<OpenSettingsPopoverStateProps>({
    screen: null,
    account: null,
  });
