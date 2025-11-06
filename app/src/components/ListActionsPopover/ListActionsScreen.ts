export const ListActionsScreen = {
  Options: 0,
  // Order only matters for the first screen:
  ArchiveAllCards: 2,
  ColorPicker: 3,
  CopyList: 4,
  MoveAllCards: 5,
  MoveList: 6,
  SetListLimit: 7,
  SortList: 8,
  // Automation screens:
  ListAutomationTemplate: 9,
  ListAutomationActions: 10,
  ListAutomationConfirmation: 11,
  //Bulk actions:
  ArchiveAllCompletedCards: 12,
};
export type ListActionsScreenType =
  (typeof ListActionsScreen)[keyof typeof ListActionsScreen];
