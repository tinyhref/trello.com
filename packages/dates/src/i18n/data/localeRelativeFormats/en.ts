import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const en = {
  today: 'today at __TIME__',
  yesterday: 'yesterday at __TIME__',
  tomorrow: 'tomorrow at __TIME__',
  lastWeek: '__DATE_NO_YEAR__ at __TIME__',
  nextWeek: '__DATE_NO_YEAR__ at __TIME__',
  sameYear: '__DATE_NO_YEAR__ at __TIME__',
  else: '__DATE_WITH_YEAR__ at __TIME__',
} satisfies RelativeFormatConfig;

export const enWithoutTime = {
  today: 'today',
  yesterday: 'yesterday',
  tomorrow: 'tomorrow',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
