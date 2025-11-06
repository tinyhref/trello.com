import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const zhHans = {
  today: (date) =>
    date.getMinutes() === 0 ? '今天__DAY_PART____HOUR__点整' : '今天__TIME__',
  yesterday: (date) =>
    date.getMinutes() === 0 ? '昨天__DAY_PART____HOUR__点整' : '昨天__TIME__',
  tomorrow: (date) =>
    date.getMinutes() === 0 ? '明天__DAY_PART____HOUR__点整' : '明天__TIME__',
  lastWeek: '__DATE_NO_YEAR__ __TIME__',
  nextWeek: '__DATE_NO_YEAR__ __TIME__',
  sameYear: '__DATE_NO_YEAR__ __TIME__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;

export const zhHant = {
  today: '今天__TIME__',
  yesterday: '昨天__TIME__',
  tomorrow: '明天__TIME__',
  lastWeek: '__DATE_NO_YEAR__ __TIME__',
  nextWeek: '__DATE_NO_YEAR__ __TIME__',
  sameYear: '__DATE_NO_YEAR__ __TIME__',
  else: '__DATE_WITH_YEAR__ __TIME__',
} satisfies RelativeFormatConfig;

export const zhHansWithoutTime = {
  today: '今天',
  yesterday: '昨天',
  tomorrow: '明天',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;

export const zhHantWithoutTime = {
  today: '今天',
  yesterday: '昨天',
  tomorrow: '明天',
  lastWeek: '__DATE_NO_YEAR__',
  nextWeek: '__DATE_NO_YEAR__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
