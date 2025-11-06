import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const vi = {
  today: 'Hôm nay lúc __TIME__',
  yesterday: 'Hôm qua lúc __TIME__',
  tomorrow: 'Ngày mai lúc __TIME__',
  lastWeek: '__WEEKDAY__ tuần rồi lúc __TIME__',
  nextWeek: '__WEEKDAY__ tuần tới lúc __TIME__',
  sameYear: '__DATE_NO_YEAR__ lúc __TIME__',
  else: '__DATE_WITH_YEAR__ lúc __TIME__',
} satisfies RelativeFormatConfig;

export const viWithoutTime = {
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  tomorrow: 'Ngày mai',
  lastWeek: '__WEEKDAY__ tuần rồi',
  nextWeek: '__WEEKDAY__ tuần tới',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
