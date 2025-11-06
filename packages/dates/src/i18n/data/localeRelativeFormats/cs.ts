import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const cs = {
  today: 'dnes v __TIME__',
  yesterday: 'včera v __TIME__',
  tomorrow: 'zítra v __TIME__',
  lastWeek: (date) => {
    switch (date.getDay()) {
      case 0:
        return 'poslední neděli v __TIME__';
      case 3:
        return 'poslední středu v __TIME__';
      case 6:
        return 'poslední sobotu v __TIME__';
      default:
        return 'poslední __WEEKDAY__ v __TIME__';
    }
  },
  nextWeek: (date) => {
    switch (date.getDay()) {
      case 0:
        return 'v neděli v __TIME__';
      case 3:
        return 've středu v __TIME__';
      case 4:
        return 've čtvrtek v __TIME__';
      case 6:
        return 'v sobotu v __TIME__';
      default:
        return 'v __WEEKDAY__ v __TIME__';
    }
  },
  sameYear: 'v __DATE_NO_YEAR__ v __TIME__',
  else: 'v __DATE_WITH_YEAR__ v __TIME__',
} satisfies RelativeFormatConfig;

export const csWithoutTime = {
  today: 'dnes',
  yesterday: 'včera',
  tomorrow: 'zítra',
  lastWeek: (date) => {
    switch (date.getDay()) {
      case 0:
        return 'poslední neděli';
      case 3:
        return 'poslední středu';
      case 6:
        return 'poslední sobotu';
      default:
        return 'poslední __WEEKDAY__';
    }
  },
  nextWeek: (date) => {
    switch (date.getDay()) {
      case 0:
        return 'neděli';
      case 3:
        return 'středu';
      case 4:
        return 'čtvrtek';
      case 6:
        return 'sobotu';
      default:
        return '__WEEKDAY__';
    }
  },
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
