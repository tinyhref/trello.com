export const Screens = {
  Menu: 0,
  Members: 1,
  Labels: 2,
  CreateLabel: 3,
  EditLabel: 4,
  DeleteLabel: 5,
  Checklist: 6,
  Dates: 7,
  Attachment: 8,
  AttachmentSendingLinks: 9,
  AttachmentInfo: 10,
  Location: 11,
  CustomFields: 12,
  CreateCustomField: 13,
  EditCustomField: 14,
  DeleteCustomField: 15,
  CustomFieldsUpgradePrompt: 16,
} as const;

export type AddToCardMenuScreenType = (typeof Screens)[keyof typeof Screens];
