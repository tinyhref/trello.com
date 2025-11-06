export const ListErrorExtensions = {
  BOARD_TOO_MANY_CUSTOM_FIELDS: 'BOARD_TOO_MANY_CUSTOM_FIELDS',
  CUSTOM_FIELD_TOO_MANY_OPTIONS: 'CUSTOM_FIELD_TOO_MANY_OPTIONS',
} as const;
type ListErrorExtensionsType =
  (typeof ListErrorExtensions)[keyof typeof ListErrorExtensions];

export const ListErrors: Record<string, ListErrorExtensionsType> = {
  'too many custom fields': ListErrorExtensions.BOARD_TOO_MANY_CUSTOM_FIELDS,
  'too many custom field options':
    ListErrorExtensions.CUSTOM_FIELD_TOO_MANY_OPTIONS,
};
