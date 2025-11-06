import { developerConsoleState } from '@trello/developer-console-state';

import { useIsEmployee } from 'app/src/useIsEmployee';

/**
 * Show internal tools if the user is allowed to view multiple channels,
 * or if we're not in a production environment (to make development easier).
 */
export const useShouldShowInternalTools = (): boolean => {
  const shouldShow = useIsEmployee();

  // Set the developer console state values if they're not already set
  // This is to ensure that we don't override any user-set values
  // but Atlassians will get the features enabled by default
  if (developerConsoleState.value.logConnectionInformation === undefined) {
    developerConsoleState.setValue({
      logConnectionInformation: shouldShow,
    });
  }
  if (developerConsoleState.value.operationNameInUrl === undefined) {
    developerConsoleState.setValue({
      operationNameInUrl: shouldShow,
    });
  }

  return shouldShow;
};
