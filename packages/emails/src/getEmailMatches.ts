import type { PIIString } from '@trello/privacy';
import { dangerouslyConvertPrivacyString } from '@trello/privacy';

import { emailRegex } from './validateEmail';

export const getEmailMatches = (
  email: PIIString | string,
): RegExpMatchArray | null => {
  const convertedEmail =
    typeof email === 'string' ? email : dangerouslyConvertPrivacyString(email);

  return convertedEmail.match(emailRegex);
};
