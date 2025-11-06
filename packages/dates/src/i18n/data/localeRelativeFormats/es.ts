import type { RelativeFormatConfig } from '../relativeFormatConfig';

const at = (date: Date) => (date.getHours() === 1 ? 'a la' : 'a las');

export const es = {
  today: (date) => {
    return `hoy ${at(date)} __TIME__`;
  },
  yesterday: (date) => {
    return `ayer ${at(date)} __TIME__`;
  },
  tomorrow: (date) => {
    return `mañana ${at(date)} __TIME__`;
  },
  lastWeek: (date) => {
    return `__DATE_NO_YEAR__ ${at(date)} __TIME__`;
  },
  nextWeek: (date) => {
    return `__DATE_NO_YEAR__ ${at(date)} __TIME__`;
  },
  sameYear: (date) => {
    return `__DATE_NO_YEAR__ ${at(date)} __TIME__`;
  },
  else: (date) => {
    return `__DATE_WITH_YEAR__ ${at(date)} __TIME__`;
  },
} satisfies RelativeFormatConfig;

export const esWithoutTime = {
  today: 'hoy',
  yesterday: 'ayer',
  tomorrow: 'mañana',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
