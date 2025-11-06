export const PlannerPopoverScreen = {
  Settings: 0,
  ConnectAccount: 1,
  ConnectedCalendars: 2,
  CustomView: 3,
  DisconnectAccount: 4,
  Feedback: 5,
  AdjustCalendarView: 6,
  ManageAccounts: 7,
  AccountDetails: 8,
};

export type PlannerPopoverScreenType =
  (typeof PlannerPopoverScreen)[keyof typeof PlannerPopoverScreen];
