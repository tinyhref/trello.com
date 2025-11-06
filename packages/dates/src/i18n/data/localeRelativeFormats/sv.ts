import type { RelativeFormatConfig } from '../relativeFormatConfig';

export const sv = {
  today: 'Idag __TIME__',
  yesterday: 'Igår __TIME__',
  tomorrow: 'Imorgon __TIME__',
  lastWeek: 'I __WEEKDAY__s __TIME__',
  nextWeek: 'På __WEEKDAY__ __TIME__',
  sameYear: 'På __DATE_NO_YEAR__ __TIME__',
  else: 'På __DATE_WITH_YEAR__ __TIME__',
} satisfies RelativeFormatConfig;

export const svWithoutTime = {
  today: 'Idag',
  yesterday: 'Igår',
  tomorrow: 'Imorgon',
  lastWeek: 'I __WEEKDAY__s',
  nextWeek: 'På __WEEKDAY__',
  sameYear: 'Den __DATE_NO_YEAR__',
  else: 'Den __DATE_WITH_YEAR__',
} satisfies RelativeFormatConfig;
