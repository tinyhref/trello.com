/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import {
  addDays,
  differenceInCalendarMonths,
  endOfMonth,
  isSameDay,
  isSameYear,
  isValid,
  startOfMonth,
} from 'date-fns';
import _ from 'underscore';

import Backbone from '@trello/backbone';
import {
  getDateDeltaString,
  getEndOfWeek as _getEndOfWeek,
  getStartOfWeek as _getStartOfWeek,
  longDateWithTimeFormatter,
  mediumDateFormatter,
  mediumDateWithoutYearFormatter,
} from '@trello/dates/i18n';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';

import { Time } from 'app/scripts/lib/time';

export const Dates = {
  objToDate(
    year: number | { year: number; month: number; day: number },
    month?: number,
    day?: number,
  ) {
    if (typeof year === 'object') {
      ({ year, month, day } = year);
    } else if (!month || !day) {
      throw new Error('Invalid date');
    }

    // in JS Dates, month is 0-indexed; day 1-indexed
    return new Date(year, month - 1, day);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dateToObj(date: any) {
    return {
      year: date.getFullYear(),
      // in JS Dates, month is 0-indexed; day 1-indexed
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStartOfWeek(day: any) {
    // Just to be safe, lets make sure we're working with a date
    const date = new Date(day);
    return _getStartOfWeek(date);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEndOfWeek(day: any) {
    // Just to be safe, lets make sure we're working with a date
    const date = new Date(day);
    return _getEndOfWeek(date);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDaysOfWeek(possibleDate: any) {
    // Just to be safe, lets make sure we're working with a date
    const date = new Date(possibleDate);
    const start = _getStartOfWeek(date);
    return [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(start, offset));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMidnightInt(date: any) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj.valueOf();
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFirstOfMonth(date: any) {
    const dateObj = new Date(date);
    return startOfMonth(dateObj);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLastOfMonth(date: any) {
    const dateObj = new Date(date);
    return endOfMonth(dateObj);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isFirstOfMonth(date: any) {
    const dateObj = new Date(date);
    return isSameDay(dateObj, startOfMonth(dateObj));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isLastOfMonth(date: any) {
    const dateObj = new Date(date);
    return isSameDay(dateObj, endOfMonth(dateObj));
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPastDateDeltaString(date: any, now: any) {
    const dateObj = new Date(date);
    const nowObj = new Date(now);
    // Will display "just now" for any dates in the future.
    if (dateObj > nowObj) {
      date = now;
    }
    return getDateDeltaString(date, now);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDateWithSpecificTime(time: any, targetDate: any) {
    return new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(context: any) {
    const now = new Date();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = (selector: any, transform: any) =>
      $(context)
        .find(selector)
        .each(function (idx, elem) {
          let dateString;
          let date = elem.dataset.date || elem.getAttribute('data-date');
          if (date == null) {
            date = Dates.parse(elem.getAttribute('dt'));
            date = Time.serverToClient(date);
            elem.dataset.date = date;
          }

          if (elem.classList.contains('past')) {
            dateString = Dates.getPastDateDeltaString(date, now);
          } else {
            dateString = getDateDeltaString(date, now);
          }
          return transform(elem, date, dateString);
        });

    try {
      update(
        '.js-date-title[dt]',
        function (elem: HTMLElement, date: string, dateString: string) {
          elem.setAttribute('title', dateString);
        },
      );
    } catch (error) {
      console.error('Error updating date title element', error);
    }

    try {
      update(
        '.date[dt], .date[data-date]',
        function (elem: HTMLElement, date: string, dateString: string) {
          elem.innerText = dateString;
          if (!elem.hasAttribute('title')) {
            elem.setAttribute(
              'title',
              longDateWithTimeFormatter.format(new Date(date)),
            );
          }
        },
      );
    } catch (error) {
      console.error('Error updating date element', error);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parse(s: any) {
    if (s == null) {
      s = '';
    }
    return new Date(s);
  },

  // Return a date like May 11, 2014
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toDateString(date: any) {
    const dateObj = new Date(date);
    const now = new Date();

    if (!isValid(dateObj)) {
      // prevent throwing RangeError: Invalid time value
      return;
    }

    // The reasoning here being that if it's Jan 11, and you're formatting a
    // date like Dec 21, you're going to assume it means the previous December,
    // not next December. If we do mean the upcoming (in 11 months) December,
    // we'll show the year.
    //
    // It's tricky to see if this logic is correct, but what we want to say is
    // that we want to hide the year when it's a date from this year, unless
    // the month is ambiguous.
    //
    // The month is ambiguous when it's more than nine months away from today --
    // which is to say that there's a month in a different year that's only
    // three months away.

    const isAmbiguousMonth =
      Math.abs(differenceInCalendarMonths(now, dateObj)) > 9;
    const hideYear = isSameYear(dateObj, now) && !isAmbiguousMonth;

    // Jan 13 or Jan 13, 2013
    return hideYear
      ? mediumDateWithoutYearFormatter.format(dateObj)
      : mediumDateFormatter.format(dateObj);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validDate(d: any) {
    return _.isDate(d) && !isNaN(d.getTime());
  },
};

_.extend(Dates, Backbone.Events);
