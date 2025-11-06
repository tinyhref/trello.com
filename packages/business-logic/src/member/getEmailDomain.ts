import type { PIIString } from '@trello/privacy';
import { EMPTY_PII_STRING } from '@trello/privacy';

/**
 * Returns domain for the provided email.
 * Based on Data Science's extraction of domain from primary user email
 * https://github.com/trello/mode/search?q=split_part
 */
export const getEmailDomain = (email?: PIIString) => {
  return email?.split('@')[1] ?? EMPTY_PII_STRING;
};
