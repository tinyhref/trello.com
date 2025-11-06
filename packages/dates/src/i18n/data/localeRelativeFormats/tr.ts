import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const tr = {
  today: 'bugün saat __TIME__',
  yesterday: 'dün __TIME__',
  tomorrow: 'yarın saat __TIME__',
  lastWeek: 'geçen hafta __WEEKDAY__ saat __TIME__',
  nextWeek: '__WEEKDAY__ saat __TIME__',
  sameYear: '__DATE_NO_YEAR__ saat __TIME__',
  else: '__DATE_WITH_YEAR__ saat __TIME__',
} satisfies RelativeFormatConfig;

export const trWithoutTime = {
  today: 'bugün',
  yesterday: 'dün',
  tomorrow: 'yarın',
  lastWeek: 'geçen hafta __WEEKDAY__',
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
