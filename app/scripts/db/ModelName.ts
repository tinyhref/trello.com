export const ModelName = {
  ACTION: 'Action',
  BOARD: 'Board',
  BOARD_PLUGIN: 'BoardPlugin',
  CARD: 'Card',
  CHECKLIST: 'Checklist',
  CUSTOM_FIELD: 'CustomField',
  CUSTOM_FIELD_ITEM: 'CustomFieldItem',
  ENTERPRISE: 'Enterprise',
  LABEL: 'Label',
  LIST: 'List',
  MEMBER: 'Member',
  ORGANIZATION: 'Organization',
  PENDING_ORGANIZATION: 'PendingOrganization',
  PLUGIN: 'Plugin',
  PLUGIN_DATA: 'PluginData',
  REACTION: 'Reaction',
} as const;

export type ModelNames = (typeof ModelName)[keyof typeof ModelName];
