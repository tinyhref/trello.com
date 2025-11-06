export const STORAGE_KINDS = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
} as const;
export type StorageKind = (typeof STORAGE_KINDS)[keyof typeof STORAGE_KINDS];
