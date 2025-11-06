import { addDays } from 'date-fns';

import type { DueFilterCriteriaOption } from 'app/src/components/FilterPopover/FilterCriteriaOptions';
import type { FilterableCard } from 'app/src/components/ViewFilters/types';
import type { CardFilterCriteria } from './ViewFilter';
import { DateType, SerializableViewFilter } from './ViewFilter';

export const SortingOption = {
  Ascending: 0,
  Descending: 1,
} as const;
export type SortingOptionType =
  (typeof SortingOption)[keyof typeof SortingOption];

export const DAY_MILLIS = 86400000;

export const RangeFilter = {
  Null: 0, //Has no range filter
  NextDay: DAY_MILLIS,
  NextWeek: DAY_MILLIS * 7,
  NextMonth: DAY_MILLIS * 30,
} as const;
type RangeFilterType = (typeof RangeFilter)[keyof typeof RangeFilter];

export const CompleteFilter = {
  None: 0,
  Complete: 1,
  Incomplete: 2,
} as const;
type CompleteFilterType = (typeof CompleteFilter)[keyof typeof CompleteFilter];

export type DueFilterValue =
  | CompleteFilterType
  | RangeFilterType
  | SortingOptionType
  | boolean;

export const DUE_FILTER_OPTIONS = [
  'notdue',
  'day',
  'week',
  'month',
  'overdue',
  'complete',
  'incomplete',
] as const;

export type BoardDueFilterString = (typeof DUE_FILTER_OPTIONS)[number] | null;

const dueMap = {
  [RangeFilter.NextDay]: 1,
  [RangeFilter.NextWeek]: 7,
  [RangeFilter.NextMonth]: 28,
};

interface DueFilterParameters {
  range?: RangeFilterType;
  complete?: CompleteFilterType;
  overdue?: boolean;
  notDue?: boolean;
}

export class DueFilter extends SerializableViewFilter {
  public readonly filterType = 'due' as const;

  public readonly range: RangeFilterType;
  public readonly complete: CompleteFilterType;
  public readonly overdue: boolean;
  public readonly notDue: boolean;

  constructor({
    range = RangeFilter.Null,
    complete = CompleteFilter.None,
    overdue = false,
    notDue = false,
  }: DueFilterParameters = {}) {
    super();
    this.range = range;
    this.complete = complete;
    this.overdue = overdue;
    this.notDue = notDue;
  }

  filterLength(): number {
    const urlParams = this.toUrlParams();
    const dueLength = urlParams['due']?.split(',').length;
    const dueCompleteLength = urlParams['dueComplete'] ? 1 : 0;
    return (dueLength ? dueLength : 0) + dueCompleteLength;
  }

  isEmpty(): boolean {
    return (
      this.range === RangeFilter.Null &&
      this.complete === CompleteFilter.None &&
      !this.overdue &&
      !this.notDue
    );
  }

  setRangeFilter(range: RangeFilterType) {
    return new DueFilter({ ...this, range });
  }

  setCompleteFilter(
    complete: CompleteFilterType,
    isMultiBoard: boolean = false,
  ) {
    if (isMultiBoard) {
      return new DueFilter({
        ...this,
        complete,
        ...(complete === CompleteFilter.Complete && { overdue: false }),
      });
    }
    return new DueFilter({ ...this, complete });
  }

  setOverdue(overdue: boolean, isMultiBoard: boolean = false) {
    if (isMultiBoard) {
      return new DueFilter({
        ...this,
        overdue,
        ...(this.complete === CompleteFilter.Complete && {
          complete: CompleteFilter.None,
        }),
        notDue: false,
      });
    }
    return new DueFilter({ ...this, overdue });
  }

  setNotDue(notDue: boolean, isMultiBoard: boolean = false) {
    if (isMultiBoard) {
      return new DueFilter({
        ...this,
        overdue: false,
        notDue,
      });
    }
    return new DueFilter({ ...this, notDue });
  }

  getMinDue() {
    switch (this.range) {
      case RangeFilter.NextDay:
      case RangeFilter.NextWeek:
      case RangeFilter.NextMonth:
        return new Date().toISOString();
      case RangeFilter.Null:
      default:
        return null;
    }
  }

  getMaxDue() {
    switch (this.range) {
      case RangeFilter.NextDay:
        return addDays(new Date(), 1).toISOString();
      case RangeFilter.NextWeek:
        return addDays(new Date(), 7).toISOString();
      case RangeFilter.NextMonth:
        return addDays(new Date(), 30).toISOString();
      case RangeFilter.Null:
      default:
        return null;
    }
  }

  getDueComplete(): boolean | null {
    if (this.complete === CompleteFilter.None) {
      return null;
    }

    return this.complete === CompleteFilter.Complete;
  }

  getOverdue(): boolean {
    return Boolean(this.overdue);
  }

  getNotDue(): boolean {
    return Boolean(this.notDue);
  }

  satisfiesDueFilter({
    due,
    complete,
    isAnd = false,
  }: {
    due: FilterableCard['due'];
    complete: FilterableCard['complete'];
    isAnd?: boolean;
  }): boolean {
    if (this.isEmpty()) {
      return true;
    }

    const statusChecks = [];
    const isCardComplete = complete === CompleteFilter.Complete;
    const isCardIncomplete = complete === CompleteFilter.Incomplete;

    if (this.getDueComplete()) {
      statusChecks.push(isCardComplete);
    } else if (this.getDueComplete() === false) {
      statusChecks.push(isCardIncomplete);
    }

    const dateChecks = [];
    if (this.notDue) {
      dateChecks.push(due === null);
    }

    if (this.range !== RangeFilter.Null) {
      if (!due) {
        dateChecks.push(false);
      } else {
        const maxDate = addDays(new Date(), dueMap[this.range]);
        const cardDueDate = new Date(due);
        const failsDateCheck = this.overdue
          ? cardDueDate > maxDate || isCardComplete
          : !(new Date() < cardDueDate && cardDueDate < maxDate);

        dateChecks.push(!failsDateCheck);
      }
    }

    if (this.overdue) {
      dateChecks.push(
        this.overdue && due && isCardIncomplete && new Date(due) < new Date(),
      );
    }

    if (statusChecks.length > 0 && dateChecks.length > 0) {
      return statusChecks.some(Boolean) && dateChecks.some(Boolean);
    }

    if (statusChecks.length > 0) {
      return statusChecks.some(Boolean);
    }
    if (dateChecks.length > 0) {
      return dateChecks.some(Boolean);
    }

    return true;
  }

  toUrlParams(): {
    due: string | null;
    dueComplete: string | null;
  } {
    const rangeString = this.getDueFromRange() ?? null;
    const notDueString = this.notDue ? 'notdue' : null;
    const overdueString = this.overdue ? 'overdue' : null;
    const dueArray = [rangeString, overdueString, notDueString].filter(
      (s) => s !== null,
    );
    const due = dueArray.join(',') || null;

    const dueComplete = (() => {
      switch (this.complete) {
        case CompleteFilter.Complete:
          return 'true';
        case CompleteFilter.Incomplete:
          return 'false';
        case CompleteFilter.None:
        default:
          return null;
      }
    })();

    return {
      due,
      dueComplete,
    };
  }

  static fromBoardString(boardString: BoardDueFilterString): DueFilter {
    let rangeFilter: RangeFilterType = RangeFilter.Null;
    let notDue = null; //This "notdue" logic is here to support backwards compatability with certain url forms
    switch (boardString) {
      case 'day':
        rangeFilter = RangeFilter.NextDay;
        break;
      case 'week':
        rangeFilter = RangeFilter.NextWeek;
        break;
      case 'month':
        rangeFilter = RangeFilter.NextMonth;
        break;
      case 'notdue':
        notDue = true;
        break;
      default:
        break;
    }

    return new DueFilter({ range: rangeFilter, ...(notDue && { notDue }) });
  }

  static fromUrlParams({ due, dueComplete }: { [key: string]: string | null }) {
    const [first, second, third] = due?.split(',') || [];
    const overdue = second === 'overdue' || (!second && first === 'overdue');
    const notDue =
      third === 'notdue' ||
      (!third && second === 'notdue') ||
      (!second && first === 'notdue');
    const rangeString =
      first !== 'overdue' && first !== 'notdue' ? first : null;

    let rangeFilter: RangeFilterType = RangeFilter.Null;

    switch (rangeString) {
      case 'day':
        rangeFilter = RangeFilter.NextDay;
        break;
      case 'week':
        rangeFilter = RangeFilter.NextWeek;
        break;
      case 'month':
        rangeFilter = RangeFilter.NextMonth;
        break;
      default:
        rangeFilter = RangeFilter.Null;
        break;
    }

    let completeFilter: CompleteFilterType = CompleteFilter.None;

    switch (dueComplete) {
      case 'true':
      case '1':
        completeFilter = CompleteFilter.Complete;
        break;
      case 'false':
      case '0':
        completeFilter = CompleteFilter.Incomplete;
        break;
      default:
        completeFilter = CompleteFilter.None;
        break;
    }

    return new DueFilter({
      range: rangeFilter,
      overdue,
      notDue,
      complete: completeFilter,
    });
  }

  toCardFilterCriteria() {
    const overdue = this.getOverdue();
    const rangeFilter = this.range;
    let start,
      end = null;

    const special = this.notDue ? ('none' as const) : undefined;

    if (
      [
        RangeFilter.NextDay,
        RangeFilter.NextWeek,
        RangeFilter.NextMonth,
      ].includes(rangeFilter)
    ) {
      start = { dateType: DateType.RELATIVE, value: 0 };
      end = { dateType: DateType.RELATIVE, value: rangeFilter };
    }

    if (overdue) {
      start = null;
      // Only set the end range if not already set by the rangeFilter
      end = end
        ? end
        : {
            dateType: DateType.RELATIVE,
            value: 0,
          };
    }

    const due =
      start || end || special
        ? {
            start,
            end,
            special,
          }
        : null;

    return {
      due,
      dueComplete: this.getDueComplete(),
    };
  }

  static fromCardFilterCriteria(cardFilterCriteria: CardFilterCriteria) {
    const overdue =
      !!cardFilterCriteria.due &&
      cardFilterCriteria.due?.start === null &&
      !cardFilterCriteria.due?.special;

    let rangeFilter: RangeFilterType = RangeFilter.Null;
    switch (cardFilterCriteria.due?.end?.value) {
      case RangeFilter.NextDay:
        rangeFilter = RangeFilter.NextDay;
        break;
      case RangeFilter.NextWeek:
        rangeFilter = RangeFilter.NextWeek;
        break;
      case RangeFilter.NextMonth:
        rangeFilter = RangeFilter.NextMonth;
        break;
      default:
        rangeFilter = RangeFilter.Null;
        break;
    }

    const notDue = cardFilterCriteria.due?.special === 'none';

    let completeFilter: CompleteFilterType = CompleteFilter.None;
    switch (cardFilterCriteria.dueComplete) {
      case true:
        completeFilter = CompleteFilter.Complete;
        break;
      case false:
        completeFilter = CompleteFilter.Incomplete;
        break;
      default:
        completeFilter = CompleteFilter.None;
        break;
    }

    return new DueFilter({
      overdue,
      range: rangeFilter,
      complete: completeFilter,
      notDue,
    });
  }

  getDueFromRange(): 'day' | 'month' | 'week' | undefined {
    let due: 'day' | 'month' | 'week' | undefined;

    switch (this.range) {
      case RangeFilter.NextDay:
        due = 'day';
        break;
      case RangeFilter.NextWeek:
        due = 'week';
        break;
      case RangeFilter.NextMonth:
        due = 'month';
        break;
      default:
        break;
    }

    return due;
  }

  serializeToBackboneFilter() {
    const due = this.getDueFromRange();

    return {
      due,
      overdue: this.getOverdue() || undefined,
      dueComplete: this.getDueComplete() ?? undefined,
      notDue: this.getNotDue() || undefined,
    };
  }

  /**
   * Parse a DueFilter into valid MBAPI query parameters
   *
   * If "notdue" is selected, due will be "none"; otherwise:
   * due will be of the form 2021-07-26T20:24:00.182Z...2021-08-01T20:24:00.182Z
   * where up to two ISOStrings are separated by ...
   *
   * @returns {due: string, dueComplete: boolean|null}
   */
  toMbapiFormat(): { due: string; dueComplete: boolean | null } {
    if (this.getNotDue()) {
      return { due: 'none', dueComplete: this.getDueComplete() };
    }

    if (this.getOverdue()) {
      const endOfRange = this.getMaxDue() || new Date().toISOString();
      return { due: `...${endOfRange}`, dueComplete: false };
    }

    const startOfRange = this.getMinDue();
    const endOfRange = this.getMaxDue();
    const due =
      startOfRange || endOfRange ? `${startOfRange || ''}...${endOfRange}` : '';
    return { due, dueComplete: this.getDueComplete() };
  }

  // These are functions used by the board filtering, which uses different url parameter formatting and
  // mutates the legacy board filter backbone model. If we deprecate the board filtering in favor of
  // view filtering, we can delete these functions
  isDueOptionActive(value: DueFilterCriteriaOption['value']) {
    switch (value) {
      case 'complete':
        return this.complete === CompleteFilter.Complete;
      case 'incomplete':
        return this.complete === CompleteFilter.Incomplete;
      case 'overdue':
        return this.getOverdue() === true;
      case 'notdue':
        return this.getNotDue() === true;
      case 'day':
        return this.range === RangeFilter.NextDay;
      case 'week':
        return this.range === RangeFilter.NextWeek;
      case 'month':
        return this.range === RangeFilter.NextMonth;
      default:
        return false;
    }
  }
}
