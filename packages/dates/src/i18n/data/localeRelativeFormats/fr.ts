import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const fr = {
  today: "Aujourd'hui à __TIME__",
  yesterday: 'Hier à __TIME__',
  tomorrow: 'Demain à __TIME__',
  lastWeek: '__WEEKDAY__ dernier à __TIME__',
  nextWeek: '__WEEKDAY__ à __TIME__',
  sameYear: '__DATE_NO_YEAR__ à __TIME__',
  else: '__DATE_WITH_YEAR__ à __TIME__',
} satisfies RelativeFormatConfig;

export const frWithoutTime = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  tomorrow: 'Demain',
  lastWeek: '__WEEKDAY__ dernier',
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
