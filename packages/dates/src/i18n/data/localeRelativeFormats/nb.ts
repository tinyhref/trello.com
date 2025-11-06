import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const nb = {
  today: 'i dag kl. __TIME__',
  yesterday: 'i går kl. __TIME__',
  tomorrow: 'i morgen kl. __TIME__',
  lastWeek: 'forrige __WEEKDAY__ kl. __TIME__',
  nextWeek: '__WEEKDAY__ kl. __TIME__',
  sameYear: '__DATE_NO_YEAR__ kl. __TIME__',
  else: '__DATE_WITH_YEAR__ kl. __TIME__',
} satisfies RelativeFormatConfig;

export const nbWithoutTime = {
  today: 'i dag',
  yesterday: 'i går',
  tomorrow: 'i morgen',
  lastWeek: 'forrige __WEEKDAY__',
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
