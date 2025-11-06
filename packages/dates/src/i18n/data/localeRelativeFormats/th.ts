import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const th = {
  today: 'วันนี้ เวลา __TIME__',
  yesterday: 'เมื่อวานนี้ เวลา __TIME__',
  tomorrow: 'พรุ่งนี้ เวลา __TIME__',
  lastWeek: 'วัน__WEEKDAY__ที่แล้ว เวลา __TIME__',
  nextWeek: '__WEEKDAY__หน้า เวลา __TIME__',
  sameYear: '__DATE_NO_YEAR__หน้า เวลา __TIME__',
  else: '__DATE_WITH_YEAR__หน้า เวลา __TIME__',
} satisfies RelativeFormatConfig;

export const thWithoutTime = {
  today: 'วันนี้',
  yesterday: 'เมื่อวานนี้',
  tomorrow: 'พรุ่งนี้',
  lastWeek: 'วัน__WEEKDAY__',
  nextWeek: '__WEEKDAY__',
  sameYear: '__DATE_NO_YEAR__',
  else: '__DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
