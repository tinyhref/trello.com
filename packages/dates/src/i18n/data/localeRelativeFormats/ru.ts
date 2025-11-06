import { isSameWeek } from '../../isSameWeek';
import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const ru = {
  today: 'Сегодня в __TIME__',
  yesterday: 'Вчера в __TIME__',
  tomorrow: 'Завтра в __TIME__',
  lastWeek: (date, baseDate) => {
    if (baseDate && isSameWeek(date, baseDate)) {
      switch (date.getDay()) {
        case 0:
          return 'В прошлое __WEEKDAY__ в __TIME__';
        case 1:
        case 2:
        case 4:
          return 'В прошлый __WEEKDAY__ в __TIME__';
        default:
          return 'В прошлую __WEEKDAY__ в __TIME__';
      }
    } else {
      if (date.getDay() === 2) {
        return 'Во __WEEKDAY__ в __TIME__';
      } else {
        return 'В __WEEKDAY__ в __TIME__';
      }
    }
  },
  nextWeek: (date) => {
    return date.getDay() === 2
      ? 'Во __WEEKDAY__ в __TIME__'
      : 'В __WEEKDAY__ в __TIME__';
  },
  sameYear: '__DATE_NO_YEAR__ в __TIME__',
  else: '__DATE_WITH_YEAR__ в __TIME__',
} satisfies RelativeFormatConfig;

export const ruWithoutTime = {
  today: 'Сегодня',
  yesterday: 'Вчера',
  tomorrow: 'Завтра',
  lastWeek: (date, baseDate) => {
    if (baseDate && isSameWeek(date, baseDate)) {
      switch (date.getDay()) {
        case 0:
          return 'В прошлое __WEEKDAY__';
        case 1:
        case 2:
        case 4:
          return 'В прошлый __WEEKDAY__';
        default:
          return 'В прошлую __WEEKDAY__';
      }
    } else {
      if (date.getDay() === 2) {
        return 'Во __WEEKDAY__';
      } else {
        return 'В __WEEKDAY__';
      }
    }
  },
  nextWeek: (date) => {
    return date.getDay() === 2 ? 'Во __WEEKDAY__' : 'В __WEEKDAY__';
  },
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
