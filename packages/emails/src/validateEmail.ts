import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

// Regex explanation:
//
// [^"@\s[\](),:;<>\\-]{1} -- The first character of the email cannot beany of the characters inside the [^]
//
// ([^"@\s[\](),:;<>\\]*[^"@\s[\](),:;<>\\-]{1})? -- There may optionally be more characters in the email username, as
// long as they are not any of the characters in the [^] group. There can be hyphens in the middle of the domain but the
// last character must not be a hyphen
//
// @[a-z0-9.]{1} -- There must be at least one character after the @ which is a lowercase letter, a number, or a dot (not a hyphen!)
// ([-a-z0-9.]*[a-z0-9.]{1})? -- There can optionally be more characters in the email domain (but only letters, numbers, dots,
// and hyphens), and the last character cannot be a hyphen.
//
// \.[a-z]+ -- There must be a top level domain after the . that is composed only of alphabetic characters, that is at the end of the string
export const emailRegex =
  /([^"@\s[\](),:;<>\\-]{1}([^"@\s[\](),:;<>\\]*[^"@\s[\](),:;<>\\-]{1})?@[a-z0-9.]{1}([-a-z0-9.]*[a-z0-9.]{1})?\.[a-z]+)/gi;

// Returns true if a string contains a valid email
export const validateEmail = (email: PIIString | string): boolean => {
  const convertedEmail =
    typeof email === 'string' ? email : dangerouslyConvertPrivacyString(email);

  return new RegExp(emailRegex).test(convertedEmail);
};
