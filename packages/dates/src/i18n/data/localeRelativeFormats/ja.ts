import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const ja = {
  today: '今日 __TIME__',
  yesterday: '昨日 __TIME__',
  tomorrow: '明日 __TIME__',
  lastWeek: '__DATE_NO_YEAR__ __TIME__',
  nextWeek: '__DATE_NO_YEAR__ __TIME__',
  sameYear: '__DATE_NO_YEAR__ __TIME__',
  else: '__DATE_WITH_YEAR__ __TIME__',
} satisfies RelativeFormatConfig;

export const jaWithoutTime = {
  today: '今日',
  yesterday: '昨日',
  tomorrow: '明日',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
