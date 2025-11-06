import { PersistentSharedState } from '@trello/shared-state';

export interface DeveloperConsoleState {
  lastActiveTab: number;
  developerConsoleOpen: boolean;
  developerConsoleEnabled: boolean;
  plainTextEditor: boolean;
  disableEditorViewRendering: boolean;
  showModelIds: boolean;
  useTrelloTimingHeader: boolean;
  logConnectionInformation?: boolean;
  operationNameInUrl?: boolean;
}

export const initialState: DeveloperConsoleState = {
  lastActiveTab: 0,
  developerConsoleOpen: false,
  developerConsoleEnabled: false,
  plainTextEditor: false,
  disableEditorViewRendering: false,
  showModelIds: false,
  useTrelloTimingHeader: false,
  logConnectionInformation: undefined,
  operationNameInUrl: undefined,
};

export const developerConsoleState =
  new PersistentSharedState<DeveloperConsoleState>(initialState, {
    storageKey: 'developerConsoleState',
  });
