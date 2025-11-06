import { dynamicConfigClient } from '@trello/dynamic-config';

const configKey = 'trello_web_native_current_board_lists_cards';

/**
 * Check if the `trello_web_native_current_board_lists_cards` dynamic config flag is enabled.
 * @returns true if the flag is enabled, false otherwise.
 */
export const isNativeCurrentBoardListsCardsEnabled = () => {
  const configValue = dynamicConfigClient.get<boolean>(configKey);
  return configValue;
};

/**
 * Subscribe to updates to the `trello_web_native_current_board_lists_cards` dynamic config flag, and run the callback when the flag changes.
 * @param callback - The function to run when the flag changes.
 * @returns A function to unsubscribe from the flag updates.
 */
export const subscribeToNativeCurrentBoardListsCards = (
  callback: (current?: boolean, previous?: boolean) => void,
) => {
  dynamicConfigClient.on(configKey, callback);
  return () => dynamicConfigClient.off(configKey, callback);
};
