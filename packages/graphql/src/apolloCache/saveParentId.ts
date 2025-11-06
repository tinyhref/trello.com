import type { FieldReadFunction } from '@apollo/client';

export const saveParentId: FieldReadFunction = (
  existing,
  { readField, storage },
) => {
  storage.parentId = readField<string>('id');
  // Persist parent id for using in merge function
  return existing;
};
