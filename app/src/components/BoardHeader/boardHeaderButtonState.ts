import { SharedState } from '@trello/shared-state';

export const boardHeaderButtonState = new SharedState({
  hasCalendarPowerUp: false,
  hasMapPowerUp: false,
  pluginButtonCount: 0,
  automationButtonCount: 0,
  isLoading: true,
});
