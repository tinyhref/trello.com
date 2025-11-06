import type {
  PIIString,
  SecureString,
  SensitiveString,
  UGCString,
} from './privacy';

// Overloads handle cases of undefined / null.
function dangerouslyConvertPrivacyString(
  str: PIIString | SecureString | SensitiveString | UGCString,
): string;
function dangerouslyConvertPrivacyString(
  str: PIIString | SecureString | SensitiveString | UGCString | null,
): string | null;
function dangerouslyConvertPrivacyString(
  str?: PIIString | SecureString | SensitiveString | UGCString,
): string | undefined;
function dangerouslyConvertPrivacyString(
  str?: PIIString | SecureString | SensitiveString | UGCString | null,
): string | null | undefined;

// There are areas where we need to use a privacy string as a string, e.g. HTML attributes.
// Explicit casting privacy strings like this in code is strictly disallowed - This
// function should be used instead for discoverability of potential data leaks.
function dangerouslyConvertPrivacyString(
  str?: PIIString | SecureString | SensitiveString | UGCString | null,
) {
  if (str === undefined || str === null) {
    return str;
  }
  // eslint-disable-next-line @trello/disallow-string-casting
  return str as unknown as string;
}

export { dangerouslyConvertPrivacyString };
