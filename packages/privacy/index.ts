import type { PIIString, SecureString, UGCString } from './src/privacy';

export { convertToPIIString } from './src/convertToPIIString';
export { convertToUGCString } from './src/convertToUGCString';
export { dangerouslyConvertPrivacyString } from './src/dangerouslyConvertPrivacyString';
export type {
  PIIString,
  SecureString,
  SensitiveString,
  UGCString,
} from './src/privacy';
export const EMPTY_PII_STRING = '' as unknown as PIIString;
export const EMPTY_UGC_STRING = '' as unknown as UGCString;
export const EMPTY_SECURE_STRING = '' as unknown as SecureString;
