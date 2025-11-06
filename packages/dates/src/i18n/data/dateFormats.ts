/**
 * Date formats for each locale used for parsing.
 */
export const dateFormats: Record<string, string[]> = {
  cs: ['d.M.yyyy', 'd. M. yyyy', 'd.M.', 'd.M', 'd/M/yyyy', 'd/M'],
  de: ['d.M.y', 'd.M.', 'd.M', 'd/M/y', 'd/M'],
  'en-AU': ['d/M/yy', 'd/M/yyyy', 'd/M', 'd-M-yy', 'd-M-yyyy', 'd-M'],
  'en-GB': ['d/M/yy', 'd/M/yyyy', 'd/M', 'd-M-yy', 'd-M-yyyy', 'd-M'],
  'en-US': ['M/d/yy', 'M/d/yyyy', 'M/d', 'M-d-yy', 'M-d-yyyy', 'M-d'],
  es: ['d/M/yyyy', 'd/M', 'd-M-yyyy', 'd-M'],
  fi: ['d.M.y', 'd.M.', 'd.M', 'd/M/y', 'd/M'],
  fr: ['d/M/y', 'd/M', 'd-M-y', 'd-M'],
  'fr-CA': ['M/d/yyyy', 'M/d', 'M-d-yyyy', 'M-d'],
  hu: ['y.M.d.', 'y. M. d.', 'M.d.', 'M.d'],
  it: ['d/M/y', 'd/M', 'd-M-y', 'd-M'],
  ja: ['y/M/d', 'M/d', 'M-d'],
  nb: ['d.M.y', 'd.M.', 'd.M', 'd/M/y', 'd/M'],
  nl: ['d-M-y', 'd-M', 'd/M/y', 'd/M'],
  pl: ['d.M.y', 'd.M.', 'd.M', 'd/M/y', 'd/M'],
  'pt-BR': ['d/M/yyyy', 'd/M', 'd-M-yyyy', 'd-M'],
  ru: ['d.M.y', 'd.M.', 'd.M', 'd/M/y', 'd/M'],
  sv: ['y-M-d', 'M-d', 'M/d'],
  th: ['d/M/yyyy', 'd/M', 'yyyy/M/d'],
  tr: ['d.M.yyyy', 'd.M.', 'd.M', 'd/M/yyyy', 'd/M'],
  uk: ['d.M.y', 'd.M.', 'd.M', 'd/M/y', 'd/M'],
  vi: ['d/M/y', 'd/M', 'd-M-y', 'd-M'],
  'zh-Hans': [
    'yyyy/M/d',
    'yyyy-M-d',
    'yy-M-d',
    'M-d',
    'M/d',
    'd.M.yyyy' /* Hong Kong and Macau */,
  ],
  'zh-Hant': [
    'yyyy/M/d',
    'yyyy-M-d',
    'yy-M-d',
    'M-d',
    'M/d',
    'd.M.yyyy' /* Hong Kong and Macau */,
  ],
};
export const defaultDateFormat = 'y-M-d';
