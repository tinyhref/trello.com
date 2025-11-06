// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import { addDays, addYears, isValid, startOfDay } from 'date-fns';
import _ from 'underscore';

import {
  getFirstDayOfWeek,
  getMonths,
  getWeekdays,
  parseLocalizedTime,
  shortTimeFormatter,
} from '@trello/dates/i18n';
// eslint-disable-next-line no-restricted-imports
import $ from '@trello/jquery';
import { importWithRetry } from '@trello/use-lazy-component';

import { l } from 'app/scripts/lib/localize';
import { VIGOR } from 'app/scripts/views/internal/View';
import { PopOver } from 'app/scripts/views/lib/PopOver';
import { PluginView } from 'app/scripts/views/plugin/PluginView';
import { PluginDatePickerTemplate } from 'app/scripts/views/templates/PluginDatePickerTemplate';

const getPikadayStrings = () => ({
  previousMonth: l('prev month button text'),
  nextMonth: l('next month button text'),
  months: getMonths(),
  weekdays: getWeekdays(),
  weekdaysShort: getWeekdays('short'),
});

interface PluginPopOverDateTimeView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Pikaday: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  dateOnly: boolean;
  // @ts-expect-error TS(2300): Duplicate identifier 'pickDate'.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickDate: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  picker: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pikadayLoadPromise: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
}

class PluginPopOverDateTimeView extends PluginView {
  vigor = VIGOR.NONE;
  static initClass() {
    // @ts-expect-error TS(2339): Property 'keepInDOM' does not exist on type 'Plugi... Remove this comment to see the full error message
    this.prototype.keepInDOM = true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize({ title, content }: any) {
    this.title = title;
    this.content = content;
    this.retain(this.content);
    this.dateOnly = this.content.type === 'date';
    return this.loadPikadayLibrary();
  }

  loadPikadayLibrary() {
    return (
      this.pikadayLoadPromise ??
      (this.pikadayLoadPromise = importWithRetry(
        () => import(/* webpackChunkName: "pikaday" */ 'pikaday'),
      )
        .then((m) => m.default)
        .then((library) => {
          return (this.Pikaday = library);
        }))
    );
  }

  getViewTitle() {
    return this.title;
  }

  events() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click a[href]'(e: any) {
        return PopOver.hide();
      },
      'input .js-dpicker-time-input': 'validateTimeInput',
      'change .js-dpicker-time-input': 'normalizeTimeInput',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'click input.nch-button.nch-button--primary'(e: any): any {
        // @ts-expect-error TS(2339): Property 'pickDate' does not exist on type '{ 'cli... Remove this comment to see the full error message
        return this.pickDate(e);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      submit(e: any): any {
        e.preventDefault();
        // @ts-expect-error TS(2339): Property 'pickDate' does not exist on type '{ 'cli... Remove this comment to see the full error message
        return this.pickDate(e);
      },
    };
  }

  getSelectedDate(): Date | null {
    let date = this.picker.getDate() as Date;
    if (!isValid(date)) {
      return null;
    }

    // Pikaday requires a single date format, and will parse it strictly (which
    // is good). However, this means an entry like '2/14/15' will parse as
    // '02/14/0015', which isn't great.
    // TODO: This is introducing a Y2K-esque bug and shouldn't be replicated in new code
    if (date.getFullYear() < 1000) {
      date = addYears(date, 2000);
    }

    const time = this.selectedTimeDate();
    date.setHours(time.getHours(), time.getMinutes());
    return date;
  }

  // @ts-expect-error TS(2300): Duplicate identifier 'pickDate'.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickDate(e: any) {
    const date = this.getSelectedDate();
    if (_.isFunction(this.content.callback)) {
      return (
        this.content
          .callback({
            el: e.currentTarget,
            options: {
              date: date?.toISOString(),
            },
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((err: any) =>
            typeof console !== 'undefined' && console !== null
              ? console.warn(
                  `Error running Power-Up date picker callback function: ${err.message}`,
                )
              : undefined,
          )
      );
    } else {
      return PopOver.popView();
    }
  }

  renderOnce() {
    let date = addDays(startOfDay(new Date()), 1);
    date.setHours(12, 0, 0, 0);

    if (_.isString(this.content.date) && isValid(new Date(this.content.date))) {
      date = new Date(this.content.date);
    }

    const minDate =
      _.isString(this.content.minDate) &&
      isValid(new Date(this.content.minDate))
        ? new Date(this.content.minDate)
        : undefined;
    const maxDate =
      _.isString(this.content.maxDate) &&
      isValid(new Date(this.content.maxDate))
        ? new Date(this.content.maxDate)
        : undefined;
    let yearRange = 10; // default behavior of Pikaday
    if (minDate || maxDate) {
      // @ts-expect-error TS(2322): Type 'number[]' is not assignable to type 'number'... Remove this comment to see the full error message
      yearRange = [
        minDate ? minDate.getFullYear() : new Date().getFullYear() - 10,
        maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10,
      ];
    }

    this.$el.html(PluginDatePickerTemplate({ dateOnly: this.dateOnly }));

    this.loadPikadayLibrary().then(() => {
      this.picker = new this.Pikaday({
        field: _.first($('.js-dpicker-date-input', this.$el)),
        container: _.first($('.js-dpicker-cal', this.$el)),
        bound: false,
        format: 'l',
        firstDay: getFirstDayOfWeek(),
        i18n: getPikadayStrings(),
        keyboardInput: false,
        minDate,
        maxDate,
        yearRange,
      });

      this.picker.setDate(date);

      if (!this.dateOnly) {
        return this.$timeInput().val(shortTimeFormatter.format(date));
      }
    });

    return this;
  }

  validateTimeInput() {
    return this.$timeInput().toggleClass(
      'input-error',
      !this.isTimeInputValid(),
    );
  }

  normalizeTimeInput() {
    this.$timeInput().val(shortTimeFormatter.format(this.selectedTimeDate()));
    return this.validateTimeInput();
  }

  selectedTimeDate(): Date {
    if (this.dateOnly) {
      const date = new Date();
      date.setHours(0, 0);
      return date;
    } else {
      const parsedTime = this.parseTimeInput();
      if (parsedTime && isValid(parsedTime)) {
        return parsedTime;
      } else {
        const defaultTime = new Date();
        defaultTime.setHours(12, 0);
        return defaultTime;
      }
    }
  }

  $timeInput() {
    return $('.js-dpicker-time-input', this.$el);
  }

  isTimeInputValid(): boolean {
    const timeDate = this.parseTimeInput();
    return !!timeDate && isValid(timeDate);
  }

  parseTimeInput(): Date | undefined {
    const timeInput = this.$timeInput().val();
    if (timeInput) {
      return parseLocalizedTime(timeInput.toString());
    }
  }
}
PluginPopOverDateTimeView.initClass();
export { PluginPopOverDateTimeView };
