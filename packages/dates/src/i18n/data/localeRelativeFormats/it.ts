import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const it = {
  today: 'Oggi alle __TIME__',
  yesterday: 'Ieri alle __TIME__',
  tomorrow: 'Domani alle __TIME__',
  lastWeek: (date) => {
    if (date.getDay() === 0) {
      return 'la scorsa __WEEKDAY__ alle __TIME__';
    } else {
      return 'lo scorso __WEEKDAY__ alle __TIME__';
    }
  },
  nextWeek: '__WEEKDAY__ alle __TIME__',
  sameYear: '__DATE_NO_YEAR__ alle __TIME__',
  else: '__DATE_WITH_YEAR__ alle __TIME__',
} satisfies RelativeFormatConfig;

export const itWithoutTime = {
  today: 'Oggi',
  yesterday: 'Ieri',
  tomorrow: 'Domani',
  lastWeek: (date) => {
    if (date.getDay() === 0) {
      return 'la scorsa __WEEKDAY__';
    } else {
      return 'lo scorso __WEEKDAY__';
    }
  },
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
