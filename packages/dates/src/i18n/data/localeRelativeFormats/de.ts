import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const de = {
  today: 'Heute um __TIME__ Uhr',
  yesterday: 'Gestern um __TIME__ Uhr',
  tomorrow: 'Morgen um __TIME__ Uhr',
  lastWeek: '__DATE_NO_YEAR__ um __TIME__ Uhr',
  nextWeek: '__DATE_NO_YEAR__ um __TIME__ Uhr',
  sameYear: '__DATE_NO_YEAR__ um __TIME__ Uhr',
  else: '__DATE_WITH_YEAR__ um __TIME__ Uhr',
} satisfies RelativeFormatConfig;

export const deWithoutTime = {
  today: 'Heute',
  yesterday: 'Gestern',
  tomorrow: 'Morgen',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
