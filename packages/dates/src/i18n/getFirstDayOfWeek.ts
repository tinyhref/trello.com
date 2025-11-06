import { currentLocale } from '@trello/locale';

import { defaultFirstDayOfWeek, firstDaysOfWeek } from './data/firstDaysOfWeek';

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * getWeekInfo and weekInfo are two extensions to Intl.Locale that are
 * (currently) only available on Chromium browsers (Chrome, Edge, etc.), and an experimental part of
 * the api. TypeScript doesn't know about these yet, so we need to add them manually.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
 */
type WeekInfo = {
  firstDay: number;
  minDays: number;
  weekend: number[];
};

declare global {
  namespace Intl {
    // Add getWeekInfo and weekInfo to the Intl.Locale prototype
    interface Locale {
      getWeekInfo?: () => WeekInfo;
      weekInfo?: WeekInfo;
    }
  }
}

/**
 * Get the first day of the week for the current locale
 * @param locale - the locale to use (Default: locale from `@trello/config`)
 * @returns the first day of the week (0 = Sunday, 1 = Monday, etc.)
 */
export const getFirstDayOfWeek = (locale = currentLocale): DayOfWeek => {
  // All browsers except Firefox support `getWeekInfo` or `weekInfo` (`getWeekInfo` is the latest proposal).
  // For Firefox, we need to fall back to a manual map (lame)
  const localeObj = new Intl.Locale(locale);
  const weekInfo = localeObj.getWeekInfo?.() ?? localeObj.weekInfo;
  if (weekInfo) {
    //`getWeekInfo` and `weekInfo` return 1-7 with 1 being Monday, 2 being Tuesday, etc.
    // So we need to modulate the value by 7 to match our map and the getWeekdays array
    // Since they're 0-based index, with Sunday being 0 (7 from `getWeekInfo`).
    // The rest will all be the same.
    return (weekInfo.firstDay % 7) as DayOfWeek;
  } else {
    return (firstDaysOfWeek[locale] ??
      firstDaysOfWeek[locale.split('-')[0]] ??
      defaultFirstDayOfWeek) as DayOfWeek;
  }
};
