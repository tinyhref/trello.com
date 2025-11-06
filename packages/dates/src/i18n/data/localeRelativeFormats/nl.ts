import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const nl = {
  today: 'vandaag om __TIME__',
  yesterday: 'gisteren om __TIME__',
  tomorrow: 'morgen om __TIME__',
  lastWeek: 'afgelopen __WEEKDAY__ om __TIME__',
  nextWeek: '__WEEKDAY__ om __TIME__',
  sameYear: '__DATE_NO_YEAR__ om __TIME__',
  else: '__DATE_WITH_YEAR__ om __TIME__',
} satisfies RelativeFormatConfig;

export const nlWithoutTime = {
  today: 'vandaag',
  yesterday: 'gisteren',
  tomorrow: 'morgen',
  lastWeek: 'afgelopen __WEEKDAY__',
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
