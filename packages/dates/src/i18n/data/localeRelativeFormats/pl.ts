import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const pl = {
  today: 'Dziś o __TIME__',
  yesterday: 'Wczoraj o __TIME__',
  tomorrow: 'Jutro o __TIME__',
  lastWeek: (date) => {
    switch (date.getDay()) {
      case 0:
        return 'Zeszłą niedzielę o __TIME__';
      case 3:
        return 'Zeszłą środę o __TIME__';
      case 6:
        return 'Zeszłą sobotę o __TIME__';
      default:
        return 'Zeszły __WEEKDAY__ o __TIME__';
    }
  },
  nextWeek: '__WEEKDAY__ o __TIME__',
  sameYear: '__DATE_NO_YEAR__ o __TIME__',
  else: '__DATE_WITH_YEAR__ o __TIME__',
} satisfies RelativeFormatConfig;

export const plWithoutTime = {
  today: 'Dziś',
  yesterday: 'Wczoraj',
  tomorrow: 'Jutro',
  lastWeek: (date) => {
    switch (date.getDay()) {
      case 0:
        return 'Zeszłą niedzielę';
      case 3:
        return 'Zeszłą środę';
      case 6:
        return 'Zeszłą sobotę';
      default:
        return 'Zeszły __WEEKDAY__';
    }
  },
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
