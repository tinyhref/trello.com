import { differenceInMinutes, isPast, isSameDay } from 'date-fns';

import { forNamespace } from '@trello/legacy-i18n';

import { formatHumanDate } from './formatHumanDate';
import {
  mediumDateWithTimeFormatter,
  relativeTimeFormatter,
} from './formatters';

const format = forNamespace();

/**
 * Calculates the time difference between a given date and the current date,
 * and returns a string representation of the time delta.
 *
 * @param date - The date to calculate the time difference for.
 * @param now- The current date. Defaults to the current system date and time.
 * @returns A string representation of the time delta.
 */
export const getDateDeltaString = (
  date: Date | number | string,
  now: Date = new Date(),
): string | 'just now' => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (isSameDay(now, date)) {
    const diffInMinutes = differenceInMinutes(date, now);
    if (Math.abs(diffInMinutes) < 1) {
      return format('just now');
    } else {
      // Minutes
      if (Math.abs(diffInMinutes) < 60) {
        return relativeTimeFormatter.format(diffInMinutes, 'minute');
      }
      // Hours
      else {
        return relativeTimeFormatter.format(
          Math.ceil(differenceInMinutes(date, now) / 60),
          'hour',
        );
      }
    }
  } else {
    return mediumDateWithTimeFormatter.format(date);
  }
};

export const getStringForCombinedDateBadge = (
  start?: Date | null,
  due?: Date | null,
  dateFormatter?: (date: Date) => string,
): string => {
  if (!dateFormatter) {
    dateFormatter = formatHumanDate;
  }
  if (start && due && start <= due) {
    return `${dateFormatter(start)} - ${dateFormatter(due)}`;
  } else if (due) {
    return `${dateFormatter(due)}`;
  } else if (start) {
    const when = isPast(start) ? 'past' : 'future';
    return format(['badge', 'start', when], {
      date: dateFormatter(start),
    });
  }
  return '';
};
