export const LabelsPopoverScreen = {
  Labels: 0,
  Create: 1,
  Edit: 2,
  Delete: 3,
} as const;
export type LabelsPopoverScreenType =
  (typeof LabelsPopoverScreen)[keyof typeof LabelsPopoverScreen];
