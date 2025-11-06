import type { RelativeFormatConfig } from '../relativeFormatConfig';

const weekEndings = [
  'vasárnap',
  'hétfőn',
  'kedden',
  'szerdán',
  'csütörtökön',
  'pénteken',
  'szombaton',
];

const week = (date: Date, isFuture: boolean, withTime = true) => {
  return `${isFuture ? '' : 'múlt '}${weekEndings[date.getDay()]}${
    withTime ? ' __TIME__-kor' : ''
  }`;
};

export const hu = {
  today: 'ma __TIME__-kor',
  yesterday: 'tegnap __TIME__-kor',
  tomorrow: 'holnap __TIME__-kor',
  lastWeek: (date) => week(date, false),
  nextWeek: (date) => week(date, true),
  sameYear: '__DATE_NO_YEAR__ __TIME__-kor',
  else: '__DATE_WITH_YEAR__ __TIME__-kor',
} satisfies RelativeFormatConfig;

export const huWithoutTime = {
  today: 'ma',
  yesterday: 'tegnap',
  tomorrow: 'holnap',
  lastWeek: (date) => week(date, false, false),
  nextWeek: (date) => week(date, true, false),
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
