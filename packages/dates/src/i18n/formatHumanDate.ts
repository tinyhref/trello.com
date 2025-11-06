import { differenceInMonths, isSameYear } from 'date-fns';

import {
  mediumDateFormatter,
  mediumDateWithoutYearFormatter,
} from './formatters';

/**
 * Formats a date in a human-friendly way, omitting the year if the date is within
 * the current year and not ambiguous with respect to month.
 */
export const formatHumanDate = (date: Date | string): string => {
  const now = Date.now();

  const isAmbiguousMonth = Math.abs(differenceInMonths(now, date)) > 9;
  const shouldHideYear = isSameYear(now, date) && !isAmbiguousMonth;

  if (shouldHideYear) {
    return mediumDateWithoutYearFormatter.format(new Date(date));
  }
  return mediumDateFormatter.format(new Date(date));
};
