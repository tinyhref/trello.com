import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const fi = {
  today: 'tänään klo __TIME__',
  yesterday: 'eilen klo __TIME__',
  tomorrow: 'huomenna klo __TIME__',
  lastWeek: 'viime __WEEKDAY__na klo __TIME__',
  nextWeek: '__WEEKDAY__ klo __TIME__',
  sameYear: '__DATE_NO_YEAR__ klo __TIME__',
  else: '__DATE_WITH_YEAR__ klo __TIME__',
} satisfies RelativeFormatConfig;

export const fiWithoutTime = {
  today: 'tänään',
  yesterday: 'eilen',
  tomorrow: 'huomenna',
  lastWeek: 'viime __WEEKDAY__na',
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
