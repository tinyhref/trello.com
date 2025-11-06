export const BoardMenuScreen = {
  Menu: 0,
  About: 1,
  Activity: 2,
  Archived: 3,
  Background: 4,
  BackgroundColor: 5,
  BackgroundPhoto: 6,
  Labels: 7,
  LabelsCreate: 8,
  LabelsEdit: 9,
  LabelsDelete: 10,
  Settings: 11,
  Stickers: 12,
  Collections: 13,
} as const;

export type BoardMenuScreenType =
  (typeof BoardMenuScreen)[keyof typeof BoardMenuScreen];
