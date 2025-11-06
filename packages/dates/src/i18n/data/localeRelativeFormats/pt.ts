import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const pt = {
  today: 'Hoje às __TIME__',
  yesterday: 'Ontem às __TIME__',
  tomorrow: 'Amanhã às __TIME__',
  lastWeek: '__DATE_NO_YEAR__ às __TIME__',
  nextWeek: '__DATE_NO_YEAR__ às __TIME__',
  sameYear: '__DATE_NO_YEAR__ às __TIME__',
  else: '__DATE_WITH_YEAR__ às __TIME__',
} satisfies RelativeFormatConfig;

export const ptWithoutTime = {
  today: 'Hoje',
  yesterday: 'Ontem',
  tomorrow: 'Amanhã',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
